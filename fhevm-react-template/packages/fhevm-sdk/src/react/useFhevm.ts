/**
 * Main fhEVM hook for React
 * Provides access to fhEVM client
 */

import { useFhevmContext } from './FhevmProvider';
import type { FhevmClient } from '../core/client';

interface UseFhevmResult {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}

/**
 * Hook to use fhEVM client
 *
 * @example
 * ```tsx
 * const { client, isInitialized } = useFhevm();
 *
 * if (!isInitialized) return <div>Loading...</div>;
 *
 * const encrypted = await client.encrypt(42, 'uint64');
 * ```
 */
export function useFhevm(): UseFhevmResult {
  const { client, isInitialized, error } = useFhevmContext();

  return {
    client,
    isInitialized,
    error
  };
}
