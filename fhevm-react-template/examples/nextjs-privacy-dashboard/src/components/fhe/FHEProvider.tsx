'use client';

import { ReactNode } from 'react';
import { FhevmProvider as SDKFhevmProvider } from '@fhevm-template/sdk';
import { ethers } from 'ethers';

interface FHEProviderProps {
  children: ReactNode;
}

/**
 * FHE Provider Component
 *
 * Wraps the application with FHE context from the SDK
 */
export function FHEProvider({ children }: FHEProviderProps) {
  // Get provider and signer from browser wallet
  const getProviderAndSigner = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return { provider, signer };
    }

    // Fallback to read-only provider
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.sepolia.org'
    );

    return { provider, signer: undefined };
  };

  return (
    <SDKFhevmProvider
      config={{
        getProvider: async () => {
          const { provider } = await getProviderAndSigner();
          return provider;
        },
        getSigner: async () => {
          const { signer } = await getProviderAndSigner();
          return signer;
        }
      }}
    >
      {children}
    </SDKFhevmProvider>
  );
}
