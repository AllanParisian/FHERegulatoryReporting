'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

/**
 * Key Manager Component
 *
 * Manages FHE encryption keys
 */
export function KeyManager() {
  const [contractAddress, setContractAddress] = useState('');
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetrieveKey = async () => {
    if (!contractAddress) {
      setError('Please enter a contract address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/keys?contractAddress=${contractAddress}`);
      const data = await response.json();

      if (data.success) {
        setPublicKey(data.publicKey);
      } else {
        setError(data.error || 'Failed to retrieve key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to generate key');
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
        <CardTitle>FHE Key Management</CardTitle>
        <CardDescription>
          Manage encryption keys for FHE operations
        </CardDescription>
      </CardHeader>

      <CardBody>
        <div className="space-y-4">
          <div>
            <Input
              label="Contract Address"
              placeholder="0x..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              error={error || undefined}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleRetrieveKey}
              isLoading={isLoading}
              disabled={!contractAddress}
            >
              Retrieve Public Key
            </Button>

            <Button
              variant="secondary"
              onClick={handleGenerateKey}
              isLoading={isLoading}
            >
              Generate New Key
            </Button>
          </div>

          {publicKey && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Public Key:</p>
              <code className="text-xs text-gray-600 break-all">{publicKey}</code>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
