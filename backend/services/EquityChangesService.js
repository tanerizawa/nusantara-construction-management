/**
 * PHASE 4: ADVANCED FINANCIAL FEATURES
 * Statement of Changes in Equity Service - PSAK Compliant
 * 
 * Indonesian Construction Industry Equity Changes Statement
 * Following Indonesian Accounting Standards for equity reporting
 */

const { Sequelize, Op } = require('sequelize');

class EquityChangesService {
    constructor(models) {
        this.models = models;
        this.JournalEntry = models.JournalEntry;
        this.JournalEntryLine = models.JournalEntryLine;
        this.ChartOfAccounts = models.ChartOfAccounts;
    }

    /**
     * Generate Statement of Changes in Equity - PSAK Compliant
     * @param {string} startDate - Format: YYYY-MM-DD
     * @param {string} endDate - Format: YYYY-MM-DD
     * @returns {Object} PSAK compliant statement of changes in equity
     */
    async generateEquityChangesStatement(startDate, endDate) {
        try {
            const [
                openingBalances,
                netIncome,
                ownerContributions,
                ownerWithdrawals,
                dividendPayments,
                otherEquityChanges,
                closingBalances
            ] = await Promise.all([
                this.getOpeningEquityBalances(startDate),
                this.getNetIncome(startDate, endDate),
                this.getOwnerContributions(startDate, endDate),
                this.getOwnerWithdrawals(startDate, endDate),
                this.getDividendPayments(startDate, endDate),
                this.getOtherEquityChanges(startDate, endDate),
                this.getClosingEquityBalances(endDate)
            ]);

            const equityMovements = this.calculateEquityMovements(
                openingBalances,
                netIncome,
                ownerContributions,
                ownerWithdrawals,
                dividendPayments,
                otherEquityChanges
            );

            return {
                equityChangesStatement: {
                    period: {
                        startDate,
                        endDate
                    },
                    equityComponents: {
                        shareCapital: {
                            openingBalance: openingBalances.shareCapital,
                            additions: ownerContributions.shareCapital,
                            deductions: 0,
                            closingBalance: closingBalances.shareCapital
                        },
                        retainedEarnings: {
                            openingBalance: openingBalances.retainedEarnings,
                            netIncome: netIncome,
                            dividendsPaid: -dividendPayments.total,
                            closingBalance: closingBalances.retainedEarnings
                        },
                        additionalPaidInCapital: {
                            openingBalance: openingBalances.additionalPaidInCapital,
                            additions: ownerContributions.additionalPaidIn,
                            deductions: 0,
                            closingBalance: closingBalances.additionalPaidInCapital
                        },
                        otherEquity: {
                            openingBalance: openingBalances.otherEquity,
                            changes: otherEquityChanges.total,
                            closingBalance: closingBalances.otherEquity
                        }
                    },
                    summary: {
                        totalOpeningEquity: openingBalances.total,
                        totalEquityIncrease: equityMovements.totalIncrease,
                        totalEquityDecrease: equityMovements.totalDecrease,
                        netEquityChange: equityMovements.netChange,
                        totalClosingEquity: closingBalances.total
                    },
                    constructionMetrics: {
                        equityToAssetsRatio: await this.calculateEquityToAssetsRatio(endDate),
                        returnOnEquity: this.calculateReturnOnEquity(netIncome, openingBalances.total, closingBalances.total),
                        equityGrowthRate: this.calculateEquityGrowthRate(openingBalances.total, closingBalances.total),
                        ownershipConcentration: await this.calculateOwnershipConcentration(endDate)
                    }
                },
                compliance: {
                    psak: "Statement of Changes in Equity",
                    reportingCurrency: "IDR",
                    generatedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new Error(`Equity Changes Statement Generation Error: ${error.message}`);
        }
    }

    /**
     * Get opening equity balances
     */
    async getOpeningEquityBalances(startDate) {
        try {
            const equityAccounts = {
                shareCapital: ['3101'], // Modal Saham
                retainedEarnings: ['3201'], // Saldo Laba
                additionalPaidInCapital: ['3102'], // Tambahan Modal Disetor
                otherEquity: ['3301', '3302'] // Dividen, Laba Ditahan
            };

            const balances = {};
            let total = 0;

            for (const [component, accountCodes] of Object.entries(equityAccounts)) {
                const balance = await this.getAccountGroupBalance(accountCodes, startDate, true);
                balances[component] = balance;
                total += balance;
            }

            balances.total = total;
            return balances;
        } catch (error) {
            throw new Error(`Opening Equity Balances Error: ${error.message}`);
        }
    }

    /**
     * Get closing equity balances
     */
    async getClosingEquityBalances(endDate) {
        try {
            const equityAccounts = {
                shareCapital: ['3101'],
                retainedEarnings: ['3201'],
                additionalPaidInCapital: ['3102'],
                otherEquity: ['3301', '3302']
            };

            const balances = {};
            let total = 0;

            for (const [component, accountCodes] of Object.entries(equityAccounts)) {
                const balance = await this.getAccountGroupBalance(accountCodes, endDate, false);
                balances[component] = balance;
                total += balance;
            }

            balances.total = total;
            return balances;
        } catch (error) {
            throw new Error(`Closing Equity Balances Error: ${error.message}`);
        }
    }

    /**
     * Get net income for the period
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
     * Get owner contributions during the period
     */
    async getOwnerContributions(startDate, endDate) {
        try {
            const shareCapitalContributions = await this.getAccountMovements(
                ['3101'], startDate, endDate, 'credit'
            );
            
            const additionalPaidInContributions = await this.getAccountMovements(
                ['3102'], startDate, endDate, 'credit'
            );

            return {
                shareCapital: shareCapitalContributions.amount,
                additionalPaidIn: additionalPaidInContributions.amount,
                total: shareCapitalContributions.amount + additionalPaidInContributions.amount,
                transactions: [
                    ...shareCapitalContributions.transactions,
                    ...additionalPaidInContributions.transactions
                ]
            };
        } catch (error) {
            return { shareCapital: 0, additionalPaidIn: 0, total: 0, transactions: [] };
        }
    }

    /**
     * Get owner withdrawals during the period
     */
    async getOwnerWithdrawals(startDate, endDate) {
        try {
            const withdrawals = await this.getAccountMovements(
                ['3301'], startDate, endDate, 'debit'
            );

            return {
                total: withdrawals.amount,
                transactions: withdrawals.transactions
            };
        } catch (error) {
            return { total: 0, transactions: [] };
        }
    }

    /**
     * Get dividend payments during the period
     */
    async getDividendPayments(startDate, endDate) {
        try {
            const dividends = await this.getAccountMovements(
                ['3301'], startDate, endDate, 'debit'
            );

            return {
                total: dividends.amount,
                transactions: dividends.transactions
            };
        } catch (error) {
            return { total: 0, transactions: [] };
        }
    }

    /**
     * Get other equity changes during the period
     */
    async getOtherEquityChanges(startDate, endDate) {
        try {
            const otherChanges = await this.getAccountMovements(
                ['3302'], startDate, endDate, 'both'
            );

            return {
                total: otherChanges.netAmount,
                transactions: otherChanges.transactions
            };
        } catch (error) {
            return { total: 0, transactions: [] };
        }
    }

    /**
     * Calculate equity movements summary
     */
    calculateEquityMovements(openingBalances, netIncome, contributions, withdrawals, dividends, otherChanges) {
        const totalIncrease = netIncome + contributions.total;
        const totalDecrease = withdrawals.total + dividends.total - otherChanges.total;
        const netChange = totalIncrease - totalDecrease;

        return {
            totalIncrease,
            totalDecrease,
            netChange,
            components: {
                netIncome,
                contributions: contributions.total,
                withdrawals: withdrawals.total,
                dividends: dividends.total,
                otherChanges: otherChanges.total
            }
        };
    }

    /**
     * Calculate Return on Equity (ROE)
     */
    calculateReturnOnEquity(netIncome, openingEquity, closingEquity) {
        const averageEquity = (openingEquity + closingEquity) / 2;
        if (averageEquity === 0) return 0;
        return (netIncome / averageEquity) * 100; // Return as percentage
    }

    /**
     * Calculate Equity Growth Rate
     */
    calculateEquityGrowthRate(openingEquity, closingEquity) {
        if (openingEquity === 0) return 0;
        return ((closingEquity - openingEquity) / openingEquity) * 100; // Return as percentage
    }

    /**
     * Calculate Equity to Assets Ratio
     */
    async calculateEquityToAssetsRatio(endDate) {
        try {
            const totalAssets = await this.getTotalAssets(endDate);
            const totalEquity = await this.getTotalEquity(endDate);
            
            if (totalAssets === 0) return 0;
            return (totalEquity / totalAssets) * 100; // Return as percentage
        } catch (error) {
            return 0;
        }
    }

    /**
     * Calculate ownership concentration
     */
    async calculateOwnershipConcentration(endDate) {
        try {
            // For construction companies, analyze ownership structure
            const shareCapital = await this.getAccountGroupBalance(['3101'], endDate, false);
            const additionalPaidIn = await this.getAccountGroupBalance(['3102'], endDate, false);
            
            return {
                totalPaidInCapital: shareCapital + additionalPaidIn,
                shareCapitalPortion: shareCapital > 0 ? (shareCapital / (shareCapital + additionalPaidIn)) * 100 : 0,
                additionalCapitalPortion: additionalPaidIn > 0 ? (additionalPaidIn / (shareCapital + additionalPaidIn)) * 100 : 0
            };
        } catch (error) {
            return { totalPaidInCapital: 0, shareCapitalPortion: 0, additionalCapitalPortion: 0 };
        }
    }

    /**
     * Get account group balance for a specific date
     */
    async getAccountGroupBalance(accountCodes, date, isOpening = false) {
        try {
            const dateCondition = isOpening ? 
                { [Op.lt]: date } : 
                { [Op.lte]: date };

            const journalLines = await this.JournalEntryLine.findAll({
                include: [
                    {
                        model: this.JournalEntry,
                        where: {
                            entry_date: dateCondition,
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

            // For equity accounts, credit is normal balance
            return journalLines.reduce((balance, line) => {
                return balance + (line.credit_amount || 0) - (line.debit_amount || 0);
            }, 0);
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get account movements for specific period
     */
    async getAccountMovements(accountCodes, startDate, endDate, movementType) {
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
                creditAmount: line.credit_amount || 0
            }));

            let amount = 0;
            let netAmount = 0;

            if (movementType === 'debit') {
                amount = transactions.reduce((sum, t) => sum + t.debitAmount, 0);
            } else if (movementType === 'credit') {
                amount = transactions.reduce((sum, t) => sum + t.creditAmount, 0);
            } else if (movementType === 'both') {
                amount = transactions.reduce((sum, t) => sum + t.creditAmount + t.debitAmount, 0);
                netAmount = transactions.reduce((sum, t) => sum + t.creditAmount - t.debitAmount, 0);
            }

            return {
                amount,
                netAmount,
                transactionCount: transactions.length,
                transactions
            };
        } catch (error) {
            return { amount: 0, netAmount: 0, transactionCount: 0, transactions: [] };
        }
    }

    /**
     * Get total assets for ratio calculation
     */
    async getTotalAssets(endDate) {
        try {
            const assetAccounts = await this.ChartOfAccounts.findAll({
                where: {
                    account_type: 'Asset'
                }
            });

            const accountCodes = assetAccounts.map(acc => acc.account_code);
            return await this.getAccountGroupBalance(accountCodes, endDate, false);
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get total equity for ratio calculation
     */
    async getTotalEquity(endDate) {
        try {
            const equityAccounts = await this.ChartOfAccounts.findAll({
                where: {
                    account_type: 'Equity'
                }
            });

            const accountCodes = equityAccounts.map(acc => acc.account_code);
            return await this.getAccountGroupBalance(accountCodes, endDate, false);
        } catch (error) {
            return 0;
        }
    }
}

module.exports = EquityChangesService;
