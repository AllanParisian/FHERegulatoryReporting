/**
 * useComputation Hook
 *
 * Custom hook for FHE computations
 */

import { useState, useCallback } from 'react';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'compare' | 'min' | 'max' | 'and' | 'or' | 'xor';

export function useComputation() {
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const compute = useCallback(
    async (operation: Operation, operands: string[], contractAddress?: string) => {
      setIsComputing(true);
      setError(null);
      setResult(null);

      try {
        if (operands.length < 2) {
          throw new Error('At least two operands are required');
        }

        const response = await fetch('/api/fhe/compute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation,
            operands,
            contractAddress
          })
        });

        const data = await response.json();

        if (data.success) {
          setResult(data);
          return data;
        } else {
          throw new Error(data.error || 'Computation failed');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Computation failed';
        setError(errorMessage);
        return null;
      } finally {
        setIsComputing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    compute,
    isComputing,
    error,
    result,
    reset
  };
}
