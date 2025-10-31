'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FhevmProvider } from '@fhevm-template/sdk';

export function Providers({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    async function initializeProvider() {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethersProvider = new ethers.BrowserProvider((window as any).ethereum);
        setProvider(ethersProvider);

        try {
          const accounts = await ethersProvider.send('eth_requestAccounts', []);
          if (accounts.length > 0) {
            const ethersSigner = await ethersProvider.getSigner();
            setSigner(ethersSigner);
          }
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      } else {
        // Fallback to read-only provider
        const fallbackProvider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
        setProvider(fallbackProvider);
      }
    }

    initializeProvider();
  }, []);

  if (!provider) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing provider...</p>
        </div>
      </div>
    );
  }

  return (
    <FhevmProvider config={{ provider, signer: signer || undefined }}>
      {children}
    </FhevmProvider>
  );
}
