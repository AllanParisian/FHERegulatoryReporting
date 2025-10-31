/**
 * useEncryption Hook
 *
 * Custom hook for encryption operations with validation
 */

import { useState, useCallback } from 'react';
import { useFhevmEncrypt } from '@fhevm-template/sdk';
import { validateValueForType } from '@/lib/utils/validation';
import { FheDataType } from '@/lib/fhe/types';

export function useEncryption() {
  const { encrypt: sdkEncrypt, isEncrypting } = useFhevmEncrypt();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const encrypt = useCallback(
    async (value: any, type: FheDataType) => {
      setError(null);
      setResult(null);

      // Validate input
      const validation = validateValueForType(value, type);
      if (!validation.valid) {
        setError(validation.error || 'Validation failed');
        return null;
      }

      try {
        const encrypted = await sdkEncrypt(value, type);
        setResult(encrypted);
        return encrypted;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        return null;
      }
    },
    [sdkEncrypt]
  );

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    encrypt,
    isEncrypting,
    error,
    result,
    reset
  };
}
