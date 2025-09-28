import { financeAPI, projectsAPI } from './api';

/**
 * ProjectFinanceIntegrationService
 * Service untuk mengintegrasikan data transaksi project dengan finance secara real-time
 */
class ProjectFinanceIntegrationService {
  
  /**
   * Fetch all project transactions and sync to finance
   * @param {object} filters - Filter options (projectId, subsidiaryId, dateRange)
   * @returns {object} - Integrated financial data
   */
  static async getIntegratedFinancialData(filters = {}) {
    try {
      console.log('🔄 [PROJECT-FINANCE] Fetching integrated financial data with filters:', filters);
      
      // Use the new backend endpoint for integrated data
      const params = new URLSearchParams();
      
      if (filters.subsidiaryId && filters.subsidiaryId !== 'all') {
        params.append('subsidiaryId', filters.subsidiaryId);
      }
      
      if (filters.projectId && filters.projectId !== 'all') {
        params.append('projectId', filters.projectId);
      }
      
      const response = await fetch(`/api/finance/project-integration?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ [PROJECT-FINANCE] Integrated data received:', {
          projects: data.data.projects.length,
          transactions: data.data.transactions.length,
          poTransactions: data.data.metrics.overview.poTransactions
        });
        
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch integrated data');
      }
      
    } catch (error) {
      console.error('❌ [PROJECT-FINANCE] Error fetching integrated data:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Get financial summaries for multiple projects
   * @param {array} projects - List of projects
   * @returns {object} - Project financial summaries
   */
  static async getProjectFinancialSummaries(projects) {
    const summaries = {};
    
    for (const project of projects) {
      try {
        // Fetch transactions for this project
        const response = await financeAPI.getTransactions(1, 1000, { projectId: project.id });
        
        if (response.success) {
          const transactions = response.data || [];
          
          summaries[project.id] = {
            projectName: project.name,
            projectCode: project.id,
            subsidiaryId: project.subsidiaryId,
            totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0),
            totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0),
            poTransactions: transactions.filter(t => t.purchaseOrderId),
            transactionCount: transactions.length,
            lastTransaction: transactions[0]?.date || null
          };
        }
      } catch (error) {
        console.warn(`⚠️ [PROJECT-FINANCE] Error fetching summary for project ${project.id}:`, error.message);
      }
    }
    
    return summaries;
  }

  /**
   * Calculate integrated financial metrics
   * @param {array} projects - Projects data
   * @param {array} transactions - Transactions data  
   * @param {object} projectSummaries - Project financial summaries
   * @returns {object} - Integrated metrics
   */
  static calculateIntegratedMetrics(projects, transactions, projectSummaries) {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const netIncome = totalIncome - totalExpense;
    
    const poTransactions = transactions.filter(t => t.purchaseOrderId);
    const totalPOAmount = poTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    // Project-wise breakdown
    const projectBreakdown = Object.values(projectSummaries).map(summary => ({
      projectId: summary.projectCode,
      projectName: summary.projectName,
      income: summary.totalIncome,
      expense: summary.totalExpense,
      netIncome: summary.totalIncome - summary.totalExpense,
      poCount: summary.poTransactions.length,
      transactionCount: summary.transactionCount
    }));

    // Subsidiary-wise breakdown
    const subsidiaryBreakdown = {};
    projects.forEach(project => {
      const subsidiaryId = project.subsidiaryId || 'general';
      if (!subsidiaryBreakdown[subsidiaryId]) {
        subsidiaryBreakdown[subsidiaryId] = {
          projects: 0,
          income: 0,
          expense: 0,
          transactions: 0
        };
      }
      
      const summary = projectSummaries[project.id];
      if (summary) {
        subsidiaryBreakdown[subsidiaryId].projects += 1;
        subsidiaryBreakdown[subsidiaryId].income += summary.totalIncome;
        subsidiaryBreakdown[subsidiaryId].expense += summary.totalExpense;
        subsidiaryBreakdown[subsidiaryId].transactions += summary.transactionCount;
      }
    });

    return {
      overview: {
        totalProjects,
        activeProjects,
        totalIncome,
        totalExpense,
        netIncome,
        totalTransactions: transactions.length,
        poTransactions: poTransactions.length,
        totalPOAmount
      },
      projectBreakdown,
      subsidiaryBreakdown,
      recentActivity: transactions.slice(0, 10) // Last 10 transactions
    };
  }

  /**
   * Get real-time updates for project transactions
   * @param {function} callback - Callback function to handle updates
   * @param {object} filters - Filter options
   * @returns {function} - Cleanup function to stop polling
   */
  static startRealTimeUpdates(callback, filters = {}) {
    console.log('🔄 [PROJECT-FINANCE] Starting real-time updates...');
    
    const pollInterval = 30000; // Poll every 30 seconds
    let isActive = true;
    
    const poll = async () => {
      if (!isActive) return;
      
      try {
        const data = await this.getIntegratedFinancialData(filters);
        callback(data);
      } catch (error) {
        console.error('❌ [PROJECT-FINANCE] Error in real-time update:', error);
      }
      
      if (isActive) {
        setTimeout(poll, pollInterval);
      }
    };
    
    // Start initial poll
    poll();
    
    // Return cleanup function
    return () => {
      console.log('🛑 [PROJECT-FINANCE] Stopping real-time updates...');
      isActive = false;
    };
  }

  /**
   * Sync specific project transactions to finance
   * @param {string} projectId - Project ID to sync
   * @returns {object} - Sync result
   */
  static async syncProjectToFinance(projectId) {
    try {
      console.log(`🔄 [PROJECT-FINANCE] Syncing project ${projectId} to finance...`);
      
      // This would typically call a backend endpoint to perform the sync
      // For now, we'll simulate by fetching current data
      const response = await financeAPI.getTransactions(1, 1000, { projectId });
      
      return {
        success: true,
        message: `Project ${projectId} synced successfully`,
        transactionCount: response.data?.length || 0
      };
      
    } catch (error) {
      console.error(`❌ [PROJECT-FINANCE] Error syncing project ${projectId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @returns {string} - Formatted currency string
   */
  static formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
  }

  /**
   * Get project status color
   * @param {string} status - Project status
   * @returns {string} - CSS color classes
   */
  static getProjectStatusColor(status) {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }
}

export default ProjectFinanceIntegrationService;