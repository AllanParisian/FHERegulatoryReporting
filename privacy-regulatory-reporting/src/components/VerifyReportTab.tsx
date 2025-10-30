'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from '@/hooks/useContract';
import { useReporting } from '@/hooks/useReporting';
import StatusMessage from './StatusMessage';
import type { StatusMessage as StatusMessageType } from '@/types';

export default function VerifyReportTab() {
  const { contract, isConnected } = useContract();
  const reporting = useReporting(contract, '');

  const [reportId, setReportId] = useState('');
  const [analystAddress, setAnalystAddress] = useState('');
  const [status, setStatus] = useState<StatusMessageType | null>(null);

  const handleVerifyReport = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!reportId) {
      setStatus({ type: 'error', message: 'Please enter a report ID' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Verifying report...' });
      const result = await reporting.verifyReport(parseInt(reportId));
      setStatus({ type: 'success', message: `Report verified successfully!<br>Transaction: ${result.receipt.hash}` });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to verify report: ${error.message}` });
    }
  };

  const handleProcessReport = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!reportId) {
      setStatus({ type: 'error', message: 'Please enter a report ID' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Processing report...' });
      const result = await reporting.processReport(parseInt(reportId));
      setStatus({ type: 'success', message: `Report processed successfully!<br>Transaction: ${result.receipt.hash}` });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to process report: ${error.message}` });
    }
  };

  const handleGrantAccess = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!reportId) {
      setStatus({ type: 'error', message: 'Please enter a report ID' });
      return;
    }

    if (!analystAddress) {
      setStatus({ type: 'error', message: 'Please enter an analyst address' });
      return;
    }

    if (!ethers.isAddress(analystAddress)) {
      setStatus({ type: 'error', message: 'Invalid analyst address' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Granting decryption access...' });
      const result = await reporting.grantDecryptionAccess(parseInt(reportId), analystAddress);
      setStatus({ type: 'success', message: `Decryption access granted successfully!<br>Transaction: ${result.receipt.hash}` });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to grant decryption access: ${error.message}` });
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">Please connect your wallet to verify reports</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Verify & Process Reports</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Report ID
          </label>
          <input
            type="number"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            placeholder="Enter report ID to verify"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleVerifyReport}
            disabled={reporting.loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reporting.loading ? 'Verifying...' : 'Verify Report'}
          </button>
          <button
            onClick={handleProcessReport}
            disabled={reporting.loading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reporting.loading ? 'Processing...' : 'Process Report'}
          </button>
        </div>

        <div className="pt-6 border-t-2 border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Grant Decryption Access</h4>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Analyst Address (for decryption access)
            </label>
            <input
              type="text"
              value={analystAddress}
              onChange={(e) => setAnalystAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors mb-4"
            />
          </div>

          <button
            onClick={handleGrantAccess}
            disabled={reporting.loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reporting.loading ? 'Granting Access...' : 'Grant Decryption Access'}
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-6">
          <StatusMessage type={status.type} message={status.message} />
        </div>
      )}
    </div>
  );
}
