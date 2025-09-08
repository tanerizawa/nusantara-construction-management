/**
 * Project Costing and Profitability Analysis Service
 * Comprehensive project financial analysis for construction industry
 * Includes budget vs actual analysis, cost allocation, and profitability metrics
 */

const { models } = require('../models');
const { JournalEntry, JournalEntryLine, ChartOfAccounts } = models;
const { Op, fn, col } = require('sequelize');

class ProjectCostingService {

  /**
   * Generate Project Cost Analysis
   * Detailed breakdown of project costs by category
   */
  async generateProjectCostAnalysis(params = {}) {
    const {
      projectId,
      startDate = new Date(new Date().getFullYear(), 0, 1),
      endDate = new Date(),
      subsidiaryId = null
    } = params;

    try {
      if (!projectId) {
        return {
          success: false,
          message: 'Project ID is required for cost analysis'
        };
      }

      // Get all expense accounts
      const expenseAccounts = await ChartOfAccounts.findAll({
        where: {
          accountType: 'EXPENSE',
          isActive: true
        }
      });

      let totalProjectCosts = 0;
      const costBreakdown = {};
      const monthlyTrends = {};

      // Build where clause for journal entries
      const entryWhereClause = {
        entryDate: { [Op.between]: [startDate, endDate] },
        status: 'POSTED',
        projectId: projectId
      };

      if (subsidiaryId) entryWhereClause.subsidiaryId = subsidiaryId;

      for (const account of expenseAccounts) {
        const accountCosts = await JournalEntryLine.findAll({
          where: { 
            accountId: account.id,
            debitAmount: { [Op.gt]: 0 } // Only expense debits
          },
          include: [{
            model: JournalEntry,
            as: 'journalEntry',
            where: entryWhereClause,
            attributes: ['entryDate', 'description']
          }],
          attributes: ['debitAmount', 'description']
        });

        if (accountCosts.length > 0) {
          const categoryTotal = accountCosts.reduce((sum, cost) => sum + parseFloat(cost.debitAmount), 0);
          totalProjectCosts += categoryTotal;

          if (!costBreakdown[account.accountSubType]) {
            costBreakdown[account.accountSubType] = {
              categoryName: account.accountSubType,
              accounts: [],
              totalAmount: 0,
              percentage: 0
            };
          }

          costBreakdown[account.accountSubType].accounts.push({
            accountCode: account.accountCode,
            accountName: account.accountName,
            amount: categoryTotal,
            transactions: accountCosts.length
          });

          costBreakdown[account.accountSubType].totalAmount += categoryTotal;

          // Monthly trend analysis
          accountCosts.forEach(cost => {
            const month = new Date(cost.journalEntry.entryDate).toISOString().slice(0, 7);
            if (!monthlyTrends[month]) monthlyTrends[month] = 0;
            monthlyTrends[month] += parseFloat(cost.debitAmount);
          });
        }
      }

      // Calculate percentages
      Object.keys(costBreakdown).forEach(category => {
        costBreakdown[category].percentage = totalProjectCosts > 0 
          ? ((costBreakdown[category].totalAmount / totalProjectCosts) * 100).toFixed(2)
          : 0;
      });

      // Sort monthly trends
      const sortedTrends = Object.keys(monthlyTrends)
        .sort()
        .map(month => ({
          month,
          amount: monthlyTrends[month],
          monthName: new Date(month + '-01').toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long' 
          })
        }));

      return {
        success: true,
        data: {
          reportType: 'Project Cost Analysis',
          projectId,
          period: {
            startDate,
            endDate
          },
          subsidiaryId,
          summary: {
            totalProjectCosts,
            costCategories: Object.keys(costBreakdown).length,
            averageMonthlyCost: sortedTrends.length > 0 
              ? totalProjectCosts / sortedTrends.length 
              : 0
          },
          costBreakdown: Object.values(costBreakdown),
          monthlyTrends: sortedTrends
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating project cost analysis',
        error: error.message
      };
    }
  }

  /**
   * Generate Project Profitability Analysis
   * Revenue vs costs with margin analysis
   */
  async generateProjectProfitabilityAnalysis(params = {}) {
    const {
      projectId,
      startDate = new Date(new Date().getFullYear(), 0, 1),
      endDate = new Date(),
      subsidiaryId = null
    } = params;

    try {
      if (!projectId) {
        return {
          success: false,
          message: 'Project ID is required for profitability analysis'
        };
      }

      // Build where clause
      const entryWhereClause = {
        entryDate: { [Op.between]: [startDate, endDate] },
        status: 'POSTED',
        projectId: projectId
      };

      if (subsidiaryId) entryWhereClause.subsidiaryId = subsidiaryId;

      // Get project revenues
      const revenueAccounts = await ChartOfAccounts.findAll({
        where: {
          accountType: 'REVENUE',
          isActive: true
        }
      });

      let totalRevenue = 0;
      const revenueBreakdown = [];

      for (const account of revenueAccounts) {
        const revenues = await JournalEntryLine.findAll({
          where: { 
            accountId: account.id,
            creditAmount: { [Op.gt]: 0 } // Revenue credits
          },
          include: [{
            model: JournalEntry,
            as: 'journalEntry',
            where: entryWhereClause
          }]
        });

        if (revenues.length > 0) {
          const accountRevenue = revenues.reduce((sum, rev) => sum + parseFloat(rev.creditAmount), 0);
          totalRevenue += accountRevenue;

          revenueBreakdown.push({
            accountCode: account.accountCode,
            accountName: account.accountName,
            amount: accountRevenue,
            percentage: 0 // Will calculate after total known
          });
        }
      }

      // Calculate revenue percentages
      revenueBreakdown.forEach(item => {
        item.percentage = totalRevenue > 0 
          ? ((item.amount / totalRevenue) * 100).toFixed(2)
          : 0;
      });

      // Get project costs (reuse cost analysis)
      const costAnalysis = await this.generateProjectCostAnalysis(params);
      const totalCosts = costAnalysis.success ? costAnalysis.data.summary.totalProjectCosts : 0;

      // Calculate profitability metrics
      const grossProfit = totalRevenue - totalCosts;
      const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : 0;

      // Project efficiency metrics
      const costPerRevenue = totalRevenue > 0 ? (totalCosts / totalRevenue).toFixed(4) : 0;
      const revenueEfficiency = totalCosts > 0 ? (totalRevenue / totalCosts).toFixed(2) : 0;

      return {
        success: true,
        data: {
          reportType: 'Project Profitability Analysis',
          projectId,
          period: {
            startDate,
            endDate
          },
          subsidiaryId,
          financialSummary: {
            totalRevenue,
            totalCosts,
            grossProfit,
            grossMargin: parseFloat(grossMargin),
            netMargin: parseFloat(grossMargin) // Simplified for construction
          },
          revenueAnalysis: {
            breakdown: revenueBreakdown,
            averageTransactionSize: revenueBreakdown.length > 0 
              ? totalRevenue / revenueBreakdown.reduce((sum, item) => sum + 1, 0) 
              : 0
          },
          costAnalysis: costAnalysis.success ? costAnalysis.data.costBreakdown : [],
          performanceMetrics: {
            costPerRevenue: parseFloat(costPerRevenue),
            revenueEfficiency: parseFloat(revenueEfficiency),
            profitabilityIndex: totalCosts > 0 ? (grossProfit / totalCosts).toFixed(2) : 0,
            breakEvenPoint: grossMargin > 0 ? (totalCosts / (grossMargin / 100)).toFixed(0) : 0
          },
          monthlyTrends: costAnalysis.success ? costAnalysis.data.monthlyTrends : []
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating project profitability analysis',
        error: error.message
      };
    }
  }

  /**
   * Generate Multi-Project Comparison
   * Compare performance across multiple projects
   */
  async generateMultiProjectComparison(params = {}) {
    const {
      projectIds = [],
      startDate = new Date(new Date().getFullYear(), 0, 1),
      endDate = new Date(),
      subsidiaryId = null
    } = params;

    try {
      if (!projectIds || projectIds.length === 0) {
        return {
          success: false,
          message: 'At least one project ID is required for comparison'
        };
      }

      const projectComparisons = [];

      for (const projectId of projectIds) {
        const profitabilityAnalysis = await this.generateProjectProfitabilityAnalysis({
          projectId,
          startDate,
          endDate,
          subsidiaryId
        });

        if (profitabilityAnalysis.success) {
          projectComparisons.push({
            projectId,
            ...profitabilityAnalysis.data.financialSummary,
            performanceMetrics: profitabilityAnalysis.data.performanceMetrics
          });
        }
      }

      // Calculate portfolio metrics
      const totalPortfolioRevenue = projectComparisons.reduce((sum, p) => sum + p.totalRevenue, 0);
      const totalPortfolioCosts = projectComparisons.reduce((sum, p) => sum + p.totalCosts, 0);
      const totalPortfolioProfit = totalPortfolioRevenue - totalPortfolioCosts;

      // Rank projects by profitability
      const rankedProjects = projectComparisons
        .sort((a, b) => b.grossMargin - a.grossMargin)
        .map((project, index) => ({
          ...project,
          rank: index + 1,
          revenueShare: totalPortfolioRevenue > 0 
            ? ((project.totalRevenue / totalPortfolioRevenue) * 100).toFixed(2)
            : 0
        }));

      return {
        success: true,
        data: {
          reportType: 'Multi-Project Performance Comparison',
          period: {
            startDate,
            endDate
          },
          subsidiaryId,
          portfolioSummary: {
            totalProjects: projectIds.length,
            totalRevenue: totalPortfolioRevenue,
            totalCosts: totalPortfolioCosts,
            totalProfit: totalPortfolioProfit,
            averageMargin: projectComparisons.length > 0 
              ? (projectComparisons.reduce((sum, p) => sum + p.grossMargin, 0) / projectComparisons.length).toFixed(2)
              : 0
          },
          projectRankings: rankedProjects,
          performanceDistribution: {
            highPerformers: rankedProjects.filter(p => p.grossMargin >= 20).length,
            mediumPerformers: rankedProjects.filter(p => p.grossMargin >= 10 && p.grossMargin < 20).length,
            lowPerformers: rankedProjects.filter(p => p.grossMargin < 10).length
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating multi-project comparison',
        error: error.message
      };
    }
  }

  /**
   * Generate Resource Utilization Analysis
   * Track how resources are allocated across projects
   */
  async generateResourceUtilizationAnalysis(params = {}) {
    const {
      startDate = new Date(new Date().getFullYear(), 0, 1),
      endDate = new Date(),
      subsidiaryId = null
    } = params;

    try {
      // Get all projects with costs in the period
      const entryWhereClause = {
        entryDate: { [Op.between]: [startDate, endDate] },
        status: 'POSTED',
        projectId: { [Op.ne]: null }
      };

      if (subsidiaryId) entryWhereClause.subsidiaryId = subsidiaryId;

      const projectCosts = await JournalEntryLine.findAll({
        where: {
          debitAmount: { [Op.gt]: 0 }
        },
        include: [{
          model: JournalEntry,
          as: 'journalEntry',
          where: entryWhereClause,
          attributes: ['projectId', 'entryDate']
        }, {
          model: ChartOfAccounts,
          as: 'account',
          where: { accountType: 'EXPENSE' },
          attributes: ['accountCode', 'accountName', 'accountSubType']
        }],
        attributes: ['debitAmount']
      });

      // Group by project and resource type
      const resourceAllocation = {};
      const projectTotals = {};

      projectCosts.forEach(cost => {
        const projectId = cost.journalEntry.projectId;
        const resourceType = cost.account.accountSubType || 'OTHER';
        const amount = parseFloat(cost.debitAmount);

        if (!resourceAllocation[resourceType]) {
          resourceAllocation[resourceType] = {};
        }

        if (!resourceAllocation[resourceType][projectId]) {
          resourceAllocation[resourceType][projectId] = 0;
        }

        if (!projectTotals[projectId]) {
          projectTotals[projectId] = 0;
        }

        resourceAllocation[resourceType][projectId] += amount;
        projectTotals[projectId] += amount;
      });

      const totalAllocation = Object.values(projectTotals).reduce((sum, total) => sum + total, 0);

      // Format for analysis
      const resourceAnalysis = Object.keys(resourceAllocation).map(resourceType => {
        const resourceTotal = Object.values(resourceAllocation[resourceType])
          .reduce((sum, amount) => sum + amount, 0);

        const projectAllocations = Object.keys(resourceAllocation[resourceType]).map(projectId => ({
          projectId,
          amount: resourceAllocation[resourceType][projectId],
          percentage: resourceTotal > 0 
            ? ((resourceAllocation[resourceType][projectId] / resourceTotal) * 100).toFixed(2)
            : 0
        }));

        return {
          resourceType,
          totalAmount: resourceTotal,
          shareOfTotal: totalAllocation > 0 
            ? ((resourceTotal / totalAllocation) * 100).toFixed(2)
            : 0,
          projectDistribution: projectAllocations.sort((a, b) => b.amount - a.amount)
        };
      });

      return {
        success: true,
        data: {
          reportType: 'Resource Utilization Analysis',
          period: {
            startDate,
            endDate
          },
          subsidiaryId,
          summary: {
            totalResourceAllocation: totalAllocation,
            uniqueProjects: Object.keys(projectTotals).length,
            resourceCategories: resourceAnalysis.length,
            averageProjectCost: Object.keys(projectTotals).length > 0 
              ? totalAllocation / Object.keys(projectTotals).length 
              : 0
          },
          resourceBreakdown: resourceAnalysis.sort((a, b) => b.totalAmount - a.totalAmount),
          projectRankings: Object.keys(projectTotals)
            .map(projectId => ({
              projectId,
              totalCost: projectTotals[projectId],
              shareOfTotal: totalAllocation > 0 
                ? ((projectTotals[projectId] / totalAllocation) * 100).toFixed(2)
                : 0
            }))
            .sort((a, b) => b.totalCost - a.totalCost)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating resource utilization analysis',
        error: error.message
      };
    }
  }
}

module.exports = new ProjectCostingService();
