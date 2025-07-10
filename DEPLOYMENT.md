# Deployment Guide

## Privacy-Preserving Regulatory Reporting System

This guide provides comprehensive instructions for deploying, verifying, and interacting with the Privacy-Preserving Regulatory Reporting smart contract.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Process](#deployment-process)
- [Contract Verification](#contract-verification)
- [Interaction Guide](#interaction-guide)
- [Network Information](#network-information)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version

### Required Accounts

1. **Ethereum Wallet**
   - MetaMask or similar wallet
   - Private key with Sepolia testnet ETH
   - Get testnet ETH from: https://sepoliafaucet.com/

2. **Etherscan API Key**
   - Create account at: https://etherscan.io
   - Generate API key at: https://etherscan.io/myapikey

---

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Network Configuration
SEPOLIA_RPC_URL=https://rpc.sepolia.org
# Alternative: Use Alchemy or Infura
# SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Deployment Account
PRIVATE_KEY=your_private_key_here

# Contract Configuration
REGULATOR_ADDRESS=0x1234567890123456789012345678901234567890

# Etherscan Verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Gas Reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
```

### 3. Security Checklist

- ✅ Never commit `.env` file to version control
- ✅ Use dedicated deployment account (not your main wallet)
- ✅ Ensure sufficient testnet ETH (minimum 0.05 ETH recommended)
- ✅ Verify regulator address is correct

---

## Deployment Process

### Step 1: Compile Contracts

```bash
npm run compile
```

**Expected Output:**
```
Compiled 1 Solidity file successfully
```

### Step 2: Deploy to Sepolia Testnet

```bash
npm run deploy
```

**Deployment Script Features:**
- ✅ Pre-deployment validation (balance, addresses)
- ✅ Automated contract deployment
- ✅ Post-deployment verification
- ✅ Deployment information saved to `deployments/sepolia.json`
- ✅ Initial reporting period creation
- ✅ Gas usage reporting

**Expected Output:**
```
========================================
Privacy-Preserving Regulatory Reporting
Contract Deployment Script
========================================

📋 Deployment Configuration:
  Network: sepolia
  Chain ID: 11155111
  Deployer: 0x...
  Balance: 0.15 ETH

✅ Contract Deployed Successfully!
  Contract Address: 0x...
  Deployment Time: 45.32 seconds

📊 Deployment Transaction:
  Transaction Hash: 0x...
  Block Number: 12345678
  Gas Used: 2500000

🔍 Verifying Initial Contract State:
  Owner: 0x...
  Regulator: 0x...
  Current Period: 1
  Total Reports: 0

📅 Initial Reporting Period:
  Period ID: 1
  Start Time: 2025-01-15T10:00:00.000Z
  End Time: 2025-04-15T10:00:00.000Z
  Active: true
  Submission Deadline: 2025-02-14T10:00:00.000Z
  Total Submissions: 0

💾 Deployment information saved to: deployments/sepolia.json

========================================
✅ Deployment Complete!
========================================

📋 Contract Address (save this):
   0x...

🔗 Etherscan Link:
   https://sepolia.etherscan.io/address/0x...
```

### Step 3: Save Deployment Information

The deployment script automatically saves critical information to `deployments/sepolia.json`:

```json
{
  "network": "sepolia",
  "chainId": "11155111",
  "contractAddress": "0x...",
  "deployer": "0x...",
  "regulator": "0x...",
  "deploymentDate": "2025-01-15T10:00:00.000Z",
  "transactionHash": "0x...",
  "blockNumber": "12345678",
  "compiler": {
    "version": "0.8.24",
    "optimizer": true,
    "runs": 200
  }
}
```

---

## Contract Verification

### Verify on Etherscan

```bash
npm run verify
```

**Verification Script Features:**
- ✅ Reads deployment information automatically
- ✅ Submits source code to Etherscan
- ✅ Handles constructor arguments
- ✅ Updates deployment file with verification status

**Expected Output:**
```
========================================
Contract Verification on Etherscan
========================================

📋 Verification Configuration:
  Network: sepolia
  Contract Address: 0x...
  Regulator: 0x...
  Deployed: 2025-01-15T10:00:00.000Z

🔍 Verifying contract on Etherscan...
   This may take a few moments...

✅ Contract Verified Successfully!

🔗 View on Etherscan:
   https://sepolia.etherscan.io/address/0x.../code

💾 Verification status saved to deployment file
```

### Manual Verification

If automated verification fails, use manual verification:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS REGULATOR_ADDRESS
```

---

## Interaction Guide

### Interactive CLI

Launch the interactive command-line interface:

```bash
npm run interact
```

**Available Operations:**

1. **View Contract Status** - Display current state and statistics
2. **Authorize Entity** - Grant submission permissions
3. **Revoke Entity** - Remove submission permissions
4. **Create Reporting Period** - Create new reporting window
5. **Submit Confidential Report** - Submit encrypted compliance data
6. **Verify Report** - Approve submitted report
7. **View Report Information** - Query report details
8. **View Period Information** - Query period details
9. **Grant Decryption Access** - Allow analyst to decrypt report

### Automated Simulation

Run complete workflow simulation:

```bash
npm run simulate
```

**Simulation Phases:**
1. Entity Authorization (3 entities)
2. Confidential Report Submission (3 reports)
3. Report Verification
4. Decryption Access Granting
5. Summary Statistics

---

## Network Information

### Sepolia Testnet

| Parameter | Value |
|-----------|-------|
| Network Name | Sepolia |
| Chain ID | 11155111 |
| RPC URL | https://rpc.sepolia.org |
| Block Explorer | https://sepolia.etherscan.io |
| Faucet | https://sepoliafaucet.com |

### Contract Addresses

After deployment, your contract addresses will be stored in:
- **Sepolia**: `deployments/sepolia.json`
- **Localhost**: `deployments/localhost.json`

### Etherscan Links

**Contract Address:**
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

**Verified Contract:**
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#code
```

**Transaction Hash:**
```
https://sepolia.etherscan.io/tx/YOUR_TX_HASH
```

---

## Troubleshooting

### Common Issues

#### 1. Insufficient Funds

**Error:**
```
Error: insufficient funds for intrinsic transaction cost
```

**Solution:**
- Get testnet ETH from faucet: https://sepoliafaucet.com
- Minimum recommended: 0.05 ETH for deployment

#### 2. Invalid Private Key

**Error:**
```
Error: invalid private key
```

**Solution:**
- Ensure private key is correctly formatted (64 hex characters)
- Do not include `0x` prefix in `.env` file
- Verify key is from correct wallet

#### 3. Network Connection Issues

**Error:**
```
Error: could not detect network
```

**Solution:**
- Check RPC URL in `.env` file
- Try alternative RPC provider (Alchemy, Infura)
- Verify internet connection

#### 4. Verification Failed

**Error:**
```
Error: verification failed
```

**Solution:**
- Wait 1-2 minutes after deployment
- Ensure Etherscan API key is valid
- Check constructor arguments match deployment

#### 5. Contract Already Verified

**Message:**
```
Contract already verified on Etherscan
```

**Action:**
- This is not an error
- Contract is already publicly verified
- View on Etherscan using provided link

---

## Deployment Checklist

### Pre-Deployment

- [ ] Install all dependencies (`npm install`)
- [ ] Configure `.env` file with all required variables
- [ ] Verify sufficient testnet ETH (minimum 0.05 ETH)
- [ ] Confirm regulator address is correct
- [ ] Test compilation (`npm run compile`)

### Deployment

- [ ] Deploy contract (`npm run deploy`)
- [ ] Save contract address from output
- [ ] Verify deployment transaction on Etherscan
- [ ] Confirm initial state is correct
- [ ] Save `deployments/sepolia.json` file

### Post-Deployment

- [ ] Verify contract on Etherscan (`npm run verify`)
- [ ] Test contract interaction (`npm run interact`)
- [ ] Run simulation to verify functionality (`npm run simulate`)
- [ ] Document contract address for team
- [ ] Update frontend configuration (if applicable)

---

## Additional Resources

### Documentation

- **Hardhat**: https://hardhat.org/docs
- **Ethers.js**: https://docs.ethers.org/v6/
- **fhEVM**: https://docs.zama.ai/fhevm

### Support

- GitHub Issues: Create issue in project repository
- Hardhat Discord: https://hardhat.org/discord
- Ethereum Stack Exchange: https://ethereum.stackexchange.com

---

## Security Considerations

### Production Deployment

When deploying to mainnet:

1. **Use Hardware Wallet** - Never use plain-text private keys
2. **Multi-Signature Wallet** - Use multi-sig for contract ownership
3. **Security Audit** - Complete professional security audit
4. **Gradual Rollout** - Start with limited functionality
5. **Emergency Procedures** - Establish incident response plan

### Best Practices

- ✅ Always test on testnet first
- ✅ Verify all constructor parameters
- ✅ Use time-locks for critical operations
- ✅ Implement access controls properly
- ✅ Monitor contract activity continuously
- ✅ Keep dependencies updated

---

## Conclusion

This deployment guide covers the complete workflow for deploying and managing the Privacy-Preserving Regulatory Reporting System. For additional assistance, refer to the main [README.md](./README.md) or create an issue in the project repository.

**Happy Deploying! 🚀**
