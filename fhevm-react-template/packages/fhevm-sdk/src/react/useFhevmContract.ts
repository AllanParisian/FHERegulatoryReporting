/**
 * React hook for contract interactions with encrypted data
 */

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useFhevm } from './useFhevm';
import type { ContractResult } from '../types';

interface UseFhevmContractOptions {
  contractAddress: string;
  abi: ethers.InterfaceAbi;
}

interface UseFhevmContractResult {
  call: <T = any>(
    method: string,
    args: any[],
    overrides?: ethers.Overrides
  ) => Promise<ContractResult<T> | null>;
  read: <T = any>(method: string, args: any[]) => Promise<T | null>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for interacting with fhEVM contracts
 *
 * @example
 * ```tsx
 * const { call, read, isLoading } = useFhevmContract({
 *   contractAddress: '0x...',
 *   abi: contractABI
 * });
 *
 * const submit = async (encryptedData: string) => {
 *   const result = await call('submitReport', [encryptedData]);
 * };
 * ```
 */
export function useFhevmContract(options: UseFhevmContractOptions): UseFhevmContractResult {
  const { client, isInitialized } = useFhevm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(
    async <T = any>(
      method: string,
      args: any[] = [],
      overrides?: ethers.Overrides
    ): Promise<ContractResult<T> | null> => {
      if (!client || !isInitialized) {
        setError(new Error('fhEVM not initialized'));
        return null;
      }

      const signer = client.getSigner();
      if (!signer) {
        setError(new Error('Signer required for contract calls'));
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const contract = new ethers.Contract(options.contractAddress, options.abi, signer);
        const tx = await contract[method](...args, overrides || {});
        const receipt = await tx.wait();

        return {
          data: receipt as T,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Contract call failed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client, isInitialized, options.contractAddress, options.abi]
  );

  const read = useCallback(
    async <T = any>(method: string, args: any[] = []): Promise<T | null> => {
      if (!client || !isInitialized) {
        setError(new Error('fhEVM not initialized'));
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const provider = client.getProvider();
        const contract = new ethers.Contract(options.contractAddress, options.abi, provider);
        const result = await contract[method](...args);
        return result as T;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Contract read failed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client, isInitialized, options.contractAddress, options.abi]
  );

  return {
    call,
    read,
    isLoading,
    error
  };
}
