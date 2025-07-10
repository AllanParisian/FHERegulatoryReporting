/**
 * Simulation Script for Privacy-Preserving Regulatory Reporting System
 *
 * This script runs automated simulations to demonstrate the full lifecycle of the system:
 * - Entity authorization
 * - Report submission
 * - Report verification
 * - Period management
 *
 * Usage:
 *   npm run simulate
 *   npx hardhat run scripts/simulate.js --network sepolia
 *
 * Prerequisites:
 *   - Contract must be deployed
 *   - Deployment info must exist in deployments/{network}.json
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n========================================");
  console.log("Privacy-Preserving Regulatory Reporting");
  console.log("Automated Simulation");
  console.log("========================================\n");

  const network = hre.network.name;

  // Load deployment information
  const deploymentFile = path.join(__dirname, "..", "deployments", `${network}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Error: Deployment file not found");
    console.error(`   Expected: ${deploymentFile}`);
    console.error("\n💡 Solution: Deploy the contract first using:");
    console.error("   npm run deploy");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

  console.log("📋 Simulation Configuration:");
  console.log("  Network:", network);
  console.log("  Contract Address:", deploymentInfo.contractAddress);
  console.log("");

  // Get contract instance
  const PrivacyRegulatoryReporting = await hre.ethers.getContractFactory(
    "PrivacyRegulatoryReporting"
  );
  const contract = PrivacyRegulatoryReporting.attach(deploymentInfo.contractAddress);

  // Get signers
  const [regulator, entity1, entity2, entity3] = await hre.ethers.getSigners();

  console.log("👥 Simulation Participants:");
  console.log("  Regulator:", regulator.address);
  console.log("  Entity 1:", entity1.address);
  console.log("  Entity 2:", entity2.address);
  console.log("  Entity 3:", entity3.address);
  console.log("");

  try {
    // ========================================
    // Phase 1: Entity Authorization
    // ========================================
    console.log("========================================");
    console.log("Phase 1: Entity Authorization");
    console.log("========================================\n");

    console.log("🔐 Authorizing entities...");

    const entities = [entity1.address, entity2.address, entity3.address];
    for (let i = 0; i < entities.length; i++) {
      console.log(`  Authorizing Entity ${i + 1}:`, entities[i]);
      const tx = await contract.connect(regulator).authorizeEntity(entities[i]);
      await tx.wait();
      console.log("    ✅ Authorized - Tx:", tx.hash);
    }
    console.log("\n✅ All entities authorized\n");

    // Verify authorization
    console.log("🔍 Verifying authorization status:");
    for (let i = 0; i < entities.length; i++) {
      const isAuthorized = await contract.isAuthorizedEntity(entities[i]);
      console.log(`  Entity ${i + 1}:`, isAuthorized ? "✅ Authorized" : "❌ Not Authorized");
    }
    console.log("");

    // ========================================
    // Phase 2: Report Submission
    // ========================================
    console.log("========================================");
    console.log("Phase 2: Confidential Report Submission");
    console.log("========================================\n");

    const currentPeriod = await contract.currentPeriod();
    console.log("📅 Current Reporting Period:", currentPeriod.toString());
    console.log("");

    // Sample report data
    const reports = [
      { totalAmount: 1500000, txCount: 250, riskScore: 35, entity: entity1 },
      { totalAmount: 2300000, txCount: 180, riskScore: 42, entity: entity2 },
      { totalAmount: 890000, txCount: 120, riskScore: 28, entity: entity3 }
    ];

    console.log("📝 Submitting confidential reports...");
    const reportIds = [];

    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      console.log(`\n  Report ${i + 1}:`);
      console.log(`    Entity: ${report.entity.address}`);
      console.log(`    Total Amount: $${report.totalAmount.toLocaleString()}`);
      console.log(`    Transaction Count: ${report.txCount}`);
      console.log(`    Risk Score: ${report.riskScore}/100`);

      const tx = await contract
        .connect(report.entity)
        .submitConfidentialReport(
          report.totalAmount,
          report.txCount,
          report.riskScore,
          currentPeriod
        );

      const receipt = await tx.wait();
      console.log(`    ✅ Submitted - Tx: ${tx.hash}`);

      // Extract report ID from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed && parsed.name === "ReportSubmitted";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        const reportId = parsedEvent.args[1];
        reportIds.push(reportId);
        console.log(`    Report ID: ${reportId.toString()}`);
      }
    }

    console.log("\n✅ All reports submitted successfully\n");

    // ========================================
    // Phase 3: Report Verification
    // ========================================
    console.log("========================================");
    console.log("Phase 3: Report Verification");
    console.log("========================================\n");

    console.log("✅ Verifying submitted reports...");

    for (let i = 0; i < reportIds.length; i++) {
      const reportId = reportIds[i];
      console.log(`\n  Verifying Report ${reportId.toString()}:`);

      const tx = await contract.connect(regulator).verifyReport(reportId);
      await tx.wait();
      console.log(`    ✅ Verified - Tx: ${tx.hash}`);

      // Get report info
      const reportInfo = await contract.getReportInfo(reportId);
      console.log(`    Submitter: ${reportInfo[0]}`);
      console.log(`    Timestamp: ${new Date(Number(reportInfo[1]) * 1000).toLocaleString()}`);
      console.log(`    Verified: ${reportInfo[3] ? "Yes" : "No"}`);
    }

    console.log("\n✅ All reports verified\n");

    // ========================================
    // Phase 4: Grant Decryption Access
    // ========================================
    console.log("========================================");
    console.log("Phase 4: Grant Decryption Access");
    console.log("========================================\n");

    console.log("🔓 Granting decryption access to analyst...");

    // Use entity3 as an analyst for demonstration
    const analystAddress = entity3.address;

    for (let i = 0; i < reportIds.length; i++) {
      const reportId = reportIds[i];
      console.log(`\n  Granting access for Report ${reportId.toString()}:`);

      const tx = await contract
        .connect(regulator)
        .grantDecryptionAccess(reportId, analystAddress);
      await tx.wait();
      console.log(`    ✅ Access granted - Tx: ${tx.hash}`);
      console.log(`    Analyst: ${analystAddress}`);
    }

    console.log("\n✅ Decryption access granted for all reports\n");

    // ========================================
    // Phase 5: Summary Statistics
    // ========================================
    console.log("========================================");
    console.log("Phase 5: Summary Statistics");
    console.log("========================================\n");

    const totalReports = await contract.getTotalReports();
    const periodInfo = await contract.getPeriodInfo(currentPeriod);

    console.log("📊 System Statistics:");
    console.log("  Total Reports:", totalReports.toString());
    console.log("  Current Period:", currentPeriod.toString());
    console.log("  Period Submissions:", periodInfo[4].toString());
    console.log("  Period Active:", periodInfo[2] ? "Yes" : "No");
    console.log("  Submission Deadline:", new Date(Number(periodInfo[3]) * 1000).toLocaleString());
    console.log("");

    console.log("✅ Authorized Entities: 3");
    console.log("✅ Reports Submitted: 3");
    console.log("✅ Reports Verified: 3");
    console.log("✅ Decryption Access Granted: 3");
    console.log("");

    // ========================================
    // Simulation Complete
    // ========================================
    console.log("========================================");
    console.log("✅ Simulation Complete!");
    console.log("========================================\n");

    console.log("📝 Summary:");
    console.log("  ✅ Entities authorized successfully");
    console.log("  ✅ Confidential reports submitted with FHE encryption");
    console.log("  ✅ Reports verified by regulator");
    console.log("  ✅ Decryption access granted to analysts");
    console.log("  ✅ Privacy-preserving compliance reporting demonstrated");
    console.log("");

    console.log("📋 Report IDs for reference:");
    reportIds.forEach((id, index) => {
      console.log(`  Report ${index + 1}: ID ${id.toString()}`);
    });
    console.log("");

    if (network === "sepolia") {
      console.log("🔗 View on Etherscan:");
      console.log(`   https://sepolia.etherscan.io/address/${deploymentInfo.contractAddress}`);
      console.log("");
    }

    // Save simulation results
    const simulationResults = {
      network: network,
      contractAddress: deploymentInfo.contractAddress,
      simulationDate: new Date().toISOString(),
      participants: {
        regulator: regulator.address,
        entities: entities
      },
      reportIds: reportIds.map(id => id.toString()),
      statistics: {
        totalReports: totalReports.toString(),
        currentPeriod: currentPeriod.toString(),
        periodSubmissions: periodInfo[4].toString()
      }
    };

    const resultsDir = path.join(__dirname, "..", "deployments");
    const resultsFile = path.join(resultsDir, `simulation-${network}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify(simulationResults, null, 2));

    console.log("💾 Simulation results saved to:", resultsFile);
    console.log("");

  } catch (error) {
    console.error("\n❌ Simulation Failed!");
    console.error("Error:", error.message);

    if (error.message.includes("Only regulator")) {
      console.error("\n💡 Solution: Ensure you're using the regulator account");
    } else if (error.message.includes("Not authorized")) {
      console.error("\n💡 Solution: Authorize entities before submitting reports");
    } else if (error.message.includes("Already submitted")) {
      console.error("\n💡 Solution: Each entity can only submit once per period");
    }

    console.error("");
    process.exit(1);
  }
}

// Execute simulation
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
