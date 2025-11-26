# Enhanced Privacy Reporting - API Documentation

## Table of Contents

1. [Entity Management](#entity-management)
2. [Period Management](#period-management)
3. [Report Submission](#report-submission)
4. [Gateway Callback Mode](#gateway-callback-mode)
5. [Refund Mechanism](#refund-mechanism)
6. [Access Control](#access-control)
7. [View Functions](#view-functions)
8. [Admin Functions](#admin-functions)

---

## Entity Management

### `authorizeEntity(address entity)`

Authorize an entity to submit confidential reports.

**Access:** Regulator only

**Parameters:**
- `entity` (address): Address of the entity to authorize

**Requirements:**
- Valid address (not zero address)
- Entity not already authorized

**Events:**
- `EntityAuthorized(address indexed entity)`

**Example:**
```solidity
contract.authorizeEntity("0x1234...5678");
```

---

### `revokeEntity(address entity)`

Revoke entity authorization.

**Access:** Regulator only

**Parameters:**
- `entity` (address): Address of the entity to revoke

**Requirements:**
- Entity must be currently authorized

**Events:**
- `EntityRevoked(address indexed entity)`

**Example:**
```solidity
contract.revokeEntity("0x1234...5678");
```

---

## Period Management

### `createReportingPeriod(uint256 duration, uint256 submissionDeadlineDays, uint256 maxSubmissions)`

Create a new reporting period.

**Access:** Regulator only

**Parameters:**
- `duration` (uint256): Duration of the period in seconds
- `submissionDeadlineDays` (uint256): Deadline for submissions in days
- `maxSubmissions` (uint256): Maximum number of submissions allowed

**Requirements:**
- Duration must be positive
- Deadline must be positive
- Max submissions between 1 and MAX_REPORTS_PER_PERIOD (1000)

**Events:**
- `ReportingPeriodCreated(uint256 indexed period, uint256 startTime, uint256 endTime, uint256 maxSubmissions)`

**Example:**
```solidity
// Create 90-day period with 30-day submission window, max 500 reports
contract.createReportingPeriod(
    90 days,
    30,
    500
);
```

---

### `closePeriod(uint256 periodId)`

Close a reporting period.

**Access:** Regulator only

**Parameters:**
- `periodId` (uint256): ID of the period to close

**Requirements:**
- Period must be active

**Example:**
```solidity
contract.closePeriod(1);
```

---

## Report Submission

### `submitConfidentialReport(uint64 totalAmount, uint32 transactionCount, uint8 riskScore, uint256 periodId)`

Submit a confidential report with privacy protection.

**Access:** Authorized entities only

**Parameters:**
- `totalAmount` (uint64): Total transaction amount (will be encrypted)
- `transactionCount` (uint32): Number of transactions (will be encrypted)
- `riskScore` (uint8): Risk assessment score 0-100 (will be encrypted)
- `periodId` (uint256): Reporting period identifier

**Requirements:**
- Caller must be authorized entity
- Within submission window
- Period must be active
- Not submitted for this period yet
- Amount > 0
- Transaction count > 0
- Risk score between 0-100
- Period not at max submissions

**Privacy Features:**
- Generates random privacy multiplier
- Obfuscates amount for division protection
- Encrypts all sensitive data using TFHE
- Grants access to regulator

**Events:**
- `ReportSubmitted(address indexed submitter, uint256 indexed reportId, uint256 indexed period, uint256 privacyMultiplier)`

**Gas Cost:** ~42,000 gas + 2,800 HCU

**Example:**
```solidity
contract.submitConfidentialReport(
    1000000,  // $1M total amount
    150,      // 150 transactions
    75,       // 75/100 risk score
    1         // Period ID
);
```

---

## Gateway Callback Mode

### `requestReportDecryption(uint256 reportId)`

Request decryption through Gateway callback mode (asynchronous).

**Access:** Regulator only

**Parameters:**
- `reportId` (uint256): ID of the report to decrypt

**Requirements:**
- Valid report ID
- Report must be verified
- Decryption not already requested
- Report not already processed

**Process:**
1. Prepares ciphertexts for Gateway
2. Requests async decryption
3. Sets timeout (7 days)
4. Stores request mapping
5. Waits for Gateway callback

**Events:**
- `DecryptionRequested(uint256 indexed reportId, uint256 requestId, uint256 timestamp)`

**Gas Cost:** ~50,000 gas + 5,000 HCU

**Example:**
```solidity
contract.requestReportDecryption(42);
```

---

### `decryptionCallback(uint256 requestId, bool success, bytes memory decryptedData)`

Gateway callback for decryption results (called by Gateway oracle).

**Access:** Gateway only (internal)

**Parameters:**
- `requestId` (uint256): The decryption request ID
- `success` (bool): Whether decryption succeeded
- `decryptedData` (bytes): Decrypted values (if successful)

**Process:**
1. Validates request ID
2. Retrieves report
3. Decodes decrypted data
4. Removes privacy multiplier
5. Marks as processed

**Events:**
- `DecryptionCompleted(uint256 indexed reportId, uint256 requestId)` (success)
- `DecryptionFailed(uint256 indexed reportId, string reason)` (failure)

**Note:** This function is called automatically by the Gateway oracle.

---

## Refund Mechanism

### `issueRefund(uint256 reportId)`

Issue refund if decryption fails or times out.

**Access:** Submitter or Regulator

**Parameters:**
- `reportId` (uint256): ID of the report to refund

**Requirements:**
- Valid report ID
- Caller is submitter or regulator
- Report not already processed
- Report not already refunded
- One of the following conditions met:
  - Decryption timeout (7 days)
  - Explicit decryption failure

**Refund Conditions:**

**Condition 1: Timeout Protection**
```solidity
block.timestamp > report.decryptionRequestTime + DECRYPTION_TIMEOUT
```

**Condition 2: Explicit Failure**
```solidity
report.decryptionRequested && !request.completed &&
block.timestamp > request.timestamp + DECRYPTION_TIMEOUT
```

**Events:**
- `RefundIssued(uint256 indexed reportId, address indexed submitter)`
- `TimeoutProtectionTriggered(uint256 indexed reportId)` (if timeout)

**Example:**
```solidity
// After 7 days if decryption hasn't completed
contract.issueRefund(42);
```

---

## Access Control

### `verifyReport(uint256 reportId)`

Verify a submitted report.

**Access:** Regulator only

**Parameters:**
- `reportId` (uint256): ID of the report to verify

**Requirements:**
- Valid report ID
- Report not already verified

**Events:**
- `ReportVerified(uint256 indexed reportId, address indexed verifier)`

**Example:**
```solidity
contract.verifyReport(42);
```

---

### `grantDecryptionAccess(uint256 reportId, address analyst)`

Grant decryption access to analyst with granular control.

**Access:** Regulator only

**Parameters:**
- `reportId` (uint256): ID of the report
- `analyst` (address): Address of the analyst

**Requirements:**
- Report must be verified
- Valid analyst address (not zero)

**Grants Access To:**
- `encryptedAmount`
- `encryptedTransactionCount`
- `encryptedRiskScore`

**Example:**
```solidity
contract.grantDecryptionAccess(42, "0xAnalyst...1234");
```

---

## View Functions

### `getReportInfo(uint256 reportId)`

Get comprehensive report information.

**Parameters:**
- `reportId` (uint256): ID of the report

**Returns:**
```solidity
(
    address submitter,           // Entity that submitted
    uint256 timestamp,           // Submission timestamp
    uint256 reportPeriod,        // Period ID
    bool verified,               // Verification status
    bool processed,              // Processing status
    bool decryptionRequested,    // Decryption request status
    bool refunded,               // Refund status
    uint256 privacyMultiplier    // Privacy multiplier used
)
```

**Example:**
```solidity
(
    address submitter,
    uint256 timestamp,
    uint256 period,
    bool verified,
    bool processed,
    bool decryptionRequested,
    bool refunded,
    uint256 multiplier
) = contract.getReportInfo(42);
```

---

### `getPeriodInfo(uint256 periodId)`

Get reporting period information.

**Parameters:**
- `periodId` (uint256): ID of the period

**Returns:**
```solidity
(
    uint256 startTime,          // Period start timestamp
    uint256 endTime,            // Period end timestamp
    bool active,                // Is period active
    uint256 submissionDeadline, // Submission deadline
    uint256 totalSubmissions,   // Current submissions
    uint256 maxSubmissions      // Maximum allowed
)
```

**Example:**
```solidity
(
    uint256 start,
    uint256 end,
    bool active,
    uint256 deadline,
    uint256 total,
    uint256 max
) = contract.getPeriodInfo(1);
```

---

### `getDecryptionStatus(uint256 reportId)`

Get decryption status for a report.

**Parameters:**
- `reportId` (uint256): ID of the report

**Returns:**
```solidity
(
    bool requested,      // Has decryption been requested
    uint256 requestId,   // Gateway request ID
    uint256 requestTime, // Request timestamp
    bool completed,      // Has decryption completed
    bool timedOut        // Has request timed out
)
```

**Example:**
```solidity
(
    bool requested,
    uint256 requestId,
    uint256 requestTime,
    bool completed,
    bool timedOut
) = contract.getDecryptionStatus(42);

if (timedOut && !completed) {
    // Issue refund
    contract.issueRefund(42);
}
```

---

### `getCurrentPeriod()`

Get current active reporting period ID.

**Returns:** `uint256` - Current period ID

**Example:**
```solidity
uint256 currentPeriod = contract.getCurrentPeriod();
```

---

### `getTotalReports()`

Get total number of reports submitted.

**Returns:** `uint256` - Total report count

**Example:**
```solidity
uint256 totalReports = contract.getTotalReports();
```

---

### `hasEntitySubmitted(address entity, uint256 periodId)`

Check if entity has submitted for a period.

**Parameters:**
- `entity` (address): Entity address
- `periodId` (uint256): Period ID

**Returns:** `bool` - True if submitted

**Example:**
```solidity
bool hasSubmitted = contract.hasEntitySubmitted(
    "0x1234...5678",
    1
);
```

---

### `isAuthorizedEntity(address entity)`

Check if address is authorized entity.

**Parameters:**
- `entity` (address): Address to check

**Returns:** `bool` - True if authorized

**Example:**
```solidity
bool isAuthorized = contract.isAuthorizedEntity("0x1234...5678");
```

---

### `getSubmissionDeadline(uint256 periodId)`

Get submission deadline for a period.

**Parameters:**
- `periodId` (uint256): Period ID

**Returns:** `uint256` - Deadline timestamp

**Example:**
```solidity
uint256 deadline = contract.getSubmissionDeadline(1);
bool canSubmit = block.timestamp <= deadline;
```

---

## Admin Functions

### `updateRegulator(address newRegulator)`

Update regulator address.

**Access:** Owner only

**Parameters:**
- `newRegulator` (address): New regulator address

**Requirements:**
- Valid address (not zero)

**Example:**
```solidity
contract.updateRegulator("0xNewRegulator...1234");
```

---

## Constants

```solidity
uint256 public constant DECRYPTION_TIMEOUT = 7 days;
uint256 public constant MAX_REPORTS_PER_PERIOD = 1000;
uint256 public constant MIN_PRIVACY_MULTIPLIER = 100;
uint256 public constant MAX_PRIVACY_MULTIPLIER = 10000;
```

---

## Error Messages

| Error | Meaning |
|-------|---------|
| `"Only regulator can perform this action"` | Caller is not the regulator |
| `"Only owner can perform this action"` | Caller is not the owner |
| `"Not authorized to submit reports"` | Entity not authorized |
| `"Reporting period not active"` | Period is closed |
| `"Submission deadline passed"` | Too late to submit |
| `"Period submission limit reached"` | Max submissions reached |
| `"Already submitted for this period"` | Duplicate submission |
| `"Invalid report ID"` | Report doesn't exist |
| `"Report must be verified first"` | Verify before decryption |
| `"Decryption already requested"` | Can't request twice |
| `"Report already processed"` | Report finalized |
| `"Refund conditions not met"` | Can't refund yet |
| `"Amount must be positive"` | Invalid amount value |
| `"Transaction count must be positive"` | Invalid count value |
| `"Risk score must be between 0-100"` | Invalid risk value |

---

## Usage Examples

### Complete Workflow

```solidity
// 1. Regulator authorizes entity
contract.authorizeEntity("0xEntity1...1234");

// 2. Entity submits confidential report
contract.submitConfidentialReport(
    1000000,  // $1M
    150,      // 150 transactions
    75,       // Risk score 75
    1         // Period 1
);

// 3. Regulator verifies report
contract.verifyReport(1);

// 4. Regulator requests decryption (async)
contract.requestReportDecryption(1);

// 5. Wait for Gateway callback (automatic)
// Gateway calls: decryptionCallback(requestId, true, decryptedData)

// 6. Check status
(bool requested, , , bool completed, bool timedOut) =
    contract.getDecryptionStatus(1);

if (completed) {
    // Report processed successfully
} else if (timedOut) {
    // Issue refund
    contract.issueRefund(1);
}

// 7. Grant analyst access
contract.grantDecryptionAccess(1, "0xAnalyst...5678");
```

### Monitoring Example

```javascript
// Listen for events
contract.on("ReportSubmitted", (submitter, reportId, period, multiplier) => {
    console.log(`Report ${reportId} submitted with multiplier ${multiplier}`);
});

contract.on("DecryptionRequested", (reportId, requestId, timestamp) => {
    console.log(`Decryption requested for report ${reportId}`);
    // Start monitoring timeout
    setTimeout(() => checkTimeout(reportId), 7 * 24 * 60 * 60 * 1000);
});

contract.on("DecryptionCompleted", (reportId, requestId) => {
    console.log(`Report ${reportId} decrypted successfully`);
});

contract.on("TimeoutProtectionTriggered", (reportId) => {
    console.warn(`Report ${reportId} timed out - refund available`);
});
```

---

## Gas Estimation

| Function | Estimated Gas | Estimated HCU |
|----------|--------------|---------------|
| `authorizeEntity()` | ~45,000 | 0 |
| `submitConfidentialReport()` | ~42,000 | 2,800 |
| `verifyReport()` | ~30,000 | 0 |
| `requestReportDecryption()` | ~50,000 | 5,000 |
| `issueRefund()` | ~35,000 | 0 |
| `grantDecryptionAccess()` | ~40,000 | 600 |
| View functions | ~5,000 | 0 |

**Note:** HCU (Homomorphic Computation Unit) costs are approximate and depend on network conditions.
