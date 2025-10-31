# API Reference

> Complete API documentation for @fhevm-template/sdk

---

## Core Client

### `createFhevmClient(config, options)`

Creates and initializes an fhEVM client instance.

**Parameters:**

- `config` (FhevmConfig): Client configuration
  - `provider` (ethers.Provider): Ethereum provider
  - `signer` (ethers.Signer, optional): Transaction signer
  - `network` (object, optional): Network configuration
  - `aclAddress` (string, optional): ACL contract address
  - `kmsVerifierAddress` (string, optional): KMS verifier address
  - `gatewayUrl` (string, optional): Gateway URL

- `options` (FhevmClientOptions, optional): Client options
  - `debug` (boolean): Enable debug logging
  - `retry` (object): Retry configuration
  - `enableCache` (boolean): Enable encryption caching

**Returns:** `Promise<FhevmClient>` - Initialized client instance

**Example:**

```typescript
import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet(privateKey, provider);

const client = await createFhevmClient({ provider, signer }, {
  debug: true,
  enableCache: true
});
```

---

## FhevmClient Class

### `client.encrypt(value, type)`

Encrypts a value using FHE.

**Parameters:**

- `value` (number | string | boolean): Value to encrypt
- `type` ('uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool'): Data type

**Returns:** `Promise<EncryptionResult>`

```typescript
{
  data: string;           // Encrypted data as hex string
  originalValue?: string; // Original value (debug)
  timestamp: number;      // Encryption timestamp
}
```

**Example:**

```typescript
const encrypted = await client.encrypt(42, 'uint64');
console.log(encrypted.data); // '0x...'
```

### `client.userDecrypt(contractAddress, handle)`

Decrypts a value using user's private key (requires EIP-712 signature).

**Parameters:**

- `contractAddress` (string): Contract address
- `handle` (string): Encrypted value handle

**Returns:** `Promise<DecryptionResult<T>>`

```typescript
{
  value: T;         // Decrypted value
  success: boolean; // Decryption successful
  error?: string;   // Error message if failed
}
```

**Example:**

```typescript
const result = await client.userDecrypt(contractAddress, handle);
if (result.success) {
  console.log('Decrypted value:', result.value);
}
```

### `client.publicDecrypt(handle)`

Public decryption (no signature required).

**Parameters:**

- `handle` (string): Encrypted value handle

**Returns:** `Promise<DecryptionResult<T>>`

**Example:**

```typescript
const result = await client.publicDecrypt(handle);
console.log(result.value);
```

### Client Methods

#### `client.init()`

Initializes the client (called automatically by createFhevmClient).

**Returns:** `Promise<void>`

#### `client.getProvider()`

Gets the Ethereum provider.

**Returns:** `ethers.Provider`

#### `client.getSigner()`

Gets the transaction signer.

**Returns:** `ethers.Signer | undefined`

#### `client.setSigner(signer)`

Sets the transaction signer.

**Parameters:**

- `signer` (ethers.Signer): New signer

#### `client.clearCache()`

Clears the encryption cache.

**Returns:** `void`

---

## Encryption Utilities

### `encryptValue(value, type)`

Encrypts a value with specified type.

**Parameters:**

- `value` (number | string | boolean): Value to encrypt
- `type` ('uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool'): Data type

**Returns:** `Promise<EncryptionResult>`

### Type-Specific Functions

#### `encryptUint8(value)`

Encrypts uint8 value (0-255).

**Parameters:**

- `value` (number): Value between 0-255

**Returns:** `Promise<EncryptionResult>`

**Throws:** `EncryptionError` if value out of range

#### `encryptUint16(value)`

Encrypts uint16 value (0-65535).

#### `encryptUint32(value)`

Encrypts uint32 value (0-4294967295).

#### `encryptUint64(value)`

Encrypts uint64 value.

#### `encryptAddress(address)`

Encrypts Ethereum address.

**Parameters:**

- `address` (string): Ethereum address (0x format)

#### `encryptBool(value)`

Encrypts boolean value.

---

## Decryption Utilities

### `userDecrypt(signer, contractAddress, handle, chainId)`

User decryption with EIP-712 signature.

**Parameters:**

- `signer` (ethers.Signer): User signer
- `contractAddress` (string): Contract address
- `handle` (string): Encrypted value handle
- `chainId` (number): Network chain ID

**Returns:** `Promise<DecryptionResult<T>>`

### `publicDecrypt(handle)`

Public decryption without signature.

**Parameters:**

- `handle` (string): Encrypted value handle

**Returns:** `Promise<DecryptionResult<T>>`

### `batchDecrypt(requests)`

Batch decryption of multiple values.

**Parameters:**

- `requests` (DecryptionRequest[]): Array of decryption requests

**Returns:** `Promise<DecryptionResult<T>[]>`

---

## EIP-712 Signing

### `generateSignature(signer, domain, handle, userAddress)`

Generates EIP-712 signature for decryption.

**Parameters:**

- `signer` (ethers.Signer): User signer
- `domain` (EIP712Domain): EIP-712 domain
- `handle` (string): Encrypted value handle
- `userAddress` (string): User address

**Returns:** `Promise<SignatureResult>`

```typescript
{
  signature: string;   // Signature string
  signer: string;      // Signer address
  messageHash: string; // Message hash
}
```

### `verifySignature(signature, domain, handle, userAddress, expectedSigner)`

Verifies EIP-712 signature.

**Returns:** `boolean`

### `createEIP712Domain(chainId, verifyingContract, name?, version?)`

Creates EIP-712 domain.

**Parameters:**

- `chainId` (number): Network chain ID
- `verifyingContract` (string): Contract address
- `name` (string, optional): Domain name (default: 'FhevmDecryption')
- `version` (string, optional): Domain version (default: '1')

**Returns:** `EIP712Domain`

---

## React Hooks

### `FhevmProvider`

Context provider for fhEVM functionality.

**Props:**

- `config` (FhevmConfig): Client configuration
- `options` (FhevmClientOptions, optional): Client options
- `children` (ReactNode): Child components

**Example:**

```tsx
import { FhevmProvider } from '@fhevm-template/sdk';

<FhevmProvider config={{ provider, signer }}>
  <App />
</FhevmProvider>
```

### `useFhevm()`

Access fhEVM client instance.

**Returns:**

```typescript
{
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}
```

**Example:**

```tsx
const { client, isInitialized } = useFhevm();

if (!isInitialized) return <div>Loading...</div>;
```

### `useFhevmEncrypt()`

Hook for encryption operations.

**Returns:**

```typescript
{
  encrypt: (value, type) => Promise<EncryptionResult | null>;
  isEncrypting: boolean;
  error: Error | null;
  lastResult: EncryptionResult | null;
}
```

**Example:**

```tsx
const { encrypt, isEncrypting, error } = useFhevmEncrypt();

const handleSubmit = async () => {
  const encrypted = await encrypt(100, 'uint64');
  if (encrypted) {
    // Use encrypted.data
  }
};
```

### `useFhevmDecrypt()`

Hook for decryption operations.

**Returns:**

```typescript
{
  userDecrypt: (contractAddress, handle) => Promise<DecryptionResult | null>;
  publicDecrypt: (handle) => Promise<DecryptionResult | null>;
  isDecrypting: boolean;
  error: Error | null;
  lastResult: DecryptionResult | null;
}
```

**Example:**

```tsx
const { userDecrypt, isDecrypting } = useFhevmDecrypt();

const handleDecrypt = async () => {
  const result = await userDecrypt(contractAddress, handle);
  if (result?.success) {
    console.log('Value:', result.value);
  }
};
```

### `useFhevmContract(options)`

Hook for contract interactions.

**Parameters:**

- `options` (UseFhevmContractOptions):
  - `contractAddress` (string): Contract address
  - `abi` (ethers.InterfaceAbi): Contract ABI

**Returns:**

```typescript
{
  call: (method, args, overrides?) => Promise<ContractResult | null>;
  read: (method, args) => Promise<T | null>;
  isLoading: boolean;
  error: Error | null;
}
```

**Example:**

```tsx
const { call, read, isLoading } = useFhevmContract({
  contractAddress: '0x...',
  abi: contractABI
});

const submit = async () => {
  const result = await call('submitReport', [encryptedData]);
  console.log('Transaction:', result.transactionHash);
};
```

---

## Error Classes

### `FhevmError`

Base error class for fhEVM operations.

```typescript
class FhevmError extends Error {
  name: 'FhevmError';
}
```

### `EncryptionError`

Error during encryption operations.

```typescript
class EncryptionError extends FhevmError {
  name: 'EncryptionError';
}
```

### `DecryptionError`

Error during decryption operations.

```typescript
class DecryptionError extends FhevmError {
  name: 'DecryptionError';
}
```

### `SignatureError`

Error during signature generation/verification.

```typescript
class SignatureError extends FhevmError {
  name: 'SignatureError';
}
```

**Example:**

```typescript
import { EncryptionError } from '@fhevm-template/sdk';

try {
  await encrypt(value, type);
} catch (error) {
  if (error instanceof EncryptionError) {
    console.error('Encryption failed:', error.message);
  }
}
```

---

## Type Definitions

### `FhevmConfig`

```typescript
interface FhevmConfig {
  provider: ethers.Provider;
  signer?: ethers.Signer;
  network?: {
    chainId: number;
    name: string;
  };
  aclAddress?: string;
  kmsVerifierAddress?: string;
  gatewayUrl?: string;
}
```

### `FhevmClientOptions`

```typescript
interface FhevmClientOptions {
  debug?: boolean;
  retry?: {
    attempts: number;
    delay: number;
  };
  enableCache?: boolean;
}
```

### `EncryptionResult`

```typescript
interface EncryptionResult {
  data: string;
  originalValue?: string;
  timestamp: number;
}
```

### `DecryptionResult<T>`

```typescript
interface DecryptionResult<T = any> {
  value: T;
  success: boolean;
  error?: string;
}
```

### `EIP712Domain`

```typescript
interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}
```

### `SignatureResult`

```typescript
interface SignatureResult {
  signature: string;
  signer: string;
  messageHash: string;
}
```

### `ContractResult<T>`

```typescript
interface ContractResult<T = any> {
  data: T;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: bigint;
}
```

---

## Constants

### `SUPPORTED_NETWORKS`

```typescript
const SUPPORTED_NETWORKS: Record<string, NetworkInfo> = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    explorerUrl: 'https://sepolia.etherscan.io',
    testnet: true
  },
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
    testnet: true
  }
};
```

### `DEFAULT_CONFIG`

```typescript
const DEFAULT_CONFIG = {
  retry: {
    attempts: 3,
    delay: 1000
  },
  timeout: 30000,
  debug: false,
  enableCache: true
};
```

---

## Utilities

### `initFhevm()`

Initializes fhEVM library.

**Returns:** `Promise<void>`

### `getFhevmInstance()`

Gets fhEVM instance.

**Returns:** `any`

**Throws:** `FhevmError` if not initialized

### `resetFhevmInstance()`

Resets fhEVM instance (for testing).

**Returns:** `void`

---

For more examples, see the [main README](../README.md) and [examples](../examples/).
