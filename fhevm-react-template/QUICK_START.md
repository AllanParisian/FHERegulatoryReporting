# Quick Start Guide

> Get started with fhEVM SDK in less than 5 minutes

---

## 🚀 For Developers Using the SDK

### Step 1: Install

```bash
npm install @fhevm-template/sdk ethers fhevm
```

### Step 2: Create Client

```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const client = await createFhevmClient({ provider, signer });
```

### Step 3: Encrypt & Use

```typescript
// Encrypt
const encrypted = await client.encrypt(42, 'uint64');

// Use in contract
const contract = new ethers.Contract(address, abi, signer);
await contract.submitData(encrypted.data);

// Decrypt
const decrypted = await client.userDecrypt(contractAddress, handle);
console.log('Value:', decrypted.value);
```

**Done!** 🎉

---

## 📱 For Developers Exploring Examples

### Try Next.js Demo

```bash
# Clone repository
git clone https://github.com/your-username/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm run install:all

# Start Next.js demo
npm run dev:nextjs

# Open browser
open http://localhost:3000
```

### Deploy Example Contract

```bash
# Navigate to example
cd examples/privacy-regulatory-reporting

# Setup environment
cp .env.example .env
# Edit .env with your values

# Compile and deploy
npm run compile
npm run deploy
```

---

## 🛠️ For Contributors

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/fhevm-react-template.git
cd fhevm-react-template

# Install all dependencies
npm run install:all

# Build SDK
npm run build:sdk

# Run tests
npm test

# Start development
npm run dev:sdk
```

### Make Changes

```bash
# Create branch
git checkout -b feature/your-feature

# Make changes in packages/fhevm-sdk/

# Test
npm run test:sdk

# Build
npm run build:sdk

# Commit and push
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 📚 Next Steps

### Learn More
- [Full Documentation](./README.md)
- [SDK API Reference](./packages/fhevm-sdk/README.md)
- [Next.js Example](./examples/nextjs-privacy-dashboard/README.md)
- [Watch Demo Video](./demo.mp4)

### Get Help
- [GitHub Issues](https://github.com/your-username/fhevm-react-template/issues)
- [Contributing Guide](./CONTRIBUTING.md)
- [Zama Documentation](https://docs.zama.ai/fhevm)

---

**Happy Building with fhEVM! 🔐**
