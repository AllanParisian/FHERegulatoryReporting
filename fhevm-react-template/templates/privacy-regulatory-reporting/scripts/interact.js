/**
 * Interaction Script for Privacy-Preserving Regulatory Reporting System
 *
 * This script provides a command-line interface to interact with the deployed contract.
 * It supports various operations including authorization, report submission, and verification.
 *
 * Usage:
 *   npm run interact
 *   npx hardhat run scripts/interact.js --network sepolia
 *
 * Prerequisites:
 *   - Contract must be deployed
 *   - Deployment info must exist in deployments/{network}.json
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("\n========================================");
  console.log("Privacy-Preserving Regulatory Reporting");
  console.log("Interactive Contract Interface");
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

  console.log("📋 Contract Information:");
  console.log("  Network:", network);
  console.log("  Contract Address:", deploymentInfo.contractAddress);
  console.log("  Deployed:", deploymentInfo.deploymentDate);
  console.log("");

  // Get contract instance
  const PrivacyRegulatoryReporting = await hre.ethers.getContractFactory(
    "PrivacyRegulatoryReporting"
  );
  const contract = PrivacyRegulatoryReporting.attach(deploymentInfo.contractAddress);

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Current Account:", signer.address);
  console.log("   Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(signer.address)), "ETH");
  console.log("");

  // Display menu
  while (true) {
    console.log("\n========================================");
    console.log("Available Operations:");
    console.log("========================================");
    console.log("  1. View Contract Status");
    console.log("  2. Authorize Entity");
    console.log("  3. Revoke Entity");
    console.log("  4. Create Reporting Period");
    console.log("  5. Submit Confidential Report");
    console.log("  6. Verify Report");
    console.log("  7. View Report Information");
    console.log("  8. View Period Information");
    console.log("  9. Grant Decryption Access");
    console.log("  0. Exit");
    console.log("========================================\n");

    const choice = await question("Select operation (0-9): ");

    try {
      switch (choice.trim()) {
        case "1":
          await viewContractStatus(contract);
          break;

        case "2":
          await authorizeEntity(contract, signer);
          break;

        case "3":
          await revokeEntity(contract, signer);
          break;

        case "4":
          await createReportingPeriod(contract, signer);
          break;

        case "5":
          await submitReport(contract, signer);
          break;

        case "6":
          await verifyReport(contract, signer);
          break;

        case "7":
          await viewReportInfo(contract);
          break;

        case "8":
          await viewPeriodInfo(contract);
          break;

        case "9":
          await grantDecryptionAccess(contract, signer);
          break;

        case "0":
          console.log("\n👋 Exiting...\n");
          rl.close();
          process.exit(0);

        default:
          console.log("\n❌ Invalid choice. Please select 0-9.");
      }
    } catch (error) {
      console.error("\n❌ Operation Failed!");
      console.error("Error:", error.message);
      console.log("");
    }
  }
}

// View contract status
async function viewContractStatus(contract) {
  console.log("\n📊 Contract Status:");
  console.log("========================================");

  const owner = await contract.owner();
  const regulator = await contract.regulator();
  const currentPeriod = await contract.currentPeriod();
  const totalReports = await contract.getTotalReports();

  console.log("  Owner:", owner);
  console.log("  Regulator:", regulator);
  console.log("  Current Period:", currentPeriod.toString());
  console.log("  Total Reports:", totalReports.toString());

  const periodInfo = await contract.getPeriodInfo(currentPeriod);
  console.log("\n📅 Current Reporting Period:");
  console.log("  Period ID:", currentPeriod.toString());
  console.log("  Start Time:", new Date(Number(periodInfo[0]) * 1000).toLocaleString());
  console.log("  End Time:", new Date(Number(periodInfo[1]) * 1000).toLocaleString());
  console.log("  Active:", periodInfo[2] ? "Yes" : "No");
  console.log("  Submission Deadline:", new Date(Number(periodInfo[3]) * 1000).toLocaleString());
  console.log("  Total Submissions:", periodInfo[4].toString());
  console.log("");
}

// Authorize entity
async function authorizeEntity(contract, signer) {
  console.log("\n🔐 Authorize Entity");
  console.log("========================================");

  const entityAddress = await question("Enter entity address to authorize: ");

  if (!hre.ethers.isAddress(entityAddress.trim())) {
    console.error("❌ Invalid Ethereum address");
    return;
  }

  console.log("\n⏳ Authorizing entity...");
  const tx = await contract.connect(signer).authorizeEntity(entityAddress.trim());
  console.log("  Transaction Hash:", tx.hash);

  await tx.wait();
  console.log("✅ Entity authorized successfully!");
  console.log("  Address:", entityAddress.trim());
}

// Revoke entity
async function revokeEntity(contract, signer) {
  console.log("\n🚫 Revoke Entity");
  console.log("========================================");

  const entityAddress = await question("Enter entity address to revoke: ");

  if (!hre.ethers.isAddress(entityAddress.trim())) {
    console.error("❌ Invalid Ethereum address");
    return;
  }

  console.log("\n⏳ Revoking entity...");
  const tx = await contract.connect(signer).revokeEntity(entityAddress.trim());
  console.log("  Transaction Hash:", tx.hash);

  await tx.wait();
  console.log("✅ Entity revoked successfully!");
  console.log("  Address:", entityAddress.trim());
}

// Create reporting period
async function createReportingPeriod(contract, signer) {
  console.log("\n📅 Create Reporting Period");
  console.log("========================================");

  const durationDays = await question("Enter duration in days (e.g., 90): ");
  const submissionDays = await question("Enter submission deadline in days (e.g., 30): ");

  const duration = Number(durationDays) * 24 * 60 * 60; // Convert to seconds
  const submissionDeadline = Number(submissionDays);

  console.log("\n⏳ Creating reporting period...");
  const tx = await contract.connect(signer).createReportingPeriod(duration, submissionDeadline);
  console.log("  Transaction Hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Reporting period created successfully!");

  // Extract period ID from events
  const event = receipt.logs.find(log => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed && parsed.name === "ReportingPeriodCreated";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsedEvent = contract.interface.parseLog(event);
    console.log("  Period ID:", parsedEvent.args[0].toString());
  }
}

// Submit confidential report
async function submitReport(contract, signer) {
  console.log("\n📝 Submit Confidential Report");
  console.log("========================================");

  const totalAmount = await question("Enter total amount (e.g., 1000000): ");
  const txCount = await question("Enter transaction count (e.g., 150): ");
  const riskScore = await question("Enter risk score (0-100): ");
  const periodId = await question("Enter period ID (e.g., 1): ");

  console.log("\n⏳ Submitting confidential report...");
  const tx = await contract.connect(signer).submitConfidentialReport(
    totalAmount,
    txCount,
    riskScore,
    periodId
  );
  console.log("  Transaction Hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Report submitted successfully!");

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
    console.log("  Report ID:", parsedEvent.args[1].toString());
    console.log("  Period:", parsedEvent.args[2].toString());
  }
}

// Verify report
async function verifyReport(contract, signer) {
  console.log("\n✅ Verify Report");
  console.log("========================================");

  const reportId = await question("Enter report ID to verify: ");

  console.log("\n⏳ Verifying report...");
  const tx = await contract.connect(signer).verifyReport(reportId);
  console.log("  Transaction Hash:", tx.hash);

  await tx.wait();
  console.log("✅ Report verified successfully!");
  console.log("  Report ID:", reportId);
}

// View report information
async function viewReportInfo(contract) {
  console.log("\n📄 View Report Information");
  console.log("========================================");

  const reportId = await question("Enter report ID: ");

  const reportInfo = await contract.getReportInfo(reportId);

  console.log("\n📋 Report Details:");
  console.log("  Report ID:", reportId);
  console.log("  Submitter:", reportInfo[0]);
  console.log("  Timestamp:", new Date(Number(reportInfo[1]) * 1000).toLocaleString());
  console.log("  Report Period:", reportInfo[2].toString());
  console.log("  Verified:", reportInfo[3] ? "Yes" : "No");
  console.log("  Processed:", reportInfo[4] ? "Yes" : "No");
  console.log("");
}

// View period information
async function viewPeriodInfo(contract) {
  console.log("\n📅 View Period Information");
  console.log("========================================");

  const periodId = await question("Enter period ID: ");

  const periodInfo = await contract.getPeriodInfo(periodId);

  console.log("\n📋 Period Details:");
  console.log("  Period ID:", periodId);
  console.log("  Start Time:", new Date(Number(periodInfo[0]) * 1000).toLocaleString());
  console.log("  End Time:", new Date(Number(periodInfo[1]) * 1000).toLocaleString());
  console.log("  Active:", periodInfo[2] ? "Yes" : "No");
  console.log("  Submission Deadline:", new Date(Number(periodInfo[3]) * 1000).toLocaleString());
  console.log("  Total Submissions:", periodInfo[4].toString());
  console.log("");
}

// Grant decryption access
async function grantDecryptionAccess(contract, signer) {
  console.log("\n🔓 Grant Decryption Access");
  console.log("========================================");

  const reportId = await question("Enter report ID: ");
  const analystAddress = await question("Enter analyst address: ");

  if (!hre.ethers.isAddress(analystAddress.trim())) {
    console.error("❌ Invalid Ethereum address");
    return;
  }

  console.log("\n⏳ Granting decryption access...");
  const tx = await contract.connect(signer).grantDecryptionAccess(reportId, analystAddress.trim());
  console.log("  Transaction Hash:", tx.hash);

  await tx.wait();
  console.log("✅ Decryption access granted successfully!");
  console.log("  Report ID:", reportId);
  console.log("  Analyst:", analystAddress.trim());
}

// Execute interaction
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      rl.close();
      process.exit(1);
    });
}

module.exports = main;
