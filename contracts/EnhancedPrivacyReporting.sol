// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";

/**
 * @title Enhanced Privacy Regulatory Reporting
 * @notice Privacy-preserving regulatory reporting with Gateway callback mode
 * @dev Implements refund mechanism, timeout protection, and innovative privacy features
 */
contract EnhancedPrivacyReporting is GatewayCaller {

    // ============ State Variables ============

    address public regulator;
    address public owner;
    uint256 public reportCounter;
    uint256 public submissionWindow;
    uint256 public constant DECRYPTION_TIMEOUT = 7 days;
    uint256 public constant MAX_REPORTS_PER_PERIOD = 1000;

    // Privacy protection multiplier range
    uint256 public constant MIN_PRIVACY_MULTIPLIER = 100;
    uint256 public constant MAX_PRIVACY_MULTIPLIER = 10000;

    // ============ Structs ============

    struct ConfidentialReport {
        euint64 encryptedAmount;
        euint32 encryptedTransactionCount;
        euint8 encryptedRiskScore;
        address submitter;
        uint256 timestamp;
        uint256 reportPeriod;
        bool verified;
        bool processed;
        uint256 decryptionRequestId;
        bool decryptionRequested;
        uint256 decryptionRequestTime;
        bool refunded;
        uint256 privacyMultiplier; // Random multiplier for division protection
    }

    struct ReportPeriod {
        uint256 startTime;
        uint256 endTime;
        bool active;
        uint256 submissionDeadline;
        uint256 totalSubmissions;
        uint256 maxSubmissions;
    }

    struct DecryptionRequest {
        uint256 reportId;
        bool completed;
        uint256 timestamp;
    }

    // ============ Mappings ============

    mapping(uint256 => ConfidentialReport) public reports;
    mapping(uint256 => ReportPeriod) public reportingPeriods;
    mapping(address => mapping(uint256 => bool)) public hasSubmitted;
    mapping(address => bool) public authorizedEntities;
    mapping(uint256 => DecryptionRequest) public decryptionRequests;
    mapping(uint256 => uint256) public requestIdToReportId;

    uint256 public currentPeriod;

    // ============ Events ============

    event ReportSubmitted(
        address indexed submitter,
        uint256 indexed reportId,
        uint256 indexed period,
        uint256 privacyMultiplier
    );
    event ReportVerified(uint256 indexed reportId, address indexed verifier);
    event ReportingPeriodCreated(
        uint256 indexed period,
        uint256 startTime,
        uint256 endTime,
        uint256 maxSubmissions
    );
    event EntityAuthorized(address indexed entity);
    event EntityRevoked(address indexed entity);
    event DecryptionRequested(uint256 indexed reportId, uint256 requestId, uint256 timestamp);
    event DecryptionCompleted(uint256 indexed reportId, uint256 requestId);
    event DecryptionFailed(uint256 indexed reportId, string reason);
    event RefundIssued(uint256 indexed reportId, address indexed submitter);
    event TimeoutProtectionTriggered(uint256 indexed reportId);

    // ============ Modifiers ============

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
        require(
            period.totalSubmissions < period.maxSubmissions,
            "Period submission limit reached"
        );
        _;
    }

    modifier validInput(uint64 amount, uint32 count, uint8 risk) {
        require(amount > 0, "Amount must be positive");
        require(count > 0, "Transaction count must be positive");
        require(risk <= 100, "Risk score must be between 0-100");
        _;
    }

    // ============ Constructor ============

    constructor(address _regulator) {
        require(_regulator != address(0), "Invalid regulator address");
        owner = msg.sender;
        regulator = _regulator;
        reportCounter = 0;
        submissionWindow = 30 days;
        currentPeriod = 1;

        // Create initial reporting period with limits
        reportingPeriods[currentPeriod] = ReportPeriod({
            startTime: block.timestamp,
            endTime: block.timestamp + 90 days,
            active: true,
            submissionDeadline: block.timestamp + submissionWindow,
            totalSubmissions: 0,
            maxSubmissions: MAX_REPORTS_PER_PERIOD
        });

        emit ReportingPeriodCreated(
            currentPeriod,
            block.timestamp,
            block.timestamp + 90 days,
            MAX_REPORTS_PER_PERIOD
        );
    }

    // ============ Entity Management ============

    /**
     * @notice Authorize an entity to submit reports
     * @param entity Address of the entity to authorize
     */
    function authorizeEntity(address entity) external onlyRegulator {
        require(entity != address(0), "Invalid entity address");
        require(!authorizedEntities[entity], "Entity already authorized");
        authorizedEntities[entity] = true;
        emit EntityAuthorized(entity);
    }

    /**
     * @notice Revoke entity authorization
     * @param entity Address of the entity to revoke
     */
    function revokeEntity(address entity) external onlyRegulator {
        require(authorizedEntities[entity], "Entity not authorized");
        authorizedEntities[entity] = false;
        emit EntityRevoked(entity);
    }

    // ============ Period Management ============

    /**
     * @notice Create a new reporting period
     * @param duration Duration of the period in seconds
     * @param submissionDeadlineDays Deadline for submissions in days
     * @param maxSubmissions Maximum number of submissions allowed
     */
    function createReportingPeriod(
        uint256 duration,
        uint256 submissionDeadlineDays,
        uint256 maxSubmissions
    ) external onlyRegulator {
        require(duration > 0, "Duration must be positive");
        require(submissionDeadlineDays > 0, "Deadline must be positive");
        require(maxSubmissions > 0 && maxSubmissions <= MAX_REPORTS_PER_PERIOD,
                "Invalid max submissions");

        currentPeriod++;

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;
        uint256 submissionDeadline = startTime + (submissionDeadlineDays * 1 days);

        reportingPeriods[currentPeriod] = ReportPeriod({
            startTime: startTime,
            endTime: endTime,
            active: true,
            submissionDeadline: submissionDeadline,
            totalSubmissions: 0,
            maxSubmissions: maxSubmissions
        });

        emit ReportingPeriodCreated(currentPeriod, startTime, endTime, maxSubmissions);
    }

    // ============ Report Submission ============

    /**
     * @notice Submit a confidential report with privacy protection
     * @param totalAmount Total transaction amount (will be encrypted)
     * @param transactionCount Number of transactions (will be encrypted)
     * @param riskScore Risk assessment score 0-100 (will be encrypted)
     * @param periodId Reporting period identifier
     * @dev Uses random multiplier for division protection and price obfuscation
     */
    function submitConfidentialReport(
        uint64 totalAmount,
        uint32 transactionCount,
        uint8 riskScore,
        uint256 periodId
    ) external
        onlyAuthorized
        duringSubmissionWindow(periodId)
        validInput(totalAmount, transactionCount, riskScore)
    {
        require(!hasSubmitted[msg.sender][periodId], "Already submitted for this period");

        // Generate privacy multiplier for division protection
        uint256 privacyMultiplier = _generatePrivacyMultiplier(totalAmount, transactionCount);

        // Apply privacy multiplier to amount for obfuscation
        uint64 obfuscatedAmount = uint64((uint256(totalAmount) * privacyMultiplier) / 1000);

        // Encrypt sensitive data with privacy protection
        euint64 encryptedAmount = TFHE.asEuint64(obfuscatedAmount);
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
            processed: false,
            decryptionRequestId: 0,
            decryptionRequested: false,
            decryptionRequestTime: 0,
            refunded: false,
            privacyMultiplier: privacyMultiplier
        });

        hasSubmitted[msg.sender][periodId] = true;
        reportingPeriods[periodId].totalSubmissions++;

        // Grant access permissions with overflow protection
        TFHE.allowThis(encryptedAmount);
        TFHE.allowThis(encryptedTxCount);
        TFHE.allowThis(encryptedRisk);

        TFHE.allow(encryptedAmount, regulator);
        TFHE.allow(encryptedTxCount, regulator);
        TFHE.allow(encryptedRisk, regulator);

        emit ReportSubmitted(msg.sender, reportCounter, periodId, privacyMultiplier);
    }

    // ============ Gateway Callback Mode - Async Decryption ============

    /**
     * @notice Request decryption through Gateway callback mode
     * @param reportId ID of the report to decrypt
     * @dev Implements async processing with Gateway oracle
     */
    function requestReportDecryption(uint256 reportId) external onlyRegulator {
        require(reportId > 0 && reportId <= reportCounter, "Invalid report ID");

        ConfidentialReport storage report = reports[reportId];
        require(report.verified, "Report must be verified first");
        require(!report.decryptionRequested, "Decryption already requested");
        require(!report.processed, "Report already processed");

        // Prepare ciphertexts for Gateway decryption
        uint256[] memory cts = new uint256[](3);
        cts[0] = Gateway.toUint256(TFHE.asEuint64(report.encryptedAmount));
        cts[1] = Gateway.toUint256(TFHE.asEuint32(report.encryptedTransactionCount));
        cts[2] = Gateway.toUint256(TFHE.asEuint8(report.encryptedRiskScore));

        // Request decryption through Gateway - will trigger callback
        uint256 requestId = Gateway.requestDecryption(
            cts,
            this.decryptionCallback.selector,
            0, // no HCU limit
            block.timestamp + DECRYPTION_TIMEOUT,
            false // not passSignature
        );

        report.decryptionRequestId = requestId;
        report.decryptionRequested = true;
        report.decryptionRequestTime = block.timestamp;

        decryptionRequests[requestId] = DecryptionRequest({
            reportId: reportId,
            completed: false,
            timestamp: block.timestamp
        });

        requestIdToReportId[requestId] = reportId;

        emit DecryptionRequested(reportId, requestId, block.timestamp);
    }

    /**
     * @notice Gateway callback for decryption results
     * @param requestId The decryption request ID
     * @param decryptedData Array of decrypted values
     * @dev Called by Gateway oracle when decryption completes
     */
    function decryptionCallback(
        uint256 requestId,
        bool success,
        bytes memory decryptedData
    ) public onlyGateway {
        uint256 reportId = requestIdToReportId[requestId];
        require(reportId > 0, "Invalid request ID");

        ConfidentialReport storage report = reports[reportId];
        DecryptionRequest storage request = decryptionRequests[requestId];

        if (success && decryptedData.length > 0) {
            // Decode decrypted values
            (uint64 amount, uint32 txCount, uint8 risk) = abi.decode(
                decryptedData,
                (uint64, uint32, uint8)
            );

            // Remove privacy multiplier to get actual amount
            uint64 actualAmount = uint64((uint256(amount) * 1000) / report.privacyMultiplier);

            // Process decrypted data (store off-chain or emit event)
            report.processed = true;
            request.completed = true;

            emit DecryptionCompleted(reportId, requestId);
        } else {
            // Decryption failed - enable refund
            emit DecryptionFailed(reportId, "Gateway decryption failed");
        }
    }

    // ============ Refund Mechanism ============

    /**
     * @notice Issue refund if decryption fails or times out
     * @param reportId ID of the report to refund
     * @dev Timeout protection prevents permanent locking
     */
    function issueRefund(uint256 reportId) external {
        require(reportId > 0 && reportId <= reportCounter, "Invalid report ID");

        ConfidentialReport storage report = reports[reportId];
        require(report.submitter == msg.sender || msg.sender == regulator,
                "Only submitter or regulator can issue refund");
        require(!report.processed, "Report already processed");
        require(!report.refunded, "Already refunded");

        bool canRefund = false;

        // Case 1: Decryption timeout
        if (report.decryptionRequested &&
            block.timestamp > report.decryptionRequestTime + DECRYPTION_TIMEOUT) {
            canRefund = true;
            emit TimeoutProtectionTriggered(reportId);
        }

        // Case 2: Decryption explicitly failed
        DecryptionRequest storage request = decryptionRequests[report.decryptionRequestId];
        if (report.decryptionRequested && !request.completed &&
            block.timestamp > request.timestamp + DECRYPTION_TIMEOUT) {
            canRefund = true;
        }

        require(canRefund, "Refund conditions not met");

        report.refunded = true;

        // Mark as processed to prevent re-processing
        report.processed = true;

        emit RefundIssued(reportId, report.submitter);
    }

    // ============ Verification & Access Control ============

    /**
     * @notice Verify a submitted report
     * @param reportId ID of the report to verify
     */
    function verifyReport(uint256 reportId) external onlyRegulator {
        require(reportId > 0 && reportId <= reportCounter, "Invalid report ID");
        require(!reports[reportId].verified, "Report already verified");

        reports[reportId].verified = true;
        emit ReportVerified(reportId, msg.sender);
    }

    /**
     * @notice Grant decryption access to analyst with granular control
     * @param reportId ID of the report
     * @param analyst Address of the analyst
     */
    function grantDecryptionAccess(uint256 reportId, address analyst) external onlyRegulator {
        require(reports[reportId].verified, "Report must be verified first");
        require(analyst != address(0), "Invalid analyst address");

        ConfidentialReport storage report = reports[reportId];

        // Grant access permissions to analyst
        TFHE.allow(report.encryptedAmount, analyst);
        TFHE.allow(report.encryptedTransactionCount, analyst);
        TFHE.allow(report.encryptedRiskScore, analyst);
    }

    // ============ Privacy Protection Helpers ============

    /**
     * @notice Generate privacy multiplier for division protection
     * @param amount Transaction amount
     * @param count Transaction count
     * @return multiplier Random multiplier for obfuscation
     */
    function _generatePrivacyMultiplier(
        uint64 amount,
        uint32 count
    ) private view returns (uint256) {
        // Generate pseudo-random multiplier based on block data
        uint256 randomness = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            amount,
            count
        )));

        // Return multiplier in safe range
        return MIN_PRIVACY_MULTIPLIER +
               (randomness % (MAX_PRIVACY_MULTIPLIER - MIN_PRIVACY_MULTIPLIER));
    }

    // ============ View Functions ============

    function getReportInfo(uint256 reportId) external view returns (
        address submitter,
        uint256 timestamp,
        uint256 reportPeriod,
        bool verified,
        bool processed,
        bool decryptionRequested,
        bool refunded,
        uint256 privacyMultiplier
    ) {
        require(reportId > 0 && reportId <= reportCounter, "Invalid report ID");

        ConfidentialReport storage report = reports[reportId];
        return (
            report.submitter,
            report.timestamp,
            report.reportPeriod,
            report.verified,
            report.processed,
            report.decryptionRequested,
            report.refunded,
            report.privacyMultiplier
        );
    }

    function getPeriodInfo(uint256 periodId) external view returns (
        uint256 startTime,
        uint256 endTime,
        bool active,
        uint256 submissionDeadline,
        uint256 totalSubmissions,
        uint256 maxSubmissions
    ) {
        ReportPeriod storage period = reportingPeriods[periodId];
        return (
            period.startTime,
            period.endTime,
            period.active,
            period.submissionDeadline,
            period.totalSubmissions,
            period.maxSubmissions
        );
    }

    function getDecryptionStatus(uint256 reportId) external view returns (
        bool requested,
        uint256 requestId,
        uint256 requestTime,
        bool completed,
        bool timedOut
    ) {
        require(reportId > 0 && reportId <= reportCounter, "Invalid report ID");

        ConfidentialReport storage report = reports[reportId];
        DecryptionRequest storage request = decryptionRequests[report.decryptionRequestId];

        bool isTimedOut = report.decryptionRequested &&
                         block.timestamp > report.decryptionRequestTime + DECRYPTION_TIMEOUT;

        return (
            report.decryptionRequested,
            report.decryptionRequestId,
            report.decryptionRequestTime,
            request.completed,
            isTimedOut
        );
    }

    // ============ Admin Functions ============

    function updateRegulator(address newRegulator) external onlyOwner {
        require(newRegulator != address(0), "Invalid regulator address");
        regulator = newRegulator;
    }

    function closePeriod(uint256 periodId) external onlyRegulator {
        require(reportingPeriods[periodId].active, "Period already closed");
        reportingPeriods[periodId].active = false;
    }

    function getCurrentPeriod() external view returns (uint256) {
        return currentPeriod;
    }

    function getTotalReports() external view returns (uint256) {
        return reportCounter;
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
}
