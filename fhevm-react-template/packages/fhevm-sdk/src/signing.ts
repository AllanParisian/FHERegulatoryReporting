/**
 * EIP-712 signing utilities for fhevm-sdk
 */

import { ethers } from 'ethers';
import { SignatureError } from './errors';
import type { EIP712Domain, SignatureResult } from './types';

/**
 * Generate EIP-712 signature for decryption
 */
export async function generateSignature(
  signer: ethers.Signer,
  domain: EIP712Domain,
  handle: string,
  userAddress: string
): Promise<SignatureResult> {
  try {
    const types = {
      Decryption: [
        { name: 'handle', type: 'bytes32' },
        { name: 'user', type: 'address' }
      ]
    };

    const value = {
      handle,
      user: userAddress
    };

    const signature = await signer.signTypedData(domain, types, value);
    const messageHash = ethers.TypedDataEncoder.hash(domain, types, value);

    return {
      signature,
      signer: await signer.getAddress(),
      messageHash
    };
  } catch (error) {
    throw new SignatureError(
      `Signature generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify EIP-712 signature
 */
export function verifySignature(
  signature: string,
  domain: EIP712Domain,
  handle: string,
  userAddress: string,
  expectedSigner: string
): boolean {
  try {
    const types = {
      Decryption: [
        { name: 'handle', type: 'bytes32' },
        { name: 'user', type: 'address' }
      ]
    };

    const value = {
      handle,
      user: userAddress
    };

    const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
    return recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
  } catch (error) {
    return false;
  }
}

/**
 * Create EIP-712 domain
 */
export function createEIP712Domain(
  chainId: number,
  verifyingContract: string,
  name: string = 'FhevmDecryption',
  version: string = '1'
): EIP712Domain {
  return {
    name,
    version,
    chainId,
    verifyingContract
  };
}
