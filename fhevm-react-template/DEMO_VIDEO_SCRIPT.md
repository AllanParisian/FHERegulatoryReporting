# Demo Video Script

> Script for creating the demonstration video showcasing fhEVM SDK

**Duration:** 5-7 minutes
**Format:** Screen recording with narration

---

## Scene 1: Introduction (30 seconds)

**Visual:** Show README.md header

**Narration:**
"Welcome to fhEVM React Template 2.0 - a universal SDK for building privacy-preserving dApps. This SDK makes Fully Homomorphic Encryption as easy as using wagmi, with support for React, Vue, Node.js, or vanilla JavaScript."

**On Screen:**
- Project name and tagline
- Key features (Framework-agnostic, Wagmi-like API, Type-safe)

---

## Scene 2: Quick Start (1 minute)

**Visual:** Terminal window showing installation

**Narration:**
"Getting started takes less than 10 lines of code. Watch how simple it is."

**Demo Steps:**
```bash
# Terminal commands
npm install @fhevm-template/sdk ethers fhevm
```

**Visual:** VS Code showing quick start code

**Narration:**
"Import the SDK, create a client, and you're ready to encrypt and decrypt data on-chain."

**Code Shown:**
```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(privateKey, provider);
const client = await createFhevmClient({ provider, signer });

const encrypted = await client.encrypt(42, 'uint64');
const decrypted = await client.userDecrypt(contractAddress, handle);
```

---

## Scene 3: SDK Architecture (1 minute)

**Visual:** Show directory structure

**Narration:**
"The SDK is organized as a monorepo with three main parts: the core SDK package, a Next.js demo application, and a complete privacy regulatory reporting example."

**On Screen:**
```
├── packages/fhevm-sdk/      # Universal SDK
├── examples/
│   ├── nextjs-privacy-dashboard/
│   └── privacy-regulatory-reporting/
```

**Visual:** Show SDK features

**Features Highlighted:**
- Encryption utilities (all types)
- Decryption (user + public)
- EIP-712 signing
- React hooks
- Error handling
- TypeScript types

---

## Scene 4: Encryption Demo (1.5 minutes)

**Visual:** Browser showing Next.js app running

**Narration:**
"Let's see the SDK in action with our Next.js demo. Here you can encrypt different data types - from simple numbers to Ethereum addresses."

**Demo Steps:**
1. Select data type (uint64)
2. Enter value (1000000)
3. Click "Encrypt Value"
4. Show encrypted result
5. Copy encrypted data

**On Screen:**
- Original value: 1000000
- Encrypted data: 0x... (long hex string)
- Timestamp
- "Use this in your contract calls" message

**Narration:**
"The encrypted data is now ready to send to your smart contract. The contract can perform computations without ever seeing the original value."

---

## Scene 5: React Hooks Integration (1 minute)

**Visual:** VS Code showing React component

**Narration:**
"The SDK provides wagmi-like hooks that make integration seamless. Here's how the encryption demo component uses our hooks."

**Code Shown:**
```tsx
import { useFhevmEncrypt } from '@fhevm-template/sdk';

function EncryptionDemo() {
  const { encrypt, isEncrypting, error } = useFhevmEncrypt();

  const handleSubmit = async () => {
    const result = await encrypt(100, 'uint64');
    // Use result.data in contract call
  };

  return (
    <button onClick={handleSubmit} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

**Narration:**
"The hooks handle loading states, errors, and results automatically - just like you'd expect from wagmi."

---

## Scene 6: Decryption Demo (1 minute)

**Visual:** Browser showing decryption tab

**Narration:**
"Decryption supports two modes: user decryption with EIP-712 signatures for private data, and public decryption for publicly readable values."

**Demo Steps:**
1. Switch to "Decryption Demo" tab
2. Select "User Decryption"
3. Enter contract address
4. Enter encrypted handle
5. Click "Decrypt Value"
6. Show wallet signature popup
7. Display decrypted result

**On Screen:**
- Decryption method selection
- Signature request from wallet
- Decrypted value displayed

---

## Scene 7: Production Example (1.5 minutes)

**Visual:** Terminal and VS Code

**Narration:**
"Now let's look at a complete production example - a privacy-preserving regulatory reporting system. Financial institutions can submit encrypted transaction reports while maintaining complete confidentiality."

**Demo Steps:**
```bash
cd examples/privacy-regulatory-reporting
cat contracts/PrivacyRegulatoryReporting.sol
```

**Visual:** Show contract code

**Highlight:**
```solidity
struct ConfidentialReport {
    euint64 encryptedAmount;
    euint32 encryptedTransactionCount;
    euint8 encryptedRiskScore;
    // ...
}
```

**Narration:**
"The contract uses fhEVM's encrypted types. Let's deploy it."

**Demo Steps:**
```bash
npm run compile
npm run deploy
```

**Visual:** Show deployment output with contract address

**Narration:**
"The deployment script uses our SDK for initialization and saves all deployment information including Etherscan links."

---

## Scene 8: SDK Integration in Smart Contract Interaction (1 minute)

**Visual:** VS Code showing interaction script

**Narration:**
"Here's how the SDK simplifies smart contract interaction. Instead of manual TFHE calls, we use the SDK's simple encrypt method."

**Code Shown:**
```typescript
import { createFhevmClient } from '@fhevm-template/sdk';

// Encrypt sensitive data
const amount = await client.encrypt(1000000, 'uint64');
const txCount = await client.encrypt(50, 'uint32');
const riskScore = await client.encrypt(25, 'uint8');

// Submit to contract
const tx = await contract.submitConfidentialReport(
  amount.data,
  txCount.data,
  riskScore.data,
  periodId
);
```

**Narration:**
"The SDK handles all the encryption complexity - you just specify the value and type. The contract receives fully encrypted data ready for homomorphic computation."

---

## Scene 9: Design Choices (1 minute)

**Visual:** Show README.md "Why This SDK" section

**Narration:**
"Let me explain our key design choices. We modeled the API after wagmi because it's familiar to web3 developers. The SDK is framework-agnostic at its core, with optional React hooks for convenience."

**On Screen - Key Decisions:**
1. **Wagmi-like API** → Familiar to web3 developers
2. **Framework Agnostic** → Core works anywhere, hooks optional
3. **TypeScript First** → Full type safety
4. **Modular Exports** → Import only what you need
5. **Zero Config** → Sensible defaults

**Narration:**
"We also focused on developer experience - comprehensive error messages, loading states, and caching are built in."

---

## Scene 10: Framework Flexibility (30 seconds)

**Visual:** Show code examples side by side

**Narration:**
"The same SDK works in different environments - here's vanilla JavaScript, React hooks, and Node.js scripts, all using the same core client."

**On Screen:**
```typescript
// Vanilla JS
const client = await createFhevmClient({ provider, signer });

// React
const { encrypt } = useFhevmEncrypt();

// Node.js
const { createFhevmClient } = require('@fhevm-template/sdk');
```

---

## Scene 11: Wrap Up (30 seconds)

**Visual:** Show completed structure

**Narration:**
"To summarize: we've built a universal fhEVM SDK that works with any framework, includes production-ready examples, and makes privacy-preserving development accessible to every JavaScript developer."

**On Screen - Deliverables:**
✅ Universal SDK (`@fhevm-template/sdk`)
✅ Next.js demo application
✅ Complete production dApp example
✅ Comprehensive documentation
✅ Live deployments

**Final Screen:**
- GitHub repo link
- Live demo link
- Documentation link
- "Thank you for watching!"

---

## Recording Tips

1. **Screen Resolution:** 1920x1080
2. **Font Size:** Increase terminal and editor fonts
3. **Color Scheme:** High contrast (dark theme recommended)
4. **Browser:** Full screen mode
5. **Terminal:** Clear, large font
6. **Pace:** Slow down during code sections
7. **Highlight:** Use cursor/annotations to draw attention
8. **Audio:** Clear microphone, minimize background noise

## Post-Production

1. Add chapter markers for each scene
2. Add text overlays for key points
3. Include links in video description
4. Add closed captions
5. Export as MP4 (H.264, 1080p, 60fps)

## Video Metadata

**Title:** fhEVM SDK 2.0 - Universal Privacy-Preserving dApp Development

**Description:**
A comprehensive demonstration of the fhEVM SDK - a framework-agnostic, wagmi-like library for building privacy-preserving decentralized applications with Fully Homomorphic Encryption.

**Timestamps:**
- 0:00 Introduction
- 0:30 Quick Start (< 10 lines)
- 1:30 SDK Architecture
- 2:30 Encryption Demo
- 4:00 React Hooks
- 5:00 Decryption Demo
- 6:00 Production Example
- 7:30 Design Choices
- 8:30 Summary

**Tags:** #fhEVM #Zama #Privacy #Encryption #Web3 #React #TypeScript #Blockchain #Ethereum
