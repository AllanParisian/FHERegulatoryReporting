/**
 * React hook for decryption operations
 */

import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import type { DecryptionResult } from '../types';

interface UseFhevmDecryptResult {
  userDecrypt: <T = any>(contractAddress: string, handle: string) => Promise<DecryptionResult<T> | null>;
  publicDecrypt: <T = any>(handle: string) => Promise<DecryptionResult<T> | null>;
  isDecrypting: boolean;
  error: Error | null;
  lastResult: DecryptionResult | null;
}

/**
 * Hook for decrypting values
 *
 * @example
 * ```tsx
 * const { userDecrypt, isDecrypting } = useFhevmDecrypt();
 *
 * const handleDecrypt = async () => {
 *   const result = await userDecrypt(contractAddress, handle);
 *   if (result?.success) {
 *     console.log('Decrypted value:', result.value);
 *   }
 * };
 * ```
 */
export function useFhevmDecrypt(): UseFhevmDecryptResult {
  const { client, isInitialized } = useFhevm();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<DecryptionResult | null>(null);

  const userDecrypt = useCallback(
    async <T = any>(contractAddress: string, handle: string): Promise<DecryptionResult<T> | null> => {
      if (!client || !isInitialized) {
        setError(new Error('fhEVM not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const result = await client.userDecrypt<T>(contractAddress, handle);
        setLastResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  const publicDecrypt = useCallback(
    async <T = any>(handle: string): Promise<DecryptionResult<T> | null> => {
      if (!client || !isInitialized) {
        setError(new Error('fhEVM not initialized'));
        return null;
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const result = await client.publicDecrypt<T>(handle);
        setLastResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    userDecrypt,
    publicDecrypt,
    isDecrypting,
    error,
    lastResult
  };
}
