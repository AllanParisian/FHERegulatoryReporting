/**
 * Encryption utilities for fhevm-sdk
 * Provides convenient functions for encrypting different data types
 */

import { getFhevmInstance } from './utils/instance';
import { EncryptionError } from './errors';
import type { EncryptionResult } from './types';

/**
 * Encrypt a value with specified type
 */
export async function encryptValue(
  value: number | string | boolean,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool'
): Promise<EncryptionResult> {
  try {
    const fhevm = getFhevmInstance();
    let encrypted: Uint8Array;

    switch (type) {
      case 'uint8':
      case 'uint16':
      case 'uint32':
      case 'uint64':
        encrypted = fhevm.encrypt64(BigInt(value));
        break;
      case 'address':
        encrypted = fhevm.encryptAddress(value as string);
        break;
      case 'bool':
        encrypted = fhevm.encryptBool(Boolean(value));
        break;
      default:
        throw new EncryptionError(`Unsupported type: ${type}`);
    }

    return {
      data: '0x' + Buffer.from(encrypted).toString('hex'),
      originalValue: String(value),
      timestamp: Date.now()
    };
  } catch (error) {
    throw new EncryptionError(
      `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Encrypt uint8 value
 */
export async function encryptUint8(value: number): Promise<EncryptionResult> {
  if (value < 0 || value > 255) {
    throw new EncryptionError('Value must be between 0 and 255 for uint8');
  }
  return encryptValue(value, 'uint8');
}

/**
 * Encrypt uint16 value
 */
export async function encryptUint16(value: number): Promise<EncryptionResult> {
  if (value < 0 || value > 65535) {
    throw new EncryptionError('Value must be between 0 and 65535 for uint16');
  }
  return encryptValue(value, 'uint16');
}

/**
 * Encrypt uint32 value
 */
export async function encryptUint32(value: number): Promise<EncryptionResult> {
  if (value < 0 || value > 4294967295) {
    throw new EncryptionError('Value must be between 0 and 4294967295 for uint32');
  }
  return encryptValue(value, 'uint32');
}

/**
 * Encrypt uint64 value
 */
export async function encryptUint64(value: number | bigint): Promise<EncryptionResult> {
  return encryptValue(Number(value), 'uint64');
}

/**
 * Encrypt address
 */
export async function encryptAddress(address: string): Promise<EncryptionResult> {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new EncryptionError('Invalid Ethereum address format');
  }
  return encryptValue(address, 'address');
}

/**
 * Encrypt boolean
 */
export async function encryptBool(value: boolean): Promise<EncryptionResult> {
  return encryptValue(value, 'bool');
}
