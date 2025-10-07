/**
 * Centralized Dashboard API Service
 * Consolidates all dashboard-related API calls to eliminate redundancy
 */

import { projectAPI, financeAPI, employeeAPI, inventoryAPI } from './api';

class DashboardAPIService {
  // Get comprehensive dashboard data
  static async getDashboardOverview(timeRange = 'month') {
    try {
      const [projectsRes, financeRes, employeesRes, inventoryRes] = await Promise.all([
        projectAPI.getAll().catch(() => ({ data: [] })),
        financeAPI.getAll().catch(() => ({ data: [] })),
        employeeAPI.getAll().catch(() => ({ data: [] })),
        inventoryAPI.getAll().catch(() => ({ data: [] }))
      ]);

      const projects = projectsRes.data || [];
      const financeTransactions = financeRes.data || [];
      const employees = employeesRes.data || [];
      const inventory = inventoryRes.data || [];

      return this.calculateDashboardMetrics({
        projects,
        financeTransactions,
        employees,
        inventory,
        timeRange
      });
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  // Calculate comprehensive metrics from raw data
  static calculateDashboardMetrics({ projects, financeTransactions, employees, inventory, timeRange }) {
    // Financial Metrics
    const totalRevenue = financeTransactions
      .filter(t => t.type === 'income' || t.type === 'credit')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const totalExpenses = financeTransactions
      .filter(t => t.type === 'expense' || t.type === 'debit')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;

    // Project Metrics
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalProjectValue = projects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0);
    const avgProjectValue = projects.length > 0 ? totalProjectValue / projects.length : 0;

    // Employee Metrics
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'active').length;
    const departmentBreakdown = this.calculateDepartmentBreakdown(employees);
    const avgPerformanceRating = this.calculateAvgPerformance(employees);

    // Inventory Metrics
    const totalInventoryItems = inventory.length;
    const totalInventoryValue = inventory.reduce((sum, item) => 
      sum + (parseFloat(item.value || 0) * parseInt(item.quantity || 0)), 0);
    const lowStockItems = inventory.filter(item => 
      parseInt(item.quantity || 0) < parseInt(item.minQuantity || 10)).length;

    // Recent Activities (from transactions and project updates)
    const recentActivities = this.generateRecentActivities(financeTransactions, projects);

    // Alerts and Notifications
    const alerts = this.generateAlerts(projects, inventory, employees, financeTransactions);

    return {
      overview: {
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin: Math.round(profitMargin * 10) / 10,
        cashFlow: netProfit,
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalEmployees,
        activeEmployees,
        totalInventoryItems,
        lowStockItems
      },
      financial: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: netProfit,
        profitMargin,
        pendingInvoices: financeTransactions.filter(t => t.status === 'pending' || t.status === 'unpaid').length,
        paidInvoices: financeTransactions.filter(t => t.status === 'completed' || t.status === 'paid').length
      },
      projects: {
        total: projects.length,
        active: activeProjects,
        completed: completedProjects,
        planning: projects.filter(p => p.status === 'planning').length,
        onHold: projects.filter(p => p.status === 'on_hold').length,
        totalValue: totalProjectValue,
        avgValue: avgProjectValue
      },
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        departments: departmentBreakdown,
        avgPerformance: avgPerformanceRating,
        newHires: this.calculateNewHires(employees, timeRange)
      },
      inventory: {
        totalItems: totalInventoryItems,
        totalValue: totalInventoryValue,
        lowStock: lowStockItems,
        categories: this.calculateInventoryCategories(inventory)
      },
      recentActivities,
      alerts,
      lastUpdated: new Date()
    };
  }

  // Helper methods
  static calculateDepartmentBreakdown(employees) {
    return employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
  }

  static calculateAvgPerformance(employees) {
    if (employees.length === 0) return 0;
    const totalRating = employees.reduce((sum, emp) => sum + (emp.performanceRating || 0), 0);
    return Math.round((totalRating / employees.length) * 10) / 10;
  }

  static calculateNewHires(employees, timeRange) {
    const now = new Date();
    let cutoffDate;
    
    switch (timeRange) {
      case 'week':
        cutoffDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case 'quarter':
        cutoffDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        break;
      default:
        cutoffDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    }

    return employees.filter(emp => {
      const hireDate = new Date(emp.hireDate || emp.joinDate);
      return hireDate >= cutoffDate;
    }).length;
  }

  static calculateInventoryCategories(inventory) {
    return inventory.reduce((acc, item) => {
      const category = item.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }

  static generateRecentActivities(transactions, projects) {
    const activities = [];
    
    // Add recent transactions
    transactions
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 10)
      .forEach(transaction => {
        activities.push({
          id: `transaction-${transaction.id}`,
          type: 'transaction',
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.createdAt || transaction.date,
          status: transaction.status,
          user: 'System'
        });
      });

    // Add recent project updates
    projects
      .filter(p => p.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .forEach(project => {
        activities.push({
          id: `project-${project.id}`,
          type: 'project',
          description: `Project ${project.name} updated`,
          status: project.status,
          date: project.updatedAt,
          user: 'System'
        });
      });

    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);
  }

  static generateAlerts(projects, inventory, employees, transactions) {
    const alerts = [];

    // Budget alerts
    projects.forEach(project => {
      const projectTransactions = transactions.filter(t => t.projectId === project.id);
      const spent = projectTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      const budget = parseFloat(project.budget || 0);
      const utilization = budget > 0 ? (spent / budget) * 100 : 0;

      if (utilization > 90) {
        alerts.push({
          id: `budget-${project.id}`,
          type: 'warning',
          title: 'Budget Alert',
          message: `Project "${project.name}" has used ${utilization.toFixed(1)}% of budget`,
          timestamp: new Date(),
          priority: utilization > 100 ? 'high' : 'medium'
        });
      }
    });

    // Inventory alerts
    const lowStock = inventory.filter(item => 
      parseInt(item.quantity || 0) < parseInt(item.minQuantity || 10));
    
    if (lowStock.length > 0) {
      alerts.push({
        id: 'inventory-low-stock',
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${lowStock.length} items are running low on stock`,
        timestamp: new Date(),
        priority: 'medium'
      });
    }

    // Employee-related alerts
    const inactiveEmployees = employees.filter(e => e.status !== 'active').length;
    if (inactiveEmployees > 0) {
      alerts.push({
        id: 'employees-inactive',
        type: 'info',
        title: 'Inactive Employees',
        message: `${inactiveEmployees} employees are currently inactive`,
        timestamp: new Date(),
        priority: 'low'
      });
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Get project-specific dashboard data
  static async getProjectDashboard(projectId) {
    try {
      const [projectRes, financeRes] = await Promise.all([
        projectAPI.getById(projectId),
        financeAPI.getByProject(projectId).catch(() => ({ data: [] }))
      ]);

      const project = projectRes.data;
      const transactions = financeRes.data || [];

      return {
        project,
        financialSummary: this.calculateProjectFinancials(project, transactions),
        recentTransactions: transactions.slice(0, 10),
        timeline: this.generateProjectTimeline(project, transactions)
      };
    } catch (error) {
      console.error('Error fetching project dashboard:', error);
      throw new Error('Failed to fetch project data');
    }
  }

  static calculateProjectFinancials(project, transactions) {
    const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const budget = parseFloat(project.budget || 0);
    const remaining = budget - totalSpent;
    const utilization = budget > 0 ? (totalSpent / budget) * 100 : 0;

    return {
      budget,
      spent: totalSpent,
      remaining,
      utilization: Math.round(utilization * 10) / 10,
      status: utilization > 100 ? 'over-budget' : utilization > 90 ? 'warning' : 'on-track'
    };
  }

  static generateProjectTimeline(project, transactions) {
    const events = [];

    // Add project milestones
    if (project.startDate) {
      events.push({
        date: project.startDate,
        type: 'milestone',
        title: 'Project Started',
        description: `Project ${project.name} commenced`
      });
    }

    // Add transaction events
    transactions.forEach(transaction => {
      events.push({
        date: transaction.createdAt || transaction.date,
        type: 'transaction',
        title: transaction.description,
        amount: transaction.amount
      });
    });

    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export default DashboardAPIService;