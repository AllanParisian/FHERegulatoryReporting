/**
 * Core fhEVM client implementation
 * Provides unified interface for encrypted operations
 */

import { ethers } from 'ethers';
import type {
  FhevmConfig,
  FhevmClientOptions,
  EncryptionResult,
  DecryptionResult,
  SignatureResult
} from '../types';
import { FhevmError } from '../errors';
import { initFhevm, getFhevmInstance } from '../utils/instance';

/**
 * Main fhEVM client class
 * Provides wagmi-like interface for encrypted operations
 */
export class FhevmClient {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private options: FhevmClientOptions;
  private initialized: boolean = false;
  private cache: Map<string, EncryptionResult> = new Map();

  constructor(config: FhevmConfig, options: FhevmClientOptions = {}) {
    this.provider = config.provider;
    this.signer = config.signer;
    this.options = {
      debug: options.debug ?? false,
      retry: options.retry ?? { attempts: 3, delay: 1000 },
      enableCache: options.enableCache ?? true
    };
  }

  /**
   * Initialize the fhEVM client
   * Must be called before any encryption/decryption operations
   */
  async init(): Promise<void> {
    if (this.initialized) {
      if (this.options.debug) {
        console.log('[FhevmClient] Already initialized');
      }
      return;
    }

    try {
      await initFhevm();
      this.initialized = true;

      if (this.options.debug) {
        console.log('[FhevmClient] Initialization successful');
      }
    } catch (error) {
      throw new FhevmError(
        `Failed to initialize fhEVM: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Encrypt a value
   * @param value - Value to encrypt
   * @param type - Data type (uint8, uint16, uint32, uint64, address, bool)
   */
  async encrypt(
    value: number | string | boolean,
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool'
  ): Promise<EncryptionResult> {
    await this.ensureInitialized();

    const cacheKey = `${type}-${value}`;
    if (this.options.enableCache && this.cache.has(cacheKey)) {
      if (this.options.debug) {
        console.log('[FhevmClient] Returning cached encryption');
      }
      return this.cache.get(cacheKey)!;
    }

    try {
      const fhevmInstance = getFhevmInstance();
      let encryptedData: Uint8Array;

      switch (type) {
        case 'uint8':
        case 'uint16':
        case 'uint32':
        case 'uint64':
          encryptedData = fhevmInstance.encrypt64(BigInt(value));
          break;
        case 'address':
          encryptedData = fhevmInstance.encryptAddress(value as string);
          break;
        case 'bool':
          encryptedData = fhevmInstance.encryptBool(Boolean(value));
          break;
        default:
          throw new FhevmError(`Unsupported encryption type: ${type}`);
      }

      const result: EncryptionResult = {
        data: '0x' + Buffer.from(encryptedData).toString('hex'),
        originalValue: String(value),
        timestamp: Date.now()
      };

      if (this.options.enableCache) {
        this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      throw new FhevmError(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Decrypt a value using user's private key (EIP-712 signature)
   * @param contractAddress - Contract address
   * @param handle - Encrypted value handle
   */
  async userDecrypt<T = any>(
    contractAddress: string,
    handle: string
  ): Promise<DecryptionResult<T>> {
    await this.ensureInitialized();

    if (!this.signer) {
      throw new FhevmError('Signer required for user decryption');
    }

    try {
      // Generate EIP-712 signature
      const signature = await this.generateDecryptionSignature(
        contractAddress,
        handle
      );

      // Request decryption from gateway
      const decryptedValue = await this.requestDecryption<T>(
        contractAddress,
        handle,
        signature.signature
      );

      return {
        value: decryptedValue,
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
   * Public decrypt (no signature required)
   * @param handle - Encrypted value handle
   */
  async publicDecrypt<T = any>(handle: string): Promise<DecryptionResult<T>> {
    await this.ensureInitialized();

    try {
      const fhevmInstance = getFhevmInstance();
      const decryptedValue = await fhevmInstance.decrypt(handle);

      return {
        value: decryptedValue as T,
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
   * Generate EIP-712 signature for decryption
   */
  private async generateDecryptionSignature(
    contractAddress: string,
    handle: string
  ): Promise<SignatureResult> {
    if (!this.signer) {
      throw new FhevmError('Signer required');
    }

    const userAddress = await this.signer.getAddress();
    const network = await this.provider.getNetwork();

    const domain = {
      name: 'FhevmDecryption',
      version: '1',
      chainId: Number(network.chainId),
      verifyingContract: contractAddress
    };

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

    const signature = await this.signer.signTypedData(domain, types, value);
    const messageHash = ethers.TypedDataEncoder.hash(domain, types, value);

    return {
      signature,
      signer: userAddress,
      messageHash
    };
  }

  /**
   * Request decryption from gateway
   */
  private async requestDecryption<T>(
    contractAddress: string,
    handle: string,
    signature: string
  ): Promise<T> {
    // This would integrate with Zama's gateway
    // Placeholder implementation
    throw new FhevmError('Gateway integration not implemented');
  }

  /**
   * Ensure client is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  /**
   * Get provider
   */
  getProvider(): ethers.Provider {
    return this.provider;
  }

  /**
   * Get signer
   */
  getSigner(): ethers.Signer | undefined {
    return this.signer;
  }

  /**
   * Set signer
   */
  setSigner(signer: ethers.Signer): void {
    this.signer = signer;
  }

  /**
   * Clear encryption cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
