# fhEVM React Template 2.0

> **Universal SDK for Building Privacy-Preserving dApps with Zama fhEVM**

Framework-agnostic, developer-friendly SDK that makes encrypted smart contract development simple and accessible.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

**GitHub Repository**: [https://github.com/AllanParisian/fhevm-react-template](https://github.com/AllanParisian/fhevm-react-template)

**Bounty Program**: Zama fhEVM SDK Competition

---

## 📺 Demo Video

**A demonstration video is included in this repository as `demo.mp4`**

⚠️ **Note**: The video file must be **downloaded to view**. Please download `demo.mp4` from the repository to watch the full demonstration.

---

## 🎯 Core Concept

### Universal fhEVM SDK for Privacy-Preserving Applications

This project provides a **universal software development kit (SDK)** that simplifies building privacy-preserving decentralized applications using Fully Homomorphic Encryption (FHE).

**Key Innovation**: Current fhEVM development requires complex setup, manual encryption/decryption logic, and framework-specific implementations. This SDK provides a unified, framework-agnostic solution that works with any JavaScript environment.

### What This SDK Enables

- **Framework-Agnostic** - Use with React, Vue, Node.js, or vanilla JavaScript
- **Simple API** - Wagmi-like interface familiar to Web3 developers
- **Complete FHE Flow** - Initialization, encryption, decryption, and signing
- **Production Ready** - Error handling, caching, and retry logic built-in
- **Type-Safe** - Full TypeScript support with comprehensive definitions

---

## 🌟 What's New in 2.0

This is a **complete rewrite** focusing on the **fhEVM SDK** as the core deliverable:

✅ **Universal SDK** (`@fhevm-template/sdk`) - Framework-agnostic, works anywhere
✅ **Wagmi-Like API** - Familiar hooks structure for easy adoption
✅ **Type-Safe** - Full TypeScript support
✅ **Zero Config** - Works out of the box
✅ **Modular** - Import only what you need
✅ **Production Ready** - Battle-tested with comprehensive tooling

---

## 🚀 Quick Start (Less Than 10 Lines)

### Install

```bash
npm install @fhevm-template/sdk ethers fhevm
```

### Use

```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

// Create client
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(privateKey, provider);
const client = await createFhevmClient({ provider, signer });

// Encrypt and use encrypted data
const encrypted = await client.encrypt(42, 'uint64');
const tx = await contract.submitData(encrypted.data);

// Decrypt when authorized
const decrypted = await client.userDecrypt(contractAddress, handle);
```

**Done!** You're now using Fully Homomorphic Encryption.

---

## 📦 Monorepo Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Core SDK (main deliverable)
│       ├── src/
│       │   ├── core/           # Client, factory
│       │   ├── react/          # React hooks
│       │   ├── encryption.ts   # Encryption utilities
│       │   ├── decryption.ts   # Decryption utilities
│       │   ├── signing.ts      # EIP-712 signatures
│       │   ├── types.ts        # TypeScript definitions
│       │   └── index.ts        # Main exports
│       └── README.md
│
├── templates/                  # Example templates (symlink to examples/)
│   ├── nextjs/                 # Next.js template
│   ├── react/                  # React template (optional)
│   └── vue/                    # Vue template (optional)
│
├── examples/
│   ├── nextjs-privacy-dashboard/    # Next.js demonstration
│   │   ├── src/
│   │   │   ├── app/            # Next.js 14 App Router
│   │   │   │   ├── api/        # API routes
│   │   │   │   │   ├── fhe/    # FHE operations
│   │   │   │   │   │   ├── route.ts
│   │   │   │   │   │   ├── encrypt/route.ts
│   │   │   │   │   │   ├── decrypt/route.ts
│   │   │   │   │   │   └── compute/route.ts
│   │   │   │   │   └── keys/route.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/     # React components
│   │   │   │   ├── ui/         # UI components
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   └── Card.tsx
│   │   │   │   ├── fhe/        # FHE components
│   │   │   │   │   ├── FHEProvider.tsx
│   │   │   │   │   ├── KeyManager.tsx
│   │   │   │   │   └── ComputationDemo.tsx
│   │   │   │   └── examples/   # Use case examples
│   │   │   │       ├── BankingExample.tsx
│   │   │   │       └── MedicalExample.tsx
│   │   │   ├── lib/            # Utility libraries
│   │   │   │   ├── fhe/        # FHE integration
│   │   │   │   │   ├── client.ts
│   │   │   │   │   ├── server.ts
│   │   │   │   │   ├── keys.ts
│   │   │   │   │   └── types.ts
│   │   │   │   └── utils/      # Helper functions
│   │   │   │       ├── security.ts
│   │   │   │       └── validation.ts
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   │   ├── useFHE.ts
│   │   │   │   ├── useEncryption.ts
│   │   │   │   └── useComputation.ts
│   │   │   └── types/          # TypeScript types
│   │   │       ├── fhe.ts
│   │   │       └── api.ts
│   │   └── README.md
│   │
│   └── privacy-regulatory-reporting/  # Complete dApp example
│       ├── contracts/          # Solidity contracts
│       ├── scripts/            # Deployment scripts
│       └── README.md
│
├── docs/                       # Documentation
│   ├── README.md
│   ├── api.md
│   ├── examples.md
│   └── migration.md
│
├── QUICK_START.md              # Quick start guide
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
├── demo.mp4                    # Video demonstration (download to view)
└── README.md                   # This file
```

---

## 🎯 Core SDK Features

### 1. Framework-Agnostic Core

Works with **any** JavaScript environment:

```typescript
// Vanilla JavaScript/TypeScript
import { createFhevmClient, encryptUint64 } from '@fhevm-template/sdk';

// React
import { useFhevmEncrypt, useFhevmDecrypt } from '@fhevm-template/sdk';

// Vue (composables can be built on top)
import { createFhevmClient } from '@fhevm-template/sdk';

// Node.js
const { createFhevmClient } = require('@fhevm-template/sdk');
```

### 2. Wagmi-Like React Hooks

Familiar API for React developers:

```tsx
import { FhevmProvider, useFhevmEncrypt, useFhevmContract } from '@fhevm-template/sdk';

function App() {
  return (
    <FhevmProvider config={{ provider, signer }}>
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { encrypt, isEncrypting } = useFhevmEncrypt();
  const { call, read } = useFhevmContract({ contractAddress, abi });

  const handleSubmit = async () => {
    const encrypted = await encrypt(100, 'uint64');
    await call('submitReport', [encrypted.data]);
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### 3. Complete Encryption/Decryption Flow

```typescript
// Encrypt different types
await client.encrypt(255, 'uint8');        // 0-255
await client.encrypt(1000, 'uint32');      // 0-4294967295
await client.encrypt(1000000, 'uint64');   // Large numbers
await client.encrypt('0x123...', 'address'); // Ethereum addresses
await client.encrypt(true, 'bool');        // Boolean values

// Decrypt with EIP-712 signature
const result = await client.userDecrypt(contractAddress, handle);

// Public decrypt (no signature)
const publicResult = await client.publicDecrypt(handle);
```

### 4. EIP-712 Signing

Built-in support for user decryption signatures:

```typescript
import { generateSignature, createEIP712Domain } from '@fhevm-template/sdk';

const domain = createEIP712Domain(chainId, contractAddress);
const signature = await generateSignature(signer, domain, handle, userAddress);
```

### 5. Comprehensive Error Handling

```typescript
import { FhevmError, EncryptionError, DecryptionError } from '@fhevm-template/sdk';

try {
  const encrypted = await client.encrypt(42, 'uint64');
} catch (error) {
  if (error instanceof EncryptionError) {
    console.error('Encryption failed:', error.message);
  }
}
```

---

## 📱 Examples

### Next.js Privacy Dashboard

Full-featured Next.js 14 application showcasing SDK integration:

```bash
cd examples/nextjs-privacy-dashboard
npm install
npm run dev
```

**Features:**
- ✅ Encryption demo with all data types
- ✅ User and public decryption
- ✅ Responsive UI with Tailwind CSS
- ✅ Complete SDK hook integration
- ✅ TypeScript throughout

### Privacy Regulatory Reporting (Complete dApp)

**GitHub Repository**: [https://github.com/AllanParisian/FHERegulatoryReporting](https://github.com/AllanParisian/FHERegulatoryReporting)

Production-ready confidential compliance reporting system:

```bash
cd examples/privacy-regulatory-reporting
npm install
npm run compile
npm run deploy
```

**Core Concept - FHE Contract for Privacy Regulatory Reporting:**
- Financial institutions submit encrypted transaction reports
- All sensitive data remains encrypted on-chain (amounts, counts, risk scores)
- Regulators verify compliance without seeing actual values
- Selective decryption for authorized analysts only

**Features:**
- ✅ Fully Homomorphic Encryption on-chain
- ✅ Role-based access control
- ✅ Time-bound reporting periods
- ✅ SDK integration throughout
- ✅ 60+ comprehensive tests
- ✅ Complete documentation

**Demo Video**: Download `demo.mp4` from the Privacy Regulatory Reporting repository

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- Ethereum wallet with Sepolia testnet ETH

### Root Installation

```bash
# Clone repository
git clone https://github.com/AllanParisian/fhevm-react-template.git
cd fhevm-react-template

# Install all packages
npm run install:all

# Build SDK
npm run build:sdk

# Start Next.js demo
npm run dev:nextjs
```

### SDK Only

```bash
cd packages/fhevm-sdk
npm install
npm run build
```

### Deploy Example Contract

```bash
cd examples/privacy-regulatory-reporting
cp .env.example .env
# Edit .env with your values

npm run compile
npm run deploy
npm run verify
```

---

## 🆕 Standalone Privacy Regulatory Reporting Project

**Location**: `D:\privacy-regulatory-reporting` (Independent deployment-ready version)

A **production-ready**, **standalone** blockchain-based confidential regulatory reporting platform that can be deployed independently from the SDK monorepo.

### 🌟 Overview

This is a fully-featured, deployment-ready implementation that demonstrates real-world use of the fhEVM SDK in a compliance reporting context. Unlike the example in the monorepo, this is a complete, production-grade application.

### 🛠️ Technology Stack

**Blockchain Layer:**
- Solidity ^0.8.24 - Smart contract development
- fhEVM Protocol - Fully Homomorphic Encryption on EVM
- TFHE Library - Zama's encrypted computation library
- Sepolia Testnet - Ethereum test network
- Hardhat - Development environment

**Frontend Layer:**
- Next.js 14 - React framework with App Router
- TypeScript - Type-safe development
- Tailwind CSS - Utility-first styling
- ethers.js v6 - Ethereum blockchain interaction
- @fhevm-template/sdk - FHE SDK integration

**Encryption Technology:**
- Zama fhEVM - FHE virtual machine
- TFHE-rs - Rust-based FHE implementation
- Encrypted Types - euint8, euint32, euint64 for different data ranges

### 🚀 Quick Start

```bash
# Navigate to standalone project
cd D:\privacy-regulatory-reporting

# Install dependencies
npm install

# Compile smart contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy

# Run development server
npm run dev

# Build for production
npm run build
```

### 🔐 Key Features

- **Privacy-Preserving Submissions** - Submit confidential financial data that remains encrypted on-chain
- **Multi-Party Authorization** - Regulator-controlled entity authorization system
- **Reporting Period Management** - Time-bound reporting windows with deadline enforcement
- **Secure Data Access** - Granular decryption permissions with immutable access logs
- **Real-Time Compliance Tracking** - Monitor submission and verification progress
- **Role-Based Access Control** - Owner, Regulator, and Authorized Entity permissions

### 📊 Smart Contract

**Deployed Address**: `0x0B7F69092DF31270DE216D07ca22B3B8ee237154`
**Network**: Sepolia Testnet
**Contract**: `PrivacyRegulatoryReporting.sol`

**Core Functions:**
- Entity authorization and management
- Encrypted report submission (euint64, euint32, euint8)
- Reporting period creation and management
- Report verification by regulators
- Controlled decryption access for analysts

### 📝 Use Cases

- **Financial Compliance**: AML reporting, SAR, LTR, CTR
- **Regulatory Oversight**: Cross-border transaction monitoring, risk assessment
- **Privacy-Critical Industries**: Banking, cryptocurrency exchanges, payment processors

### 📚 Documentation

Full documentation available at: `D:\privacy-regulatory-reporting\README.md`

**Demo Video**: `PrivacyRegulatoryReporting.mp4` (included in project)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SDK README](./packages/fhevm-sdk/README.md) | Complete SDK documentation |
| [Next.js Example](./examples/nextjs-privacy-dashboard/README.md) | Next.js integration guide |
| [Privacy Reporting Example](./examples/privacy-regulatory-reporting/README.md) | Complete dApp example |
| [Standalone Privacy Reporting](D:/privacy-regulatory-reporting/README.md) | Production-ready standalone project |
| [QUICK_START.md](./QUICK_START.md) | 5-minute setup guide |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |

---

## 🎥 Demo Video

**A demonstration video is included in this repository as `demo.mp4`**

⚠️ **Note**: The video file must be **downloaded to view**. The video link cannot be opened directly - please download the file from the repository.

**Video Contents:**
1. SDK setup demonstration (less than 10 lines of code)
2. Encryption and decryption flows
3. Next.js application walkthrough
4. Privacy Regulatory Reporting example
5. Design choices explanation

---

## 🔗 Project Links

### Main Repositories

- **fhEVM SDK Repository**: [https://github.com/AllanParisian/fhevm-react-template](https://github.com/AllanParisian/fhevm-react-template)
- **Privacy Reporting Example**: [https://github.com/AllanParisian/FHERegulatoryReporting](https://github.com/AllanParisian/FHERegulatoryReporting)

### Standalone Projects

- **Privacy Regulatory Reporting** (Production-ready): `D:\privacy-regulatory-reporting`
  - Independent deployment-ready version
  - Smart contract deployed at: `0x0B7F69092DF31270DE216D07ca22B3B8ee237154`
  - Includes demo video: `PrivacyRegulatoryReporting.mp4`

### Resources

- **Zama Documentation**: https://docs.zama.ai/fhevm
- **fhEVM Package**: https://www.npmjs.com/package/fhevm
- **Zama GitHub**: https://github.com/zama-ai

---

## 🎯 Why This SDK?

### Problem: Existing Solutions Are Fragmented

Current fhEVM development requires:
- ❌ Manual TFHE library integration
- ❌ Custom encryption/decryption logic
- ❌ EIP-712 signing from scratch
- ❌ Framework-specific implementations
- ❌ Repetitive boilerplate code

### Solution: Universal SDK

This SDK provides:
- ✅ **One Import** - All utilities in one package
- ✅ **Wagmi-Like API** - Familiar hooks structure
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Zero Config** - Works out of the box
- ✅ **Framework Agnostic** - Use anywhere
- ✅ **Production Ready** - Battle-tested

### Code Comparison

**Before (Manual FHE):**

```typescript
// 30+ lines of boilerplate
import { initFhevm } from 'fhevm';
import { ethers } from 'ethers';

const fhevm = await initFhevm();
const provider = new ethers.JsonRpcProvider(RPC_URL);
// ... more setup code
// ... manual encryption
// ... manual EIP-712 signing
// ... 20+ more lines
```

**After (With SDK):**

```typescript
// 5 lines
import { createFhevmClient } from '@fhevm-template/sdk';

const client = await createFhevmClient({ provider, signer });
const encrypted = await client.encrypt(42, 'uint64');
const decrypted = await client.userDecrypt(contractAddress, handle);
```

**Result:** 85% less code, 100% type-safe, zero configuration.

---

## 🏆 Competition Deliverables

### ✅ Universal fhEVM SDK (Main Deliverable)

**Location:** `packages/fhevm-sdk/`

- ✅ Framework-agnostic (React, Vue, Node.js, vanilla JS)
- ✅ Wagmi-like API structure
- ✅ Complete encryption/decryption utilities
- ✅ EIP-712 signing support
- ✅ TypeScript with full type definitions
- ✅ React hooks for easy integration
- ✅ Comprehensive error handling
- ✅ Modular exports

### ✅ Next.js Example (Required)

**Location:** `examples/nextjs-privacy-dashboard/`

- ✅ Next.js 14 with App Router
- ✅ Full SDK integration
- ✅ Interactive encryption/decryption demos
- ✅ Responsive UI with Tailwind CSS
- ✅ Production ready

### ✅ Additional Example (Privacy Regulatory Reporting)

**Repository:** [https://github.com/AllanParisian/FHERegulatoryReporting](https://github.com/AllanParisian/FHERegulatoryReporting)

**Monorepo Location:** `examples/privacy-regulatory-reporting/`

**Standalone Location:** `D:\privacy-regulatory-reporting` (Production-ready deployment)

- ✅ Complete production dApp
- ✅ FHE contract for confidential regulatory data submission
- ✅ SDK integration throughout
- ✅ Solidity contracts with FHE (PrivacyRegulatoryReporting.sol)
- ✅ Deployment scripts (Deployed at: `0x0B7F69092DF31270DE216D07ca22B3B8ee237154`)
- ✅ 60+ comprehensive tests
- ✅ Standalone deployment-ready version with demo video
- ✅ Full technology stack: Next.js 14, TypeScript, Tailwind CSS, Hardhat

### ✅ Documentation

- ✅ Main README with complete overview
- ✅ SDK README with API documentation
- ✅ Example README files
- ✅ Quick start guide
- ✅ Contributing guidelines

### ✅ Video Demo

- ✅ Complete demonstration video (download `demo.mp4` to view)
- ✅ Setup and usage walkthrough
- ✅ Design choices explanation

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development

```bash
# Install dependencies
npm run install:all

# Build SDK
npm run build:sdk

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

Built with cutting-edge privacy technology:

- **Zama** - For pioneering fhEVM technology
- **Ethereum Foundation** - For Sepolia testnet
- **Next.js** - For excellent React framework
- **TypeScript** - For type safety

---

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/AllanParisian/fhevm-react-template/issues)
- **Documentation**: [Read the docs](./docs/)

---

**Built for Privacy** | **Powered by Zama fhEVM** | **Production Ready**

[View SDK Docs](./packages/fhevm-sdk/README.md) • [Privacy Reporting Example](https://github.com/AllanParisian/FHERegulatoryReporting)
