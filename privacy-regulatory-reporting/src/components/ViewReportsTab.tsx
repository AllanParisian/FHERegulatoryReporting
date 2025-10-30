'use client';

import { useState } from 'react';
import { useContract } from '@/hooks/useContract';
import { useReporting } from '@/hooks/useReporting';
import StatusMessage from './StatusMessage';
import type { StatusMessage as StatusMessageType, ReportInfo, PeriodInfo } from '@/types';

export default function ViewReportsTab() {
  const { contract, account, isConnected } = useContract();
  const reporting = useReporting(contract, account);

  const [reportIdView, setReportIdView] = useState('');
  const [status, setStatus] = useState<StatusMessageType | null>(null);
  const [reportsData, setReportsData] = useState<any>(null);

  const handleGetReportInfo = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!reportIdView) {
      setStatus({ type: 'error', message: 'Please enter a report ID' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Loading report info...' });
      const reportInfo = await reporting.getReportInfo(parseInt(reportIdView));

      const reportHtml = `
        <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div class="flex justify-between items-center mb-3">
            <span class="text-lg font-bold text-purple-700">Report #${reportIdView}</span>
            <span class="px-3 py-1 rounded-full text-sm font-semibold ${
              reportInfo.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }">${reportInfo.verified ? 'Verified' : 'Pending'}</span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="font-semibold">Submitter:</span>
              <span class="font-mono text-xs">${reportInfo.submitter}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Timestamp:</span>
              <span>${new Date(Number(reportInfo.timestamp) * 1000).toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Report Period:</span>
              <span>${reportInfo.reportPeriod.toString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Processed:</span>
              <span class="px-2 py-1 rounded text-xs font-semibold ${
                reportInfo.processed ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
              }">${reportInfo.processed ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      `;

      setReportsData(reportHtml);
      setStatus({ type: 'success', message: 'Report info loaded successfully!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to get report info: ${error.message}` });
    }
  };

  const handleLoadReports = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Loading reports...' });

      const [totalReports, currentPeriod] = await Promise.all([
        reporting.getTotalReports(),
        reporting.getCurrentPeriod(),
      ]);

      let reportsHtml = `
        <div class="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="font-semibold text-blue-900">
            Total Reports: ${totalReports}<br>
            Current Period: ${currentPeriod}
          </div>
        </div>
      `;

      if (totalReports > 0) {
        const reportsToLoad = Math.min(totalReports, 10);
        for (let i = 1; i <= reportsToLoad; i++) {
          try {
            const reportInfo = await reporting.getReportInfo(i);
            reportsHtml += `
              <div class="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold text-purple-700">Report #${i}</span>
                  <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                    reportInfo.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }">${reportInfo.verified ? 'Verified' : 'Pending'}</span>
                </div>
                <div class="space-y-1 text-sm">
                  <div><strong>Submitter:</strong> <span class="font-mono text-xs">${reportInfo.submitter}</span></div>
                  <div><strong>Period:</strong> ${reportInfo.reportPeriod.toString()}</div>
                  <div><strong>Date:</strong> ${new Date(Number(reportInfo.timestamp) * 1000).toLocaleDateString()}</div>
                </div>
              </div>
            `;
          } catch (error) {
            console.error(`Error loading report ${i}:`, error);
          }
        }
      }

      setReportsData(reportsHtml);
      setStatus({ type: 'success', message: 'Reports loaded successfully!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to load reports: ${error.message}` });
    }
  };

  const handleLoadPeriods = async () => {
    if (!contract) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Loading periods...' });

      const currentPeriod = await reporting.getCurrentPeriod();
      let periodsHtml = '<h4 class="text-xl font-bold text-gray-800 mb-4">Reporting Periods</h4>';

      for (let i = 1; i <= currentPeriod; i++) {
        try {
          const periodInfo = await reporting.getPeriodInfo(i);
          periodsHtml += `
            <div class="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
              <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-purple-700">Period #${i}</span>
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                  periodInfo.active ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }">${periodInfo.active ? 'Active' : 'Closed'}</span>
              </div>
              <div class="space-y-1 text-sm">
                <div><strong>Start:</strong> ${new Date(Number(periodInfo.startTime) * 1000).toLocaleDateString()}</div>
                <div><strong>End:</strong> ${new Date(Number(periodInfo.endTime) * 1000).toLocaleDateString()}</div>
                <div><strong>Submission Deadline:</strong> ${new Date(Number(periodInfo.submissionDeadline) * 1000).toLocaleDateString()}</div>
                <div><strong>Total Submissions:</strong> ${periodInfo.totalSubmissions.toString()}</div>
              </div>
            </div>
          `;
        } catch (error) {
          console.error(`Error loading period ${i}:`, error);
        }
      }

      setReportsData(periodsHtml);
      setStatus({ type: 'success', message: 'Periods loaded successfully!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to load periods: ${error.message}` });
    }
  };

  const handleCheckAuthorization = async () => {
    if (!contract || !account) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Checking authorization...' });

      const auth = await reporting.checkAuthorization();

      const authHtml = `
        <div class="p-6 rounded-lg border ${
          auth.isAuthorized ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }">
          <h4 class="text-xl font-bold ${auth.isAuthorized ? 'text-green-900' : 'text-red-900'} mb-4">
            Authorization Status
          </h4>
          <div class="space-y-2 text-sm">
            <div><strong>Your Address:</strong> <span class="font-mono text-xs">${account}</span></div>
            <div><strong>Authorized to Submit Reports:</strong> <span class="font-semibold">${auth.isAuthorized ? 'Yes ✅' : 'No ❌'}</span></div>
            <div><strong>Contract Owner:</strong> <span class="font-mono text-xs">${auth.ownerAddress}</span></div>
            <div><strong>Regulator:</strong> <span class="font-mono text-xs">${auth.regulatorAddress}</span></div>
            <div><strong>You are Owner:</strong> ${auth.isOwner ? 'Yes ✅' : 'No ❌'}</div>
            <div><strong>You are Regulator:</strong> ${auth.isRegulator ? 'Yes ✅' : 'No ❌'}</div>
          </div>
        </div>
      `;

      setReportsData(authHtml);
      setStatus({ type: 'success', message: 'Authorization status loaded!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to check authorization: ${error.message}` });
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">Please connect your wallet to view reports</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Reports Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleLoadReports}
            disabled={reporting.loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reporting.loading ? 'Loading...' : 'Load Reports'}
          </button>
          <button
            onClick={handleLoadPeriods}
            disabled={reporting.loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reporting.loading ? 'Loading...' : 'Load Periods'}
          </button>
          <button
            onClick={handleCheckAuthorization}
            disabled={reporting.loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reporting.loading ? 'Checking...' : 'Check Authorization'}
          </button>
        </div>

        {/* Get Specific Report */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Report ID
          </label>
          <input
            type="number"
            value={reportIdView}
            onChange={(e) => setReportIdView(e.target.value)}
            placeholder="Enter report ID"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors mb-3"
          />
          <button
            onClick={handleGetReportInfo}
            disabled={reporting.loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {reporting.loading ? 'Loading...' : 'Get Report Info'}
          </button>
        </div>
      </div>

      {/* Reports Container */}
      {reportsData && (
        <div
          className="mb-6"
          dangerouslySetInnerHTML={{ __html: reportsData }}
        />
      )}

      {status && <StatusMessage type={status.type} message={status.message} />}
    </div>
  );
}
