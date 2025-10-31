/**
 * Factory function for creating fhEVM client
 * Provides simplified client creation
 */

import { FhevmClient } from './client';
import type { FhevmConfig, FhevmClientOptions } from '../types';

/**
 * Create a new fhEVM client instance
 * @param config - Client configuration
 * @param options - Client options
 * @returns Initialized fhEVM client
 *
 * @example
 * ```typescript
 * const client = await createFhevmClient({
 *   provider: ethersProvider,
 *   signer: ethersSigner
 * });
 * ```
 */
export async function createFhevmClient(
  config: FhevmConfig,
  options?: FhevmClientOptions
): Promise<FhevmClient> {
  const client = new FhevmClient(config, options);
  await client.init();
  return client;
}
