/**
 * FHE Client Utilities
 *
 * Client-side FHE operations and helpers
 */

import { createFhevmClient, FhevmClient } from '@fhevm-template/sdk';
import type { BrowserProvider, JsonRpcProvider, Signer } from 'ethers';

let clientInstance: FhevmClient | null = null;

/**
 * Initialize FHE client for browser environment
 */
export async function initializeFheClient(
  provider: BrowserProvider | JsonRpcProvider,
  signer?: Signer
): Promise<FhevmClient> {
  if (clientInstance) {
    return clientInstance;
  }

  clientInstance = await createFhevmClient({
    provider,
    signer
  });

  return clientInstance;
}

/**
 * Get existing FHE client instance
 */
export function getFheClient(): FhevmClient | null {
  return clientInstance;
}

/**
 * Reset client instance (useful for wallet changes)
 */
export function resetFheClient(): void {
  clientInstance = null;
}

/**
 * Check if client is initialized
 */
export function isClientInitialized(): boolean {
  return clientInstance !== null;
}

/**
 * Encrypt data with validation
 */
export async function encryptData(
  value: number | string | boolean,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool'
): Promise<{ data: any; success: boolean; error?: string }> {
  try {
    const client = getFheClient();

    if (!client) {
      return {
        data: null,
        success: false,
        error: 'FHE client not initialized'
      };
    }

    const encrypted = await client.encrypt(value, type);

    return {
      data: encrypted.data,
      success: true
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed'
    };
  }
}

/**
 * Decrypt data with proper error handling
 */
export async function decryptData(
  contractAddress: string,
  handle: string,
  isPublic = false
): Promise<{ data: any; success: boolean; error?: string }> {
  try {
    const client = getFheClient();

    if (!client) {
      return {
        data: null,
        success: false,
        error: 'FHE client not initialized'
      };
    }

    const decrypted = isPublic
      ? await client.publicDecrypt(handle)
      : await client.userDecrypt(contractAddress, handle);

    return {
      data: decrypted.toString(),
      success: true
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed'
    };
  }
}
