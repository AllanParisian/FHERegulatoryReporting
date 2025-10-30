'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from '@/hooks/useContract';
import { useReporting } from '@/hooks/useReporting';
import StatusMessage from './StatusMessage';
import type { StatusMessage as StatusMessageType } from '@/types';

export default function ManageSystemTab() {
  const { contract, isConnected } = useContract();
  const reporting = useReporting(contract, '');

  const [entityAddress, setEntityAddress] = useState('');
  const [periodDuration, setPeriodDuration] = useState('');
  const [submissionDays, setSubmissionDays] = useState('');
  const [closePeriodId, setClosePeriodId] = useState('');
  const [status, setStatus] = useState<StatusMessageType | null>(null);

  const handleAuthorizeEntity = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!entityAddress) {
      setStatus({ type: 'error', message: 'Please enter an entity address' });
      return;
    }

    if (!ethers.isAddress(entityAddress)) {
      setStatus({ type: 'error', message: 'Invalid Ethereum address' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Authorizing entity...' });
      const result = await reporting.authorizeEntity(entityAddress);
      setStatus({ type: 'success', message: `Entity authorized successfully!<br>Transaction: ${result.receipt.hash}` });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to authorize entity: ${error.message}` });
    }
  };

  const handleRevokeEntity = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!entityAddress) {
      setStatus({ type: 'error', message: 'Please enter an entity address' });
      return;
    }

    if (!ethers.isAddress(entityAddress)) {
      setStatus({ type: 'error', message: 'Invalid Ethereum address' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Revoking entity...' });
      const result = await reporting.revokeEntity(entityAddress);
      setStatus({ type: 'success', message: `Entity revoked successfully!<br>Transaction: ${result.receipt.hash}` });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to revoke entity: ${error.message}` });
    }
  };

  const handleCreatePeriod = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!periodDuration || !submissionDays) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Creating reporting period...' });
      const result = await reporting.createReportingPeriod(
        parseInt(periodDuration),
        parseInt(submissionDays)
      );
      setStatus({ type: 'success', message: `Reporting period created successfully!<br>Transaction: ${result.receipt.hash}` });
      setPeriodDuration('');
      setSubmissionDays('');
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to create reporting period: ${error.message}` });
    }
  };

  const handleClosePeriod = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!closePeriodId) {
      setStatus({ type: 'error', message: 'Please enter a period ID' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Closing period...' });
      const result = await reporting.closePeriod(parseInt(closePeriodId));
      setStatus({ type: 'success', message: `Period closed successfully!<br>Transaction: ${result.receipt.hash}` });
      setClosePeriodId('');
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to close period: ${error.message}` });
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">Please connect your wallet to manage the system</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">System Management</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Entity Authorization */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Entity Authorization</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Entity Address
              </label>
              <input
                type="text"
                value={entityAddress}
                onChange={(e) => setEntityAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAuthorizeEntity}
                disabled={reporting.loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reporting.loading ? 'Authorizing...' : 'Authorize Entity'}
              </button>
              <button
                onClick={handleRevokeEntity}
                disabled={reporting.loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reporting.loading ? 'Revoking...' : 'Revoke Entity'}
              </button>
            </div>
          </div>
        </div>

        {/* Reporting Period */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Reporting Period</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (days)
              </label>
              <input
                type="number"
                value={periodDuration}
                onChange={(e) => setPeriodDuration(e.target.value)}
                placeholder="90"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Submission Deadline (days)
              </label>
              <input
                type="number"
                value={submissionDays}
                onChange={(e) => setSubmissionDays(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleCreatePeriod}
              disabled={reporting.loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {reporting.loading ? 'Creating...' : 'Create Period'}
            </button>
          </div>
        </div>
      </div>

      {/* Close Period */}
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Close Period</h4>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Period ID to Close
            </label>
            <input
              type="number"
              value={closePeriodId}
              onChange={(e) => setClosePeriodId(e.target.value)}
              placeholder="Period ID to close"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleClosePeriod}
              disabled={reporting.loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {reporting.loading ? 'Closing...' : 'Close Period'}
            </button>
          </div>
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
