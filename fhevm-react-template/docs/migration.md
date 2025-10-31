# Migration Guide

> Guide for migrating from fhEVM 1.x to the Universal SDK 2.0

---

## Overview

This guide helps you migrate from manual fhEVM integration to the new Universal SDK 2.0, which provides a wagmi-like API with framework-agnostic support.

---

## Breaking Changes

### 1. Package Name

**Before:**
```bash
npm install fhevm
```

**After:**
```bash
npm install @fhevm-template/sdk ethers fhevm
```

### 2. Initialization

**Before (Manual):**
```typescript
import { initFhevm } from 'fhevm';
import { ethers } from 'ethers';

const fhevm = await initFhevm();
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
```

**After (SDK):**
```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const client = await createFhevmClient({ provider, signer });
```

### 3. Encryption

**Before (Manual):**
```typescript
const encrypted = fhevm.encrypt64(BigInt(42));
const encryptedHex = '0x' + Buffer.from(encrypted).toString('hex');
```

**After (SDK):**
```typescript
const encrypted = await client.encrypt(42, 'uint64');
// encrypted.data is already formatted as '0x...'
```

### 4. Decryption with EIP-712

**Before (Manual):**
```typescript
const domain = {
  name: 'Decryption',
  version: '1',
  chainId: await provider.getNetwork().then(n => n.chainId),
  verifyingContract: contractAddress
};

const types = {
  Decryption: [
    { name: 'handle', type: 'bytes32' },
    { name: 'user', type: 'address' }
  ]
};

const value = {
  handle,
  user: await signer.getAddress()
};

const signature = await signer.signTypedData(domain, types, value);
// ... more manual steps
```

**After (SDK):**
```typescript
const result = await client.userDecrypt(contractAddress, handle);
// EIP-712 signing handled automatically
```

---

## Step-by-Step Migration

### Step 1: Install New Package

```bash
npm install @fhevm-template/sdk ethers fhevm
```

### Step 2: Update Imports

**Before:**
```typescript
import { initFhevm } from 'fhevm';
```

**After:**
```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
```

### Step 3: Replace Initialization Code

**Before:**
```typescript
const fhevm = await initFhevm();
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Manual setup of fhEVM instance
// 15+ lines of initialization code
```

**After:**
```typescript
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const client = await createFhevmClient({ provider, signer });
```

### Step 4: Update Encryption Calls

**Before:**
```typescript
const encryptedUint64 = fhevm.encrypt64(BigInt(amount));
const encryptedUint32 = fhevm.encrypt32(BigInt(count));
const encryptedAddress = fhevm.encryptAddress(address);

// Convert to hex
const hex64 = '0x' + Buffer.from(encryptedUint64).toString('hex');
const hex32 = '0x' + Buffer.from(encryptedUint32).toString('hex');
const hexAddr = '0x' + Buffer.from(encryptedAddress).toString('hex');
```

**After:**
```typescript
const encryptedAmount = await client.encrypt(amount, 'uint64');
const encryptedCount = await client.encrypt(count, 'uint32');
const encryptedAddress = await client.encrypt(address, 'address');

// Already formatted as hex strings
const hex64 = encryptedAmount.data;
const hex32 = encryptedCount.data;
const hexAddr = encryptedAddress.data;
```

### Step 5: Update Decryption Calls

**Before:**
```typescript
// Manual EIP-712 signature creation
const domain = { /* ... */ };
const types = { /* ... */ };
const value = { /* ... */ };
const signature = await signer.signTypedData(domain, types, value);

// Manual gateway request
const decrypted = await fetch(gatewayUrl, {
  method: 'POST',
  body: JSON.stringify({ handle, signature })
});
```

**After:**
```typescript
const result = await client.userDecrypt(contractAddress, handle);
if (result.success) {
  console.log('Decrypted value:', result.value);
}
```

### Step 6: Update Contract Interactions

**Before:**
```typescript
const contract = new ethers.Contract(address, abi, signer);

// Manual encryption
const encrypted1 = fhevm.encrypt64(BigInt(value1));
const encrypted2 = fhevm.encrypt32(BigInt(value2));

// Manual hex conversion
const hex1 = '0x' + Buffer.from(encrypted1).toString('hex');
const hex2 = '0x' + Buffer.from(encrypted2).toString('hex');

// Submit transaction
const tx = await contract.submitData(hex1, hex2);
await tx.wait();
```

**After:**
```typescript
// Encrypt values
const encrypted1 = await client.encrypt(value1, 'uint64');
const encrypted2 = await client.encrypt(value2, 'uint32');

// Submit transaction
const contract = new ethers.Contract(address, abi, client.getSigner());
const tx = await contract.submitData(encrypted1.data, encrypted2.data);
await tx.wait();
```

---

## React Migration

### From Custom Hooks to SDK Hooks

**Before (Custom Implementation):**
```tsx
import React, { useState, useEffect } from 'react';
import { initFhevm } from 'fhevm';

function MyComponent() {
  const [fhevm, setFhevm] = useState(null);
  const [encrypted, setEncrypted] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const instance = await initFhevm();
      setFhevm(instance);
    }
    init();
  }, []);

  const handleEncrypt = async (value) => {
    setLoading(true);
    try {
      const result = fhevm.encrypt64(BigInt(value));
      const hex = '0x' + Buffer.from(result).toString('hex');
      setEncrypted(hex);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => handleEncrypt(42)} disabled={loading}>
        {loading ? 'Encrypting...' : 'Encrypt'}
      </button>
    </div>
  );
}
```

**After (SDK Hooks):**
```tsx
import React from 'react';
import { FhevmProvider, useFhevmEncrypt } from '@fhevm-template/sdk';

function App() {
  return (
    <FhevmProvider config={{ provider, signer }}>
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { encrypt, isEncrypting, lastResult } = useFhevmEncrypt();

  const handleEncrypt = async () => {
    await encrypt(42, 'uint64');
  };

  return (
    <div>
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>
      {lastResult && <div>Encrypted: {lastResult.data}</div>}
    </div>
  );
}
```

---

## Common Migration Patterns

### Pattern 1: Batch Encryption

**Before:**
```typescript
const encrypted = [];
for (const value of values) {
  const enc = fhevm.encrypt64(BigInt(value));
  encrypted.push('0x' + Buffer.from(enc).toString('hex'));
}
```

**After:**
```typescript
const encrypted = await Promise.all(
  values.map(value => client.encrypt(value, 'uint64'))
);
const hexValues = encrypted.map(e => e.data);
```

### Pattern 2: Error Handling

**Before:**
```typescript
try {
  const encrypted = fhevm.encrypt64(BigInt(value));
} catch (error) {
  console.error('Encryption failed:', error);
}
```

**After:**
```typescript
import { EncryptionError } from '@fhevm-template/sdk';

try {
  const encrypted = await client.encrypt(value, 'uint64');
} catch (error) {
  if (error instanceof EncryptionError) {
    console.error('Encryption failed:', error.message);
  }
}
```

### Pattern 3: Provider/Signer Updates

**Before:**
```typescript
// Manually manage provider and signer
let provider = new ethers.JsonRpcProvider(RPC_URL);
let signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Update signer when needed
signer = newSigner;
```

**After:**
```typescript
const client = await createFhevmClient({ provider, signer });

// Update signer dynamically
client.setSigner(newSigner);
```

---

## Feature Mapping

| Old Approach | New SDK Method | Notes |
|--------------|----------------|-------|
| `initFhevm()` | `createFhevmClient(config)` | Automatic initialization |
| `fhevm.encrypt64()` | `client.encrypt(value, 'uint64')` | Auto hex formatting |
| `fhevm.encrypt32()` | `client.encrypt(value, 'uint32')` | Auto hex formatting |
| `fhevm.encryptAddress()` | `client.encrypt(address, 'address')` | Auto hex formatting |
| `fhevm.encryptBool()` | `client.encrypt(bool, 'bool')` | Auto hex formatting |
| Manual EIP-712 | `client.userDecrypt()` | Built-in signature |
| Manual gateway | `client.publicDecrypt()` | Built-in requests |
| Custom hooks | `useFhevmEncrypt()` | Wagmi-like API |
| - | `useFhevmDecrypt()` | New feature |
| - | `useFhevmContract()` | New feature |

---

## Benefits After Migration

### Before Migration
- ❌ 30+ lines of setup code
- ❌ Manual hex conversion
- ❌ Custom EIP-712 implementation
- ❌ No React hook support
- ❌ Framework-specific code
- ❌ Manual error handling

### After Migration
- ✅ 5 lines of setup code (85% reduction)
- ✅ Automatic hex formatting
- ✅ Built-in EIP-712 signing
- ✅ Wagmi-like React hooks
- ✅ Framework-agnostic
- ✅ Comprehensive error classes

---

## Testing After Migration

Update your tests to use the SDK:

**Before:**
```typescript
import { initFhevm } from 'fhevm';

describe('Encryption', () => {
  let fhevm;

  beforeEach(async () => {
    fhevm = await initFhevm();
  });

  it('should encrypt value', () => {
    const encrypted = fhevm.encrypt64(BigInt(42));
    expect(encrypted).toBeDefined();
  });
});
```

**After:**
```typescript
import { createFhevmClient } from '@fhevm-template/sdk';

describe('Encryption', () => {
  let client;

  beforeEach(async () => {
    client = await createFhevmClient({ provider, signer });
  });

  it('should encrypt value', async () => {
    const encrypted = await client.encrypt(42, 'uint64');
    expect(encrypted.data).toMatch(/^0x[0-9a-fA-F]+$/);
  });
});
```

---

## Troubleshooting

### Issue: Type Errors

If you get TypeScript errors:

```bash
npm install --save-dev @types/node
```

### Issue: Import Errors

Ensure you're importing from the correct package:

```typescript
// ❌ Wrong
import { createFhevmClient } from 'fhevm';

// ✅ Correct
import { createFhevmClient } from '@fhevm-template/sdk';
```

### Issue: Provider Not Connecting

Ensure provider is properly initialized:

```typescript
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
await provider.getNetwork(); // Verify connection
const client = await createFhevmClient({ provider });
```

---

## Need Help?

- **Documentation**: [API Reference](./api.md)
- **Examples**: [See examples folder](../examples/)
- **Issues**: [GitHub Issues](https://github.com/AllanParisian/fhevm-react-template/issues)

---

**Migration complete!** Enjoy the simplified SDK experience.
