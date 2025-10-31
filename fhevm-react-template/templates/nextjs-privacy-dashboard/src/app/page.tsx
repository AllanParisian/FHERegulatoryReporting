'use client';

import { useState } from 'react';
import { useFhevm, useFhevmEncrypt, useFhevmDecrypt } from '@fhevm-template/sdk';
import { EncryptionDemo } from '@/components/EncryptionDemo';
import { DecryptionDemo } from '@/components/DecryptionDemo';
import { StatusIndicator } from '@/components/StatusIndicator';

export default function Home() {
  const { client, isInitialized, error } = useFhevm();
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Initialization Error</h2>
          <p className="text-gray-700">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Initializing fhEVM
          </h2>
          <p className="text-gray-600">Setting up encrypted computation environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Privacy Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Powered by fhEVM SDK - Fully Homomorphic Encryption
              </p>
            </div>
            <StatusIndicator isInitialized={isInitialized} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('encrypt')}
                className={`${
                  activeTab === 'encrypt'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-lg`}
              >
                Encryption Demo
              </button>
              <button
                onClick={() => setActiveTab('decrypt')}
                className={`${
                  activeTab === 'decrypt'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-lg`}
              >
                Decryption Demo
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === 'encrypt' ? <EncryptionDemo /> : <DecryptionDemo />}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            title="Framework Agnostic"
            description="Use with React, Vue, Node.js, or any JavaScript framework"
            icon="🔧"
          />
          <InfoCard
            title="Wagmi-Like API"
            description="Familiar hooks-based structure for React developers"
            icon="⚡"
          />
          <InfoCard
            title="Type Safe"
            description="Full TypeScript support with comprehensive types"
            icon="🛡️"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            Built with{' '}
            <a
              href="https://github.com/zama-ai/fhevm"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zama fhEVM
            </a>
            {' '}and{' '}
            <a
              href="https://nextjs.org"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
