# CI/CD Documentation

## Privacy-Preserving Regulatory Reporting System

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Privacy-Preserving Regulatory Reporting System.

---

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Code Quality Tools](#code-quality-tools)
- [Coverage Reporting](#coverage-reporting)
- [Deployment Pipeline](#deployment-pipeline)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Overview

The CI/CD pipeline is built using **GitHub Actions** and includes:

✅ **Automated Testing** - Runs on every push and pull request
✅ **Code Quality Checks** - Linting with Solhint and Prettier
✅ **Coverage Reporting** - Integration with Codecov
✅ **Multi-Version Testing** - Tests on Node.js 18.x and 20.x
✅ **Security Scanning** - npm audit for vulnerabilities
✅ **Automated Deployment** - Manual deployment workflow

### Workflow Triggers

All workflows trigger on:
- **Push to `main` or `develop` branches**
- **Pull requests to `main` or `develop` branches**
- **Manual dispatch** (for deployment)

---

## GitHub Actions Workflows

### 1. Test Workflow (`.github/workflows/test.yml`)

**Purpose**: Run comprehensive tests across multiple Node.js versions

**Jobs**:

#### Test Job
- **Matrix Strategy**: Tests on Node.js 18.x and 20.x
- **Steps**:
  1. Checkout code
  2. Setup Node.js with caching
  3. Install dependencies (`npm ci`)
  4. Check code formatting
  5. Lint Solidity contracts
  6. Compile contracts
  7. Run tests
  8. Upload test results

#### Lint Job
- Check formatting with Prettier
- Lint Solidity with Solhint

#### Build Job
- Compile contracts
- Upload build artifacts

#### Security Job
- Run `npm audit`
- Check for vulnerabilities
- Upload security scan results

**Triggers**:
```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

**Usage**:
```bash
# Runs automatically on push/PR
# Or run locally:
npm run ci
```

### 2. Coverage Workflow (`.github/workflows/coverage.yml`)

**Purpose**: Generate and upload coverage reports to Codecov

**Steps**:
1. Run tests with coverage
2. Upload coverage to Codecov
3. Generate coverage report in PR comments
4. Upload coverage artifacts

**Requirements**:
- `CODECOV_TOKEN` secret must be configured in repository settings

**Codecov Integration**:
```yaml
- uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
```

**Coverage Badges**:

Add to README.md:
```markdown
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO)
```

### 3. Deploy Workflow (`.github/workflows/deploy.yml`)

**Purpose**: Manual deployment to Sepolia or local network

**Trigger**: Manual workflow dispatch

**Inputs**:
- `network`: Choice of `sepolia` or `localhost`

**Required Secrets**:
- `SEPOLIA_RPC_URL`: Sepolia RPC endpoint
- `PRIVATE_KEY`: Deployer private key
- `REGULATOR_ADDRESS`: Regulator address
- `ETHERSCAN_API_KEY`: Etherscan API key

**Steps**:
1. Compile contracts
2. Deploy to selected network
3. Verify on Etherscan (if Sepolia)
4. Upload deployment artifacts
5. Create deployment summary

**Usage**:
```
1. Go to Actions tab in GitHub
2. Select "Deploy" workflow
3. Click "Run workflow"
4. Choose network (sepolia/localhost)
5. Click "Run workflow"
```

---

## Code Quality Tools

### Solhint (Solidity Linter)

**Configuration**: `.solhint.json`

**Rules**:
- Compiler version: `^0.8.24`
- Max line length: 120 characters
- Constructor syntax enforcement
- Naming conventions
- Visibility modifiers
- Import ordering

**Commands**:
```bash
# Lint Solidity files
npm run lint:sol

# Fix auto-fixable issues
npm run lint:fix

# Run all linting
npm run lint
```

**Configuration**:
```json
{
  "extends": "solhint:recommended",
  "rules": {
    "compiler-version": ["error", "^0.8.24"],
    "max-line-length": ["warn", 120],
    "constructor-syntax": "error",
    "contract-name-camelcase": "error"
  }
}
```

### Prettier (Code Formatter)

**Configuration**: `.prettierrc.json`

**Settings**:
- Print width: 100 characters (JS), 120 (Solidity)
- Tab width: 2 spaces (JS), 4 (Solidity)
- Single quotes: No
- Trailing commas: ES5
- Semicolons: Yes

**Commands**:
```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check
```

**Prettier Overrides**:
```json
{
  "overrides": [
    {
      "files": "*.sol",
      "options": {
        "printWidth": 120,
        "tabWidth": 4
      }
    }
  ]
}
```

---

## Coverage Reporting

### Solidity Coverage

**Tool**: `solidity-coverage`

**Configuration**: `hardhat.config.js`

**Generate Coverage**:
```bash
npm run test:coverage
```

**Output**:
- `coverage/` - HTML coverage report
- `coverage/lcov.info` - LCOV format for Codecov
- `coverage/coverage-summary.json` - JSON summary

**Coverage Metrics**:
| Metric | Description |
|--------|-------------|
| Lines | Percentage of code lines executed |
| Statements | Percentage of statements executed |
| Functions | Percentage of functions called |
| Branches | Percentage of branches taken |

**Target Coverage**:
- Lines: >80%
- Statements: >80%
- Functions: >90%
- Branches: >75%

### Codecov Integration

**Configuration**: `codecov.yml`

```yaml
coverage:
  precision: 2
  round: down
  range: "70...100"
  status:
    project:
      default:
        target: auto
        threshold: 1%
```

**Setup Steps**:

1. **Sign up for Codecov**
   - Go to https://codecov.io
   - Sign in with GitHub
   - Authorize repository access

2. **Get Codecov Token**
   - Navigate to repository settings in Codecov
   - Copy the upload token

3. **Add Secret to GitHub**
   - Go to GitHub repository settings
   - Navigate to Secrets and variables → Actions
   - Add new secret: `CODECOV_TOKEN`
   - Paste Codecov token

4. **Coverage Uploads Automatically**
   - On every push/PR, coverage is uploaded
   - View reports at: https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO

---

## Deployment Pipeline

### Manual Deployment Workflow

**Workflow File**: `.github/workflows/deploy.yml`

**Steps to Deploy**:

1. **Navigate to Actions**
   ```
   GitHub Repository → Actions → Deploy
   ```

2. **Run Workflow**
   - Click "Run workflow"
   - Select network (sepolia/localhost)
   - Click "Run workflow" button

3. **Monitor Progress**
   - Watch workflow execution in real-time
   - Check each step for success/failure

4. **Verify Deployment**
   - Download deployment artifacts
   - Check deployment summary
   - Verify on Etherscan (if Sepolia)

### Deployment Secrets

Configure in GitHub repository settings (Settings → Secrets and variables → Actions):

| Secret | Description | Example |
|--------|-------------|---------|
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint | `https://sepolia.infura.io/v3/...` |
| `PRIVATE_KEY` | Deployer private key | `1234567890abcdef...` |
| `REGULATOR_ADDRESS` | Regulator address | `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` |
| `ETHERSCAN_API_KEY` | Etherscan API key | `ABC123XYZ456...` |
| `CODECOV_TOKEN` | Codecov upload token | `abcd-1234-efgh-5678` |

### Deployment Artifacts

After successful deployment:

- **Artifact Name**: `deployment-{network}`
- **Contents**: `deployments/` directory
- **Retention**: 90 days
- **Download**: From GitHub Actions workflow run

---

## Configuration

### Environment Variables

**.env.example** - Template for local development
```bash
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key
REGULATOR_ADDRESS=0x...
ETHERSCAN_API_KEY=your_api_key
```

### GitHub Actions Permissions

**Required Permissions**:
```yaml
permissions:
  contents: read  # Read repository contents
  issues: write   # Comment on issues/PRs (for coverage reports)
```

### Branch Protection Rules

**Recommended Settings** (Settings → Branches → Add rule):

For `main` branch:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - Required checks: `Test on Node.js 18.x`, `Test on Node.js 20.x`, `Code Quality Checks`
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

---

## Troubleshooting

### Common Issues

#### 1. Tests Fail in CI but Pass Locally

**Symptoms**: Tests pass on local machine but fail in GitHub Actions

**Solutions**:
```bash
# Ensure dependencies are locked
npm ci

# Test with same Node version as CI
nvm use 20
npm test

# Check for environment-specific issues
CI=true npm test
```

#### 2. Coverage Upload Fails

**Symptoms**: Codecov upload step fails

**Solutions**:
- Verify `CODECOV_TOKEN` secret is set correctly
- Check token permissions in Codecov dashboard
- Ensure coverage files are generated: `coverage/lcov.info`

```bash
# Test coverage generation locally
npm run test:coverage
ls -la coverage/
```

#### 3. Solhint Errors

**Symptoms**: Linting fails in CI

**Solutions**:
```bash
# Run linting locally
npm run lint:sol

# Auto-fix issues
npm run lint:fix

# Check specific file
npx solhint contracts/YourContract.sol
```

#### 4. Deployment Fails

**Symptoms**: Deployment workflow fails

**Solutions**:
- Verify all secrets are configured
- Check RPC URL is accessible
- Ensure deployer has sufficient funds
- Verify regulator address is valid

```bash
# Test deployment locally
npm run deploy:local

# Check environment variables
node -e "require('dotenv').config(); console.log(process.env.SEPOLIA_RPC_URL)"
```

#### 5. Prettier Formatting Conflicts

**Symptoms**: Formatting check fails

**Solutions**:
```bash
# Format all files
npm run format

# Check what would change
npm run format:check

# Format specific file
npx prettier --write contracts/YourContract.sol
```

### Debug Mode

Enable debug logging in workflows:

```yaml
- name: Run tests
  run: npm test
  env:
    DEBUG: '*'
    NODE_OPTIONS: '--max-old-space-size=4096'
```

### Workflow Logs

**Access Logs**:
1. Go to Actions tab
2. Select workflow run
3. Click on job
4. Expand step to view logs

**Download Logs**:
- Click "..." menu in workflow run
- Select "Download log archive"

---

## Best Practices

### 1. Commit Messages

Follow conventional commits:
```
feat: add new reporting feature
fix: resolve authorization bug
docs: update CI/CD documentation
test: add edge case tests
ci: update Node.js version matrix
```

### 2. Pull Request Workflow

1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch and create PR
4. Wait for CI checks to pass
5. Request review
6. Merge after approval and green CI

### 3. Version Management

Use semantic versioning:
```bash
# Update version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 4. Dependency Updates

Regularly update dependencies:
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions
npx npm-check-updates -u
npm install
```

### 5. Security

- Never commit `.env` files
- Use GitHub Secrets for sensitive data
- Rotate access tokens regularly
- Enable Dependabot alerts
- Review security advisories

---

## Metrics and Monitoring

### CI/CD Dashboard

Monitor workflow metrics:
- Workflow success rate
- Average execution time
- Test pass rate
- Coverage trends
- Security scan results

### GitHub Insights

View in GitHub repository:
- Actions → View workflow runs
- Insights → Community standards
- Security → Security advisories

---

## Additional Resources

### Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Codecov Documentation](https://docs.codecov.com/)
- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Tools

- [Act - Run GitHub Actions Locally](https://github.com/nektos/act)
- [GitHub CLI](https://cli.github.com/)
- [Hardhat Documentation](https://hardhat.org/docs)

---

## Summary

The Privacy-Preserving Regulatory Reporting System includes a comprehensive CI/CD pipeline with:

✅ **3 GitHub Actions workflows** (test, coverage, deploy)
✅ **Multi-version testing** (Node.js 18.x, 20.x)
✅ **Code quality checks** (Solhint, Prettier)
✅ **Coverage reporting** (Codecov integration)
✅ **Security scanning** (npm audit)
✅ **Automated deployment** (manual trigger)
✅ **Complete documentation** (this file)

All workflows run automatically on push/PR to `main` or `develop` branches, ensuring code quality and test coverage before merging.

For deployment, use the manual workflow dispatch from the GitHub Actions tab.

---

**Last Updated**: 2025-01-15
**CI/CD Version**: 1.0.0
