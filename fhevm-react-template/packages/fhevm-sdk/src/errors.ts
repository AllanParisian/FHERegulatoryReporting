/**
 * Custom error classes for fhevm-sdk
 */

/**
 * Base error class for fhEVM operations
 */
export class FhevmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FhevmError';
  }
}

/**
 * Error during encryption operations
 */
export class EncryptionError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'EncryptionError';
  }
}

/**
 * Error during decryption operations
 */
export class DecryptionError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'DecryptionError';
  }
}

/**
 * Error during signature generation/verification
 */
export class SignatureError extends FhevmError {
  constructor(message: string) {
    super(message);
    this.name = 'SignatureError';
  }
}
