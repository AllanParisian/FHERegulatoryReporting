# Code Examples

> Practical examples for using @fhevm-template/sdk

---

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [React Examples](#react-examples)
3. [Smart Contract Integration](#smart-contract-integration)
4. [Advanced Patterns](#advanced-patterns)
5. [Error Handling](#error-handling)

---

## Basic Usage

### Simple Encryption

```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

async function main() {
  // Setup
  const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Create client
  const client = await createFhevmClient({ provider, signer });

  // Encrypt different types
  const uint64Encrypted = await client.encrypt(1000000, 'uint64');
  const uint32Encrypted = await client.encrypt(50, 'uint32');
  const uint8Encrypted = await client.encrypt(25, 'uint8');
  const addressEncrypted = await client.encrypt('0x1234...', 'address');
  const boolEncrypted = await client.encrypt(true, 'bool');

  console.log('Encrypted uint64:', uint64Encrypted.data);
}
```

### Simple Decryption

```typescript
async function decryptValue() {
  const client = await createFhevmClient({ provider, signer });

  // User decryption (requires signature)
  const result = await client.userDecrypt(contractAddress, handle);

  if (result.success) {
    console.log('Decrypted value:', result.value);
  } else {
    console.error('Decryption failed:', result.error);
  }
}
```

---

## React Examples

### Complete App Setup

```tsx
import React from 'react';
import { ethers } from 'ethers';
import { FhevmProvider } from '@fhevm-template/sdk';
import Dashboard from './components/Dashboard';

function App() {
  const [provider, setProvider] = React.useState<ethers.Provider | null>(null);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);

  React.useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethersProvider);

        const accounts = await ethersProvider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          const ethersSigner = await ethersProvider.getSigner();
          setSigner(ethersSigner);
        }
      }
    }
    init();
  }, []);

  if (!provider) {
    return <div>Loading provider...</div>;
  }

  return (
    <FhevmProvider config={{ provider, signer: signer || undefined }}>
      <Dashboard />
    </FhevmProvider>
  );
}

export default App;
```

### Encryption Component

```tsx
import React from 'react';
import { useFhevmEncrypt } from '@fhevm-template/sdk';

function EncryptionForm() {
  const { encrypt, isEncrypting, error, lastResult } = useFhevmEncrypt();
  const [value, setValue] = React.useState('');
  const [type, setType] = React.useState<'uint64'>('uint64');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await encrypt(parseInt(value), type);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
      />

      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="uint8">uint8</option>
        <option value="uint16">uint16</option>
        <option value="uint32">uint32</option>
        <option value="uint64">uint64</option>
      </select>

      <button type="submit" disabled={isEncrypting || !value}>
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>

      {error && <div>Error: {error.message}</div>}

      {lastResult && (
        <div>
          <p>Encrypted Data:</p>
          <code>{lastResult.data}</code>
        </div>
      )}
    </form>
  );
}
```

### Decryption Component

```tsx
import React from 'react';
import { useFhevmDecrypt } from '@fhevm-template/sdk';

function DecryptionForm({ contractAddress }: { contractAddress: string }) {
  const { userDecrypt, isDecrypting, lastResult } = useFhevmDecrypt();
  const [handle, setHandle] = React.useState('');

  const handleDecrypt = async () => {
    await userDecrypt(contractAddress, handle);
  };

  return (
    <div>
      <input
        type="text"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="Enter encrypted handle"
      />

      <button onClick={handleDecrypt} disabled={isDecrypting || !handle}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>

      {lastResult && lastResult.success && (
        <div>
          <p>Decrypted Value: {lastResult.value}</p>
        </div>
      )}
    </div>
  );
}
```

### Contract Interaction Component

```tsx
import React from 'react';
import { useFhevmContract, useFhevmEncrypt } from '@fhevm-template/sdk';
import contractABI from './contract-abi.json';

function ContractInteraction({ contractAddress }: { contractAddress: string }) {
  const { encrypt } = useFhevmEncrypt();
  const { call, read, isLoading } = useFhevmContract({
    contractAddress,
    abi: contractABI
  });

  const [amount, setAmount] = React.useState('');

  const handleSubmit = async () => {
    // Encrypt the amount
    const encrypted = await encrypt(parseInt(amount), 'uint64');

    if (encrypted) {
      // Call contract method with encrypted data
      const result = await call('submitReport', [encrypted.data]);

      if (result) {
        console.log('Transaction hash:', result.transactionHash);
      }
    }
  };

  const handleRead = async () => {
    const reportCount = await read('getTotalReports', []);
    console.log('Total reports:', reportCount);
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />

      <button onClick={handleSubmit} disabled={isLoading || !amount}>
        {isLoading ? 'Submitting...' : 'Submit Report'}
      </button>

      <button onClick={handleRead} disabled={isLoading}>
        Get Report Count
      </button>
    </div>
  );
}
```

---

## Smart Contract Integration

### Deploy and Interact

```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

async function deployAndInteract() {
  // Setup
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const client = await createFhevmClient({ provider, signer });

  // Deploy contract
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy(regulatorAddress);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log('Deployed to:', contractAddress);

  // Encrypt sensitive data
  const amount = await client.encrypt(1000000, 'uint64');
  const txCount = await client.encrypt(50, 'uint32');
  const riskScore = await client.encrypt(25, 'uint8');

  // Submit encrypted report
  const tx = await contract.submitConfidentialReport(
    amount.data,
    txCount.data,
    riskScore.data,
    1 // periodId
  );

  const receipt = await tx.wait();
  console.log('Report submitted:', receipt.hash);
}
```

### Read Encrypted Data

```typescript
async function readEncryptedData() {
  const client = await createFhevmClient({ provider, signer });
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Get report (returns encrypted handles)
  const report = await contract.reports(reportId);

  // Decrypt if authorized
  const amount = await client.userDecrypt(
    contractAddress,
    report.encryptedAmount
  );

  const txCount = await client.userDecrypt(
    contractAddress,
    report.encryptedTransactionCount
  );

  console.log('Decrypted amount:', amount.value);
  console.log('Decrypted count:', txCount.value);
}
```

---

## Advanced Patterns

### Batch Operations

```typescript
async function batchEncrypt() {
  const client = await createFhevmClient({ provider, signer });

  const values = [100, 200, 300, 400, 500];

  // Encrypt in parallel
  const encrypted = await Promise.all(
    values.map(value => client.encrypt(value, 'uint64'))
  );

  // Get all encrypted data
  const encryptedData = encrypted.map(e => e.data);

  return encryptedData;
}
```

### Caching Results

```typescript
async function cachedEncryption() {
  const client = await createFhevmClient(
    { provider, signer },
    { enableCache: true } // Enable caching
  );

  // First encryption - computed
  const first = await client.encrypt(42, 'uint64');

  // Second encryption - from cache (same value and type)
  const second = await client.encrypt(42, 'uint64');

  console.log('Same result:', first.data === second.data);
}
```

### Retry Logic

```typescript
async function withRetry() {
  const client = await createFhevmClient(
    { provider, signer },
    {
      retry: {
        attempts: 5,
        delay: 2000
      }
    }
  );

  // Automatically retries on failure
  const encrypted = await client.encrypt(42, 'uint64');
}
```

---

## Error Handling

### Comprehensive Error Handling

```typescript
import {
  FhevmError,
  EncryptionError,
  DecryptionError,
  SignatureError
} from '@fhevm-template/sdk';

async function handleErrors() {
  const client = await createFhevmClient({ provider, signer });

  try {
    const encrypted = await client.encrypt(42, 'uint64');
    const decrypted = await client.userDecrypt(contractAddress, handle);
  } catch (error) {
    if (error instanceof EncryptionError) {
      console.error('Encryption failed:', error.message);
      // Handle encryption error
    } else if (error instanceof DecryptionError) {
      console.error('Decryption failed:', error.message);
      // Handle decryption error
    } else if (error instanceof SignatureError) {
      console.error('Signature failed:', error.message);
      // Handle signature error
    } else if (error instanceof FhevmError) {
      console.error('fhEVM error:', error.message);
      // Handle general fhEVM error
    } else {
      console.error('Unknown error:', error);
      // Handle unknown error
    }
  }
}
```

### React Error Boundaries

```tsx
import React from 'react';
import { FhevmError } from '@fhevm-template/sdk';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error;

      if (error instanceof FhevmError) {
        return <div>fhEVM Error: {error.message}</div>;
      }

      return <div>Something went wrong</div>;
    }

    return this.props.children;
  }
}
```

---

For more examples, check out:
- [Next.js Example](../examples/nextjs-privacy-dashboard/)
- [Privacy Reporting Example](../examples/privacy-regulatory-reporting/)
