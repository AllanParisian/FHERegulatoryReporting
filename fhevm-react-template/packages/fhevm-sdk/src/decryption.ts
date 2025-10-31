/**
 * Decryption utilities for fhevm-sdk
 * Provides user decryption (with EIP-712) and public decryption
 */

import { ethers } from 'ethers';
import { getFhevmInstance } from './utils/instance';
import { DecryptionError } from './errors';
import type { DecryptionResult, DecryptionRequest, BatchDecryptionRequest } from './types';

/**
 * User decryption with EIP-712 signature
 * Requires signer to generate signature
 */
export async function userDecrypt<T = any>(
  signer: ethers.Signer,
  contractAddress: string,
  handle: string,
  chainId: number
): Promise<DecryptionResult<T>> {
  try {
    const userAddress = await signer.getAddress();

    // Create EIP-712 domain
    const domain = {
      name: 'FhevmDecryption',
      version: '1',
      chainId,
      verifyingContract: contractAddress
    };

    // Create types
    const types = {
      Decryption: [
        { name: 'handle', type: 'bytes32' },
        { name: 'user', type: 'address' }
      ]
    };

    // Create value
    const value = {
      handle,
      user: userAddress
    };

    // Sign typed data
    const signature = await signer.signTypedData(domain, types, value);

    // TODO: Send to gateway for decryption
    // This is a placeholder - actual implementation would call Zama's gateway
    return {
      value: null as any,
      success: false,
      error: 'Gateway integration pending'
    };
  } catch (error) {
    throw new DecryptionError(
      `User decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Public decryption (no signature required)
 * For publicly decryptable values
 */
export async function publicDecrypt<T = any>(handle: string): Promise<DecryptionResult<T>> {
  try {
    const fhevm = getFhevmInstance();
    const decrypted = await fhevm.decrypt(handle);

    return {
      value: decrypted as T,
      success: true
    };
  } catch (error) {
    return {
      value: null as any,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Batch decrypt multiple values
 */
export async function batchDecrypt<T = any>(
  requests: DecryptionRequest[]
): Promise<DecryptionResult<T>[]> {
  const results: DecryptionResult<T>[] = [];

  for (const request of requests) {
    try {
      // This would be optimized in production to make parallel requests
      const result = await publicDecrypt<T>(request.handle);
      results.push(result);
    } catch (error) {
      results.push({
        value: null as any,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}
