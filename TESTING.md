# Testing Documentation

## Privacy-Preserving Regulatory Reporting System

This document provides comprehensive information about the test suite, test patterns, and testing best practices for the Privacy-Preserving Regulatory Reporting System.

---

## Table of Contents

- [Overview](#overview)
- [Test Infrastructure](#test-infrastructure)
- [Test Suite Organization](#test-suite-organization)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Patterns](#test-patterns)
- [Writing New Tests](#writing-new-tests)

---

## Overview

### Test Statistics

- **Total Test Files**: 1
- **Total Test Cases**: 65+
- **Code Coverage Target**: >80%
- **Testing Framework**: Hardhat + Mocha + Chai
- **Test Environment**: Mock (local) network

### Test Categories

| Category | Test Count | Description |
|----------|-----------|-------------|
| Deployment & Initialization | 8 | Contract deployment and initial state |
| Entity Authorization | 8 | Authorization and revocation of entities |
| Reporting Period Management | 7 | Period creation and lifecycle |
| Report Submission | 10 | Confidential report submission workflow |
| Report Verification | 7 | Verification and processing of reports |
| Decryption Access Control | 4 | Access management for encrypted data |
| View Functions | 5 | State query functions |
| Owner Functions | 3 | Owner-specific operations |
| Edge Cases | 5 | Boundary conditions and extreme cases |
| Gas Optimization | 3 | Gas usage monitoring |

---

## Test Infrastructure

### Dependencies

```json
{
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "@nomicfoundation/hardhat-verify": "^2.0.0",
    "hardhat": "^2.19.0",
    "hardhat-gas-reporter": "^1.0.9",
    "solidity-coverage": "^0.8.5",
    "dotenv": "^16.3.1",
    "chai": "^4.3.10",
    "ethers": "^6.9.0"
  }
}
```

### Hardhat Configuration

The test suite uses the following Hardhat configuration:

- **Solidity Version**: 0.8.24
- **Optimizer**: Enabled (200 runs)
- **Network**: Hardhat (local)
- **Gas Reporter**: Enabled via environment variable
- **Coverage**: Enabled via solidity-coverage plugin

---

## Test Suite Organization

### File Structure

```
test/
└── PrivacyRegulatoryReporting.test.js    # Main test suite (65+ tests)
```

### Test Hierarchy

```
PrivacyRegulatoryReporting
├── Deployment and Initialization (8 tests)
│   ├── Successful deployment
│   ├── Initial state verification
│   ├── Parameter validation
│   └── Error handling
├── Entity Authorization Management (8 tests)
│   ├── Authorization workflow
│   ├── Revocation workflow
│   ├── Access control
│   └── Edge cases
├── Reporting Period Management (7 tests)
│   ├── Period creation
│   ├── Period closure
│   ├── Access control
│   └── Error handling
├── Confidential Report Submission (10 tests)
│   ├── Successful submission
│   ├── Metadata verification
│   ├── Authorization checks
│   ├── Duplicate prevention
│   └── Validation rules
├── Report Verification (7 tests)
│   ├── Verification workflow
│   ├── Processing workflow
│   ├── Access control
│   └── State validation
├── Decryption Access Control (4 tests)
│   ├── Access granting
│   ├── Authorization checks
│   └── Validation rules
├── View Functions (5 tests)
│   ├── Report information
│   ├── Period information
│   ├── Submission tracking
│   └── State queries
├── Owner Functions (3 tests)
│   ├── Regulator updates
│   ├── Access control
│   └── Validation
├── Edge Cases and Boundary Conditions (5 tests)
│   ├── Zero values
│   ├── Maximum values
│   ├── Multiple periods
│   └── State isolation
└── Gas Optimization (3 tests)
    ├── Authorization gas
    ├── Submission gas
    └── Verification gas
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with gas reporting
REPORT_GAS=true npm test

# Run specific test file
npx hardhat test test/PrivacyRegulatoryReporting.test.js

# Run tests with verbose output
npx hardhat test --verbose
```

### Continuous Integration

Tests are designed to run in CI/CD pipelines:

```bash
# CI test script
npm run compile && npm test
```

### Test Execution Time

- **Full Test Suite**: ~30-45 seconds
- **Single Test File**: ~30-45 seconds
- **Coverage Report**: ~60-90 seconds

---

## Test Coverage

### Coverage Reports

Generate coverage report:

```bash
npm run test:coverage
```

Output location: `coverage/`

### Coverage Targets

| Metric | Target | Current |
|--------|--------|---------|
| Statements | >80% | TBD |
| Branches | >75% | TBD |
| Functions | >90% | TBD |
| Lines | >80% | TBD |

### Viewing Coverage

```bash
# Generate and open coverage report
npm run test:coverage
open coverage/index.html
```

---

## Test Patterns

### Pattern 1: Deployment Fixture

Every test uses a clean deployment fixture:

```javascript
async function deployFixture() {
  const [deployer, reg, ent1, ent2, ent3, unauth] = await ethers.getSigners();

  const PrivacyRegulatoryReporting = await ethers.getContractFactory(
    "PrivacyRegulatoryReporting"
  );
  const contractInstance = await PrivacyRegulatoryReporting.deploy(reg.address);
  await contractInstance.waitForDeployment();

  return {
    contract: contractInstance,
    owner: deployer,
    regulator: reg,
    entity1: ent1,
    // ...
  };
}

beforeEach(async function () {
  const deployed = await deployFixture();
  contract = deployed.contract;
  // ...
});
```

**Benefits**:
- Isolated test environments
- No state pollution between tests
- Consistent initial state

### Pattern 2: Multi-Signer Setup

Tests use multiple signers for role-based testing:

```javascript
let owner;        // Contract owner
let regulator;    // Regulatory authority
let entity1;      // Authorized reporting entity
let entity2;      // Second entity
let entity3;      // Third entity
let unauthorized; // Unauthorized user
```

### Pattern 3: Event Verification

Tests verify events are emitted correctly:

```javascript
await expect(
  contract.connect(regulator).authorizeEntity(entity1.address)
).to.emit(contract, "EntityAuthorized")
  .withArgs(entity1.address);
```

### Pattern 4: Access Control Testing

Tests verify permissions are enforced:

```javascript
// Should succeed
await expect(
  contract.connect(regulator).authorizeEntity(entity1.address)
).to.not.be.reverted;

// Should fail
await expect(
  contract.connect(entity1).authorizeEntity(entity2.address)
).to.be.revertedWith("Only regulator can perform this action");
```

### Pattern 5: State Verification

Tests verify state changes after operations:

```javascript
// Before state
expect(await contract.isAuthorizedEntity(entity1.address)).to.be.false;

// Perform operation
await contract.connect(regulator).authorizeEntity(entity1.address);

// After state
expect(await contract.isAuthorizedEntity(entity1.address)).to.be.true;
```

### Pattern 6: Boundary Testing

Tests check edge cases and limits:

```javascript
// Zero values
await contract.submitConfidentialReport(0, 0, 0, 1);

// Maximum values
const maxUint32 = 4294967295;
await contract.submitConfidentialReport(1000000, maxUint32, 100, 1);
```

---

## Writing New Tests

### Test Structure Template

```javascript
describe("Feature Name", function () {
  beforeEach(async function () {
    // Setup for this test group
  });

  it("should perform expected behavior", async function () {
    // 1. Arrange - Set up test data
    const testValue = 100;

    // 2. Act - Execute the function
    await contract.someFunction(testValue);

    // 3. Assert - Verify results
    expect(await contract.getValue()).to.equal(testValue);
  });

  it("should reject invalid input", async function () {
    await expect(
      contract.someFunction(invalidValue)
    ).to.be.revertedWith("Error message");
  });
});
```

### Best Practices

#### 1. Test Naming

✅ **Good**: Descriptive and clear
```javascript
it("should reject submission from unauthorized entity", async function () {});
it("should emit ReportSubmitted event when report is submitted", async function () {});
```

❌ **Bad**: Vague or unclear
```javascript
it("test1", async function () {});
it("works", async function () {});
```

#### 2. Assertions

✅ **Good**: Explicit expectations
```javascript
expect(value).to.equal(100);
expect(address).to.equal(entity1.address);
expect(isActive).to.be.true;
```

❌ **Bad**: Vague assertions
```javascript
expect(value).to.be.ok;
expect(result).to.exist;
```

#### 3. Error Testing

✅ **Good**: Test specific error messages
```javascript
await expect(
  contract.connect(unauthorized).ownerFunction()
).to.be.revertedWith("Only owner can perform this action");
```

#### 4. Test Independence

✅ **Good**: Each test is self-contained
```javascript
beforeEach(async function () {
  ({ contract, owner, regulator } = await deployFixture());
});
```

❌ **Bad**: Tests depend on execution order

#### 5. Setup and Teardown

✅ **Good**: Use beforeEach for common setup
```javascript
beforeEach(async function () {
  await contract.connect(regulator).authorizeEntity(entity1.address);
});
```

---

## Gas Reporting

### Enable Gas Reporting

```bash
REPORT_GAS=true npm test
```

### Gas Benchmarks

| Function | Estimated Gas | Target |
|----------|---------------|--------|
| authorizeEntity | ~50-80k | <100k |
| submitConfidentialReport | ~300-400k | <500k |
| verifyReport | ~50-80k | <100k |
| createReportingPeriod | ~150-200k | <250k |

### Gas Optimization Tips

1. Use `calldata` instead of `memory` for read-only arrays
2. Pack struct variables efficiently
3. Use events instead of storing logs on-chain
4. Batch operations when possible
5. Avoid redundant storage reads

---

## Continuous Integration

### CI Test Script

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run compile
      - run: npm test
      - run: npm run test:coverage
```

---

## Troubleshooting

### Common Issues

#### 1. Tests Timeout

**Issue**: Tests take too long to execute

**Solution**: Increase timeout in test
```javascript
it("should work", async function () {
  this.timeout(60000); // 60 seconds
  // test code
});
```

#### 2. Deployment Fails

**Issue**: Contract deployment reverts

**Solution**: Check constructor parameters
```javascript
// Ensure valid regulator address
expect(regulatorAddress).to.not.equal(ethers.ZeroAddress);
```

#### 3. Inconsistent Test Results

**Issue**: Tests pass/fail randomly

**Solution**: Use `beforeEach` to ensure clean state
```javascript
beforeEach(async function () {
  ({ contract } = await deployFixture());
});
```

---

## Additional Resources

### Documentation

- [Hardhat Testing](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)
- [Chai Assertions](https://www.chaijs.com/api/bdd/)
- [Ethers.js Testing](https://docs.ethers.org/v6/api/providers/)

### Example Tests

- **Basic Tests**: See `test/PrivacyRegulatoryReporting.test.js`
- **Access Control**: Lines 80-130
- **State Verification**: Lines 200-250
- **Edge Cases**: Lines 450-500

---

## Summary

This test suite provides comprehensive coverage of the Privacy-Preserving Regulatory Reporting System with 65+ test cases covering:

✅ **Deployment and Initialization** - 8 tests
✅ **Entity Authorization** - 8 tests
✅ **Reporting Periods** - 7 tests
✅ **Report Submission** - 10 tests
✅ **Verification** - 7 tests
✅ **Access Control** - 4 tests
✅ **View Functions** - 5 tests
✅ **Owner Operations** - 3 tests
✅ **Edge Cases** - 5 tests
✅ **Gas Optimization** - 3 tests

**Total**: 60+ test cases ensuring robust contract behavior and security.

For questions or issues, please refer to the main [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md).
