'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import type { ReportInfo, PeriodInfo, AuthorizationStatus } from '@/types';

export function useReporting(contract: ethers.Contract | null, account: string) {
  const [loading, setLoading] = useState(false);

  const submitReport = async (
    totalAmount: string,
    transactionCount: number,
    riskScore: number,
    periodId: number
  ) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    try {
      // Convert ETH to Wei and then to uint64 (in microether units)
      const amountInWei = ethers.parseEther(totalAmount);
      const amountUint64 = amountInWei / ethers.parseEther("0.000001");

      const tx = await contract.submitConfidentialReport(
        amountUint64,
        transactionCount,
        riskScore,
        periodId
      );

      const receipt = await tx.wait();
      return { success: true, receipt };
    } catch (error: any) {
      console.error('Submit report error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyReport = async (reportId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    try {
      const tx = await contract.verifyReport(reportId);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } finally {
      setLoading(false);
    }
  };

  const processReport = async (reportId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    try {
      const tx = await contract.processReport(reportId);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } finally {
      setLoading(false);
    }
  };

  const grantDecryptionAccess = async (reportId: number, analystAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    try {
      const tx = await contract.grantDecryptionAccess(reportId, analystAddress);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } finally {
      setLoading(false);
    }
  };

  const getReportInfo = async (reportId: number): Promise<ReportInfo> => {
    if (!contract) throw new Error('Contract not initialized');

    const info = await contract.getReportInfo(reportId);
    return {
      submitter: info.submitter,
      timestamp: info.timestamp,
      reportPeriod: info.reportPeriod,
      verified: info.verified,
      processed: info.processed,
    };
  };

  const getPeriodInfo = async (periodId: number): Promise<PeriodInfo> => {
    if (!contract) throw new Error('Contract not initialized');

    const info = await contract.getPeriodInfo(periodId);
    return {
      startTime: info.startTime,
      endTime: info.endTime,
      active: info.active,
      submissionDeadline: info.submissionDeadline,
      totalSubmissions: info.totalSubmissions,
    };
  };

  const getCurrentPeriod = async (): Promise<number> => {
    if (!contract) throw new Error('Contract not initialized');
    const period = await contract.getCurrentPeriod();
    return Number(period);
  };

  const getTotalReports = async (): Promise<number> => {
    if (!contract) throw new Error('Contract not initialized');
    const total = await contract.getTotalReports();
    return Number(total);
  };

  const checkAuthorization = async (): Promise<AuthorizationStatus> => {
    if (!contract || !account) throw new Error('Contract or account not initialized');

    const [isAuthorized, owner, regulator] = await Promise.all([
      contract.isAuthorizedEntity(account),
      contract.owner(),
      contract.regulator(),
    ]);

    return {
      isAuthorized,
      isOwner: account.toLowerCase() === owner.toLowerCase(),
      isRegulator: account.toLowerCase() === regulator.toLowerCase(),
      ownerAddress: owner,
      regulatorAddress: regulator,
    };
  };

  const authorizeEntity = async (entityAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    try {
      const tx = await contract.authorizeEntity(entityAddress);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } finally {
      setLoading(false);
    }
  };

  const revokeEntity = async (entityAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    try {
      const tx = await contract.revokeEntity(entityAddress);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } finally {
      setLoading(false);
    }
  };

  const createReportingPeriod = async (durationDays: number, submissionDays: number) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    try {
      const durationSeconds = durationDays * 24 * 60 * 60;
      const tx = await contract.createReportingPeriod(durationSeconds, submissionDays);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } finally {
      setLoading(false);
    }
  };

  const closePeriod = async (periodId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    setLoading(true);
    try {
      const tx = await contract.closePeriod(periodId);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitReport,
    verifyReport,
    processReport,
    grantDecryptionAccess,
    getReportInfo,
    getPeriodInfo,
    getCurrentPeriod,
    getTotalReports,
    checkAuthorization,
    authorizeEntity,
    revokeEntity,
    createReportingPeriod,
    closePeriod,
  };
}
