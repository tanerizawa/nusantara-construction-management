/**
 * Indonesian Tax Reporting Service
 * Handles PPh, PPN, and other Indonesian tax calculations and reporting
 * Compliant with Indonesian tax regulations (UU PPh, UU PPN)
 */

const { models } = require('../models');
const { JournalEntry, JournalEntryLine, ChartOfAccounts } = models;
const { Op, fn, col } = require('sequelize');

class IndonesianTaxService {
  
  /**
   * Generate PPh 21 Report (Employee Income Tax)
   * Monthly withholding tax report for employees
   */
  async generatePPh21Report(params = {}) {
    const {
      month,
      year = new Date().getFullYear(),
      subsidiaryId = null
    } = params;

    try {
      // Get salary expense accounts
      const salaryAccounts = await ChartOfAccounts.findAll({
        where: {
          account_sub_type: {
            [Op.in]: ['LABOR_COST', 'ADMIN_SALARY']
          },
          is_active: true
        }
      });

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of month

      let totalSalary = 0;
      let totalPPh21 = 0;
      const employeeDetails = [];

      for (const account of salaryAccounts) {
        const salaryData = await this.getSalaryTransactions(
          account.id, startDate, endDate, subsidiaryId
        );
        
        // Calculate PPh 21 for each transaction
        for (const transaction of salaryData) {
          const pph21Amount = this.calculatePPh21(transaction.amount);
          totalSalary += transaction.amount;
          totalPPh21 += pph21Amount;
          
          employeeDetails.push({
            date: transaction.date,
            description: transaction.description,
            grossSalary: transaction.amount,
            pph21Amount,
            netSalary: transaction.amount - pph21Amount
          });
        }
      }

      return {
        success: true,
        data: {
          reportType: 'PPh 21 Monthly Report',
          period: {
            month,
            year,
            monthName: this.getMonthName(month)
          },
          subsidiaryId,
          summary: {
            totalEmployees: employeeDetails.length,
            totalGrossSalary: totalSalary,
            totalPPh21Withheld: totalPPh21,
            totalNetSalary: totalSalary - totalPPh21
          },
          details: employeeDetails,
          taxRates: this.getPPh21TaxRates(),
          dueDate: this.getPPh21DueDate(month, year),
          formReference: 'Bukti Potong PPh 21'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating PPh 21 report',
        error: error.message
      };
    }
  }

  /**
   * Generate PPN Report (Value Added Tax)
   * Monthly VAT report with input and output VAT
   */
  async generatePPNReport(params = {}) {
    const {
      month,
      year = new Date().getFullYear(),
      subsidiaryId = null
    } = params;

    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Get VAT-applicable accounts
      const vatAccounts = await ChartOfAccounts.findAll({
        where: {
          vat_applicable: true,
          is_active: true
        }
      });

      let totalOutputVAT = 0; // PPN Keluaran
      let totalInputVAT = 0;  // PPN Masukan
      const vatTransactions = [];

      for (const account of vatAccounts) {
        const transactions = await this.getVATTransactions(
          account.id, startDate, endDate, subsidiaryId
        );

        for (const transaction of transactions) {
          const vatAmount = this.calculatePPN(transaction.amount);
          const isOutput = account.accountType === 'REVENUE';
          
          if (isOutput) {
            totalOutputVAT += vatAmount;
          } else {
            totalInputVAT += vatAmount;
          }

          vatTransactions.push({
            date: transaction.date,
            accountCode: account.accountCode,
            accountName: account.accountName,
            description: transaction.description,
            baseAmount: transaction.amount,
            vatAmount,
            vatType: isOutput ? 'OUTPUT' : 'INPUT'
          });
        }
      }

      const netVATPayable = totalOutputVAT - totalInputVAT;

      return {
        success: true,
        data: {
          reportType: 'PPN Monthly Report',
          period: {
            month,
            year,
            monthName: this.getMonthName(month)
          },
          subsidiaryId,
          summary: {
            totalOutputVAT,
            totalInputVAT,
            netVATPayable: Math.max(0, netVATPayable), // Only payable if positive
            vatRefund: Math.abs(Math.min(0, netVATPayable)), // Refund if negative
            vatRate: '11%' // Current Indonesian VAT rate
          },
          transactions: vatTransactions,
          dueDate: this.getPPNDueDate(month, year),
          formReference: 'SPT Masa PPN'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating PPN report',
        error: error.message
      };
    }
  }

  /**
   * Generate PPh 23 Report (Withholding Tax on Services)
   * For payments to service providers, contractors, etc.
   */
  async generatePPh23Report(params = {}) {
    const {
      month,
      year = new Date().getFullYear(),
      subsidiaryId = null
    } = params;

    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Get service expense accounts
      const serviceAccounts = await ChartOfAccounts.findAll({
        where: {
          account_sub_type: {
            [Op.in]: ['SUBCONTRACTOR_COST', 'EQUIPMENT_COST']
          },
          is_active: true
        }
      });

      let totalServicePayments = 0;
      let totalPPh23 = 0;
      const servicePayments = [];

      for (const account of serviceAccounts) {
        const payments = await this.getServicePayments(
          account.id, startDate, endDate, subsidiaryId
        );

        for (const payment of payments) {
          const pph23Amount = this.calculatePPh23(payment.amount, account.accountSubType);
          totalServicePayments += payment.amount;
          totalPPh23 += pph23Amount;

          servicePayments.push({
            date: payment.date,
            accountCode: account.accountCode,
            accountName: account.accountName,
            description: payment.description,
            grossAmount: payment.amount,
            pph23Amount,
            netAmount: payment.amount - pph23Amount,
            serviceType: account.accountSubType,
            taxRate: this.getPPh23Rate(account.accountSubType)
          });
        }
      }

      return {
        success: true,
        data: {
          reportType: 'PPh 23 Monthly Report',
          period: {
            month,
            year,
            monthName: this.getMonthName(month)
          },
          subsidiaryId,
          summary: {
            totalTransactions: servicePayments.length,
            totalGrossPayments: totalServicePayments,
            totalPPh23Withheld: totalPPh23,
            totalNetPayments: totalServicePayments - totalPPh23
          },
          details: servicePayments,
          dueDate: this.getPPh23DueDate(month, year),
          formReference: 'Bukti Potong PPh 23'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating PPh 23 report',
        error: error.message
      };
    }
  }

  /**
   * Generate Construction Tax Summary
   * Comprehensive tax overview for construction companies
   */
  async generateConstructionTaxSummary(params = {}) {
    const {
      month,
      year = new Date().getFullYear(),
      subsidiaryId = null
    } = params;

    try {
      // Get all tax reports
      const pph21 = await this.generatePPh21Report({ month, year, subsidiaryId });
      const ppn = await this.generatePPNReport({ month, year, subsidiaryId });
      const pph23 = await this.generatePPh23Report({ month, year, subsidiaryId });

      const totalTaxLiability = 
        (pph21.success ? pph21.data.summary.totalPPh21Withheld : 0) +
        (ppn.success ? ppn.data.summary.netVATPayable : 0) +
        (pph23.success ? pph23.data.summary.totalPPh23Withheld : 0);

      return {
        success: true,
        data: {
          reportType: 'Construction Industry Tax Summary',
          period: {
            month,
            year,
            monthName: this.getMonthName(month)
          },
          subsidiaryId,
          summary: {
            totalTaxLiability,
            pph21Liability: pph21.success ? pph21.data.summary.totalPPh21Withheld : 0,
            ppnLiability: ppn.success ? ppn.data.summary.netVATPayable : 0,
            pph23Liability: pph23.success ? pph23.data.summary.totalPPh23Withheld : 0
          },
          reports: {
            pph21: pph21.success ? pph21.data : { error: pph21.message },
            ppn: ppn.success ? ppn.data : { error: ppn.message },
            pph23: pph23.success ? pph23.data : { error: pph23.message }
          },
          complianceStatus: {
            pph21Due: this.getPPh21DueDate(month, year),
            ppnDue: this.getPPNDueDate(month, year),
            pph23Due: this.getPPh23DueDate(month, year)
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating construction tax summary',
        error: error.message
      };
    }
  }

  // Helper methods for tax calculations
  calculatePPh21(grossSalary) {
    // Simplified PPh 21 calculation
    // In practice, this would include PTKP, tax brackets, etc.
    if (grossSalary <= 4500000) return 0; // Below taxable threshold
    const taxableIncome = grossSalary - 4500000; // Simplified PTKP
    return taxableIncome * 0.05; // 5% rate for lower bracket
  }

  calculatePPN(baseAmount) {
    return baseAmount * 0.11; // 11% VAT rate
  }

  calculatePPh23(grossAmount, serviceType) {
    const rates = {
      'SUBCONTRACTOR_COST': 0.02, // 2% for construction services
      'EQUIPMENT_COST': 0.02,     // 2% for equipment rental
      'PROFESSIONAL_SERVICE': 0.025 // 2.5% for professional services
    };
    return grossAmount * (rates[serviceType] || 0.02);
  }

  getPPh23Rate(serviceType) {
    const rates = {
      'SUBCONTRACTOR_COST': '2%',
      'EQUIPMENT_COST': '2%',
      'PROFESSIONAL_SERVICE': '2.5%'
    };
    return rates[serviceType] || '2%';
  }

  getPPh21TaxRates() {
    return [
      { bracket: 'Up to Rp 60,000,000', rate: '5%' },
      { bracket: 'Rp 60,000,000 - Rp 250,000,000', rate: '15%' },
      { bracket: 'Rp 250,000,000 - Rp 500,000,000', rate: '25%' },
      { bracket: 'Above Rp 500,000,000', rate: '30%' }
    ];
  }

  // Due date calculations
  getPPh21DueDate(month, year) {
    return new Date(year, month, 10); // 10th of following month
  }

  getPPNDueDate(month, year) {
    return new Date(year, month, 25); // 25th of following month
  }

  getPPh23DueDate(month, year) {
    return new Date(year, month, 10); // 10th of following month
  }

  getMonthName(month) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1];
  }

  // Data retrieval methods
  async getSalaryTransactions(accountId, startDate, endDate, subsidiaryId) {
    const whereClause = { account_id: accountId };
    const entryWhereClause = {
      entry_date: { [Op.between]: [startDate, endDate] },
      status: 'POSTED'
    };

    if (subsidiaryId) entryWhereClause.subsidiary_id = subsidiaryId;

    const transactions = await JournalEntryLine.findAll({
      where: whereClause,
      include: [{
        model: JournalEntry,
        as: 'journalEntry',
        where: entryWhereClause,
        attributes: ['entry_date', 'description']
      }]
    });

    return transactions.map(t => ({
      date: t.journalEntry.entry_date,
      description: t.journalEntry.description,
      amount: t.debitAmount // Salary expenses are debited
    }));
  }

  async getVATTransactions(accountId, startDate, endDate, subsidiaryId) {
    return this.getSalaryTransactions(accountId, startDate, endDate, subsidiaryId);
  }

  async getServicePayments(accountId, startDate, endDate, subsidiaryId) {
    return this.getSalaryTransactions(accountId, startDate, endDate, subsidiaryId);
  }
}

module.exports = new IndonesianTaxService();
