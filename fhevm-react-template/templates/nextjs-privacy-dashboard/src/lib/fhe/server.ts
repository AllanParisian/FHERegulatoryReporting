/**
 * FHE Server Utilities
 *
 * Server-side FHE operations (for API routes)
 */

import { createFhevmClient } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

/**
 * Create server-side FHE client
 *
 * Note: In production, you should use proper key management
 * and not expose private keys in the code
 */
export async function createServerFheClient(rpcUrl?: string, privateKey?: string) {
  const provider = new ethers.JsonRpcProvider(
    rpcUrl || process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.sepolia.org'
  );

  // For server operations, you might use a dedicated wallet
  const wallet = privateKey
    ? new ethers.Wallet(privateKey, provider)
    : ethers.Wallet.createRandom(provider);

  return await createFhevmClient({
    provider,
    signer: wallet
  });
}

/**
 * Encrypt data on the server
 */
export async function serverEncrypt(
  value: number | string | boolean,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool',
  rpcUrl?: string,
  privateKey?: string
) {
  const client = await createServerFheClient(rpcUrl, privateKey);
  return await client.encrypt(value, type);
}

/**
 * Decrypt data on the server (requires authorization)
 */
export async function serverDecrypt(
  contractAddress: string,
  handle: string,
  isPublic: boolean,
  rpcUrl?: string,
  privateKey?: string
) {
  const client = await createServerFheClient(rpcUrl, privateKey);

  if (isPublic) {
    return await client.publicDecrypt(handle);
  }

  return await client.userDecrypt(contractAddress, handle);
}

/**
 * Validate encryption parameters
 */
export function validateEncryptionParams(
  value: any,
  type: string
): { valid: boolean; error?: string } {
  const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'address', 'bool'];

  if (!validTypes.includes(type)) {
    return {
      valid: false,
      error: `Invalid type: ${type}. Must be one of: ${validTypes.join(', ')}`
    };
  }

  if (value === undefined || value === null) {
    return {
      valid: false,
      error: 'Value cannot be undefined or null'
    };
  }

  // Type-specific validation
  if (type.startsWith('uint')) {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      return {
        valid: false,
        error: 'Value must be a non-negative number for uint types'
      };
    }

    // Check bounds
    const bits = parseInt(type.substring(4));
    const maxValue = Math.pow(2, bits) - 1;
    if (num > maxValue) {
      return {
        valid: false,
        error: `Value exceeds maximum for ${type}: ${maxValue}`
      };
    }
  }

  if (type === 'address') {
    if (typeof value !== 'string' || !value.startsWith('0x') || value.length !== 42) {
      return {
        valid: false,
        error: 'Value must be a valid Ethereum address'
      };
    }
  }

  if (type === 'bool') {
    if (typeof value !== 'boolean' && value !== 0 && value !== 1) {
      return {
        valid: false,
        error: 'Value must be a boolean or 0/1'
      };
    }
  }

  return { valid: true };
}
