/**
 * Utilities for managing fhEVM instance
 */

import { FhevmError } from '../errors';

let fhevmInstance: any = null;

/**
 * Initialize fhEVM library
 */
export async function initFhevm(): Promise<void> {
  if (fhevmInstance) {
    return;
  }

  try {
    // Dynamically import fhevm to avoid bundling issues
    const fhevm = await import('fhevm');
    fhevmInstance = await fhevm.initFhevm();
  } catch (error) {
    throw new FhevmError(
      `Failed to initialize fhEVM: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get fhEVM instance
 * @throws {FhevmError} If fhEVM is not initialized
 */
export function getFhevmInstance(): any {
  if (!fhevmInstance) {
    throw new FhevmError('fhEVM not initialized. Call initFhevm() first.');
  }
  return fhevmInstance;
}

/**
 * Reset fhEVM instance (for testing)
 */
export function resetFhevmInstance(): void {
  fhevmInstance = null;
}
