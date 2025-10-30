export interface ReportInfo {
  submitter: string;
  timestamp: bigint;
  reportPeriod: bigint;
  verified: boolean;
  processed: boolean;
}

export interface PeriodInfo {
  startTime: bigint;
  endTime: bigint;
  active: boolean;
  submissionDeadline: bigint;
  totalSubmissions: bigint;
}

export interface ReportFormData {
  totalAmount: string;
  transactionCount: string;
  riskScore: string;
  periodId: string;
}

export interface AuthorizationStatus {
  isAuthorized: boolean;
  isOwner: boolean;
  isRegulator: boolean;
  ownerAddress: string;
  regulatorAddress: string;
}

export type StatusType = 'success' | 'error' | 'info' | 'warning';

export interface StatusMessage {
  type: StatusType;
  message: string;
}
