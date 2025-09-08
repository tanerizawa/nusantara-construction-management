/**
 * PHASE 4: ADVANCED FINANCIAL FEATURES
 * Cash Flow Statement Service - PSAK 2 Compliant
 * 
 * Indonesian Construction Industry Cash Flow Statement
 * Following PSAK 2 (Statement of Cash Flows) standards
 */

const { Sequelize, Op } = require('sequelize');

class CashFlowService {
    constructor(models) {
        this.models = models;
        this.JournalEntry = models.JournalEntry;
        this.JournalEntryLine = models.JournalEntryLine;
        this.ChartOfAccounts = models.ChartOfAccounts;
    }

    /**
     * Generate Cash Flow Statement - PSAK 2 Compliant
     * @param {string} startDate - Format: YYYY-MM-DD
     * @param {string} endDate - Format: YYYY-MM-DD
     * @param {string} method - 'direct' or 'indirect'
     * @returns {Object} PSAK 2 compliant cash flow statement
     */
    async generateCashFlowStatement(startDate, endDate, method = 'indirect') {
        try {
            const [operatingCashFlow, investingCashFlow, financingCashFlow] = await Promise.all([
                this.calculateOperatingCashFlow(startDate, endDate, method),
                this.calculateInvestingCashFlow(startDate, endDate),
                this.calculateFinancingCashFlow(startDate, endDate)
            ]);

            const openingCash = await this.getOpeningCashBalance(startDate);
            const closingCash = await this.getClosingCashBalance(endDate);
            
            const netCashFlow = operatingCashFlow.total + investingCashFlow.total + financingCashFlow.total;

            return {
                cashFlowStatement: {
                    period: {
                        startDate,
                        endDate,
                        method: method.toUpperCase()
                    },
                    operatingActivities: operatingCashFlow,
                    investingActivities: investingCashFlow,
                    financingActivities: financingCashFlow,
                    summary: {
                        netCashFlow,
                        openingCashBalance: openingCash,
                        closingCashBalance: closingCash,
                        calculatedClosingBalance: openingCash + netCashFlow,
                        isReconciled: Math.abs((openingCash + netCashFlow) - closingCash) < 1
                    },
                    constructionMetrics: {
                        projectCashInflows: operatingCashFlow.projectReceipts || 0,
                        materialCashOutflows: operatingCashFlow.materialPayments || 0,
                        laborCashOutflows: operatingCashFlow.laborPayments || 0,
                        operatingCashRatio: operatingCashFlow.total / (Math.abs(investingCashFlow.total) + Math.abs(financingCashFlow.total) || 1)
                    }
                },
                compliance: {
                    psak2: "Statement of Cash Flows",
                    method: method,
                    reportingCurrency: "IDR",
                    generatedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new Error(`Cash Flow Statement Generation Error: ${error.message}`);
        }
    }

    /**
     * Calculate Operating Cash Flow - Both Direct and Indirect Methods
     */
    async calculateOperatingCashFlow(startDate, endDate, method) {
        if (method === 'direct') {
            return this.calculateDirectOperatingCashFlow(startDate, endDate);
        } else {
            return this.calculateIndirectOperatingCashFlow(startDate, endDate);
        }
    }

    /**
     * Direct Method Operating Cash Flow (PSAK 2 preferred method)
     */
    async calculateDirectOperatingCashFlow(startDate, endDate) {
        try {
            // Cash receipts from customers (Revenue related accounts)
            const customerReceipts = await this.getCashMovements(startDate, endDate, ['1101', '1102'], 'debit', 'customer_receipts');
            
            // Cash payments to suppliers (Material and supplier accounts)
            const supplierPayments = await this.getCashMovements(startDate, endDate, ['2101', '5101'], 'credit', 'supplier_payments');
            
            // Cash payments to employees (Labor and salary accounts)
            const employeePayments = await this.getCashMovements(startDate, endDate, ['5102', '5103'], 'debit', 'employee_payments');
            
            // Cash payments for operating expenses
            const operatingExpenses = await this.getCashMovements(startDate, endDate, ['5201', '5202'], 'debit', 'operating_expenses');

            const total = customerReceipts.amount - supplierPayments.amount - employeePayments.amount - operatingExpenses.amount;

            return {
                method: 'DIRECT',
                receipts: {
                    customerReceipts,
                    otherOperatingReceipts: { amount: 0, transactions: [] }
                },
                payments: {
                    supplierPayments,
                    employeePayments,
                    operatingExpenses,
                    interestPaid: { amount: 0, transactions: [] },
                    taxesPaid: { amount: 0, transactions: [] }
                },
                total,
                projectReceipts: customerReceipts.amount,
                materialPayments: supplierPayments.amount,
                laborPayments: employeePayments.amount
            };
        } catch (error) {
            throw new Error(`Direct Operating Cash Flow Calculation Error: ${error.message}`);
        }
    }

    /**
     * Indirect Method Operating Cash Flow (Start with Net Income)
     */
    async calculateIndirectOperatingCashFlow(startDate, endDate) {
        try {
            // Get net income from income statement
            const netIncome = await this.getNetIncome(startDate, endDate);
            
            // Non-cash adjustments
            const depreciation = await this.getDepreciationExpense(startDate, endDate);
            const amortization = await this.getAmortizationExpense(startDate, endDate);
            
            // Working capital changes
            const workingCapitalChanges = await this.getWorkingCapitalChanges(startDate, endDate);
            
            const adjustments = depreciation + amortization + workingCapitalChanges.totalChange;
            const total = netIncome + adjustments;

            return {
                method: 'INDIRECT',
                netIncome,
                adjustments: {
                    depreciation,
                    amortization,
                    workingCapitalChanges
                },
                total,
                reconciliation: {
                    startingNetIncome: netIncome,
                    totalAdjustments: adjustments,
                    operatingCashFlow: total
                }
            };
        } catch (error) {
            throw new Error(`Indirect Operating Cash Flow Calculation Error: ${error.message}`);
        }
    }

    /**
     * Calculate Investing Cash Flow (Purchase/Sale of Assets)
     */
    async calculateInvestingCashFlow(startDate, endDate) {
        try {
            // Property, Plant & Equipment purchases
            const ppePurchases = await this.getCashMovements(startDate, endDate, ['1301', '1302', '1303'], 'debit', 'ppe_purchases');
            
            // Asset sales
            const assetSales = await this.getCashMovements(startDate, endDate, ['1301', '1302', '1303'], 'credit', 'asset_sales');
            
            // Investment purchases
            const investmentPurchases = await this.getCashMovements(startDate, endDate, ['1401'], 'debit', 'investment_purchases');
            
            // Investment sales
            const investmentSales = await this.getCashMovements(startDate, endDate, ['1401'], 'credit', 'investment_sales');

            const total = assetSales.amount + investmentSales.amount - ppePurchases.amount - investmentPurchases.amount;

            return {
                purchases: {
                    ppePurchases,
                    investmentPurchases
                },
                sales: {
                    assetSales,
                    investmentSales
                },
                total,
                constructionAssets: {
                    equipmentPurchases: ppePurchases.amount,
                    equipmentSales: assetSales.amount,
                    netEquipmentInvestment: ppePurchases.amount - assetSales.amount
                }
            };
        } catch (error) {
            throw new Error(`Investing Cash Flow Calculation Error: ${error.message}`);
        }
    }

    /**
     * Calculate Financing Cash Flow (Debt, Equity transactions)
     */
    async calculateFinancingCashFlow(startDate, endDate) {
        try {
            // Debt proceeds
            const debtProceeds = await this.getCashMovements(startDate, endDate, ['2201', '2301'], 'credit', 'debt_proceeds');
            
            // Debt payments
            const debtPayments = await this.getCashMovements(startDate, endDate, ['2201', '2301'], 'debit', 'debt_payments');
            
            // Equity contributions
            const equityContributions = await this.getCashMovements(startDate, endDate, ['3101', '3201'], 'credit', 'equity_contributions');
            
            // Dividend payments
            const dividendPayments = await this.getCashMovements(startDate, endDate, ['3301'], 'debit', 'dividend_payments');

            const total = debtProceeds.amount + equityContributions.amount - debtPayments.amount - dividendPayments.amount;

            return {
                inflows: {
                    debtProceeds,
                    equityContributions
                },
                outflows: {
                    debtPayments,
                    dividendPayments
                },
                total,
                leverage: {
                    totalBorrowings: debtProceeds.amount,
                    totalRepayments: debtPayments.amount,
                    netBorrowings: debtProceeds.amount - debtPayments.amount
                }
            };
        } catch (error) {
            throw new Error(`Financing Cash Flow Calculation Error: ${error.message}`);
        }
    }

    /**
     * Get cash movements for specific accounts and transaction types
     */
    async getCashMovements(startDate, endDate, accountCodes, debitCredit, category) {
        try {
            const journalLines = await this.JournalEntryLine.findAll({
                include: [
                    {
                        model: this.JournalEntry,
                        where: {
                            entry_date: {
                                [Op.between]: [startDate, endDate]
                            },
                            status: 'posted'
                        }
                    },
                    {
                        model: this.ChartOfAccounts,
                        where: {
                            account_code: {
                                [Op.in]: accountCodes
                            }
                        }
                    }
                ]
            });

            const transactions = journalLines.map(line => ({
                date: line.JournalEntry.entry_date,
                description: line.JournalEntry.description,
                accountName: line.ChartOfAccount.account_name,
                debitAmount: line.debit_amount || 0,
                creditAmount: line.credit_amount || 0,
                amount: debitCredit === 'debit' ? (line.debit_amount || 0) : (line.credit_amount || 0)
            }));

            const amount = transactions.reduce((sum, t) => sum + t.amount, 0);

            return {
                category,
                amount,
                transactionCount: transactions.length,
                transactions
            };
        } catch (error) {
            throw new Error(`Cash Movements Calculation Error: ${error.message}`);
        }
    }

    /**
     * Get opening cash balance
     */
    async getOpeningCashBalance(date) {
        try {
            const cashAccounts = ['1101']; // Kas dan Bank
            
            const journalLines = await this.JournalEntryLine.findAll({
                include: [
                    {
                        model: this.JournalEntry,
                        where: {
                            entry_date: {
                                [Op.lt]: date
                            },
                            status: 'posted'
                        }
                    },
                    {
                        model: this.ChartOfAccounts,
                        where: {
                            account_code: {
                                [Op.in]: cashAccounts
                            }
                        }
                    }
                ]
            });

            return journalLines.reduce((balance, line) => {
                return balance + (line.debit_amount || 0) - (line.credit_amount || 0);
            }, 0);
        } catch (error) {
            return 0; // Return 0 if no opening balance found
        }
    }

    /**
     * Get closing cash balance
     */
    async getClosingCashBalance(date) {
        try {
            const cashAccounts = ['1101']; // Kas dan Bank
            
            const journalLines = await this.JournalEntryLine.findAll({
                include: [
                    {
                        model: this.JournalEntry,
                        where: {
                            entry_date: {
                                [Op.lte]: date
                            },
                            status: 'posted'
                        }
                    },
                    {
                        model: this.ChartOfAccounts,
                        where: {
                            account_code: {
                                [Op.in]: cashAccounts
                            }
                        }
                    }
                ]
            });

            return journalLines.reduce((balance, line) => {
                return balance + (line.debit_amount || 0) - (line.credit_amount || 0);
            }, 0);
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get net income for period
     */
    async getNetIncome(startDate, endDate) {
        try {
            // Get revenue accounts (4xxx)
            const revenueLines = await this.JournalEntryLine.findAll({
                include: [
                    {
                        model: this.JournalEntry,
                        where: {
                            entry_date: {
                                [Op.between]: [startDate, endDate]
                            },
                            status: 'posted'
                        }
                    },
                    {
                        model: this.ChartOfAccounts,
                        where: {
                            account_type: 'Revenue'
                        }
                    }
                ]
            });

            // Get expense accounts (5xxx)
            const expenseLines = await this.JournalEntryLine.findAll({
                include: [
                    {
                        model: this.JournalEntry,
                        where: {
                            entry_date: {
                                [Op.between]: [startDate, endDate]
                            },
                            status: 'posted'
                        }
                    },
                    {
                        model: this.ChartOfAccounts,
                        where: {
                            account_type: 'Expense'
                        }
                    }
                ]
            });

            const totalRevenue = revenueLines.reduce((sum, line) => sum + (line.credit_amount || 0), 0);
            const totalExpenses = expenseLines.reduce((sum, line) => sum + (line.debit_amount || 0), 0);

            return totalRevenue - totalExpenses;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get depreciation expense for period
     */
    async getDepreciationExpense(startDate, endDate) {
        // For now return 0, will be implemented when depreciation accounts are added
        return 0;
    }

    /**
     * Get amortization expense for period
     */
    async getAmortizationExpense(startDate, endDate) {
        // For now return 0, will be implemented when amortization accounts are added
        return 0;
    }

    /**
     * Calculate working capital changes
     */
    async getWorkingCapitalChanges(startDate, endDate) {
        try {
            // Calculate changes in current assets and current liabilities
            const currentAssetAccounts = ['1102', '1103', '1104']; // Piutang, Persediaan, Biaya Dibayar Dimuka
            const currentLiabilityAccounts = ['2101', '2102', '2103']; // Hutang Usaha, Hutang Lain-lain, Biaya Akrual

            const assetChanges = await this.getAccountBalanceChanges(startDate, endDate, currentAssetAccounts);
            const liabilityChanges = await this.getAccountBalanceChanges(startDate, endDate, currentLiabilityAccounts);

            return {
                currentAssetChanges: assetChanges,
                currentLiabilityChanges: liabilityChanges,
                totalChange: -assetChanges + liabilityChanges // Negative for increases in assets
            };
        } catch (error) {
            return { totalChange: 0 };
        }
    }

    /**
     * Get account balance changes for period
     */
    async getAccountBalanceChanges(startDate, endDate, accountCodes) {
        try {
            const journalLines = await this.JournalEntryLine.findAll({
                include: [
                    {
                        model: this.JournalEntry,
                        where: {
                            entry_date: {
                                [Op.between]: [startDate, endDate]
                            },
                            status: 'posted'
                        }
                    },
                    {
                        model: this.ChartOfAccounts,
                        where: {
                            account_code: {
                                [Op.in]: accountCodes
                            }
                        }
                    }
                ]
            });

            return journalLines.reduce((sum, line) => {
                return sum + (line.debit_amount || 0) - (line.credit_amount || 0);
            }, 0);
        } catch (error) {
            return 0;
        }
    }
}

module.exports = CashFlowService;
