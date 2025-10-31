'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type Operation = 'add' | 'subtract' | 'multiply' | 'compare' | 'min' | 'max';

/**
 * Computation Demo Component
 *
 * Demonstrates homomorphic computation on encrypted data
 */
export function ComputationDemo() {
  const [operandA, setOperandA] = useState('');
  const [operandB, setOperandB] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const operations: { value: Operation; label: string }[] = [
    { value: 'add', label: 'Addition (+)' },
    { value: 'subtract', label: 'Subtraction (-)' },
    { value: 'multiply', label: 'Multiplication (×)' },
    { value: 'compare', label: 'Comparison (==)' },
    { value: 'min', label: 'Minimum (min)' },
    { value: 'max', label: 'Maximum (max)' }
  ];

  const handleCompute = async () => {
    if (!operandA || !operandB) {
      setError('Please enter both operands');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          operands: [operandA, operandB]
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Computation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Homomorphic Computation</CardTitle>
        <CardDescription>
          Perform operations on encrypted data without decryption
        </CardDescription>
      </CardHeader>

      <CardBody>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Encrypted Operand A"
              placeholder="Enter encrypted handle"
              value={operandA}
              onChange={(e) => setOperandA(e.target.value)}
            />

            <Input
              label="Encrypted Operand B"
              placeholder="Enter encrypted handle"
              value={operandB}
              onChange={(e) => setOperandB(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {operations.map((op) => (
                <button
                  key={op.value}
                  onClick={() => setOperation(op.value)}
                  className={`
                    px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors
                    ${
                      operation === op.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCompute}
            isLoading={isLoading}
            disabled={!operandA || !operandB}
            className="w-full"
          >
            Compute on Encrypted Data
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <p className="text-sm font-medium text-green-800">
                Computation Submitted Successfully
              </p>
              <p className="text-xs text-green-700">Operation: {result.operation}</p>
              <p className="text-xs text-green-700">
                Operands: {result.operandCount}
              </p>
              <p className="text-xs text-gray-600 mt-2">{result.note}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              How It Works
            </h4>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Operations are performed on encrypted values on-chain</li>
              <li>Results remain encrypted throughout computation</li>
              <li>No intermediate values are ever revealed</li>
              <li>Authorized users can decrypt final results</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
