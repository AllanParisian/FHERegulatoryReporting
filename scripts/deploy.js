/**
 * Deploy Script for Privacy-Preserving Regulatory Reporting System
 *
 * This script deploys the PrivacyRegulatoryReporting contract to the specified network.
 * It includes comprehensive logging, error handling, and deployment verification.
 *
 * Usage:
 *   npx hardhat run scripts/deploy.js --network sepolia
 *   npx hardhat run scripts/deploy.js --network localhost
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n========================================");
  console.log("Privacy-Preserving Regulatory Reporting");
  console.log("Contract Deployment Script");
  console.log("========================================\n");

  // Get network information
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("📋 Deployment Configuration:");
  console.log("  Network:", network);
  console.log("  Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
  console.log("  Deployer:", deployer.address);
  console.log("  Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // Verify sufficient balance
  if (balance < hre.ethers.parseEther("0.01")) {
    console.error("❌ Error: Insufficient ETH balance for deployment");
    console.error("   Please fund your deployer account with at least 0.01 ETH");
    process.exit(1);
  }

  // Get regulator address from environment or use deployer as default
  const regulatorAddress = process.env.REGULATOR_ADDRESS || deployer.address;

  if (regulatorAddress === deployer.address) {
    console.log("⚠️  Warning: Using deployer address as regulator (for testing only)");
    console.log("   Regulator Address:", regulatorAddress);
  } else {
    console.log("✅ Regulator Address:", regulatorAddress);
  }
  console.log("");

  // Validate regulator address
  if (!hre.ethers.isAddress(regulatorAddress)) {
    console.error("❌ Error: Invalid regulator address");
    process.exit(1);
  }

  try {
    // Get contract factory
    console.log("🔨 Compiling contracts...");
    const PrivacyRegulatoryReporting = await hre.ethers.getContractFactory(
      "PrivacyRegulatoryReporting"
    );

    // Deploy contract
    console.log("🚀 Deploying PrivacyRegulatoryReporting contract...");
    const startTime = Date.now();

    const contract = await PrivacyRegulatoryReporting.deploy(regulatorAddress);
    await contract.waitForDeployment();

    const deployTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const contractAddress = await contract.getAddress();

    console.log("");
    console.log("✅ Contract Deployed Successfully!");
    console.log("  Contract Address:", contractAddress);
    console.log("  Deployment Time:", deployTime, "seconds");
    console.log("");

    // Get deployment transaction details
    const deployTx = contract.deploymentTransaction();
    if (deployTx) {
      console.log("📊 Deployment Transaction:");
      console.log("  Transaction Hash:", deployTx.hash);
      console.log("  Block Number:", deployTx.blockNumber);
      console.log("  Gas Used:", deployTx.gasLimit.toString());
      console.log("");

      // Wait for confirmations
      if (network === "sepolia") {
        console.log("⏳ Waiting for block confirmations...");
        await deployTx.wait(2);
        console.log("✅ Confirmed (2 blocks)");
        console.log("");
      }
    }

    // Verify initial contract state
    console.log("🔍 Verifying Initial Contract State:");
    const owner = await contract.owner();
    const regulator = await contract.regulator();
    const currentPeriod = await contract.currentPeriod();
    const reportCounter = await contract.reportCounter();

    console.log("  Owner:", owner);
    console.log("  Regulator:", regulator);
    console.log("  Current Period:", currentPeriod.toString());
    console.log("  Total Reports:", reportCounter.toString());
    console.log("");

    // Get period information
    const periodInfo = await contract.getPeriodInfo(currentPeriod);
    console.log("📅 Initial Reporting Period:");
    console.log("  Period ID:", currentPeriod.toString());
    console.log("  Start Time:", new Date(Number(periodInfo[0]) * 1000).toISOString());
    console.log("  End Time:", new Date(Number(periodInfo[1]) * 1000).toISOString());
    console.log("  Active:", periodInfo[2]);
    console.log("  Submission Deadline:", new Date(Number(periodInfo[3]) * 1000).toISOString());
    console.log("  Total Submissions:", periodInfo[4].toString());
    console.log("");

    // Save deployment information
    const deploymentInfo = {
      network: network,
      chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
      contractAddress: contractAddress,
      deployer: deployer.address,
      regulator: regulatorAddress,
      deploymentDate: new Date().toISOString(),
      transactionHash: deployTx?.hash || "N/A",
      blockNumber: deployTx?.blockNumber || "N/A",
      compiler: {
        version: "0.8.24",
        optimizer: true,
        runs: 200
      }
    };

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save deployment information to file
    const deploymentFile = path.join(deploymentsDir, `${network}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("💾 Deployment information saved to:", deploymentFile);
    console.log("");

    // Display next steps
    console.log("========================================");
    console.log("✅ Deployment Complete!");
    console.log("========================================\n");

    console.log("📝 Next Steps:");
    console.log("  1. Verify contract on Etherscan:");
    console.log(`     npm run verify`);
    console.log("");
    console.log("  2. Interact with the contract:");
    console.log(`     npm run interact`);
    console.log("");
    console.log("  3. Run simulations:");
    console.log(`     npm run simulate`);
    console.log("");

    if (network === "sepolia") {
      console.log("🔗 Etherscan Link:");
      console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
      console.log("");
    }

    console.log("📋 Contract Address (save this):");
    console.log(`   ${contractAddress}`);
    console.log("");

    return contractAddress;

  } catch (error) {
    console.error("\n❌ Deployment Failed!");
    console.error("Error:", error.message);

    if (error.message.includes("insufficient funds")) {
      console.error("\n💡 Solution: Add more ETH to your deployer account");
      console.error("   Address:", deployer.address);
    } else if (error.message.includes("nonce")) {
      console.error("\n💡 Solution: Wait a few moments and try again");
    } else if (error.message.includes("network")) {
      console.error("\n💡 Solution: Check your network configuration and RPC URL");
    }

    console.error("");
    process.exit(1);
  }
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;