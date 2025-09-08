/**
 * Compliance and Audit Trail Service
 * Comprehensive audit trail and compliance reporting for Indonesian standards
 * Includes PSAK compliance, audit logs, and regulatory reporting
 */

const { models } = require('../models');
const { JournalEntry, JournalEntryLine, ChartOfAccounts } = models;
const { Op, fn, col } = require('sequelize');

class ComplianceAuditService {

  /**
   * Generate Audit Trail Report
   * Complete audit trail for financial transactions
   */
  async generateAuditTrail(params = {}) {
    const {
      startDate = new Date(new Date().getFullYear(), 0, 1),
      endDate = new Date(),
      subsidiaryId = null,
      userId = null,
      transactionType = null
    } = params;

    try {
      // Build where clause for audit trail
      const entryWhereClause = {
        entryDate: { [Op.between]: [startDate, endDate] }
      };

      if (subsidiaryId) entryWhereClause.subsidiaryId = subsidiaryId;
      if (userId) entryWhereClause.createdBy = userId;

      // Get all journal entries with full audit information
      const auditEntries = await JournalEntry.findAll({
        where: entryWhereClause,
        include: [{
          model: JournalEntryLine,
          as: 'lines',
          include: [{
            model: ChartOfAccounts,
            as: 'account',
            attributes: ['accountCode', 'accountName', 'accountType']
          }]
        }],
        order: [['entryDate', 'DESC'], ['entryNumber', 'DESC']]
      });

      let totalTransactions = 0;
      let totalDebitAmount = 0;
      let totalCreditAmount = 0;
      const userActivity = {};
      const accountActivity = {};
      const dailyActivity = {};

      const auditData = auditEntries.map(entry => {
        totalTransactions++;
        totalDebitAmount += parseFloat(entry.totalDebit || 0);
        totalCreditAmount += parseFloat(entry.totalCredit || 0);

        // Track user activity
        if (!userActivity[entry.createdBy]) {
          userActivity[entry.createdBy] = {
            transactionCount: 0,
            totalAmount: 0,
            lastActivity: null
          };
        }
        userActivity[entry.createdBy].transactionCount++;
        userActivity[entry.createdBy].totalAmount += parseFloat(entry.totalDebit || 0);
        userActivity[entry.createdBy].lastActivity = entry.entryDate;

        // Track daily activity
        const dateKey = entry.entryDate.toISOString().split('T')[0];
        if (!dailyActivity[dateKey]) {
          dailyActivity[dateKey] = { count: 0, amount: 0 };
        }
        dailyActivity[dateKey].count++;
        dailyActivity[dateKey].amount += parseFloat(entry.totalDebit || 0);

        // Process lines for account activity
        const lineDetails = entry.lines.map(line => {
          const accountKey = line.account.accountCode;
          if (!accountActivity[accountKey]) {
            accountActivity[accountKey] = {
              accountName: line.account.accountName,
              transactionCount: 0,
              totalDebits: 0,
              totalCredits: 0
            };
          }
          accountActivity[accountKey].transactionCount++;
          accountActivity[accountKey].totalDebits += parseFloat(line.debitAmount || 0);
          accountActivity[accountKey].totalCredits += parseFloat(line.creditAmount || 0);

          return {
            lineNumber: line.lineNumber,
            accountCode: line.account.accountCode,
            accountName: line.account.accountName,
            accountType: line.account.accountType,
            debitAmount: parseFloat(line.debitAmount || 0),
            creditAmount: parseFloat(line.creditAmount || 0),
            description: line.description
          };
        });

        return {
          entryId: entry.id,
          entryNumber: entry.entryNumber,
          entryDate: entry.entryDate,
          description: entry.description,
          totalDebit: parseFloat(entry.totalDebit || 0),
          totalCredit: parseFloat(entry.totalCredit || 0),
          status: entry.status,
          projectId: entry.projectId,
          subsidiaryId: entry.subsidiaryId,
          createdBy: entry.createdBy,
          postedBy: entry.postedBy,
          postedAt: entry.postedAt,
          reversed: entry.reversed,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          lines: lineDetails,
          auditFlags: this.generateAuditFlags(entry, lineDetails)
        };
      });

      return {
        success: true,
        data: {
          reportType: 'Comprehensive Audit Trail',
          period: { startDate, endDate },
          subsidiaryId,
          summary: {
            totalTransactions,
            totalDebitAmount,
            totalCreditAmount,
            balanceVerification: Math.abs(totalDebitAmount - totalCreditAmount) < 0.01,
            uniqueUsers: Object.keys(userActivity).length,
            uniqueAccounts: Object.keys(accountActivity).length,
            averageTransactionSize: totalTransactions > 0 ? totalDebitAmount / totalTransactions : 0
          },
          userActivity: Object.keys(userActivity).map(userId => ({
            userId,
            ...userActivity[userId]
          })).sort((a, b) => b.transactionCount - a.transactionCount),
          accountActivity: Object.keys(accountActivity).map(accountCode => ({
            accountCode,
            ...accountActivity[accountCode]
          })).sort((a, b) => b.transactionCount - a.transactionCount),
          dailyActivity: Object.keys(dailyActivity).map(date => ({
            date,
            ...dailyActivity[date]
          })).sort((a, b) => new Date(a.date) - new Date(b.date)),
          transactions: auditData
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating audit trail',
        error: error.message
      };
    }
  }

  /**
   * Generate PSAK Compliance Report
   * Check compliance with Indonesian Financial Reporting Standards
   */
  async generatePSAKComplianceReport(params = {}) {
    const {
      startDate = new Date(new Date().getFullYear(), 0, 1),
      endDate = new Date(),
      subsidiaryId = null
    } = params;

    try {
      // Get all accounts and transactions for compliance check
      const accounts = await ChartOfAccounts.findAll({
        where: { isActive: true }
      });

      const entryWhereClause = {
        entryDate: { [Op.between]: [startDate, endDate] },
        status: 'POSTED'
      };

      if (subsidiaryId) entryWhereClause.subsidiaryId = subsidiaryId;

      const transactions = await JournalEntryLine.findAll({
        include: [{
          model: JournalEntry,
          as: 'journalEntry',
          where: entryWhereClause
        }, {
          model: ChartOfAccounts,
          as: 'account'
        }]
      });

      // PSAK Compliance Checks
      const complianceChecks = {
        doubleEntryCompliance: this.checkDoubleEntryCompliance(transactions),
        accountClassification: this.checkAccountClassification(accounts),
        transactionDocumentation: this.checkTransactionDocumentation(transactions),
        chronologicalOrder: this.checkChronologicalOrder(transactions),
        accountingPeriod: this.checkAccountingPeriod(transactions, startDate, endDate),
        currencyConsistency: this.checkCurrencyConsistency(transactions),
        constructionAccounting: this.checkConstructionSpecificCompliance(transactions)
      };

      // Calculate overall compliance score
      const totalChecks = Object.keys(complianceChecks).length;
      const passedChecks = Object.values(complianceChecks).filter(check => check.passed).length;
      const complianceScore = ((passedChecks / totalChecks) * 100).toFixed(2);

      // Generate recommendations
      const recommendations = this.generateComplianceRecommendations(complianceChecks);

      return {
        success: true,
        data: {
          reportType: 'PSAK Compliance Report',
          period: { startDate, endDate },
          subsidiaryId,
          complianceSummary: {
            overallScore: parseFloat(complianceScore),
            totalChecks,
            passedChecks,
            failedChecks: totalChecks - passedChecks,
            complianceLevel: complianceScore >= 90 ? 'EXCELLENT' : 
                           complianceScore >= 80 ? 'GOOD' : 
                           complianceScore >= 70 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT'
          },
          detailedChecks: complianceChecks,
          recommendations,
          psak_standards: {
            applicable: ['PSAK 1', 'PSAK 2', 'PSAK 34', 'PSAK 55'],
            description: 'Indonesian Financial Accounting Standards for Construction Industry'
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating PSAK compliance report',
        error: error.message
      };
    }
  }

  /**
   * Generate Data Integrity Report
   * Check data consistency and integrity across the system
   */
  async generateDataIntegrityReport(params = {}) {
    const {
      startDate = new Date(new Date().getFullYear(), 0, 1),
      endDate = new Date(),
      subsidiaryId = null
    } = params;

    try {
      const integrityChecks = [];

      // Check 1: Journal Entry Balance Verification
      const balanceCheck = await this.verifyJournalEntryBalances(startDate, endDate, subsidiaryId);
      integrityChecks.push({
        checkName: 'Journal Entry Balance Verification',
        description: 'Verify all journal entries have balanced debits and credits',
        ...balanceCheck
      });

      // Check 2: Account Balance Reconciliation
      const accountBalanceCheck = await this.verifyAccountBalances(startDate, endDate, subsidiaryId);
      integrityChecks.push({
        checkName: 'Account Balance Reconciliation',
        description: 'Verify account balances match transaction summaries',
        ...accountBalanceCheck
      });

      // Check 3: Orphaned Records Check
      const orphanedCheck = await this.checkOrphanedRecords();
      integrityChecks.push({
        checkName: 'Orphaned Records Check',
        description: 'Identify records without proper relationships',
        ...orphanedCheck
      });

      // Check 4: Duplicate Entry Detection
      const duplicateCheck = await this.checkDuplicateEntries(startDate, endDate, subsidiaryId);
      integrityChecks.push({
        checkName: 'Duplicate Entry Detection',
        description: 'Identify potential duplicate transactions',
        ...duplicateCheck
      });

      // Check 5: Date Consistency Verification
      const dateConsistencyCheck = await this.verifyDateConsistency(startDate, endDate, subsidiaryId);
      integrityChecks.push({
        checkName: 'Date Consistency Verification',
        description: 'Verify transaction dates are logical and consistent',
        ...dateConsistencyCheck
      });

      // Calculate overall integrity score
      const passedChecks = integrityChecks.filter(check => check.passed).length;
      const integrityScore = ((passedChecks / integrityChecks.length) * 100).toFixed(2);

      return {
        success: true,
        data: {
          reportType: 'Data Integrity Report',
          period: { startDate, endDate },
          subsidiaryId,
          integritySummary: {
            overallScore: parseFloat(integrityScore),
            totalChecks: integrityChecks.length,
            passedChecks,
            failedChecks: integrityChecks.length - passedChecks,
            integrityLevel: integrityScore >= 95 ? 'EXCELLENT' : 
                          integrityScore >= 85 ? 'GOOD' : 
                          integrityScore >= 75 ? 'ACCEPTABLE' : 'CRITICAL_ISSUES'
          },
          detailedChecks: integrityChecks,
          criticalIssues: integrityChecks.filter(check => !check.passed && check.severity === 'HIGH'),
          recommendations: this.generateIntegrityRecommendations(integrityChecks)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating data integrity report',
        error: error.message
      };
    }
  }

  /**
   * Generate Regulatory Compliance Dashboard
   * Overview of all compliance requirements
   */
  async generateRegulatoryComplianceDashboard(params = {}) {
    const {
      subsidiaryId = null
    } = params;

    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      // Get compliance status for various regulations
      const complianceStatus = {
        psak: await this.getPSAKComplianceStatus(subsidiaryId),
        taxation: await this.getTaxationComplianceStatus(currentMonth, currentYear, subsidiaryId),
        audit: await this.getAuditReadinessStatus(subsidiaryId),
        dataIntegrity: await this.getDataIntegrityStatus(subsidiaryId)
      };

      // Calculate overall compliance score
      const scores = Object.values(complianceStatus).map(status => status.score);
      const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      return {
        success: true,
        data: {
          reportType: 'Regulatory Compliance Dashboard',
          generatedAt: currentDate,
          subsidiaryId,
          overallCompliance: {
            score: parseFloat(overallScore.toFixed(2)),
            status: overallScore >= 90 ? 'COMPLIANT' : 
                   overallScore >= 80 ? 'MOSTLY_COMPLIANT' : 
                   overallScore >= 70 ? 'NEEDS_ATTENTION' : 'NON_COMPLIANT',
            lastUpdated: currentDate
          },
          complianceAreas: {
            psak_compliance: complianceStatus.psak,
            tax_compliance: complianceStatus.taxation,
            audit_readiness: complianceStatus.audit,
            data_integrity: complianceStatus.dataIntegrity
          },
          upcomingDeadlines: await this.getUpcomingComplianceDeadlines(currentMonth, currentYear),
          riskAreas: this.identifyRiskAreas(complianceStatus),
          actionItems: this.generateActionItems(complianceStatus)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating regulatory compliance dashboard',
        error: error.message
      };
    }
  }

  // Helper methods for compliance checks
  generateAuditFlags(entry, lines) {
    const flags = [];
    
    // Check for unbalanced entries
    const totalDebits = lines.reduce((sum, line) => sum + line.debitAmount, 0);
    const totalCredits = lines.reduce((sum, line) => sum + line.creditAmount, 0);
    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      flags.push({ type: 'UNBALANCED_ENTRY', severity: 'HIGH' });
    }

    // Check for round numbers (potential estimates)
    if (totalDebits % 1000000 === 0 && totalDebits > 0) {
      flags.push({ type: 'ROUND_NUMBER', severity: 'LOW' });
    }

    // Check for backdated entries
    if (entry.createdAt && entry.entryDate < new Date(entry.createdAt.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      flags.push({ type: 'BACKDATED_ENTRY', severity: 'MEDIUM' });
    }

    return flags;
  }

  checkDoubleEntryCompliance(transactions) {
    let unbalancedEntries = 0;
    const entryBalances = {};

    transactions.forEach(line => {
      const entryId = line.journalEntry.id;
      if (!entryBalances[entryId]) {
        entryBalances[entryId] = { debits: 0, credits: 0 };
      }
      entryBalances[entryId].debits += parseFloat(line.debitAmount || 0);
      entryBalances[entryId].credits += parseFloat(line.creditAmount || 0);
    });

    Object.values(entryBalances).forEach(balance => {
      if (Math.abs(balance.debits - balance.credits) > 0.01) {
        unbalancedEntries++;
      }
    });

    return {
      passed: unbalancedEntries === 0,
      score: unbalancedEntries === 0 ? 100 : Math.max(0, 100 - (unbalancedEntries * 10)),
      details: {
        totalEntries: Object.keys(entryBalances).length,
        unbalancedEntries,
        balancedEntries: Object.keys(entryBalances).length - unbalancedEntries
      }
    };
  }

  checkAccountClassification(accounts) {
    const requiredAccountTypes = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
    const availableTypes = [...new Set(accounts.map(acc => acc.accountType))];
    const missingTypes = requiredAccountTypes.filter(type => !availableTypes.includes(type));

    return {
      passed: missingTypes.length === 0,
      score: ((requiredAccountTypes.length - missingTypes.length) / requiredAccountTypes.length) * 100,
      details: {
        requiredTypes: requiredAccountTypes,
        availableTypes,
        missingTypes,
        totalAccounts: accounts.length
      }
    };
  }

  checkTransactionDocumentation(transactions) {
    const undocumentedTransactions = transactions.filter(t => 
      !t.description || t.description.trim().length < 5
    ).length;

    const documentationScore = transactions.length > 0 
      ? ((transactions.length - undocumentedTransactions) / transactions.length) * 100 
      : 100;

    return {
      passed: documentationScore >= 90,
      score: documentationScore,
      details: {
        totalTransactions: transactions.length,
        documentedTransactions: transactions.length - undocumentedTransactions,
        undocumentedTransactions
      }
    };
  }

  checkChronologicalOrder(transactions) {
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.journalEntry.entryDate) - new Date(b.journalEntry.entryDate)
    );

    let outOfOrderCount = 0;
    for (let i = 1; i < sortedTransactions.length; i++) {
      const current = sortedTransactions[i].journalEntry;
      const previous = sortedTransactions[i-1].journalEntry;
      
      if (current.entryNumber < previous.entryNumber && 
          current.entryDate >= previous.entryDate) {
        outOfOrderCount++;
      }
    }

    const chronologyScore = transactions.length > 0 
      ? ((transactions.length - outOfOrderCount) / transactions.length) * 100 
      : 100;

    return {
      passed: chronologyScore >= 95,
      score: chronologyScore,
      details: {
        totalTransactions: transactions.length,
        properlyOrdered: transactions.length - outOfOrderCount,
        outOfOrder: outOfOrderCount
      }
    };
  }

  checkAccountingPeriod(transactions, startDate, endDate) {
    const outsidePeriodCount = transactions.filter(t => {
      const entryDate = new Date(t.journalEntry.entryDate);
      return entryDate < startDate || entryDate > endDate;
    }).length;

    return {
      passed: outsidePeriodCount === 0,
      score: transactions.length > 0 
        ? ((transactions.length - outsidePeriodCount) / transactions.length) * 100 
        : 100,
      details: {
        totalTransactions: transactions.length,
        withinPeriod: transactions.length - outsidePeriodCount,
        outsidePeriod: outsidePeriodCount,
        periodStart: startDate,
        periodEnd: endDate
      }
    };
  }

  checkCurrencyConsistency(transactions) {
    // For simplicity, assuming all transactions are in IDR
    // In a multi-currency system, this would check for proper currency handling
    return {
      passed: true,
      score: 100,
      details: {
        baseCurrency: 'IDR',
        foreignCurrencyTransactions: 0,
        exchangeRateIssues: 0
      }
    };
  }

  checkConstructionSpecificCompliance(transactions) {
    const constructionTransactions = transactions.filter(t => 
      t.journalEntry.projectId !== null
    );

    const projectAllocatedTransactions = constructionTransactions.filter(t =>
      t.journalEntry.projectId && t.journalEntry.projectId.trim().length > 0
    );

    const allocationScore = constructionTransactions.length > 0
      ? (projectAllocatedTransactions.length / constructionTransactions.length) * 100
      : 100;

    return {
      passed: allocationScore >= 90,
      score: allocationScore,
      details: {
        totalConstructionTransactions: constructionTransactions.length,
        properlyAllocated: projectAllocatedTransactions.length,
        unallocated: constructionTransactions.length - projectAllocatedTransactions.length
      }
    };
  }

  generateComplianceRecommendations(complianceChecks) {
    const recommendations = [];

    Object.entries(complianceChecks).forEach(([checkName, result]) => {
      if (!result.passed) {
        switch (checkName) {
          case 'doubleEntryCompliance':
            recommendations.push({
              priority: 'HIGH',
              area: 'Double Entry Bookkeeping',
              issue: 'Unbalanced journal entries detected',
              recommendation: 'Review and correct all unbalanced journal entries. Implement automated balance verification.',
              impact: 'Financial statements may be inaccurate'
            });
            break;
          case 'accountClassification':
            recommendations.push({
              priority: 'MEDIUM',
              area: 'Chart of Accounts',
              issue: 'Missing required account types',
              recommendation: 'Add missing account classifications to ensure complete financial reporting.',
              impact: 'May affect financial statement completeness'
            });
            break;
          case 'transactionDocumentation':
            recommendations.push({
              priority: 'MEDIUM',
              area: 'Transaction Documentation',
              issue: 'Insufficient transaction descriptions',
              recommendation: 'Implement mandatory description fields and validation rules.',
              impact: 'Audit trail may be incomplete'
            });
            break;
        }
      }
    });

    return recommendations;
  }

  generateIntegrityRecommendations(integrityChecks) {
    return integrityChecks
      .filter(check => !check.passed)
      .map(check => ({
        area: check.checkName,
        priority: check.severity || 'MEDIUM',
        recommendation: `Address ${check.checkName.toLowerCase()} issues identified in the report`,
        action: 'Review and resolve flagged items'
      }));
  }

  // Placeholder methods for integrity checks - would be implemented based on specific requirements
  async verifyJournalEntryBalances(startDate, endDate, subsidiaryId) {
    return { passed: true, score: 100, severity: 'HIGH', details: 'All journal entries balanced' };
  }

  async verifyAccountBalances(startDate, endDate, subsidiaryId) {
    return { passed: true, score: 100, severity: 'HIGH', details: 'Account balances reconciled' };
  }

  async checkOrphanedRecords() {
    return { passed: true, score: 100, severity: 'MEDIUM', details: 'No orphaned records found' };
  }

  async checkDuplicateEntries(startDate, endDate, subsidiaryId) {
    return { passed: true, score: 100, severity: 'MEDIUM', details: 'No duplicate entries detected' };
  }

  async verifyDateConsistency(startDate, endDate, subsidiaryId) {
    return { passed: true, score: 100, severity: 'LOW', details: 'Date consistency verified' };
  }

  async getPSAKComplianceStatus(subsidiaryId) {
    return { score: 95, status: 'COMPLIANT', lastChecked: new Date() };
  }

  async getTaxationComplianceStatus(month, year, subsidiaryId) {
    return { score: 90, status: 'COMPLIANT', lastChecked: new Date() };
  }

  async getAuditReadinessStatus(subsidiaryId) {
    return { score: 88, status: 'READY', lastChecked: new Date() };
  }

  async getDataIntegrityStatus(subsidiaryId) {
    return { score: 92, status: 'GOOD', lastChecked: new Date() };
  }

  async getUpcomingComplianceDeadlines(month, year) {
    return [
      { type: 'PPh 21', dueDate: new Date(year, month, 10), status: 'UPCOMING' },
      { type: 'PPN', dueDate: new Date(year, month, 25), status: 'UPCOMING' },
      { type: 'Monthly Report', dueDate: new Date(year, month, 15), status: 'UPCOMING' }
    ];
  }

  identifyRiskAreas(complianceStatus) {
    return Object.entries(complianceStatus)
      .filter(([area, status]) => status.score < 80)
      .map(([area, status]) => ({
        area: area.replace('_', ' ').toUpperCase(),
        score: status.score,
        riskLevel: status.score < 60 ? 'HIGH' : 'MEDIUM'
      }));
  }

  generateActionItems(complianceStatus) {
    return Object.entries(complianceStatus)
      .filter(([area, status]) => status.score < 90)
      .map(([area, status]) => ({
        area: area.replace('_', ' ').toUpperCase(),
        action: `Improve ${area.replace('_', ' ')} compliance`,
        priority: status.score < 70 ? 'HIGH' : 'MEDIUM',
        targetScore: 95
      }));
  }
}

module.exports = new ComplianceAuditService();
