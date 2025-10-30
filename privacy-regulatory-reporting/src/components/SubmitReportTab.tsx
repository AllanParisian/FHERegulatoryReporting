'use client';

import { useState, useEffect } from 'react';
import { useContract } from '@/hooks/useContract';
import { useReporting } from '@/hooks/useReporting';
import StatusMessage from './StatusMessage';
import type { StatusMessage as StatusMessageType, PeriodInfo } from '@/types';

export default function SubmitReportTab() {
  const { contract, account, isConnected } = useContract();
  const reporting = useReporting(contract, account);

  const [formData, setFormData] = useState({
    totalAmount: '',
    transactionCount: '',
    riskScore: '',
    periodId: '',
  });

  const [status, setStatus] = useState<StatusMessageType | null>(null);
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [periods, setPeriods] = useState<Array<{ id: number; info: PeriodInfo }>>([]);

  useEffect(() => {
    if (contract && account) {
      loadPeriodsForSelect();
      checkMyAuthorization();
    }
  }, [contract, account]);

  const loadPeriodsForSelect = async () => {
    if (!contract) return;

    try {
      const currentPeriod = await reporting.getCurrentPeriod();
      const activePeriods: Array<{ id: number; info: PeriodInfo }> = [];

      for (let i = 1; i <= currentPeriod; i++) {
        try {
          const periodInfo = await reporting.getPeriodInfo(i);
          if (periodInfo.active) {
            activePeriods.push({ id: i, info: periodInfo });
          }
        } catch (error) {
          console.error(`Error loading period ${i}:`, error);
        }
      }

      setPeriods(activePeriods);
    } catch (error) {
      console.error('Error loading periods:', error);
    }
  };

  const checkMyAuthorization = async () => {
    try {
      const auth = await reporting.checkAuthorization();
      setAuthStatus(auth);
      setShowAuthAlert(!auth.isAuthorized);

      if (auth.isAuthorized) {
        setStatus({ type: 'success', message: `✅ Your address IS authorized to submit reports!<br>Owner: ${auth.isOwner ? 'Yes' : 'No'} | Regulator: ${auth.isRegulator ? 'Yes' : 'No'}` });
      } else {
        setStatus({ type: 'error', message: `❌ Your address is NOT authorized to submit reports.<br>Owner: ${auth.isOwner ? 'Yes' : 'No'} | Regulator: ${auth.isRegulator ? 'Yes' : 'No'}<br>Contract Owner: ${auth.ownerAddress}<br>Regulator: ${auth.regulatorAddress}` });
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to check authorization: ${error.message}` });
    }
  };

  const authorizeMySelf = async () => {
    if (!contract || !account) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Authorizing your address...' });
      const result = await reporting.authorizeEntity(account);
      setStatus({ type: 'success', message: `✅ Your address has been authorized successfully!<br>Transaction: ${result.receipt.hash}` });
      setShowAuthAlert(false);
      await checkMyAuthorization();
    } catch (error: any) {
      if (error.message.includes('Only regulator')) {
        setStatus({ type: 'error', message: 'Only the regulator can authorize addresses. Please contact the regulator to authorize your address.' });
      } else {
        setStatus({ type: 'error', message: `Failed to authorize address: ${error.message}` });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    const { totalAmount, transactionCount, riskScore, periodId } = formData;

    if (!totalAmount || !transactionCount || !riskScore || !periodId) {
      setStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    const risk = parseInt(riskScore);
    if (risk < 0 || risk > 100) {
      setStatus({ type: 'error', message: 'Risk score must be between 0 and 100' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Submitting confidential report...' });
      const result = await reporting.submitReport(
        totalAmount,
        parseInt(transactionCount),
        risk,
        parseInt(periodId)
      );
      setStatus({ type: 'success', message: `Report submitted successfully!<br>Transaction: ${result.receipt.hash}` });
      setFormData({ totalAmount: '', transactionCount: '', riskScore: '', periodId: '' });
    } catch (error: any) {
      console.error('Submit report error:', error);
      if (error.message.includes('Not authorized')) {
        setShowAuthAlert(true);
        setStatus({ type: 'error', message: 'You are not authorized to submit reports. Please authorize your address first.' });
      } else {
        setStatus({ type: 'error', message: `Failed to submit report: ${error.message}` });
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">Please connect your wallet to submit reports</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Submit Confidential Report</h3>

      {showAuthAlert && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold mb-2">⚠️ Not Authorized</p>
          <p className="text-red-700 text-sm">
            Your address is not authorized to submit reports. Please contact the regulator or use the "Manage System" tab to authorize your address (if you're the owner/regulator).
          </p>
        </div>
      )}

      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={checkMyAuthorization}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg font-semibold transition-all"
        >
          Check My Authorization Status
        </button>
        <button
          onClick={authorizeMySelf}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-lg font-semibold transition-all"
        >
          Authorize My Address (Owner/Regulator)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Amount (ETH)
          </label>
          <input
            type="number"
            step="0.000001"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            placeholder="Enter total amount"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction Count
            </label>
            <input
              type="number"
              value={formData.transactionCount}
              onChange={(e) => setFormData({ ...formData, transactionCount: e.target.value })}
              placeholder="Number of transactions"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Risk Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.riskScore}
              onChange={(e) => setFormData({ ...formData, riskScore: e.target.value })}
              placeholder="Risk assessment score"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reporting Period
          </label>
          <select
            value={formData.periodId}
            onChange={(e) => setFormData({ ...formData, periodId: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="">Select reporting period</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                Period {period.id} (Deadline: {new Date(Number(period.info.submissionDeadline) * 1000).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={reporting.loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {reporting.loading ? 'Submitting...' : 'Submit Confidential Report'}
        </button>
      </form>

      {status && (
        <div className="mt-6">
          <StatusMessage type={status.type} message={status.message} />
        </div>
      )}
    </div>
  );
}
