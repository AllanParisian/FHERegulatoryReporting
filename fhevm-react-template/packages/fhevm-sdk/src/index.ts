/**
 * @fhevm-template/sdk
 * Universal SDK for privacy-preserving dApps with Zama fhEVM
 *
 * Framework-agnostic, wagmi-like structure for encrypted computations
 */

export { FhevmClient } from './core/client';
export { createFhevmClient } from './core/factory';

export type {
  FhevmConfig,
  FhevmClientOptions,
  EncryptionResult,
  DecryptionResult
} from './types';

export {
  encryptValue,
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptAddress,
  encryptBool
} from './encryption';

export {
  userDecrypt,
  publicDecrypt,
  batchDecrypt
} from './decryption';

export {
  generateSignature,
  verifySignature,
  createEIP712Domain
} from './signing';

export {
  getFhevmInstance,
  initFhevm
} from './utils/instance';

export {
  FhevmError,
  EncryptionError,
  DecryptionError,
  SignatureError
} from './errors';

// React hooks (optional, requires React)
export { useFhevm } from './react/useFhevm';
export { useFhevmContract } from './react/useFhevmContract';
export { useFhevmEncrypt } from './react/useFhevmEncrypt';
export { useFhevmDecrypt } from './react/useFhevmDecrypt';
export { FhevmProvider } from './react/FhevmProvider';

// Constants
export { SUPPORTED_NETWORKS, DEFAULT_CONFIG } from './constants';
