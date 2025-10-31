/**
 * React context provider for fhEVM
 * Wagmi-like provider pattern
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FhevmClient } from '../core/client';
import type { FhevmConfig, FhevmClientOptions } from '../types';

interface FhevmContextValue {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue>({
  client: null,
  isInitialized: false,
  error: null
});

interface FhevmProviderProps {
  config: FhevmConfig;
  options?: FhevmClientOptions;
  children: ReactNode;
}

/**
 * Provider component for fhEVM
 * Wraps your app to provide fhEVM functionality
 *
 * @example
 * ```tsx
 * <FhevmProvider config={{ provider, signer }}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
export function FhevmProvider({ config, options, children }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const fhevmClient = new FhevmClient(config, options);
        await fhevmClient.init();

        if (mounted) {
          setClient(fhevmClient);
          setIsInitialized(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Initialization failed'));
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [config, options]);

  return (
    <FhevmContext.Provider value={{ client, isInitialized, error }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to access fhEVM context
 */
export function useFhevmContext(): FhevmContextValue {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}
