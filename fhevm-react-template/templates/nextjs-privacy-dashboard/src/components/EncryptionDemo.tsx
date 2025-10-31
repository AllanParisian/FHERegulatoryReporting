'use client';

import { useState } from 'react';
import { useFhevmEncrypt } from '@fhevm-template/sdk';

type EncryptionType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';

export function EncryptionDemo() {
  const { encrypt, isEncrypting, error, lastResult } = useFhevmEncrypt();
  const [value, setValue] = useState('');
  const [type, setType] = useState<EncryptionType>('uint64');

  const handleEncrypt = async () => {
    if (!value) return;

    let parsedValue: number | string | boolean;

    if (type === 'bool') {
      parsedValue = value.toLowerCase() === 'true';
    } else if (type === 'address') {
      parsedValue = value;
    } else {
      parsedValue = parseInt(value, 10);
    }

    await encrypt(parsedValue, type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Encrypt Your Data
        </h2>
        <p className="text-gray-600">
          Encrypt sensitive data using Fully Homomorphic Encryption before sending to smart contracts
        </p>
      </div>

      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EncryptionType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="uint8">uint8 (0-255)</option>
            <option value="uint16">uint16 (0-65535)</option>
            <option value="uint32">uint32 (0-4294967295)</option>
            <option value="uint64">uint64 (large numbers)</option>
            <option value="address">address (Ethereum address)</option>
            <option value="bool">bool (true/false)</option>
          </select>
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value to Encrypt
          </label>
          <input
            type={type === 'bool' ? 'text' : type === 'address' ? 'text' : 'number'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              type === 'bool'
                ? 'true or false'
                : type === 'address'
                ? '0x1234567890123456789012345678901234567890'
                : 'Enter a number'
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Encrypt Button */}
        <button
          onClick={handleEncrypt}
          disabled={isEncrypting || !value}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
            isEncrypting || !value
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isEncrypting ? (
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
              Encrypting...
            </span>
          ) : (
            'Encrypt Value'
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* Result Display */}
        {lastResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-green-800 font-medium mb-1">Original Value</p>
              <code className="block bg-white px-4 py-2 rounded border border-green-200 text-sm">
                {lastResult.originalValue}
              </code>
            </div>
            <div>
              <p className="text-green-800 font-medium mb-1">Encrypted Data</p>
              <div className="bg-white px-4 py-2 rounded border border-green-200">
                <code className="block text-xs break-all text-gray-700">
                  {lastResult.data}
                </code>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(lastResult.data)}
                className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                📋 Copy to clipboard
              </button>
            </div>
            <div>
              <p className="text-green-800 font-medium mb-1">Timestamp</p>
              <code className="block bg-white px-4 py-2 rounded border border-green-200 text-sm">
                {new Date(lastResult.timestamp).toLocaleString()}
              </code>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
              <p className="text-blue-800 text-sm">
                💡 <strong>Next Step:</strong> Use the encrypted data ({lastResult.data.substring(0, 20)}...)
                in your smart contract function calls. The contract will perform computations on encrypted data
                without ever seeing the original value!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
