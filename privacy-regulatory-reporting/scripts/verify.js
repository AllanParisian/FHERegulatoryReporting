/**
 * Verification Script for Privacy-Preserving Regulatory Reporting System
 *
 * This script verifies the deployed contract on Etherscan.
 * It reads the deployment information and submits the contract source code for verification.
 *
 * Usage:
 *   npm run verify
 *   npx hardhat run scripts/verify.js --network sepolia
 *
 * Prerequisites:
 *   - Contract must be deployed
 *   - ETHERSCAN_API_KEY must be set in .env
 *   - Deployment info must exist in deployments/{network}.json
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n========================================");
  console.log("Contract Verification on Etherscan");
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

  console.log("📋 Verification Configuration:");
  console.log("  Network:", network);
  console.log("  Contract Address:", deploymentInfo.contractAddress);
  console.log("  Regulator:", deploymentInfo.regulator);
  console.log("  Deployed:", deploymentInfo.deploymentDate);
  console.log("");

  // Check if Etherscan API key is configured
  if (!process.env.ETHERSCAN_API_KEY) {
    console.error("❌ Error: ETHERSCAN_API_KEY not set in .env file");
    console.error("\n💡 Solution: Add your Etherscan API key to .env:");
    console.error("   ETHERSCAN_API_KEY=your_api_key_here");
    console.error("\n   Get your API key from: https://etherscan.io/myapikey");
    process.exit(1);
  }

  try {
    console.log("🔍 Verifying contract on Etherscan...");
    console.log("   This may take a few moments...\n");

    // Verify the contract
    await hre.run("verify:verify", {
      address: deploymentInfo.contractAddress,
      constructorArguments: [deploymentInfo.regulator],
      contract: "contracts/PrivacyRegulatoryReporting.sol:PrivacyRegulatoryReporting"
    });

    console.log("\n✅ Contract Verified Successfully!");
    console.log("");
    console.log("🔗 View on Etherscan:");
    console.log(`   https://${network === "sepolia" ? "sepolia." : ""}etherscan.io/address/${deploymentInfo.contractAddress}#code`);
    console.log("");

    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verificationDate = new Date().toISOString();
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("💾 Verification status saved to deployment file");
    console.log("");

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Contract already verified on Etherscan");
      console.log("");
      console.log("🔗 View on Etherscan:");
      console.log(`   https://${network === "sepolia" ? "sepolia." : ""}etherscan.io/address/${deploymentInfo.contractAddress}#code`);
      console.log("");
    } else {
      console.error("\n❌ Verification Failed!");
      console.error("Error:", error.message);

      if (error.message.includes("Invalid API Key")) {
        console.error("\n💡 Solution: Check your ETHERSCAN_API_KEY in .env");
        console.error("   Get a valid API key from: https://etherscan.io/myapikey");
      } else if (error.message.includes("does not have bytecode")) {
        console.error("\n💡 Solution: Ensure the contract is deployed to this network");
        console.error("   Current network:", network);
      } else if (error.message.includes("rate limit")) {
        console.error("\n💡 Solution: Wait a few minutes and try again");
        console.error("   Etherscan has rate limits on verification requests");
      }

      console.error("");
      process.exit(1);
    }
  }

  console.log("========================================");
  console.log("✅ Verification Complete!");
  console.log("========================================\n");

  console.log("📝 Next Steps:");
  console.log("  1. Interact with the verified contract:");
  console.log(`     npm run interact`);
  console.log("");
  console.log("  2. Run simulations:");
  console.log(`     npm run simulate`);
  console.log("");
}

// Execute verification
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;
