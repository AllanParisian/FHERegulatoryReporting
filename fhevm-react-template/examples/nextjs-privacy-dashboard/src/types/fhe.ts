/**
 * FHE Type Definitions
 *
 * TypeScript types for FHE operations
 */

export type FheDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';

export type FheOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'compare'
  | 'min'
  | 'max'
  | 'and'
  | 'or'
  | 'xor';

export interface EncryptionParams {
  value: number | string | boolean;
  type: FheDataType;
}

export interface DecryptionParams {
  handle: string;
  contractAddress: string;
  isPublic?: boolean;
}

export interface EncryptedValue {
  data: any;
  type: FheDataType;
  timestamp?: string;
}

export interface DecryptedValue {
  value: string | number | boolean;
  type: FheDataType;
  timestamp?: string;
}

export interface FheClientState {
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
}

export interface ComputationRequest {
  operation: FheOperation;
  operands: string[];
  contractAddress?: string;
  abi?: any[];
}

export interface ComputationResponse {
  success: boolean;
  resultHandle?: string;
  transactionHash?: string;
  error?: string;
}
