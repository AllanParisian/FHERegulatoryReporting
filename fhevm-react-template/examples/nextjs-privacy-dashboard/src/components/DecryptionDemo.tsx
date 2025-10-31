'use client';

import { useState } from 'react';
import { useFhevmDecrypt } from '@fhevm-template/sdk';

export function DecryptionDemo() {
  const { userDecrypt, publicDecrypt, isDecrypting } = useFhevmDecrypt();
  const [handle, setHandle] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [decryptionType, setDecryptionType] = useState<'user' | 'public'>('public');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecrypt = async () => {
    setError(null);
    setResult(null);

    if (!handle) {
      setError('Please enter a handle');
      return;
    }

    if (decryptionType === 'user' && !contractAddress) {
      setError('Contract address required for user decryption');
      return;
    }

    try {
      let decryptResult;
      if (decryptionType === 'user') {
        decryptResult = await userDecrypt(contractAddress, handle);
      } else {
        decryptResult = await publicDecrypt(handle);
      }

      if (decryptResult?.success) {
        setResult(decryptResult.value);
      } else {
        setError(decryptResult?.error || 'Decryption failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Decrypt Encrypted Data
        </h2>
        <p className="text-gray-600">
          Decrypt values from smart contracts using your private key or public decryption
        </p>
      </div>

      <div className="space-y-4">
        {/* Decryption Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decryption Method
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="public"
                checked={decryptionType === 'public'}
                onChange={(e) => setDecryptionType(e.target.value as 'user' | 'public')}
                className="mr-2"
              />
              <span className="text-sm">Public Decryption</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="user"
                checked={decryptionType === 'user'}
                onChange={(e) => setDecryptionType(e.target.value as 'user' | 'public')}
                className="mr-2"
              />
              <span className="text-sm">User Decryption (EIP-712)</span>
            </label>
          </div>
        </div>

        {/* Contract Address (for user decryption) */}
        {decryptionType === 'user' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Address
            </label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x1234567890123456789012345678901234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Handle Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encrypted Value Handle
          </label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Decrypt Button */}
        <button
          onClick={handleDecrypt}
          disabled={isDecrypting || !handle}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
            isDecrypting || !handle
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isDecrypting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Decrypting...
            </span>
          ) : (
            'Decrypt Value'
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Result Display */}
        {result !== null && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <p className="text-purple-800 font-medium mb-2">Decrypted Value</p>
            <code className="block bg-white px-4 py-3 rounded border border-purple-200 text-lg font-mono">
              {String(result)}
            </code>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            ℹ️ <strong>Note:</strong> User decryption requires an EIP-712 signature from your wallet.
            Public decryption can be performed without signing if the value has public read permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
