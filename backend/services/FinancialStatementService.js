/**
 * Financial Statement Service
 * Generates PSAK-compliant financial reports for construction company
 */

const { models } = require('../models');
const { JournalEntry, JournalEntryLine, ChartOfAccounts } = models;
const { Op, fn, col, literal } = require('sequelize');

class FinancialStatementService {
  
  /**
   * Generate Trial Balance
   * Base for all financial statements
   */
  async generateTrialBalance(params = {}) {
    const {
      asOfDate = new Date(),
      subsidiaryId = null,
      projectId = null,
      includeInactive = false
    } = params;

    try {
      // Get all accounts with their balances
      const accounts = await ChartOfAccounts.findAll({
        where: {
          is_active: includeInactive ? undefined : true
        },
        order: [['account_code', 'ASC']]
      });

      // Calculate balances for each account
      const accountBalances = await Promise.all(
        accounts.map(async (account) => {
          const balance = await this.calculateAccountBalance(
            account.id, 
            asOfDate, 
            subsidiaryId, 
            projectId
          );
          
          return {
            accountId: account.id,
            accountCode: account.accountCode,
            accountName: account.accountName,
            accountType: account.accountType,
            level: account.level,
            normalBalance: account.normalBalance,
            debitBalance: balance.normalBalance === 'DEBIT' ? balance.balance : 0,
            creditBalance: balance.normalBalance === 'CREDIT' ? balance.balance : 0,
            balance: balance.balance
          };
        })
      );

      // Calculate totals
      const totalDebits = accountBalances.reduce((sum, acc) => sum + acc.debitBalance, 0);
      const totalCredits = accountBalances.reduce((sum, acc) => sum + acc.creditBalance, 0);

      return {
        success: true,
        data: {
          asOfDate,
          subsidiaryId,
          projectId,
          accounts: accountBalances.filter(acc => Math.abs(acc.balance) > 0.01), // Filter zero balances
          summary: {
            totalDebits,
            totalCredits,
            difference: totalDebits - totalCredits,
            isBalanced: Math.abs(totalDebits - totalCredits) < 0.01
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating trial balance',
        error: error.message
      };
    }
  }

  /**
   * Generate Income Statement (Laporan Laba Rugi)
   * PSAK-compliant format
   */
  async generateIncomeStatement(params = {}) {
    const {
      startDate,
      endDate = new Date(),
      subsidiaryId = null,
      projectId = null,
      format = 'SINGLE_STEP' // SINGLE_STEP or MULTI_STEP
    } = params;

    try {
      // Get revenue accounts (4000 series)
      const revenues = await this.getAccountBalancesByType('REVENUE', startDate, endDate, subsidiaryId, projectId);
      
      // Get expense accounts (5000 and 6000 series)
      const directExpenses = await this.getAccountBalancesBySubType([
        'DIRECT_COST', 'MATERIAL_COST', 'LABOR_COST', 'SUBCONTRACTOR_COST', 'EQUIPMENT_COST'
      ], startDate, endDate, subsidiaryId, projectId);
      
      const indirectExpenses = await this.getAccountBalancesBySubType([
        'INDIRECT_COST', 'ADMIN_SALARY', 'DEPRECIATION'
      ], startDate, endDate, subsidiaryId, projectId);

      // Calculate totals
      const totalRevenue = revenues.reduce((sum, acc) => sum + acc.balance, 0);
      const totalDirectCosts = directExpenses.reduce((sum, acc) => sum + acc.balance, 0);
      const totalIndirectCosts = indirectExpenses.reduce((sum, acc) => sum + acc.balance, 0);
      
      const grossProfit = totalRevenue - totalDirectCosts;
      const netIncome = grossProfit - totalIndirectCosts;

      return {
        success: true,
        data: {
          period: {
            startDate,
            endDate
          },
          subsidiaryId,
          projectId,
          statement: {
            revenues: {
              accounts: revenues,
              total: totalRevenue
            },
            directCosts: {
              accounts: directExpenses,
              total: totalDirectCosts
            },
            grossProfit,
            indirectCosts: {
              accounts: indirectExpenses,
              total: totalIndirectCosts
            },
            netIncome,
            // Construction industry metrics
            grossProfitMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
            netProfitMargin: totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating income statement',
        error: error.message
      };
    }
  }

  /**
   * Generate Balance Sheet (Neraca)
   * PSAK-compliant format
   */
  async generateBalanceSheet(params = {}) {
    const {
      asOfDate = new Date(),
      subsidiaryId = null
    } = params;

    try {
      // Assets (1000 series)
      const currentAssets = await this.getAccountBalancesBySubType([
        'CURRENT_ASSET', 'CASH_AND_BANK', 'ACCOUNTS_RECEIVABLE', 'RETENTION_RECEIVABLE', 
        'INVENTORY', 'PREPAID'
      ], null, asOfDate, subsidiaryId);

      const fixedAssets = await this.getAccountBalancesBySubType([
        'FIXED_ASSET', 'HEAVY_EQUIPMENT', 'VEHICLES'
      ], null, asOfDate, subsidiaryId);

      // Liabilities (2000 series)
      const currentLiabilities = await this.getAccountBalancesBySubType([
        'CURRENT_LIABILITY', 'ACCOUNTS_PAYABLE', 'SUBCONTRACTOR_PAYABLE', 
        'INCOME_TAX_PAYABLE', 'VAT_PAYABLE', 'ADVANCE_RECEIVED'
      ], null, asOfDate, subsidiaryId);

      // Equity (3000 series)
      const equity = await this.getAccountBalancesByType('EQUITY', null, asOfDate, subsidiaryId);

      // Calculate totals
      const totalCurrentAssets = currentAssets.reduce((sum, acc) => sum + acc.balance, 0);
      const totalFixedAssets = fixedAssets.reduce((sum, acc) => sum + acc.balance, 0);
      const totalAssets = totalCurrentAssets + totalFixedAssets;

      const totalCurrentLiabilities = currentLiabilities.reduce((sum, acc) => sum + acc.balance, 0);
      const totalEquity = equity.reduce((sum, acc) => sum + acc.balance, 0);
      const totalLiabilitiesAndEquity = totalCurrentLiabilities + totalEquity;

      return {
        success: true,
        data: {
          asOfDate,
          subsidiaryId,
          statement: {
            assets: {
              currentAssets: {
                accounts: currentAssets,
                total: totalCurrentAssets
              },
              fixedAssets: {
                accounts: fixedAssets,
                total: totalFixedAssets
              },
              total: totalAssets
            },
            liabilities: {
              currentLiabilities: {
                accounts: currentLiabilities,
                total: totalCurrentLiabilities
              },
              total: totalCurrentLiabilities
            },
            equity: {
              accounts: equity,
              total: totalEquity
            },
            totalLiabilitiesAndEquity,
            // Validation
            isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01,
            difference: totalAssets - totalLiabilitiesAndEquity
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating balance sheet',
        error: error.message
      };
    }
  }

  /**
   * Calculate account balance up to a specific date
   */
  async calculateAccountBalance(accountId, asOfDate, subsidiaryId = null, projectId = null) {
    try {
      const whereClause = {
        account_id: accountId
      };

      // Add date filter
      const entryWhereClause = {
        entry_date: {
          [Op.lte]: asOfDate
        },
        status: 'POSTED' // Only posted entries
      };

      if (subsidiaryId) {
        entryWhereClause.subsidiary_id = subsidiaryId;
      }

      if (projectId) {
        whereClause.project_id = projectId;
      }

      // Sum debits and credits
      const result = await JournalEntryLine.findOne({
        attributes: [
          [fn('COALESCE', fn('SUM', col('debit_amount')), 0), 'totalDebits'],
          [fn('COALESCE', fn('SUM', col('credit_amount')), 0), 'totalCredits']
        ],
        include: [{
          model: JournalEntry,
          as: 'journalEntry',
          where: entryWhereClause,
          attributes: []
        }],
        where: whereClause,
        raw: true
      });

      const totalDebits = parseFloat(result?.totalDebits || 0);
      const totalCredits = parseFloat(result?.totalCredits || 0);

      // Get account normal balance
      const account = await ChartOfAccounts.findByPk(accountId);
      const normalBalance = account?.normalBalance || 'DEBIT';

      // Calculate net balance based on normal balance
      let balance;
      if (normalBalance === 'DEBIT') {
        balance = totalDebits - totalCredits;
      } else {
        balance = totalCredits - totalDebits;
      }

      return {
        accountId,
        totalDebits,
        totalCredits,
        balance,
        normalBalance
      };
    } catch (error) {
      throw new Error(`Error calculating balance for account ${accountId}: ${error.message}`);
    }
  }

  /**
   * Get account balances by type
   */
  async getAccountBalancesByType(accountType, startDate = null, endDate, subsidiaryId = null, projectId = null) {
    try {
      const accounts = await ChartOfAccounts.findAll({
        where: {
          account_type: accountType,
          is_active: true
        },
        order: [['account_code', 'ASC']]
      });

      const balances = await Promise.all(
        accounts.map(async (account) => {
          const balance = await this.calculateAccountBalance(
            account.id, 
            endDate, 
            subsidiaryId, 
            projectId
          );
          
          return {
            accountId: account.id,
            accountCode: account.accountCode,
            accountName: account.accountName,
            accountType: account.accountType,
            balance: Math.abs(balance.balance) // Always positive for statements
          };
        })
      );

      return balances.filter(acc => Math.abs(acc.balance) > 0.01);
    } catch (error) {
      throw new Error(`Error getting balances by type ${accountType}: ${error.message}`);
    }
  }

  /**
   * Get account balances by sub type
   */
  async getAccountBalancesBySubType(subTypes, startDate = null, endDate, subsidiaryId = null, projectId = null) {
    try {
      const accounts = await ChartOfAccounts.findAll({
        where: {
          account_sub_type: {
            [Op.in]: subTypes
          },
          is_active: true
        },
        order: [['account_code', 'ASC']]
      });

      const balances = await Promise.all(
        accounts.map(async (account) => {
          const balance = await this.calculateAccountBalance(
            account.id, 
            endDate, 
            subsidiaryId, 
            projectId
          );
          
          return {
            accountId: account.id,
            accountCode: account.accountCode,
            accountName: account.accountName,
            accountSubType: account.accountSubType,
            balance: Math.abs(balance.balance)
          };
        })
      );

      return balances.filter(acc => Math.abs(acc.balance) > 0.01);
    } catch (error) {
      throw new Error(`Error getting balances by sub types: ${error.message}`);
    }
  }

  /**
   * Generate General Ledger Report
   * @param {string} accountCode - Specific account code (optional)
   * @param {string} startDate - Start date for filtering
   * @param {string} endDate - End date for filtering
   * @returns {Object} General ledger with detailed transactions
   */
  async generateGeneralLedger(accountCode, startDate, endDate) {
    try {
      const whereConditions = {
        entry_date: {
          [Op.between]: [startDate, endDate]
        },
        status: 'posted'
      };

      const accountConditions = accountCode ? 
        { account_code: accountCode } : {};

      const journalLines = await JournalEntryLine.findAll({
        include: [
          {
            model: JournalEntry,
            where: whereConditions
          },
          {
            model: ChartOfAccounts,
            where: accountConditions
          }
        ],
        order: [
          [{ model: ChartOfAccounts }, 'account_code', 'ASC'],
          [{ model: JournalEntry }, 'entry_date', 'ASC']
        ]
      });

      // Group by account
      const accountsMap = new Map();
      let totalDebits = 0;
      let totalCredits = 0;

      journalLines.forEach(line => {
        const accountCode = line.ChartOfAccount.account_code;
        const accountName = line.ChartOfAccount.account_name;
        const accountType = line.ChartOfAccount.account_type;

        if (!accountsMap.has(accountCode)) {
          accountsMap.set(accountCode, {
            accountCode,
            accountName,
            accountType,
            openingBalance: 0,
            transactions: [],
            runningBalance: 0,
            totalDebits: 0,
            totalCredits: 0,
            closingBalance: 0
          });
        }

        const account = accountsMap.get(accountCode);
        const debitAmount = line.debit_amount || 0;
        const creditAmount = line.credit_amount || 0;

        account.transactions.push({
          date: line.JournalEntry.entry_date,
          description: line.JournalEntry.description,
          reference: line.JournalEntry.reference_number,
          debitAmount,
          creditAmount,
          runningBalance: account.runningBalance + debitAmount - creditAmount
        });

        account.totalDebits += debitAmount;
        account.totalCredits += creditAmount;
        account.runningBalance += debitAmount - creditAmount;
        account.closingBalance = account.runningBalance;

        totalDebits += debitAmount;
        totalCredits += creditAmount;
      });

      const accounts = Array.from(accountsMap.values());

      return {
        success: true,
        data: {
          generalLedger: {
            period: { startDate, endDate },
            accountCode: accountCode || 'All Accounts',
            accounts,
            summary: {
              totalAccounts: accounts.length,
              totalTransactions: journalLines.length,
              totalDebits,
              totalCredits,
              isBalanced: Math.abs(totalDebits - totalCredits) < 1
            }
          }
        },
        compliance: {
          standardsCompliance: 'Indonesian Accounting Records Requirements',
          auditTrail: 'Complete transaction history maintained',
          reportingCurrency: 'IDR',
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating general ledger',
        error: error.message
      };
    }
  }

  /**
   * Generate Construction Industry Analytics
   * @param {string} startDate - Start date for analysis
   * @param {string} endDate - End date for analysis
   * @returns {Object} Construction-specific financial analytics
   */
  async generateConstructionAnalytics(startDate, endDate) {
    try {
      const [
        trialBalance,
        incomeStatement,
        balanceSheet
      ] = await Promise.all([
        this.generateTrialBalance(startDate, endDate),
        this.generateIncomeStatement(startDate, endDate),
        this.generateBalanceSheet(endDate)
      ]);

      // Construction-specific KPIs
      const analytics = {
        profitabilityMetrics: {
          grossProfitMargin: incomeStatement.data.statement.grossProfitMargin || 0,
          netProfitMargin: incomeStatement.data.statement.netProfitMargin || 0,
          operatingMargin: this.calculateOperatingMargin(incomeStatement.data.statement),
          returnOnAssets: this.calculateROA(incomeStatement.data.statement.netIncome, balanceSheet.data.statement.assets.total)
        },
        liquidityMetrics: {
          currentRatio: this.calculateCurrentRatio(balanceSheet.data.statement),
          quickRatio: this.calculateQuickRatio(balanceSheet.data.statement),
          cashRatio: this.calculateCashRatio(balanceSheet.data.statement),
          workingCapital: this.calculateWorkingCapital(balanceSheet.data.statement)
        },
        constructionSpecific: {
          materialCostRatio: this.calculateMaterialCostRatio(incomeStatement.data.statement),
          laborCostRatio: this.calculateLaborCostRatio(incomeStatement.data.statement),
          projectEfficiency: this.calculateProjectEfficiency(incomeStatement.data.statement),
          revenueGrowth: 'To be calculated with historical data'
        },
        industryBenchmarks: {
          averageGrossMargin: 15, // Industry average for construction
          averageNetMargin: 5,
          averageCurrentRatio: 1.2,
          performance: this.benchmarkPerformance(incomeStatement.data.statement, balanceSheet.data.statement)
        }
      };

      return {
        success: true,
        data: {
          constructionAnalytics: analytics,
          period: { startDate, endDate },
          industryFocus: 'Construction & Infrastructure'
        },
        compliance: {
          standards: 'PSAK 34 - Construction Contracts',
          industryReporting: 'Indonesian Construction Industry Standards',
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating construction analytics',
        error: error.message
      };
    }
  }

  // Helper methods for construction analytics
  calculateOperatingMargin(statement) {
    if (!statement.revenues || !statement.revenues.total) return 0;
    const operatingIncome = statement.grossProfit - (statement.indirectCosts?.total || 0);
    return (operatingIncome / statement.revenues.total) * 100;
  }

  calculateROA(netIncome, totalAssets) {
    if (!totalAssets || totalAssets === 0) return 0;
    return (netIncome / totalAssets) * 100;
  }

  calculateCurrentRatio(balanceSheet) {
    const currentAssets = balanceSheet.assets?.currentAssets?.total || 0;
    const currentLiabilities = balanceSheet.liabilities?.currentLiabilities?.total || 0;
    return currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
  }

  calculateQuickRatio(balanceSheet) {
    const currentAssets = balanceSheet.assets?.currentAssets?.total || 0;
    const inventory = 0; // To be implemented when inventory accounts are tracked
    const currentLiabilities = balanceSheet.liabilities?.currentLiabilities?.total || 0;
    return currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 0;
  }

  calculateCashRatio(balanceSheet) {
    const cash = balanceSheet.assets?.currentAssets?.accounts?.find(acc => 
      acc.accountName?.includes('Kas') || acc.accountName?.includes('Bank'))?.balance || 0;
    const currentLiabilities = balanceSheet.liabilities?.currentLiabilities?.total || 0;
    return currentLiabilities > 0 ? cash / currentLiabilities : 0;
  }

  calculateWorkingCapital(balanceSheet) {
    const currentAssets = balanceSheet.assets?.currentAssets?.total || 0;
    const currentLiabilities = balanceSheet.liabilities?.currentLiabilities?.total || 0;
    return currentAssets - currentLiabilities;
  }

  calculateMaterialCostRatio(statement) {
    const materialCosts = statement.directCosts?.accounts?.find(acc => 
      acc.accountName?.includes('Material'))?.balance || 0;
    return statement.revenues?.total > 0 ? (materialCosts / statement.revenues.total) * 100 : 0;
  }

  calculateLaborCostRatio(statement) {
    const laborCosts = statement.directCosts?.accounts?.find(acc => 
      acc.accountName?.includes('Tenaga Kerja'))?.balance || 0;
    return statement.revenues?.total > 0 ? (laborCosts / statement.revenues.total) * 100 : 0;
  }

  calculateProjectEfficiency(statement) {
    const totalCosts = (statement.directCosts?.total || 0) + (statement.indirectCosts?.total || 0);
    return statement.revenues?.total > 0 ? ((statement.revenues.total - totalCosts) / statement.revenues.total) * 100 : 0;
  }

  benchmarkPerformance(incomeStatement, balanceSheet) {
    const grossMargin = incomeStatement.grossProfitMargin || 0;
    const currentRatio = this.calculateCurrentRatio(balanceSheet);
    
    let performance = 'Average';
    if (grossMargin > 20 && currentRatio > 1.5) {
      performance = 'Excellent';
    } else if (grossMargin > 15 && currentRatio > 1.2) {
      performance = 'Good';
    } else if (grossMargin < 10 || currentRatio < 1.0) {
      performance = 'Below Average';
    }
    
    return performance;
  }
}

module.exports = new FinancialStatementService();
