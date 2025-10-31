/**
 * Security Utilities
 *
 * Security-related helper functions
 */

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Validate numeric input for encryption
 */
export function validateNumericInput(
  value: string | number,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64'
): { valid: boolean; error?: string } {
  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Value must be a number' };
  }

  if (num < 0) {
    return { valid: false, error: 'Value must be non-negative' };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Value must be an integer' };
  }

  const maxValues: Record<string, number> = {
    uint8: 255,
    uint16: 65535,
    uint32: 4294967295,
    uint64: Number.MAX_SAFE_INTEGER
  };

  if (num > maxValues[type]) {
    return {
      valid: false,
      error: `Value exceeds maximum for ${type}: ${maxValues[type]}`
    };
  }

  return { valid: true };
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private timeWindow: number; // in milliseconds

  constructor(maxRequests: number = 10, timeWindow: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Filter out old requests
    const recentRequests = requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Generate a secure random ID
 */
export function generateSecureId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate contract ABI
 */
export function isValidABI(abi: any): boolean {
  try {
    if (!Array.isArray(abi)) return false;
    if (abi.length === 0) return false;

    // Basic ABI structure validation
    return abi.every(
      (item) =>
        typeof item === 'object' &&
        typeof item.type === 'string' &&
        Array.isArray(item.inputs || [])
    );
  } catch {
    return false;
  }
}
