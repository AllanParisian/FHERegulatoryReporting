/**
 * Privacy-Preserving Regulatory Reporting System
 * Comprehensive Test Suite - Mock Environment
 *
 * This test suite covers:
 * - Deployment and initialization
 * - Entity authorization management
 * - Reporting period lifecycle
 * - Confidential report submission
 * - Report verification and processing
 * - Access control and permissions
 * - Edge cases and boundary conditions
 * - Gas optimization
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivacyRegulatoryReporting", function () {
  let contract;
  let owner;
  let regulator;
  let entity1;
  let entity2;
  let entity3;
  let unauthorized;

  // Deploy fixture
  async function deployFixture() {
    const [deployer, reg, ent1, ent2, ent3, unauth] = await ethers.getSigners();

    const PrivacyRegulatoryReporting = await ethers.getContractFactory(
      "PrivacyRegulatoryReporting"
    );
    const contractInstance = await PrivacyRegulatoryReporting.deploy(reg.address);
    await contractInstance.waitForDeployment();

    const contractAddress = await contractInstance.getAddress();

    return {
      contract: contractInstance,
      contractAddress,
      owner: deployer,
      regulator: reg,
      entity1: ent1,
      entity2: ent2,
      entity3: ent3,
      unauthorized: unauth
    };
  }

  beforeEach(async function () {
    const deployed = await deployFixture();
    contract = deployed.contract;
    owner = deployed.owner;
    regulator = deployed.regulator;
    entity1 = deployed.entity1;
    entity2 = deployed.entity2;
    entity3 = deployed.entity3;
    unauthorized = deployed.unauthorized;
  });

  // ========================================
  // Deployment and Initialization Tests
  // ========================================
  describe("Deployment and Initialization", function () {
    it("should deploy successfully with valid parameters", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("should set owner correctly", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should set regulator correctly", async function () {
      expect(await contract.regulator()).to.equal(regulator.address);
    });

    it("should initialize report counter to zero", async function () {
      expect(await contract.reportCounter()).to.equal(0);
    });

    it("should create initial reporting period", async function () {
      const currentPeriod = await contract.currentPeriod();
      expect(currentPeriod).to.equal(1);

      const periodInfo = await contract.getPeriodInfo(1);
      expect(periodInfo[2]).to.be.true; // active
      expect(periodInfo[4]).to.equal(0); // totalSubmissions
    });

    it("should set submission window to 30 days", async function () {
      const submissionWindow = await contract.submissionWindow();
      expect(submissionWindow).to.equal(30 * 24 * 60 * 60);
    });

    it("should have zero authorized entities initially", async function () {
      const isAuthorized = await contract.isAuthorizedEntity(entity1.address);
      expect(isAuthorized).to.be.false;
    });

    it("should revert when deployed with zero regulator address", async function () {
      const PrivacyRegulatoryReporting = await ethers.getContractFactory(
        "PrivacyRegulatoryReporting"
      );

      await expect(
        PrivacyRegulatoryReporting.deploy(ethers.ZeroAddress)
      ).to.be.reverted;
    });
  });

  // ========================================
  // Entity Authorization Tests
  // ========================================
  describe("Entity Authorization Management", function () {
    it("should allow regulator to authorize entity", async function () {
      await expect(
        contract.connect(regulator).authorizeEntity(entity1.address)
      ).to.emit(contract, "EntityAuthorized")
        .withArgs(entity1.address);

      const isAuthorized = await contract.isAuthorizedEntity(entity1.address);
      expect(isAuthorized).to.be.true;
    });

    it("should allow regulator to authorize multiple entities", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);
      await contract.connect(regulator).authorizeEntity(entity2.address);
      await contract.connect(regulator).authorizeEntity(entity3.address);

      expect(await contract.isAuthorizedEntity(entity1.address)).to.be.true;
      expect(await contract.isAuthorizedEntity(entity2.address)).to.be.true;
      expect(await contract.isAuthorizedEntity(entity3.address)).to.be.true;
    });

    it("should allow regulator to revoke entity authorization", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      await expect(
        contract.connect(regulator).revokeEntity(entity1.address)
      ).to.emit(contract, "EntityRevoked")
        .withArgs(entity1.address);

      const isAuthorized = await contract.isAuthorizedEntity(entity1.address);
      expect(isAuthorized).to.be.false;
    });

    it("should reject authorization from non-regulator", async function () {
      await expect(
        contract.connect(entity1).authorizeEntity(entity2.address)
      ).to.be.revertedWith("Only regulator can perform this action");
    });

    it("should reject revocation from non-regulator", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      await expect(
        contract.connect(entity1).revokeEntity(entity1.address)
      ).to.be.revertedWith("Only regulator can perform this action");
    });

    it("should reject authorization from owner", async function () {
      await expect(
        contract.connect(owner).authorizeEntity(entity1.address)
      ).to.be.revertedWith("Only regulator can perform this action");
    });

    it("should handle re-authorization of same entity", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);
      await contract.connect(regulator).authorizeEntity(entity1.address);

      expect(await contract.isAuthorizedEntity(entity1.address)).to.be.true;
    });

    it("should handle revocation of non-authorized entity", async function () {
      await expect(
        contract.connect(regulator).revokeEntity(entity1.address)
      ).to.emit(contract, "EntityRevoked");

      expect(await contract.isAuthorizedEntity(entity1.address)).to.be.false;
    });
  });

  // ========================================
  // Reporting Period Management Tests
  // ========================================
  describe("Reporting Period Management", function () {
    it("should allow regulator to create new reporting period", async function () {
      const duration = 90 * 24 * 60 * 60; // 90 days
      const submissionDeadline = 30; // 30 days

      await expect(
        contract.connect(regulator).createReportingPeriod(duration, submissionDeadline)
      ).to.emit(contract, "ReportingPeriodCreated");

      const currentPeriod = await contract.currentPeriod();
      expect(currentPeriod).to.equal(2);
    });

    it("should set correct period parameters", async function () {
      const duration = 60 * 24 * 60 * 60; // 60 days
      const submissionDeadline = 20; // 20 days

      await contract.connect(regulator).createReportingPeriod(duration, submissionDeadline);

      const periodInfo = await contract.getPeriodInfo(2);
      expect(periodInfo[2]).to.be.true; // active
      expect(periodInfo[4]).to.equal(0); // no submissions yet
    });

    it("should allow regulator to close reporting period", async function () {
      await contract.connect(regulator).closePeriod(1);

      const periodInfo = await contract.getPeriodInfo(1);
      expect(periodInfo[2]).to.be.false; // not active
    });

    it("should reject period creation from non-regulator", async function () {
      await expect(
        contract.connect(entity1).createReportingPeriod(90 * 24 * 60 * 60, 30)
      ).to.be.revertedWith("Only regulator can perform this action");
    });

    it("should reject period closure from non-regulator", async function () {
      await expect(
        contract.connect(entity1).closePeriod(1)
      ).to.be.revertedWith("Only regulator can perform this action");
    });

    it("should reject closing already closed period", async function () {
      await contract.connect(regulator).closePeriod(1);

      await expect(
        contract.connect(regulator).closePeriod(1)
      ).to.be.revertedWith("Period already closed");
    });

    it("should retrieve current period correctly", async function () {
      const currentPeriod = await contract.getCurrentPeriod();
      expect(currentPeriod).to.equal(1);

      await contract.connect(regulator).createReportingPeriod(90 * 24 * 60 * 60, 30);

      const newCurrentPeriod = await contract.getCurrentPeriod();
      expect(newCurrentPeriod).to.equal(2);
    });
  });

  // ========================================
  // Report Submission Tests
  // ========================================
  describe("Confidential Report Submission", function () {
    beforeEach(async function () {
      // Authorize entity1 for these tests
      await contract.connect(regulator).authorizeEntity(entity1.address);
    });

    it("should allow authorized entity to submit report", async function () {
      const totalAmount = 1000000;
      const transactionCount = 150;
      const riskScore = 35;
      const periodId = 1;

      await expect(
        contract.connect(entity1).submitConfidentialReport(
          totalAmount,
          transactionCount,
          riskScore,
          periodId
        )
      ).to.emit(contract, "ReportSubmitted")
        .withArgs(entity1.address, 1, periodId);

      const totalReports = await contract.getTotalReports();
      expect(totalReports).to.equal(1);
    });

    it("should store report with correct metadata", async function () {
      await contract.connect(entity1).submitConfidentialReport(
        1000000,
        150,
        35,
        1
      );

      const reportInfo = await contract.getReportInfo(1);
      expect(reportInfo[0]).to.equal(entity1.address); // submitter
      expect(reportInfo[2]).to.equal(1); // reportPeriod
      expect(reportInfo[3]).to.be.false; // not verified
      expect(reportInfo[4]).to.be.false; // not processed
    });

    it("should increment report counter", async function () {
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);
      expect(await contract.reportCounter()).to.equal(1);

      await contract.connect(entity1).submitConfidentialReport(2000000, 200, 50, 1);
      expect(await contract.reportCounter()).to.equal(2);
    });

    it("should reject submission from unauthorized entity", async function () {
      await expect(
        contract.connect(entity2).submitConfidentialReport(1000000, 150, 35, 1)
      ).to.be.revertedWith("Not authorized to submit reports");
    });

    it("should reject duplicate submission in same period", async function () {
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);

      await expect(
        contract.connect(entity1).submitConfidentialReport(2000000, 200, 50, 1)
      ).to.be.revertedWith("Already submitted for this period");
    });

    it("should reject risk score above 100", async function () {
      await expect(
        contract.connect(entity1).submitConfidentialReport(1000000, 150, 101, 1)
      ).to.be.revertedWith("Risk score must be between 0-100");
    });

    it("should accept risk score of exactly 100", async function () {
      await expect(
        contract.connect(entity1).submitConfidentialReport(1000000, 150, 100, 1)
      ).to.not.be.reverted;
    });

    it("should accept risk score of 0", async function () {
      await expect(
        contract.connect(entity1).submitConfidentialReport(1000000, 150, 0, 1)
      ).to.not.be.reverted;
    });

    it("should track submission status per entity per period", async function () {
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);

      const hasSubmitted = await contract.hasEntitySubmitted(entity1.address, 1);
      expect(hasSubmitted).to.be.true;

      const hasNotSubmitted = await contract.hasEntitySubmitted(entity2.address, 1);
      expect(hasNotSubmitted).to.be.false;
    });

    it("should update period submission count", async function () {
      await contract.connect(regulator).authorizeEntity(entity2.address);

      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);
      await contract.connect(entity2).submitConfidentialReport(2000000, 200, 50, 1);

      const periodInfo = await contract.getPeriodInfo(1);
      expect(periodInfo[4]).to.equal(2); // totalSubmissions
    });
  });

  // ========================================
  // Report Verification Tests
  // ========================================
  describe("Report Verification", function () {
    beforeEach(async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);
    });

    it("should allow regulator to verify report", async function () {
      await expect(
        contract.connect(regulator).verifyReport(1)
      ).to.emit(contract, "ReportVerified")
        .withArgs(1, regulator.address);

      const reportInfo = await contract.getReportInfo(1);
      expect(reportInfo[3]).to.be.true; // verified
    });

    it("should reject verification from non-regulator", async function () {
      await expect(
        contract.connect(entity1).verifyReport(1)
      ).to.be.revertedWith("Only regulator can perform this action");
    });

    it("should reject verification of invalid report ID", async function () {
      await expect(
        contract.connect(regulator).verifyReport(999)
      ).to.be.revertedWith("Invalid report ID");
    });

    it("should reject verification of already verified report", async function () {
      await contract.connect(regulator).verifyReport(1);

      await expect(
        contract.connect(regulator).verifyReport(1)
      ).to.be.revertedWith("Report already verified");
    });

    it("should allow processing of verified report", async function () {
      await contract.connect(regulator).verifyReport(1);

      await expect(
        contract.connect(regulator).processReport(1)
      ).to.not.be.reverted;

      const reportInfo = await contract.getReportInfo(1);
      expect(reportInfo[4]).to.be.true; // processed
    });

    it("should reject processing of unverified report", async function () {
      await expect(
        contract.connect(regulator).processReport(1)
      ).to.be.revertedWith("Report not verified");
    });

    it("should reject processing of already processed report", async function () {
      await contract.connect(regulator).verifyReport(1);
      await contract.connect(regulator).processReport(1);

      await expect(
        contract.connect(regulator).processReport(1)
      ).to.be.revertedWith("Report already processed");
    });
  });

  // ========================================
  // Decryption Access Control Tests
  // ========================================
  describe("Decryption Access Control", function () {
    beforeEach(async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);
      await contract.connect(regulator).verifyReport(1);
    });

    it("should allow regulator to grant decryption access", async function () {
      await expect(
        contract.connect(regulator).grantDecryptionAccess(1, entity2.address)
      ).to.not.be.reverted;
    });

    it("should reject granting access to zero address", async function () {
      await expect(
        contract.connect(regulator).grantDecryptionAccess(1, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid analyst address");
    });

    it("should reject granting access for unverified report", async function () {
      await contract.connect(entity1).submitConfidentialReport(2000000, 200, 50, 1);

      await expect(
        contract.connect(regulator).grantDecryptionAccess(2, entity2.address)
      ).to.be.revertedWith("Report must be verified first");
    });

    it("should reject granting access from non-regulator", async function () {
      await expect(
        contract.connect(entity1).grantDecryptionAccess(1, entity2.address)
      ).to.be.revertedWith("Only regulator can perform this action");
    });
  });

  // ========================================
  // View Functions Tests
  // ========================================
  describe("View Functions", function () {
    it("should retrieve report information correctly", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);

      const reportInfo = await contract.getReportInfo(1);
      expect(reportInfo[0]).to.equal(entity1.address);
      expect(reportInfo[2]).to.equal(1);
    });

    it("should retrieve period information correctly", async function () {
      const periodInfo = await contract.getPeriodInfo(1);
      expect(periodInfo[2]).to.be.true; // active
    });

    it("should get total reports count", async function () {
      expect(await contract.getTotalReports()).to.equal(0);

      await contract.connect(regulator).authorizeEntity(entity1.address);
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);

      expect(await contract.getTotalReports()).to.equal(1);
    });

    it("should get submission deadline for period", async function () {
      const deadline = await contract.getSubmissionDeadline(1);
      expect(deadline).to.be.gt(0);
    });

    it("should check if entity has submitted", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      expect(await contract.hasEntitySubmitted(entity1.address, 1)).to.be.false;

      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);

      expect(await contract.hasEntitySubmitted(entity1.address, 1)).to.be.true;
    });
  });

  // ========================================
  // Owner Functions Tests
  // ========================================
  describe("Owner Functions", function () {
    it("should allow owner to update regulator", async function () {
      const newRegulator = entity2.address;

      await expect(
        contract.connect(owner).updateRegulator(newRegulator)
      ).to.not.be.reverted;

      expect(await contract.regulator()).to.equal(newRegulator);
    });

    it("should reject regulator update with zero address", async function () {
      await expect(
        contract.connect(owner).updateRegulator(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid regulator address");
    });

    it("should reject regulator update from non-owner", async function () {
      await expect(
        contract.connect(entity1).updateRegulator(entity2.address)
      ).to.be.revertedWith("Only owner can perform this action");
    });
  });

  // ========================================
  // Edge Cases and Boundary Conditions
  // ========================================
  describe("Edge Cases and Boundary Conditions", function () {
    it("should handle zero values for amounts and counts", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      await expect(
        contract.connect(entity1).submitConfidentialReport(0, 0, 0, 1)
      ).to.not.be.reverted;
    });

    it("should handle maximum risk score value", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      await expect(
        contract.connect(entity1).submitConfidentialReport(1000000, 150, 100, 1)
      ).to.not.be.reverted;
    });

    it("should handle large transaction counts", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      const maxUint32 = 4294967295;
      await expect(
        contract.connect(entity1).submitConfidentialReport(1000000, maxUint32, 50, 1)
      ).to.not.be.reverted;
    });

    it("should handle multiple periods with same entity", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      // Submit in period 1
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);

      // Create period 2
      await contract.connect(regulator).createReportingPeriod(90 * 24 * 60 * 60, 30);

      // Submit in period 2
      await expect(
        contract.connect(entity1).submitConfidentialReport(2000000, 200, 50, 2)
      ).to.not.be.reverted;
    });

    it("should maintain separate submission tracking per period", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);
      await contract.connect(regulator).createReportingPeriod(90 * 24 * 60 * 60, 30);

      expect(await contract.hasEntitySubmitted(entity1.address, 1)).to.be.true;
      expect(await contract.hasEntitySubmitted(entity1.address, 2)).to.be.false;
    });
  });

  // ========================================
  // Gas Optimization Tests
  // ========================================
  describe("Gas Optimization", function () {
    it("should authorize entity efficiently", async function () {
      const tx = await contract.connect(regulator).authorizeEntity(entity1.address);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(100000); // Should use less than 100k gas
    });

    it("should submit report efficiently", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);

      const tx = await contract.connect(entity1).submitConfidentialReport(
        1000000,
        150,
        35,
        1
      );
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(500000); // Should use less than 500k gas
    });

    it("should verify report efficiently", async function () {
      await contract.connect(regulator).authorizeEntity(entity1.address);
      await contract.connect(entity1).submitConfidentialReport(1000000, 150, 35, 1);

      const tx = await contract.connect(regulator).verifyReport(1);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(100000); // Should use less than 100k gas
    });
  });
});
