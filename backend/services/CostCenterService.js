/**
 * Cost Center Management Service
 * Handles cost center operations, allocation, and performance tracking
 * for construction industry with department and project-based costing
 */
class CostCenterService {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  /**
   * Create or update cost center
   * @param {Object} params - Cost center parameters
   * @returns {Object} Cost center creation result
   */
  async createCostCenter(params) {
    try {
      const {
        costCenterCode,
        costCenterName,
        costCenterType,
        departmentId,
        managerId,
        budgetLimit,
        isActive = true,
        parentCostCenterId,
        description,
        subsidiaryId
      } = params;

      // Validate required fields
      if (!costCenterCode || !costCenterName || !costCenterType) {
        return {
          success: false,
          message: 'Cost center code, name, and type are required'
        };
      }

      // Cost center types for construction industry
      const validTypes = [
        'ADMINISTRATIVE',
        'OPERATIONAL',
        'PROJECT_SPECIFIC',
        'EQUIPMENT',
        'MATERIAL_PROCUREMENT',
        'LABOR_MANAGEMENT',
        'QUALITY_CONTROL',
        'SAFETY_COMPLIANCE',
        'OVERHEAD'
      ];

      if (!validTypes.includes(costCenterType)) {
        return {
          success: false,
          message: `Invalid cost center type. Valid types: ${validTypes.join(', ')}`
        };
      }

      const costCenter = {
        id: `CC-${Date.now()}`,
        costCenterCode,
        costCenterName,
        costCenterType,
        departmentId,
        managerId,
        budgetLimit: budgetLimit || 0,
        actualCosts: 0,
        allocatedCosts: 0,
        isActive,
        parentCostCenterId,
        description,
        subsidiaryId,
        createdAt: new Date(),
        updatedAt: new Date(),
        performanceMetrics: {
          budgetUtilization: 0,
          costEfficiency: 'WITHIN_BUDGET',
          variancePercent: 0,
          allocationAccuracy: 100
        },
        allocations: []
      };

      return {
        success: true,
        message: 'Cost center created successfully',
        data: {
          costCenter,
          summary: {
            totalBudget: budgetLimit || 0,
            remainingBudget: budgetLimit || 0,
            utilizationPercent: 0
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creating cost center',
        error: error.message
      };
    }
  }

  /**
   * Allocate costs to cost centers
   * @param {Object} params - Cost allocation parameters
   * @returns {Object} Cost allocation result
   */
  async allocateCosts(params) {
    try {
      const {
        costCenterId,
        projectId,
        allocationAmount,
        allocationType,
        allocationBasis,
        description,
        effectiveDate,
        journalEntryId
      } = params;

      // Allocation types for construction
      const validAllocations = [
        'DIRECT_LABOR',
        'DIRECT_MATERIAL',
        'EQUIPMENT_USAGE',
        'OVERHEAD_ALLOCATION',
        'ADMINISTRATIVE_COSTS',
        'UTILITY_COSTS',
        'INSURANCE_ALLOCATION',
        'FACILITY_COSTS'
      ];

      if (!validAllocations.includes(allocationType)) {
        return {
          success: false,
          message: `Invalid allocation type. Valid types: ${validAllocations.join(', ')}`
        };
      }

      // Allocation basis methods
      const allocationMethods = {
        DIRECT_LABOR: 'Labor hours worked',
        DIRECT_MATERIAL: 'Material quantity used',
        EQUIPMENT_USAGE: 'Equipment hours utilized',
        OVERHEAD_ALLOCATION: 'Percentage of direct costs',
        ADMINISTRATIVE_COSTS: 'Revenue percentage',
        UTILITY_COSTS: 'Square footage basis',
        INSURANCE_ALLOCATION: 'Asset value basis',
        FACILITY_COSTS: 'Headcount basis'
      };

      const allocation = {
        id: `ALLOC-${Date.now()}`,
        costCenterId,
        projectId,
        allocationAmount: parseFloat(allocationAmount),
        allocationType,
        allocationBasis: allocationBasis || allocationMethods[allocationType],
        description,
        effectiveDate: effectiveDate || new Date(),
        journalEntryId,
        status: 'ACTIVE',
        createdAt: new Date(),
        calculationDetails: {
          method: allocationMethods[allocationType],
          rate: allocationAmount,
          baseAmount: allocationAmount,
          allocationPercent: 100
        }
      };

      return {
        success: true,
        message: 'Cost allocation created successfully',
        data: {
          allocation,
          summary: {
            totalAllocated: allocationAmount,
            allocationType,
            effectiveDate: allocation.effectiveDate
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creating cost allocation',
        error: error.message
      };
    }
  }

  /**
   * Get cost center performance analysis
   * @param {Object} params - Analysis parameters
   * @returns {Object} Performance analysis result
   */
  async getCostCenterPerformance(params) {
    try {
      const {
        costCenterId,
        startDate,
        endDate,
        includeAllocations = true,
        subsidiaryId
      } = params;

      // Get actual costs from journal entries
      const actualCostsQuery = `
        SELECT 
          cc.cost_center_code,
          cc.cost_center_name,
          cc.cost_center_type,
          cc.budget_limit,
          SUM(COALESCE(jel.debit_amount, 0) - COALESCE(jel.credit_amount, 0)) as actual_costs,
          COUNT(jel.id) as transaction_count,
          AVG(COALESCE(jel.debit_amount, 0) - COALESCE(jel.credit_amount, 0)) as avg_transaction_amount
        FROM cost_centers cc
        LEFT JOIN journal_entry_lines jel ON cc.id = jel.cost_center_id
        LEFT JOIN journal_entries je ON jel.journal_entry_id = je.id
        WHERE 1=1
          ${costCenterId ? `AND cc.id = '${costCenterId}'` : ''}
          ${subsidiaryId ? `AND je.subsidiary_id = '${subsidiaryId}'` : ''}
          ${startDate ? `AND je.entry_date >= '${startDate}'` : ''}
          ${endDate ? `AND je.entry_date <= '${endDate}'` : ''}
          AND cc.is_active = true
        GROUP BY cc.id, cc.cost_center_code, cc.cost_center_name, cc.cost_center_type, cc.budget_limit
        ORDER BY cc.cost_center_code
      `;

      // Mock data for demonstration (in real implementation, use actual database)
      const mockCostCenters = [
        {
          cost_center_code: 'CC-ADM-001',
          cost_center_name: 'Administration',
          cost_center_type: 'ADMINISTRATIVE',
          budget_limit: 500000000,
          actual_costs: 425000000,
          transaction_count: 45,
          avg_transaction_amount: 9444444
        },
        {
          cost_center_code: 'CC-OPS-001',
          cost_center_name: 'Operations',
          cost_center_type: 'OPERATIONAL',
          budget_limit: 2000000000,
          actual_costs: 1850000000,
          transaction_count: 120,
          avg_transaction_amount: 15416667
        },
        {
          cost_center_code: 'CC-PRJ-001',
          cost_center_name: 'Project Alpha',
          cost_center_type: 'PROJECT_SPECIFIC',
          budget_limit: 3000000000,
          actual_costs: 2750000000,
          transaction_count: 85,
          avg_transaction_amount: 32352941
        }
      ];

      const performanceAnalysis = mockCostCenters.map(cc => {
        const budgetLimit = parseFloat(cc.budget_limit) || 0;
        const actualCosts = parseFloat(cc.actual_costs) || 0;
        const variance = actualCosts - budgetLimit;
        const variancePercent = budgetLimit > 0 ? (variance / budgetLimit) * 100 : 0;
        const utilization = budgetLimit > 0 ? (actualCosts / budgetLimit) * 100 : 0;

        let status = 'WITHIN_BUDGET';
        if (variancePercent > 10) status = 'OVER_BUDGET';
        else if (variancePercent < -20) status = 'UNDER_BUDGET';

        let efficiency = 'GOOD';
        if (utilization > 95) efficiency = 'EXCELLENT';
        else if (utilization < 70) efficiency = 'NEEDS_IMPROVEMENT';

        return {
          costCenterCode: cc.cost_center_code,
          costCenterName: cc.cost_center_name,
          costCenterType: cc.cost_center_type,
          budget: {
            budgetLimit,
            actualCosts,
            variance,
            variancePercent,
            utilization,
            remainingBudget: budgetLimit - actualCosts
          },
          performance: {
            status,
            efficiency,
            transactionCount: parseInt(cc.transaction_count),
            avgTransactionAmount: parseFloat(cc.avg_transaction_amount),
            costPerTransaction: actualCosts / parseInt(cc.transaction_count)
          },
          recommendations: this.generateCostCenterRecommendations(variancePercent, utilization, cc.cost_center_type)
        };
      });

      // Portfolio summary
      const portfolioSummary = {
        totalCostCenters: performanceAnalysis.length,
        totalBudget: performanceAnalysis.reduce((sum, cc) => sum + cc.budget.budgetLimit, 0),
        totalActual: performanceAnalysis.reduce((sum, cc) => sum + cc.budget.actualCosts, 0),
        totalVariance: performanceAnalysis.reduce((sum, cc) => sum + cc.budget.variance, 0),
        avgUtilization: performanceAnalysis.reduce((sum, cc) => sum + cc.budget.utilization, 0) / performanceAnalysis.length,
        overBudgetCount: performanceAnalysis.filter(cc => cc.performance.status === 'OVER_BUDGET').length,
        underBudgetCount: performanceAnalysis.filter(cc => cc.performance.status === 'UNDER_BUDGET').length
      };

      return {
        success: true,
        message: 'Cost center performance analysis generated successfully',
        data: {
          period: {
            startDate: startDate || '2025-01-01',
            endDate: endDate || '2025-09-08'
          },
          portfolioSummary,
          costCenterPerformance: performanceAnalysis,
          topPerformers: performanceAnalysis
            .sort((a, b) => b.performance.efficiency === 'EXCELLENT' ? 1 : -1)
            .slice(0, 3),
          needsAttention: performanceAnalysis
            .filter(cc => cc.performance.status === 'OVER_BUDGET')
            .sort((a, b) => b.budget.variancePercent - a.budget.variancePercent)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating cost center performance analysis',
        error: error.message
      };
    }
  }

  /**
   * Generate cost allocation report
   * @param {Object} params - Report parameters
   * @returns {Object} Allocation report result
   */
  async getCostAllocationReport(params) {
    try {
      const {
        projectId,
        costCenterId,
        startDate,
        endDate,
        allocationType,
        subsidiaryId
      } = params;

      // Mock allocation data for demonstration
      const mockAllocations = [
        {
          allocationId: 'ALLOC-1694175600001',
          costCenterCode: 'CC-OPS-001',
          costCenterName: 'Operations',
          projectId: 'PROJ-001',
          projectName: 'Construction Project 1',
          allocationType: 'DIRECT_LABOR',
          allocationAmount: 750000000,
          allocationBasis: 'Labor hours worked',
          effectiveDate: '2025-09-01',
          description: 'Labor cost allocation for Q3'
        },
        {
          allocationId: 'ALLOC-1694175600002',
          costCenterCode: 'CC-OPS-001',
          costCenterName: 'Operations',
          projectId: 'PROJ-002',
          projectName: 'Construction Project 2',
          allocationType: 'EQUIPMENT_USAGE',
          allocationAmount: 425000000,
          allocationBasis: 'Equipment hours utilized',
          effectiveDate: '2025-09-01',
          description: 'Equipment usage allocation'
        },
        {
          allocationId: 'ALLOC-1694175600003',
          costCenterCode: 'CC-ADM-001',
          costCenterName: 'Administration',
          projectId: 'PROJ-001',
          projectName: 'Construction Project 1',
          allocationType: 'OVERHEAD_ALLOCATION',
          allocationAmount: 125000000,
          allocationBasis: 'Percentage of direct costs',
          effectiveDate: '2025-09-01',
          description: 'Administrative overhead allocation'
        }
      ];

      // Filter allocations based on parameters
      let filteredAllocations = mockAllocations;
      if (projectId) {
        filteredAllocations = filteredAllocations.filter(alloc => alloc.projectId === projectId);
      }
      if (costCenterId) {
        filteredAllocations = filteredAllocations.filter(alloc => alloc.costCenterCode === costCenterId);
      }
      if (allocationType) {
        filteredAllocations = filteredAllocations.filter(alloc => alloc.allocationType === allocationType);
      }

      // Calculate allocation summary by type
      const allocationSummary = {
        DIRECT_LABOR: 0,
        DIRECT_MATERIAL: 0,
        EQUIPMENT_USAGE: 0,
        OVERHEAD_ALLOCATION: 0,
        ADMINISTRATIVE_COSTS: 0,
        UTILITY_COSTS: 0,
        INSURANCE_ALLOCATION: 0,
        FACILITY_COSTS: 0
      };

      filteredAllocations.forEach(alloc => {
        allocationSummary[alloc.allocationType] += alloc.allocationAmount;
      });

      // Project allocation breakdown
      const projectBreakdown = {};
      filteredAllocations.forEach(alloc => {
        if (!projectBreakdown[alloc.projectId]) {
          projectBreakdown[alloc.projectId] = {
            projectId: alloc.projectId,
            projectName: alloc.projectName,
            totalAllocated: 0,
            allocations: []
          };
        }
        projectBreakdown[alloc.projectId].totalAllocated += alloc.allocationAmount;
        projectBreakdown[alloc.projectId].allocations.push(alloc);
      });

      const totalAllocated = filteredAllocations.reduce((sum, alloc) => sum + alloc.allocationAmount, 0);

      return {
        success: true,
        message: 'Cost allocation report generated successfully',
        data: {
          period: {
            startDate: startDate || '2025-09-01',
            endDate: endDate || '2025-09-08'
          },
          summary: {
            totalAllocations: filteredAllocations.length,
            totalAllocated,
            allocationsByType: allocationSummary,
            projectCount: Object.keys(projectBreakdown).length
          },
          allocations: filteredAllocations,
          projectBreakdown: Object.values(projectBreakdown),
          allocationTrends: this.generateAllocationTrends(filteredAllocations)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating cost allocation report',
        error: error.message
      };
    }
  }

  /**
   * Generate cost center recommendations
   * @private
   */
  generateCostCenterRecommendations(variancePercent, utilization, costCenterType) {
    const recommendations = [];

    if (variancePercent > 15) {
      recommendations.push({
        priority: 'HIGH',
        type: 'BUDGET_CONTROL',
        issue: `Cost center is ${variancePercent.toFixed(1)}% over budget`,
        action: 'Implement immediate cost control measures and review allocation accuracy',
        expectedImpact: 'Reduce budget variance to acceptable range'
      });
    }

    if (utilization < 60) {
      recommendations.push({
        priority: 'MEDIUM',
        type: 'UTILIZATION',
        issue: `Low budget utilization at ${utilization.toFixed(1)}%`,
        action: 'Review budget allocation and consider reallocation to other cost centers',
        expectedImpact: 'Optimize resource allocation efficiency'
      });
    }

    if (costCenterType === 'PROJECT_SPECIFIC' && variancePercent > 5) {
      recommendations.push({
        priority: 'HIGH',
        type: 'PROJECT_CONTROL',
        issue: 'Project-specific cost center showing budget variance',
        action: 'Review project scope and timeline for cost control opportunities',
        expectedImpact: 'Maintain project profitability'
      });
    }

    return recommendations;
  }

  /**
   * Generate allocation trends
   * @private
   */
  generateAllocationTrends(allocations) {
    const trends = {
      monthlyTrends: {},
      typeDistribution: {},
      averageAllocation: 0
    };

    allocations.forEach(alloc => {
      const month = alloc.effectiveDate.substring(0, 7); // YYYY-MM format
      if (!trends.monthlyTrends[month]) {
        trends.monthlyTrends[month] = 0;
      }
      trends.monthlyTrends[month] += alloc.allocationAmount;

      if (!trends.typeDistribution[alloc.allocationType]) {
        trends.typeDistribution[alloc.allocationType] = 0;
      }
      trends.typeDistribution[alloc.allocationType] += alloc.allocationAmount;
    });

    trends.averageAllocation = allocations.length > 0 
      ? allocations.reduce((sum, alloc) => sum + alloc.allocationAmount, 0) / allocations.length 
      : 0;

    return trends;
  }
}

module.exports = CostCenterService;
