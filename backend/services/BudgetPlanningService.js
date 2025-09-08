/**
 * Budget Planning & Variance Analysis Service
 * PSAK-compliant budget planning and performance analysis for construction industry
 * Handles budget creation, variance analysis, and performance monitoring
 */

class BudgetPlanningService {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  /**
   * Create comprehensive budget for construction projects
   * @param {Object} params - Budget creation parameters
   * @returns {Object} Budget creation result
   */
  async createProjectBudget(params) {
    try {
      const {
        projectId,
        budgetYear,
        totalBudget,
        categories,
        quarters,
        subsidiaryId
      } = params;

      // Validate required parameters
      if (!projectId || !budgetYear || !totalBudget) {
        return {
          success: false,
          message: 'Missing required parameters: projectId, budgetYear, totalBudget'
        };
      }

      // Construction industry budget categories
      const defaultCategories = {
        directCosts: {
          materials: { percentage: 40, amount: totalBudget * 0.40 },
          labor: { percentage: 25, amount: totalBudget * 0.25 },
          equipment: { percentage: 15, amount: totalBudget * 0.15 },
          subcontractors: { percentage: 10, amount: totalBudget * 0.10 }
        },
        indirectCosts: {
          overhead: { percentage: 5, amount: totalBudget * 0.05 },
          administration: { percentage: 3, amount: totalBudget * 0.03 },
          insurance: { percentage: 2, amount: totalBudget * 0.02 }
        }
      };

      // Quarterly distribution (default: equal distribution)
      const defaultQuarters = quarters || {
        Q1: { percentage: 25, amount: totalBudget * 0.25 },
        Q2: { percentage: 25, amount: totalBudget * 0.25 },
        Q3: { percentage: 25, amount: totalBudget * 0.25 },
        Q4: { percentage: 25, amount: totalBudget * 0.25 }
      };

      const budget = {
        projectId,
        budgetYear,
        totalBudget,
        subsidiaryId,
        categories: categories || defaultCategories,
        quarterlyDistribution: defaultQuarters,
        status: 'DRAFT',
        createdAt: new Date(),
        budgetMetadata: {
          currency: 'IDR',
          budgetType: 'PROJECT_CONSTRUCTION',
          approvalRequired: totalBudget > 1000000000, // 1 Billion IDR
          revisionNumber: 1
        }
      };

      return {
        success: true,
        message: 'Project budget created successfully',
        data: {
          budget,
          summary: {
            totalBudget,
            directCostsTotal: Object.values(defaultCategories.directCosts)
              .reduce((sum, cat) => sum + cat.amount, 0),
            indirectCostsTotal: Object.values(defaultCategories.indirectCosts)
              .reduce((sum, cat) => sum + cat.amount, 0)
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creating project budget',
        error: error.message
      };
    }
  }

  /**
   * Generate comprehensive variance analysis
   * @param {Object} params - Variance analysis parameters
   * @returns {Object} Variance analysis result
   */
  async generateVarianceAnalysis(params) {
    try {
      const {
        projectId,
        budgetYear,
        period = 'QUARTERLY',
        startDate,
        endDate,
        subsidiaryId
      } = params;

      // Get actual financial data from journal entry lines
      const actualQuery = `
        SELECT 
          coa.account_code,
          coa.account_name,
          coa.account_type,
          coa.account_sub_type,
          coa.construction_specific,
          SUM(CASE WHEN jel.debit_amount > 0 THEN jel.debit_amount ELSE 0 END) as total_debits,
          SUM(CASE WHEN jel.credit_amount > 0 THEN jel.credit_amount ELSE 0 END) as total_credits,
          SUM(COALESCE(jel.debit_amount, 0) - COALESCE(jel.credit_amount, 0)) as net_amount,
          COUNT(*) as transaction_count
        FROM journal_entry_lines jel
        JOIN chart_of_accounts coa ON jel.account_id = coa.id
        JOIN journal_entries je ON jel.journal_entry_id = je.id
        WHERE 1=1
          ${projectId ? `AND jel.project_id = '${projectId}'` : ''}
          ${subsidiaryId ? `AND je.subsidiary_id = '${subsidiaryId}'` : ''}
          ${startDate ? `AND je.entry_date >= '${startDate}'` : ''}
          ${endDate ? `AND je.entry_date <= '${endDate}'` : ''}
        GROUP BY coa.account_code, coa.account_name, coa.account_type, coa.account_sub_type, coa.construction_specific
        ORDER BY coa.account_type, coa.account_code
      `;

      const actualResults = await this.sequelize.query(actualQuery, {
        type: this.sequelize.QueryTypes.SELECT
      });

      // Mock budget data (in real implementation, this would come from budget table)
      const mockBudget = await this.createProjectBudget({
        projectId,
        budgetYear,
        totalBudget: 5000000000, // 5 Billion IDR
        subsidiaryId
      });

      // Calculate actual totals by account type and construction category mapping
      const actualTotals = {
        materials: 0,
        labor: 0,
        equipment: 0,
        subcontractors: 0,
        overhead: 0,
        administration: 0,
        insurance: 0
      };

      actualResults.forEach(row => {
        // Map account types to construction categories
        let category = '';
        const accountType = row.account_type?.toLowerCase();
        const accountName = row.account_name?.toLowerCase();
        
        if (accountName.includes('material') || accountName.includes('bahan')) {
          category = 'materials';
        } else if (accountName.includes('labor') || accountName.includes('tenaga kerja') || accountName.includes('upah')) {
          category = 'labor';
        } else if (accountName.includes('equipment') || accountName.includes('alat') || accountName.includes('mesin')) {
          category = 'equipment';
        } else if (accountName.includes('subcontractor') || accountName.includes('kontraktor')) {
          category = 'subcontractors';
        } else if (accountType === 'expense' && row.construction_specific) {
          category = 'overhead';
        } else if (accountType === 'expense') {
          category = 'administration';
        }
        
        if (category && actualTotals.hasOwnProperty(category)) {
          actualTotals[category] += Math.abs(parseFloat(row.net_amount) || 0);
        }
      });

      // Calculate variances
      const budgetData = mockBudget.data.budget.categories;
      const variances = {};

      // Direct costs variances
      Object.keys(budgetData.directCosts).forEach(category => {
        const budgetAmount = budgetData.directCosts[category].amount;
        const actualAmount = actualTotals[category] || 0;
        const variance = actualAmount - budgetAmount;
        const variancePercent = budgetAmount > 0 ? (variance / budgetAmount) * 100 : 0;

        variances[category] = {
          budget: budgetAmount,
          actual: actualAmount,
          variance,
          variancePercent,
          status: Math.abs(variancePercent) > 10 ? 'SIGNIFICANT' : 
                  Math.abs(variancePercent) > 5 ? 'MODERATE' : 'ACCEPTABLE'
        };
      });

      // Indirect costs variances
      Object.keys(budgetData.indirectCosts).forEach(category => {
        const budgetAmount = budgetData.indirectCosts[category].amount;
        const actualAmount = actualTotals[category] || 0;
        const variance = actualAmount - budgetAmount;
        const variancePercent = budgetAmount > 0 ? (variance / budgetAmount) * 100 : 0;

        variances[category] = {
          budget: budgetAmount,
          actual: actualAmount,
          variance,
          variancePercent,
          status: Math.abs(variancePercent) > 10 ? 'SIGNIFICANT' : 
                  Math.abs(variancePercent) > 5 ? 'MODERATE' : 'ACCEPTABLE'
        };
      });

      // Overall variance summary
      const totalBudget = mockBudget.data.budget.totalBudget;
      const totalActual = Object.values(actualTotals).reduce((sum, val) => sum + val, 0);
      const totalVariance = totalActual - totalBudget;
      const totalVariancePercent = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;

      // Performance metrics
      const performanceMetrics = {
        budgetUtilization: totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0,
        costEfficiency: totalVariance < 0 ? 'UNDER_BUDGET' : 'OVER_BUDGET',
        criticalVariances: Object.entries(variances)
          .filter(([_, data]) => data.status === 'SIGNIFICANT')
          .length
      };

      return {
        success: true,
        message: 'Variance analysis generated successfully',
        data: {
          period: {
            startDate,
            endDate,
            period,
            projectId,
            subsidiaryId
          },
          summary: {
            totalBudget,
            totalActual,
            totalVariance,
            totalVariancePercent,
            status: Math.abs(totalVariancePercent) > 15 ? 'CRITICAL' :
                    Math.abs(totalVariancePercent) > 10 ? 'WARNING' : 'NORMAL'
          },
          categoryVariances: variances,
          performanceMetrics,
          actualData: actualResults,
          recommendations: this.generateVarianceRecommendations(variances, performanceMetrics)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating variance analysis',
        error: error.message
      };
    }
  }

  /**
   * Generate budget forecasting
   * @param {Object} params - Forecasting parameters
   * @returns {Object} Budget forecast result
   */
  async generateBudgetForecast(params) {
    try {
      const {
        projectId,
        forecastPeriod = 12, // months
        baseBudget,
        growthAssumptions = {},
        riskFactors = {},
        subsidiaryId
      } = params;

      // Default growth assumptions for construction industry
      const defaultGrowthAssumptions = {
        materials: { monthlyGrowth: 1.5, inflation: 3.5 }, // Material cost inflation
        labor: { monthlyGrowth: 0.8, inflation: 2.5 },
        equipment: { monthlyGrowth: 0.5, inflation: 2.0 },
        overhead: { monthlyGrowth: 0.3, inflation: 1.5 }
      };

      // Default risk factors
      const defaultRiskFactors = {
        weatherDelay: { probability: 0.2, impact: 0.15 },
        materialShortage: { probability: 0.15, impact: 0.20 },
        laborShortage: { probability: 0.10, impact: 0.12 },
        regulatoryChanges: { probability: 0.05, impact: 0.08 }
      };

      const growthParams = { ...defaultGrowthAssumptions, ...growthAssumptions };
      const riskParams = { ...defaultRiskFactors, ...riskFactors };

      // Generate monthly forecasts
      const monthlyForecasts = [];
      const baseBudgetAmount = baseBudget || 5000000000; // 5 Billion IDR

      for (let month = 1; month <= forecastPeriod; month++) {
        const monthlyBudget = {
          month,
          baseBudget: baseBudgetAmount,
          adjustedBudget: baseBudgetAmount,
          growthAdjustments: {},
          riskAdjustments: {}
        };

        // Apply growth adjustments
        Object.keys(growthParams).forEach(category => {
          const growth = growthParams[category];
          const monthlyGrowthFactor = 1 + (growth.monthlyGrowth / 100);
          const inflationFactor = 1 + (growth.inflation / 100 / 12); // Monthly inflation
          
          monthlyBudget.growthAdjustments[category] = {
            growthFactor: monthlyGrowthFactor,
            inflationFactor: inflationFactor,
            combinedFactor: monthlyGrowthFactor * inflationFactor
          };
        });

        // Apply risk adjustments
        let riskAdjustment = 0;
        Object.keys(riskParams).forEach(risk => {
          const riskData = riskParams[risk];
          const expectedRiskImpact = riskData.probability * riskData.impact;
          riskAdjustment += expectedRiskImpact;
          
          monthlyBudget.riskAdjustments[risk] = {
            probability: riskData.probability,
            impact: riskData.impact,
            expectedImpact: expectedRiskImpact
          };
        });

        // Calculate final adjusted budget (using moderate monthly growth)
        const monthsFromStart = month - 1;
        const growthMultiplier = Math.pow(1.005, monthsFromStart); // 0.5% monthly compound growth
        const riskMultiplier = 1 + riskAdjustment;
        
        monthlyBudget.adjustedBudget = baseBudgetAmount * growthMultiplier * riskMultiplier;
        monthlyBudget.totalRiskAdjustment = riskAdjustment;
        
        monthlyForecasts.push(monthlyBudget);
      }

      // Generate forecast summary
      const finalBudget = monthlyForecasts[monthlyForecasts.length - 1].adjustedBudget;
      const forecastSummary = {
        originalBudget: baseBudgetAmount,
        finalForecastBudget: finalBudget,
        totalGrowthPercent: ((finalBudget - baseBudgetAmount) / baseBudgetAmount) * 100,
        averageMonthlyGrowth: (finalBudget / baseBudgetAmount) ** (1 / forecastPeriod) - 1,
        totalRiskImpact: Object.values(riskParams).reduce((sum, risk) => sum + (risk.probability * risk.impact), 0)
      };

      return {
        success: true,
        message: 'Budget forecast generated successfully',
        data: {
          projectId,
          subsidiaryId,
          forecastPeriod,
          summary: forecastSummary,
          monthlyForecasts,
          assumptions: {
            growth: growthParams,
            risks: riskParams
          },
          recommendations: this.generateForecastRecommendations(forecastSummary, riskParams)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating budget forecast',
        error: error.message
      };
    }
  }

  /**
   * Generate budget performance dashboard
   * @param {Object} params - Dashboard parameters
   * @returns {Object} Dashboard data
   */
  async generateBudgetDashboard(params) {
    try {
      const {
        subsidiaryId,
        period = 'CURRENT_QUARTER',
        projectIds = []
      } = params;

      // Get current date range
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentQuarter = Math.floor((currentDate.getMonth() / 3)) + 1;
      
      let startDate, endDate;
      if (period === 'CURRENT_QUARTER') {
        startDate = new Date(currentYear, (currentQuarter - 1) * 3, 1);
        endDate = new Date(currentYear, currentQuarter * 3, 0);
      } else if (period === 'CURRENT_YEAR') {
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31);
      }

      // Mock multiple project data
      const projectData = [];
      for (let i = 1; i <= 3; i++) {
        const projectId = `PROJ-${String(i).padStart(3, '0')}`;
        
        const variance = await this.generateVarianceAnalysis({
          projectId,
          budgetYear: currentYear,
          startDate: startDate?.toISOString().split('T')[0],
          endDate: endDate?.toISOString().split('T')[0],
          subsidiaryId
        });

        if (variance.success) {
          projectData.push({
            projectId,
            projectName: `Construction Project ${i}`,
            ...variance.data.summary,
            performance: variance.data.performanceMetrics
          });
        }
      }

      // Calculate portfolio metrics
      const portfolioMetrics = {
        totalProjects: projectData.length,
        totalBudget: projectData.reduce((sum, p) => sum + p.totalBudget, 0),
        totalActual: projectData.reduce((sum, p) => sum + p.totalActual, 0),
        averageVariancePercent: projectData.length > 0 ? 
          projectData.reduce((sum, p) => sum + p.totalVariancePercent, 0) / projectData.length : 0,
        projectsOverBudget: projectData.filter(p => p.totalVariancePercent > 0).length,
        projectsUnderBudget: projectData.filter(p => p.totalVariancePercent < 0).length,
        criticalProjects: projectData.filter(p => p.status === 'CRITICAL').length
      };

      // Top variances across all projects
      const topVariances = projectData
        .filter(p => Math.abs(p.totalVariancePercent) > 5)
        .sort((a, b) => Math.abs(b.totalVariancePercent) - Math.abs(a.totalVariancePercent))
        .slice(0, 5);

      return {
        success: true,
        message: 'Budget dashboard generated successfully',
        data: {
          period: {
            period,
            startDate,
            endDate,
            subsidiaryId
          },
          portfolioMetrics,
          projectPerformance: projectData,
          topVariances,
          alerts: this.generateBudgetAlerts(projectData, portfolioMetrics),
          kpis: {
            budgetEfficiency: portfolioMetrics.totalBudget > 0 ? 
              (portfolioMetrics.totalActual / portfolioMetrics.totalBudget) * 100 : 0,
            onBudgetPercentage: portfolioMetrics.totalProjects > 0 ?
              ((portfolioMetrics.totalProjects - portfolioMetrics.criticalProjects) / portfolioMetrics.totalProjects) * 100 : 0,
            costControlIndex: portfolioMetrics.averageVariancePercent < 5 ? 'EXCELLENT' :
                              portfolioMetrics.averageVariancePercent < 10 ? 'GOOD' :
                              portfolioMetrics.averageVariancePercent < 15 ? 'FAIR' : 'POOR'
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating budget dashboard',
        error: error.message
      };
    }
  }

  /**
   * Generate recommendations based on variance analysis
   * @private
   */
  generateVarianceRecommendations(variances, performanceMetrics) {
    const recommendations = [];

    // Check for critical variances
    Object.entries(variances).forEach(([category, data]) => {
      if (data.status === 'SIGNIFICANT') {
        if (data.variance > 0) {
          recommendations.push({
            priority: 'HIGH',
            category,
            issue: `${category} costs are ${data.variancePercent.toFixed(1)}% over budget`,
            action: `Review ${category} procurement and usage patterns`,
            expectedImpact: 'Cost reduction and better budget control'
          });
        } else {
          recommendations.push({
            priority: 'MEDIUM',
            category,
            issue: `${category} costs are ${Math.abs(data.variancePercent).toFixed(1)}% under budget`,
            action: `Assess if quality or project scope is being compromised`,
            expectedImpact: 'Ensure project quality and completion'
          });
        }
      }
    });

    // Budget utilization recommendations
    if (performanceMetrics.budgetUtilization > 110) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'BUDGET_CONTROL',
        issue: 'Total budget exceeded by significant margin',
        action: 'Implement immediate cost control measures and revised budget approval',
        expectedImpact: 'Prevent further budget overruns'
      });
    }

    return recommendations;
  }

  /**
   * Generate recommendations based on budget forecast
   * @private
   */
  generateForecastRecommendations(forecastSummary, riskParams) {
    const recommendations = [];

    if (forecastSummary.totalGrowthPercent > 25) {
      recommendations.push({
        priority: 'HIGH',
        area: 'BUDGET_PLANNING',
        issue: 'Forecast shows significant budget increase',
        action: 'Review and optimize resource allocation strategies',
        expectedImpact: 'Control future cost escalation'
      });
    }

    // Risk-based recommendations
    Object.entries(riskParams).forEach(([risk, data]) => {
      if (data.probability * data.impact > 0.05) {
        recommendations.push({
          priority: 'MEDIUM',
          area: 'RISK_MANAGEMENT',
          issue: `High risk exposure from ${risk}`,
          action: `Develop mitigation strategy for ${risk}`,
          expectedImpact: 'Reduce project risk and potential cost impact'
        });
      }
    });

    return recommendations;
  }

  /**
   * Generate budget alerts
   * @private
   */
  generateBudgetAlerts(projectData, portfolioMetrics) {
    const alerts = [];

    // Critical project alerts
    projectData.forEach(project => {
      if (project.status === 'CRITICAL') {
        alerts.push({
          type: 'CRITICAL',
          project: project.projectId,
          message: `Project ${project.projectId} has critical budget variance of ${project.totalVariancePercent.toFixed(1)}%`,
          actionRequired: true
        });
      }
    });

    // Portfolio alerts
    if (portfolioMetrics.criticalProjects > portfolioMetrics.totalProjects * 0.3) {
      alerts.push({
        type: 'WARNING',
        project: 'PORTFOLIO',
        message: `${portfolioMetrics.criticalProjects} out of ${portfolioMetrics.totalProjects} projects have critical variances`,
        actionRequired: true
      });
    }

    return alerts;
  }
}

module.exports = BudgetPlanningService;
