# @fhevm-template/sdk

> **Universal SDK for privacy-preserving dApps with Zama fhEVM**

Framework-agnostic, wagmi-like structure for building confidential smart contract frontends.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## Features

- ✅ **Framework-Agnostic** - Works with React, Vue, Node.js, or vanilla JavaScript
- ✅ **Wagmi-Like API** - Familiar hooks-based structure for React developers
- ✅ **Type-Safe** - Full TypeScript support with comprehensive type definitions
- ✅ **Modular** - Import only what you need
- ✅ **Zero Config** - Works out of the box with sensible defaults
- ✅ **EIP-712 Signing** - Built-in support for user decryption signatures
- ✅ **Error Handling** - Comprehensive error classes and messages

## Installation

```bash
npm install @fhevm-template/sdk ethers fhevm
```

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

// Create provider and signer
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(privateKey, provider);

// Create fhEVM client
const client = await createFhevmClient({
  provider,
  signer
});

// Encrypt a value
const encrypted = await client.encrypt(42, 'uint64');
console.log('Encrypted:', encrypted.data);

// Decrypt a value
const decrypted = await client.userDecrypt(contractAddress, handle);
console.log('Decrypted:', decrypted.value);
```

### React with Hooks

```tsx
import { FhevmProvider, useFhevm, useFhevmEncrypt } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

// Wrap your app
function App() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return (
    <FhevmProvider config={{ provider, signer }}>
      <MyComponent />
    </FhevmProvider>
  );
}

// Use in components
function MyComponent() {
  const { client, isInitialized } = useFhevm();
  const { encrypt, isEncrypting } = useFhevmEncrypt();

  const handleSubmit = async () => {
    const encrypted = await encrypt(100, 'uint64');
    // Use encrypted.data in contract call
  };

  if (!isInitialized) return <div>Initializing fhEVM...</div>;

  return (
    <button onClick={handleSubmit} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Submit'}
    </button>
  );
}
```

## Core API

### Client Creation

```typescript
import { createFhevmClient, FhevmClient } from '@fhevm-template/sdk';

const client = await createFhevmClient({
  provider: ethersProvider,
  signer: ethersSigner
}, {
  debug: true,
  enableCache: true
});
```

### Encryption

```typescript
// Encrypt different types
const encrypted8 = await client.encrypt(255, 'uint8');
const encrypted64 = await client.encrypt(1000000, 'uint64');
const encryptedAddr = await client.encrypt('0x1234...', 'address');
const encryptedBool = await client.encrypt(true, 'bool');

// Type-specific helpers
import { encryptUint64, encryptAddress } from '@fhevm-template/sdk';

const result = await encryptUint64(42);
// result.data: '0x...'  <- Use this in contract calls
```

### Decryption

```typescript
// User decryption (requires signature)
const result = await client.userDecrypt(contractAddress, handle);
if (result.success) {
  console.log('Value:', result.value);
}

// Public decryption (no signature)
const publicResult = await client.publicDecrypt(handle);
```

### Contract Interaction (React)

```tsx
import { useFhevmContract } from '@fhevm-template/sdk';

function MyComponent() {
  const { call, read, isLoading } = useFhevmContract({
    contractAddress: '0x...',
    abi: contractABI
  });

  const submitReport = async () => {
    const encrypted = await encrypt(100, 'uint64');
    const result = await call('submitReport', [encrypted.data]);
    console.log('Transaction:', result.transactionHash);
  };

  const getReport = async () => {
    const report = await read('getReport', [reportId]);
    console.log('Report:', report);
  };

  return (
    <>
      <button onClick={submitReport} disabled={isLoading}>Submit</button>
      <button onClick={getReport}>Get Report</button>
    </>
  );
}
```

## React Hooks

### `useFhevm()`

Access the fhEVM client instance.

```tsx
const { client, isInitialized, error } = useFhevm();
```

### `useFhevmEncrypt()`

Encrypt values with loading states.

```tsx
const { encrypt, isEncrypting, error, lastResult } = useFhevmEncrypt();

const encrypted = await encrypt(42, 'uint64');
```

### `useFhevmDecrypt()`

Decrypt values with loading states.

```tsx
const { userDecrypt, publicDecrypt, isDecrypting } = useFhevmDecrypt();

const result = await userDecrypt(contractAddress, handle);
```

### `useFhevmContract()`

Interact with contracts.

```tsx
const { call, read, isLoading, error } = useFhevmContract({
  contractAddress: '0x...',
  abi: contractABI
});
```

## Encryption Types

| Type | Range | Example |
|------|-------|---------|
| `uint8` | 0 - 255 | `await encrypt(100, 'uint8')` |
| `uint16` | 0 - 65535 | `await encrypt(1000, 'uint16')` |
| `uint32` | 0 - 4294967295 | `await encrypt(1000000, 'uint32')` |
| `uint64` | 0 - 2^64-1 | `await encrypt(1000000000, 'uint64')` |
| `address` | Ethereum address | `await encrypt('0x123...', 'address')` |
| `bool` | true/false | `await encrypt(true, 'bool')` |

## Error Handling

```typescript
import {
  FhevmError,
  EncryptionError,
  DecryptionError,
  SignatureError
} from '@fhevm-template/sdk';

try {
  const encrypted = await client.encrypt(42, 'uint64');
} catch (error) {
  if (error instanceof EncryptionError) {
    console.error('Encryption failed:', error.message);
  } else if (error instanceof FhevmError) {
    console.error('fhEVM error:', error.message);
  }
}
```

## EIP-712 Signing

```typescript
import { generateSignature, createEIP712Domain } from '@fhevm-template/sdk';

const domain = createEIP712Domain(
  chainId,
  contractAddress,
  'MyContract',
  '1'
);

const signature = await generateSignature(
  signer,
  domain,
  handle,
  userAddress
);
```

## TypeScript Support

Full type definitions included:

```typescript
import type {
  FhevmConfig,
  FhevmClientOptions,
  EncryptionResult,
  DecryptionResult,
  SignatureResult,
  EIP712Domain
} from '@fhevm-template/sdk';
```

## Examples

See the `examples/` directory for complete implementations:

- **Next.js** - Full-featured Next.js application
- **Privacy Regulatory Reporting** - Complete privacy-preserving dApp

## License

MIT © Privacy Compliance Team
