/**
 * Validation Utilities
 *
 * Input validation helpers
 */

import { FheDataType } from '../fhe/types';

/**
 * Validate encryption type
 */
export function isValidEncryptionType(type: string): type is FheDataType {
  const validTypes: FheDataType[] = ['uint8', 'uint16', 'uint32', 'uint64', 'address', 'bool'];
  return validTypes.includes(type as FheDataType);
}

/**
 * Validate value for given encryption type
 */
export function validateValueForType(
  value: any,
  type: FheDataType
): { valid: boolean; error?: string } {
  if (value === undefined || value === null) {
    return { valid: false, error: 'Value cannot be undefined or null' };
  }

  switch (type) {
    case 'uint8':
      return validateUint(value, 8);
    case 'uint16':
      return validateUint(value, 16);
    case 'uint32':
      return validateUint(value, 32);
    case 'uint64':
      return validateUint(value, 64);
    case 'address':
      return validateAddress(value);
    case 'bool':
      return validateBoolean(value);
    default:
      return { valid: false, error: `Unknown type: ${type}` };
  }
}

/**
 * Validate unsigned integer
 */
function validateUint(
  value: any,
  bits: number
): { valid: boolean; error?: string } {
  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Value must be a number' };
  }

  if (num < 0) {
    return { valid: false, error: 'Value must be non-negative' };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Value must be an integer' };
  }

  const maxValue = bits === 64 ? Number.MAX_SAFE_INTEGER : Math.pow(2, bits) - 1;

  if (num > maxValue) {
    return {
      valid: false,
      error: `Value exceeds maximum for uint${bits}: ${maxValue}`
    };
  }

  return { valid: true };
}

/**
 * Validate Ethereum address
 */
function validateAddress(value: any): { valid: boolean; error?: string } {
  if (typeof value !== 'string') {
    return { valid: false, error: 'Address must be a string' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    return { valid: false, error: 'Invalid Ethereum address format' };
  }

  return { valid: true };
}

/**
 * Validate boolean
 */
function validateBoolean(value: any): { valid: boolean; error?: string } {
  if (typeof value === 'boolean') {
    return { valid: true };
  }

  if (value === 0 || value === 1 || value === '0' || value === '1') {
    return { valid: true };
  }

  return { valid: false, error: 'Value must be a boolean or 0/1' };
}

/**
 * Validate handle (encrypted data reference)
 */
export function validateHandle(handle: any): { valid: boolean; error?: string } {
  if (typeof handle !== 'string') {
    return { valid: false, error: 'Handle must be a string' };
  }

  if (handle.length === 0) {
    return { valid: false, error: 'Handle cannot be empty' };
  }

  // Handles are typically hex strings
  if (!/^0x[a-fA-F0-9]+$/.test(handle)) {
    return { valid: false, error: 'Handle must be a valid hex string' };
  }

  return { valid: true };
}

/**
 * Validate RPC URL
 */
export function validateRpcUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(url);

    if (!['http:', 'https:', 'ws:', 'wss:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must use http, https, ws, or wss protocol' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate private key
 */
export function validatePrivateKey(key: string): { valid: boolean; error?: string } {
  if (typeof key !== 'string') {
    return { valid: false, error: 'Private key must be a string' };
  }

  // Remove 0x prefix if present
  const cleanKey = key.startsWith('0x') ? key.slice(2) : key;

  if (!/^[a-fA-F0-9]{64}$/.test(cleanKey)) {
    return { valid: false, error: 'Private key must be a 64-character hex string' };
  }

  return { valid: true };
}
