/**
 * React hook for encryption operations
 */

import { useState, useCallback } from 'react';
import { useFhevm } from './useFhevm';
import type { EncryptionResult } from '../types';

interface UseFhevmEncryptResult {
  encrypt: (
    value: number | string | boolean,
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool'
  ) => Promise<EncryptionResult | null>;
  isEncrypting: boolean;
  error: Error | null;
  lastResult: EncryptionResult | null;
}

/**
 * Hook for encrypting values
 *
 * @example
 * ```tsx
 * const { encrypt, isEncrypting, error } = useFhevmEncrypt();
 *
 * const handleSubmit = async () => {
 *   const encrypted = await encrypt(100, 'uint64');
 *   if (encrypted) {
 *     // Use encrypted.data in contract call
 *   }
 * };
 * ```
 */
export function useFhevmEncrypt(): UseFhevmEncryptResult {
  const { client, isInitialized } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<EncryptionResult | null>(null);

  const encrypt = useCallback(
    async (
      value: number | string | boolean,
      type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool'
    ): Promise<EncryptionResult | null> => {
      if (!client || !isInitialized) {
        setError(new Error('fhEVM not initialized'));
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const result = await client.encrypt(value, type);
        setLastResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    encrypt,
    isEncrypting,
    error,
    lastResult
  };
}
