/**
 * Budget Validation Service
 * 
 * Business logic for budget validation and monitoring:
 * - Calculate budget vs actual spending
 * - Track additional expenses
 * - Compute variance analysis
 * - Generate budget health status
 */

const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const ProjectAdditionalExpense = require('../models/ProjectAdditionalExpense');

class BudgetValidationService {
  
  /**
   * Get comprehensive budget data for a project
   * Includes RAB, actual spending, and additional expenses
   */
  async getComprehensiveBudgetData(projectId) {
    try {
      // 1. Get RAB items (Budget)
      const rabItems = await this._getRABItems(projectId);
      
      // 2. Get actual spending from purchase tracking
      const actualTracking = await this._getActualTracking(projectId);
      
      // 3. Get additional expenses
      const additionalExpenses = await this._getAdditionalExpenses(projectId);
      
      // 4. Calculate summary
      const summary = this._calculateSummary(rabItems, actualTracking, additionalExpenses);
      
      // 5. Get category breakdown
      const categoryBreakdown = this._calculateCategoryBreakdown(rabItems, actualTracking);
      
      // 6. Get time series data for trends
      const timeSeriesData = await this._getTimeSeriesData(projectId);
      
      // 7. Merge RAB with actual data
      const rabWithActual = this._mergeRABWithActual(rabItems, actualTracking);
      
      return {
        success: true,
        data: {
          projectId,
          summary,
          rabItems: rabWithActual,
          categoryBreakdown,
          additionalExpenses,
          timeSeriesData,
          lastUpdated: new Date()
        }
      };
    } catch (error) {
      console.error('[BudgetValidationService] Error getting budget data:', error);
      throw error;
    }
  }
  
  /**
   * Get all approved RAB items
   */
  async _getRABItems(projectId) {
    const query = `
      SELECT 
        id,
        project_id as "projectId",
        category,
        description,
        unit,
        quantity,
        unit_price as "unitPrice",
        total_price as "totalPrice",
        status,
        is_approved as "isApproved",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM project_rab
      WHERE project_id = :projectId
        AND status = 'approved'
      ORDER BY category, description
    `;
    
    return await sequelize.query(query, {
      replacements: { projectId },
      type: QueryTypes.SELECT
    });
  }
  
  /**
   * Get actual spending from purchase tracking
   */
  async _getActualTracking(projectId) {
    const query = `
      SELECT 
        rpt.id,
        rpt.rab_item_id as "rabItemId",
        rpt.project_id as "projectId",
        rpt.po_number as "poNumber",
        rpt.quantity,
        rpt.unit_price as "unitPrice",
        rpt.total_amount as "totalAmount",
        rpt.purchase_date as "purchaseDate",
        rpt.status,
        rpt.notes,
        pr.category,
        pr.description as "rabDescription"
      FROM rab_purchase_tracking rpt
      LEFT JOIN project_rab pr ON pr.id::text = rpt.rab_item_id
      WHERE rpt.project_id = :projectId
        AND rpt.status != 'cancelled'
      ORDER BY rpt.purchase_date DESC
    `;
    
    return await sequelize.query(query, {
      replacements: { projectId },
      type: QueryTypes.SELECT
    });
  }
  
  /**
   * Get additional expenses
   */
  async _getAdditionalExpenses(projectId) {
    return await ProjectAdditionalExpense.findAll({
      where: {
        projectId,
        deletedAt: null
      },
      order: [['expenseDate', 'DESC']]
    });
  }
  
  /**
   * Calculate summary statistics
   */
  _calculateSummary(rabItems, actualTracking, additionalExpenses) {
    // Total RAB (Budget)
    const totalRAB = rabItems.reduce((sum, item) => {
      return sum + parseFloat(item.totalPrice || 0);
    }, 0);
    
    // Total Actual from purchase tracking
    const totalActual = actualTracking.reduce((sum, track) => {
      return sum + parseFloat(track.totalAmount || 0);
    }, 0);
    
    // Total Additional Expenses (only approved)
    const totalAdditional = additionalExpenses
      .filter(exp => exp.approvalStatus === 'approved')
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    
    // Total Spent (Actual + Additional)
    const totalSpent = totalActual + totalAdditional;
    
    // Remaining Budget
    const remaining = totalRAB - totalSpent;
    
    // Variance (negative means under budget, positive means over budget)
    const variance = totalSpent - totalRAB;
    const variancePercent = totalRAB > 0 ? (variance / totalRAB) * 100 : 0;
    
    // Progress percentage
    const progress = totalRAB > 0 ? (totalSpent / totalRAB) * 100 : 0;
    
    // Budget health status
    const budgetHealth = this._getBudgetHealth(progress);
    
    return {
      totalRAB: parseFloat(totalRAB.toFixed(2)),
      totalActual: parseFloat(totalActual.toFixed(2)),
      totalAdditional: parseFloat(totalAdditional.toFixed(2)),
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      remaining: parseFloat(remaining.toFixed(2)),
      variance: parseFloat(variance.toFixed(2)),
      variancePercent: parseFloat(variancePercent.toFixed(2)),
      progress: parseFloat(progress.toFixed(2)),
      budgetHealth
    };
  }
  
  /**
   * Calculate category breakdown
   */
  _calculateCategoryBreakdown(rabItems, actualTracking) {
    const categories = {};
    
    // Group RAB by category
    rabItems.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = {
          category,
          budget: 0,
          actual: 0,
          itemCount: 0
        };
      }
      categories[category].budget += parseFloat(item.totalPrice || 0);
      categories[category].itemCount += 1;
    });
    
    // Add actual spending to categories
    actualTracking.forEach(track => {
      const category = track.category || 'Uncategorized';
      if (categories[category]) {
        categories[category].actual += parseFloat(track.totalAmount || 0);
      }
    });
    
    // Calculate variance and percentage for each category
    return Object.values(categories).map(cat => ({
      ...cat,
      variance: cat.actual - cat.budget,
      percentUsed: cat.budget > 0 ? (cat.actual / cat.budget) * 100 : 0,
      status: this._getBudgetHealth((cat.actual / cat.budget) * 100)
    }));
  }
  
  /**
   * Merge RAB items with actual spending data
   */
  _mergeRABWithActual(rabItems, actualTracking) {
    return rabItems.map(rabItem => {
      // Find all tracking entries for this RAB item
      const itemTracking = actualTracking.filter(
        track => track.rabItemId === rabItem.id
      );
      
      // Calculate total actual for this item
      const actualSpent = itemTracking.reduce((sum, track) => {
        return sum + parseFloat(track.totalAmount || 0);
      }, 0);
      
      // Calculate variance
      const variance = actualSpent - parseFloat(rabItem.totalPrice || 0);
      const percentUsed = parseFloat(rabItem.totalPrice) > 0 
        ? (actualSpent / parseFloat(rabItem.totalPrice)) * 100 
        : 0;
      
      return {
        ...rabItem,
        actualSpent: parseFloat(actualSpent.toFixed(2)),
        variance: parseFloat(variance.toFixed(2)),
        percentUsed: parseFloat(percentUsed.toFixed(2)),
        trackingCount: itemTracking.length,
        lastPurchaseDate: itemTracking[0]?.purchaseDate || null,
        status: this._getBudgetHealth(percentUsed)
      };
    });
  }
  
  /**
   * Get time series data for spending trends
   */
  async _getTimeSeriesData(projectId) {
    const query = `
      SELECT 
        DATE_TRUNC('month', purchase_date) as period,
        SUM(total_amount) as monthly_spending,
        SUM(SUM(total_amount)) OVER (ORDER BY DATE_TRUNC('month', purchase_date)) as cumulative_spending
      FROM rab_purchase_tracking
      WHERE project_id = :projectId
        AND status != 'cancelled'
      GROUP BY DATE_TRUNC('month', purchase_date)
      ORDER BY period ASC
    `;
    
    const results = await sequelize.query(query, {
      replacements: { projectId },
      type: QueryTypes.SELECT
    });
    
    return results.map(r => ({
      period: r.period,
      monthlySpending: parseFloat(r.monthly_spending || 0),
      cumulativeSpending: parseFloat(r.cumulative_spending || 0)
    }));
  }
  
  /**
   * Determine budget health status
   */
  _getBudgetHealth(percentUsed) {
    if (percentUsed <= 90) {
      return { status: 'healthy', color: 'green', label: 'Healthy' };
    } else if (percentUsed <= 100) {
      return { status: 'warning', color: 'yellow', label: 'Warning' };
    } else {
      return { status: 'critical', color: 'red', label: 'Over Budget' };
    }
  }
  
  /**
   * Record actual spending for RAB item
   */
  async recordActualCost(projectId, data) {
    const { rabItemId, quantity, unitPrice, totalAmount, poNumber, purchaseDate, notes, createdBy } = data;
    
    const query = `
      INSERT INTO rab_purchase_tracking (
        project_id, rab_item_id, quantity, unit_price, total_amount, 
        po_number, purchase_date, status, notes, created_at, updated_at
      ) VALUES (
        :projectId, :rabItemId, :quantity, :unitPrice, :totalAmount,
        :poNumber, :purchaseDate, 'completed', :notes, NOW(), NOW()
      ) RETURNING *
    `;
    
    const result = await sequelize.query(query, {
      replacements: {
        projectId,
        rabItemId,
        quantity,
        unitPrice,
        totalAmount,
        poNumber: poNumber || null,
        purchaseDate: purchaseDate || new Date(),
        notes: notes || null
      },
      type: QueryTypes.INSERT
    });
    
    return {
      success: true,
      message: 'Actual cost recorded successfully',
      data: result[0][0]
    };
  }
  
  /**
   * Add additional expense
   */
  async addAdditionalExpense(projectId, data, createdBy) {
    const expense = await ProjectAdditionalExpense.create({
      projectId,
      ...data,
      createdBy,
      approvalStatus: data.amount > 10000000 ? 'pending' : 'approved' // Auto-approve if < 10M
    });
    
    return {
      success: true,
      message: 'Additional expense added successfully',
      data: expense
    };
  }
  
  /**
   * Get variance analysis
   */
  async getVarianceAnalysis(projectId, options = {}) {
    const { timeframe = 'month', groupBy = 'category' } = options;
    
    const budgetData = await this.getComprehensiveBudgetData(projectId);
    
    // Generate alerts
    const alerts = this._generateBudgetAlerts(budgetData.data);
    
    return {
      success: true,
      data: {
        byCategory: budgetData.data.categoryBreakdown,
        timeSeries: budgetData.data.timeSeriesData,
        summary: budgetData.data.summary,
        alerts
      }
    };
  }
  
  /**
   * Generate budget alerts
   */
  _generateBudgetAlerts(budgetData) {
    const alerts = [];
    
    // Check overall budget status
    if (budgetData.summary.progress > 100) {
      alerts.push({
        type: 'error',
        severity: 'high',
        category: 'Overall',
        message: `Project is ${budgetData.summary.variancePercent.toFixed(1)}% over budget`,
        value: budgetData.summary.variance
      });
    } else if (budgetData.summary.progress > 90) {
      alerts.push({
        type: 'warning',
        severity: 'medium',
        category: 'Overall',
        message: `Project budget utilization at ${budgetData.summary.progress.toFixed(1)}%`,
        value: budgetData.summary.remaining
      });
    }
    
    // Check per-category status
    budgetData.categoryBreakdown.forEach(cat => {
      if (cat.percentUsed > 100) {
        alerts.push({
          type: 'error',
          severity: 'high',
          category: cat.category,
          message: `${cat.category} is ${cat.percentUsed.toFixed(1)}% of budget`,
          value: cat.variance
        });
      } else if (cat.percentUsed > 95) {
        alerts.push({
          type: 'warning',
          severity: 'medium',
          category: cat.category,
          message: `${cat.category} approaching budget limit`,
          value: cat.budget - cat.actual
        });
      }
    });
    
    return alerts;
  }
}

module.exports = new BudgetValidationService();
