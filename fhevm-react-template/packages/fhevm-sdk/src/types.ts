/**
 * Type definitions for fhevm-sdk
 */

import { ethers } from 'ethers';

/**
 * Core configuration for fhEVM client
 */
export interface FhevmConfig {
  /** Ethereum provider (ethers.js provider) */
  provider: ethers.Provider;

  /** Signer for transactions (optional) */
  signer?: ethers.Signer;

  /** Network configuration */
  network?: {
    chainId: number;
    name: string;
  };

  /** ACL contract address (optional) */
  aclAddress?: string;

  /** KMS verifier address (optional) */
  kmsVerifierAddress?: string;

  /** Custom gateway URL (optional) */
  gatewayUrl?: string;
}

/**
 * Options for creating fhEVM client
 */
export interface FhevmClientOptions {
  /** Enable debug logging */
  debug?: boolean;

  /** Retry configuration */
  retry?: {
    attempts: number;
    delay: number;
  };

  /** Cache encrypted values */
  enableCache?: boolean;
}

/**
 * Result of encryption operation
 */
export interface EncryptionResult {
  /** Encrypted data as hex string */
  data: string;

  /** Original value (for debugging) */
  originalValue?: string | number | boolean;

  /** Encryption timestamp */
  timestamp: number;
}

/**
 * Result of decryption operation
 */
export interface DecryptionResult<T = any> {
  /** Decrypted value */
  value: T;

  /** Decryption successful */
  success: boolean;

  /** Error message if failed */
  error?: string;
}

/**
 * EIP-712 domain for signing
 */
export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

/**
 * Signature result
 */
export interface SignatureResult {
  /** Signature string */
  signature: string;

  /** Signer address */
  signer: string;

  /** Message hash */
  messageHash: string;
}

/**
 * Decryption request parameters
 */
export interface DecryptionRequest {
  /** Contract address */
  contractAddress: string;

  /** User address */
  userAddress: string;

  /** Encrypted value handle */
  handle: string;

  /** EIP-712 signature */
  signature: string;
}

/**
 * Batch decryption request
 */
export interface BatchDecryptionRequest {
  requests: DecryptionRequest[];
}

/**
 * Network information
 */
export interface NetworkInfo {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl?: string;
  testnet?: boolean;
}

/**
 * Contract interaction result
 */
export interface ContractResult<T = any> {
  data: T;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: bigint;
}
