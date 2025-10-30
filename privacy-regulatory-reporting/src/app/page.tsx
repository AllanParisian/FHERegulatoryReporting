'use client';

import { useState } from 'react';
import WalletConnect from '@/components/WalletConnect';
import SubmitReportTab from '@/components/SubmitReportTab';
import VerifyReportTab from '@/components/VerifyReportTab';
import ManageSystemTab from '@/components/ManageSystemTab';
import ViewReportsTab from '@/components/ViewReportsTab';

type TabType = 'submit' | 'verify' | 'manage' | 'view';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('submit');

  const tabs = [
    { id: 'submit' as TabType, label: 'Submit Report' },
    { id: 'verify' as TabType, label: 'Verify Reports' },
    { id: 'manage' as TabType, label: 'Manage System' },
    { id: 'view' as TabType, label: 'View Reports' },
  ];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            Privacy Regulatory Reporting
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Confidential Financial Compliance System
          </p>
        </header>

        {/* Wallet Section */}
        <WalletConnect />

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b-2 border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold text-sm md:text-base whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-b-3 border-purple-700 text-purple-700 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'submit' && <SubmitReportTab />}
            {activeTab === 'verify' && <VerifyReportTab />}
            {activeTab === 'manage' && <ManageSystemTab />}
            {activeTab === 'view' && <ViewReportsTab />}
          </div>
        </div>
      </div>
    </main>
  );
}
