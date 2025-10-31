'use client';

import { useState } from 'react';
import { useFhevmEncrypt } from '@fhevm-template/sdk';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

/**
 * Banking Example Component
 *
 * Demonstrates FHE usage in financial applications
 */
export function BankingExample() {
  const { encrypt, isEncrypting } = useFhevmEncrypt();
  const [amount, setAmount] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEncryptTransaction = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    setError(null);

    try {
      // Convert amount to smallest unit (e.g., cents)
      const amountInCents = Math.floor(Number(amount) * 100);

      // Encrypt the transaction amount
      const encrypted = await encrypt(amountInCents, 'uint64');

      setEncryptedData({
        originalAmount: amount,
        encryptedAmount: encrypted.data,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    }
  };

  const handleEncryptBalance = async () => {
    if (!accountBalance || isNaN(Number(accountBalance))) {
      setError('Please enter a valid balance');
      return;
    }

    setError(null);

    try {
      const balanceInCents = Math.floor(Number(accountBalance) * 100);
      const encrypted = await encrypt(balanceInCents, 'uint64');

      setEncryptedData({
        originalBalance: accountBalance,
        encryptedBalance: encrypted.data,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
    }
  };

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>🏦 Private Banking Operations</CardTitle>
        <CardDescription>
          Encrypt sensitive financial data using FHE
        </CardDescription>
      </CardHeader>

      <CardBody>
        <div className="space-y-6">
          {/* Transaction Amount */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Encrypt Transaction Amount
            </h4>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Enter amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
                leftIcon={<span className="text-gray-500">$</span>}
              />
              <Button
                onClick={handleEncryptTransaction}
                isLoading={isEncrypting}
                disabled={!amount}
              >
                Encrypt
              </Button>
            </div>
          </div>

          {/* Account Balance */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Encrypt Account Balance
            </h4>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Enter balance (USD)"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="flex-1"
                leftIcon={<span className="text-gray-500">$</span>}
              />
              <Button
                onClick={handleEncryptBalance}
                isLoading={isEncrypting}
                disabled={!accountBalance}
              >
                Encrypt
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {encryptedData && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <p className="text-sm font-medium text-green-800">
                Data Encrypted Successfully
              </p>
              {encryptedData.originalAmount && (
                <p className="text-xs text-green-700">
                  Original Amount: ${encryptedData.originalAmount}
                </p>
              )}
              {encryptedData.originalBalance && (
                <p className="text-xs text-green-700">
                  Original Balance: ${encryptedData.originalBalance}
                </p>
              )}
              <p className="text-xs text-gray-600 break-all">
                Encrypted: {JSON.stringify(encryptedData.encryptedAmount || encryptedData.encryptedBalance).substring(0, 100)}...
              </p>
            </div>
          )}

          {/* Use Cases */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Banking Use Cases
            </h4>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Private account balances stored on-chain</li>
              <li>Encrypted transaction amounts</li>
              <li>Confidential credit scores and risk assessments</li>
              <li>Privacy-preserving AML/KYC compliance checks</li>
              <li>Secure multi-party computation for settlements</li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
