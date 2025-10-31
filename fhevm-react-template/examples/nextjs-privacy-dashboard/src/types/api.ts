/**
 * API Type Definitions
 *
 * TypeScript types for API requests and responses
 */

import { FheDataType, FheOperation } from './fhe';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptApiRequest {
  value: number | string | boolean;
  type: FheDataType;
  rpcUrl?: string;
  privateKey?: string;
}

export interface EncryptApiResponse {
  success: boolean;
  encrypted?: {
    data: any;
    type: FheDataType;
  };
  error?: string;
}

export interface DecryptApiRequest {
  handle: string;
  contractAddress?: string;
  userAddress?: string;
  isPublic?: boolean;
  rpcUrl?: string;
  privateKey?: string;
}

export interface DecryptApiResponse {
  success: boolean;
  decrypted?: string;
  type?: 'public' | 'user';
  error?: string;
}

export interface ComputeApiRequest {
  operation: FheOperation;
  operands: string[];
  contractAddress?: string;
  abi?: any[];
}

export interface ComputeApiResponse {
  success: boolean;
  message?: string;
  operation?: string;
  operandCount?: number;
  resultHandle?: string;
  note?: string;
  error?: string;
}

export interface KeysApiRequest {
  action: 'generate' | 'register' | 'revoke';
  contractAddress?: string;
}

export interface KeysApiResponse {
  success: boolean;
  publicKey?: string;
  keyId?: string;
  contractAddress?: string;
  message?: string;
  error?: string;
}

export interface StatusApiResponse {
  status: 'operational' | 'degraded' | 'down';
  message?: string;
  endpoints?: Record<string, string>;
}
