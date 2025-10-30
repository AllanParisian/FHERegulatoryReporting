export const CONTRACT_ADDRESS = "0x0B7F69092DF31270DE216D07ca22B3B8ee237154";

export const CONTRACT_ABI = [
  "function regulator() view returns (address)",
  "function owner() view returns (address)",
  "function reportCounter() view returns (uint256)",
  "function currentPeriod() view returns (uint256)",
  "function authorizeEntity(address entity)",
  "function revokeEntity(address entity)",
  "function createReportingPeriod(uint256 duration, uint256 submissionDeadlineDays)",
  "function submitConfidentialReport(uint64 totalAmount, uint32 transactionCount, uint8 riskScore, uint256 periodId)",
  "function verifyReport(uint256 reportId)",
  "function processReport(uint256 reportId)",
  "function grantDecryptionAccess(uint256 reportId, address analyst)",
  "function getReportInfo(uint256 reportId) view returns (address submitter, uint256 timestamp, uint256 reportPeriod, bool verified, bool processed)",
  "function getPeriodInfo(uint256 periodId) view returns (uint256 startTime, uint256 endTime, bool active, uint256 submissionDeadline, uint256 totalSubmissions)",
  "function getCurrentPeriod() view returns (uint256)",
  "function hasEntitySubmitted(address entity, uint256 periodId) view returns (bool)",
  "function isAuthorizedEntity(address entity) view returns (bool)",
  "function getSubmissionDeadline(uint256 periodId) view returns (uint256)",
  "function getTotalReports() view returns (uint256)",
  "function closePeriod(uint256 periodId)",
  "event ReportSubmitted(address indexed submitter, uint256 indexed reportId, uint256 indexed period)",
  "event ReportVerified(uint256 indexed reportId, address indexed verifier)",
  "event ReportingPeriodCreated(uint256 indexed period, uint256 startTime, uint256 endTime)",
  "event EntityAuthorized(address indexed entity)",
  "event EntityRevoked(address indexed entity)"
];
