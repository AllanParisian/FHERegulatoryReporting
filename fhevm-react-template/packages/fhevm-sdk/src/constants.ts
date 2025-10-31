/**
 * Constants for fhevm-sdk
 */

import type { NetworkInfo } from './types';

/**
 * Supported networks for fhEVM
 */
export const SUPPORTED_NETWORKS: Record<string, NetworkInfo> = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    explorerUrl: 'https://sepolia.etherscan.io',
    testnet: true
  },
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
    testnet: true
  }
};

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  retry: {
    attempts: 3,
    delay: 1000
  },
  timeout: 30000,
  debug: false,
  enableCache: true
};

/**
 * EIP-712 domain name
 */
export const EIP712_DOMAIN_NAME = 'FhevmDecryption';

/**
 * EIP-712 domain version
 */
export const EIP712_DOMAIN_VERSION = '1';
