const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying PrivacyRegulatoryReporting contract to Sepolia...");

  const regulatorAddress = process.env.REGULATOR_ADDRESS;

  if (!regulatorAddress || regulatorAddress === "YOUR_REGULATOR_ADDRESS_HERE") {
    throw new Error("Please set REGULATOR_ADDRESS in .env file");
  }

  console.log("Regulator address:", regulatorAddress);

  const PrivacyRegulatoryReporting = await hre.ethers.getContractFactory("PrivacyRegulatoryReporting");
  const contract = await PrivacyRegulatoryReporting.deploy(regulatorAddress);

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("✅ PrivacyRegulatoryReporting deployed to:", contractAddress);
  console.log("Regulator:", regulatorAddress);
  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress} ${regulatorAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });