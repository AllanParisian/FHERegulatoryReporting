// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

contract PrivacyRegulatoryReporting {

    address public regulator;
    address public owner;
    uint256 public reportCounter;
    uint256 public submissionWindow;

    struct ConfidentialReport {
        euint64 encryptedAmount;
        euint32 encryptedTransactionCount;
        euint8 encryptedRiskScore;
        address submitter;
        uint256 timestamp;
        uint256 reportPeriod;
        bool verified;
        bool processed;
    }

    struct ReportPeriod {
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 submissionDeadline;
        uint256 totalSubmissions;
    }

    mapping(uint256 => ConfidentialReport) public reports;
    mapping(uint256 => ReportPeriod) public reportingPeriods;
    mapping(address => mapping(uint256 => bool)) public hasSubmitted;
    mapping(address => bool) public authorizedEntities;

    uint256 public currentPeriod;

    event ReportSubmitted(address indexed submitter, uint256 indexed reportId, uint256 indexed period);
    event ReportVerified(uint256 indexed reportId, address indexed verifier);
    event ReportingPeriodCreated(uint256 indexed period, uint256 startTime, uint256 endTime);
    event EntityAuthorized(address indexed entity);
    event EntityRevoked(address indexed entity);

    modifier onlyRegulator() {
        require(msg.sender == regulator, "Only regulator can perform this action");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedEntities[msg.sender], "Not authorized to submit reports");
        _;
    }

    modifier duringSubmissionWindow(uint256 periodId) {
        ReportPeriod storage period = reportingPeriods[periodId];
        require(period.active, "Reporting period not active");
        require(block.timestamp <= period.submissionDeadline, "Submission deadline passed");
        _;
    }

    constructor(address _regulator) {
        owner = msg.sender;
        regulator = _regulator;
        reportCounter = 0;
        submissionWindow = 30 days;
        currentPeriod = 1;

        // Create initial reporting period
        reportingPeriods[currentPeriod] = ReportPeriod({
            startTime: block.timestamp,
            endTime: block.timestamp + 90 days,
            active: true,
            submissionDeadline: block.timestamp + submissionWindow,
            totalSubmissions: 0
        });

        emit ReportingPeriodCreated(currentPeriod, block.timestamp, block.timestamp + 90 days);
    }

    function authorizeEntity(address entity) external onlyRegulator {
        authorizedEntities[entity] = true;
        emit EntityAuthorized(entity);
    }

    function revokeEntity(address entity) external onlyRegulator {
        authorizedEntities[entity] = false;
        emit EntityRevoked(entity);
    }

    function createReportingPeriod(
        uint256 duration,
        uint256 submissionDeadlineDays
    ) external onlyRegulator {
        currentPeriod++;

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;
        uint256 submissionDeadline = startTime + (submissionDeadlineDays * 1 days);

        reportingPeriods[currentPeriod] = ReportPeriod({
            startTime: startTime,
            endTime: endTime,
            active: true,
            submissionDeadline: submissionDeadline,
            totalSubmissions: 0
        });

        emit ReportingPeriodCreated(currentPeriod, startTime, endTime);
    }

    function submitConfidentialReport(
        uint64 totalAmount,
        uint32 transactionCount,
        uint8 riskScore,
        uint256 periodId
    ) external
        onlyAuthorized
        duringSubmissionWindow(periodId)
    {
        require(!hasSubmitted[msg.sender][periodId], "Already submitted for this period");
        require(riskScore <= 100, "Risk score must be between 0-100");

        // Encrypt sensitive data
        euint64 encryptedAmount = TFHE.asEuint64(totalAmount);
        euint32 encryptedTxCount = TFHE.asEuint32(transactionCount);
        euint8 encryptedRisk = TFHE.asEuint8(riskScore);

        reportCounter++;

        reports[reportCounter] = ConfidentialReport({
            encryptedAmount: encryptedAmount,
            encryptedTransactionCount: encryptedTxCount,
            encryptedRiskScore: encryptedRisk,
            submitter: msg.sender,
            timestamp: block.timestamp,
            reportPeriod: periodId,
            verified: false,
            processed: false
        });

        hasSubmitted[msg.sender][periodId] = true;
        reportingPeriods[periodId].totalSubmissions++;

        // Grant access permissions
        TFHE.allow(encryptedAmount, address(this));
        TFHE.allow(encryptedTxCount, address(this));
        TFHE.allow(encryptedRisk, address(this));
        TFHE.allow(encryptedAmount, regulator);
        TFHE.allow(encryptedTxCount, regulator);
        TFHE.allow(encryptedRisk, regulator);

        emit ReportSubmitted(msg.sender, reportCounter, periodId);
    }

    function verifyReport(uint256 reportId) external onlyRegulator {
        require(reportId > 0 && reportId <= reportCounter, "Invalid report ID");
        require(!reports[reportId].verified, "Report already verified");

        reports[reportId].verified = true;
        emit ReportVerified(reportId, msg.sender);
    }

    function processReport(uint256 reportId) external onlyRegulator {
        require(reports[reportId].verified, "Report not verified");
        require(!reports[reportId].processed, "Report already processed");

        reports[reportId].processed = true;
    }

    // Grant decryption access to regulator for analysis
    function grantDecryptionAccess(uint256 reportId, address analyst) external onlyRegulator {
        require(reports[reportId].verified, "Report must be verified first");
        require(analyst != address(0), "Invalid analyst address");

        ConfidentialReport storage report = reports[reportId];

        // Grant access permissions to analyst
        TFHE.allow(report.encryptedAmount, analyst);
        TFHE.allow(report.encryptedTransactionCount, analyst);
        TFHE.allow(report.encryptedRiskScore, analyst);
    }

    function getReportInfo(uint256 reportId) external view returns (
        address submitter,
        uint256 timestamp,
        uint256 reportPeriod,
        bool verified,
        bool processed
    ) {
        require(reportId > 0 && reportId <= reportCounter, "Invalid report ID");

        ConfidentialReport storage report = reports[reportId];
        return (
            report.submitter,
            report.timestamp,
            report.reportPeriod,
            report.verified,
            report.processed
        );
    }

    function getPeriodInfo(uint256 periodId) external view returns (
        uint256 startTime,
        uint256 endTime,
        bool active,
        uint256 submissionDeadline,
        uint256 totalSubmissions
    ) {
        ReportPeriod storage period = reportingPeriods[periodId];
        return (
            period.startTime,
            period.endTime,
            period.active,
            period.submissionDeadline,
            period.totalSubmissions
        );
    }

    function getCurrentPeriod() external view returns (uint256) {
        return currentPeriod;
    }

    function hasEntitySubmitted(address entity, uint256 periodId) external view returns (bool) {
        return hasSubmitted[entity][periodId];
    }

    function isAuthorizedEntity(address entity) external view returns (bool) {
        return authorizedEntities[entity];
    }

    function getSubmissionDeadline(uint256 periodId) external view returns (uint256) {
        return reportingPeriods[periodId].submissionDeadline;
    }

    function getTotalReports() external view returns (uint256) {
        return reportCounter;
    }

    function updateRegulator(address newRegulator) external onlyOwner {
        require(newRegulator != address(0), "Invalid regulator address");
        regulator = newRegulator;
    }

    function closePeriod(uint256 periodId) external onlyRegulator {
        require(reportingPeriods[periodId].active, "Period already closed");
        reportingPeriods[periodId].active = false;
    }
}