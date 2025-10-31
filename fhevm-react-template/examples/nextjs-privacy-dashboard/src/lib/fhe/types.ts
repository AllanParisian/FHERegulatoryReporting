/**
 * FHE Type Definitions
 *
 * Common types used throughout the FHE integration
 */

export type FheDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';

export interface EncryptedData {
  data: any;
  type: FheDataType;
  timestamp?: string;
}

export interface DecryptedData {
  value: string | number | boolean;
  type: FheDataType;
  timestamp?: string;
}

export interface FheClientConfig {
  provider: any;
  signer?: any;
  gatewayUrl?: string;
}

export interface EncryptionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface DecryptionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface KeyInfo {
  publicKey: string;
  keyId: string;
  contractAddress?: string;
}

export interface ComputationParams {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'compare' | 'min' | 'max' | 'and' | 'or' | 'xor';
  operands: string[];
  contractAddress?: string;
}

export interface ComputationResult {
  success: boolean;
  resultHandle?: string;
  error?: string;
}
