const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const ApprovalInstance = require('../models/ApprovalInstance');
const ApprovalStep = require('../models/ApprovalStep');
const ProjectRAB = require('../models/ProjectRAB');
const Project = require('../models/Project');

class AnalyticsService {
  
  /**
   * Get comprehensive financial analytics
   */
  static async getFinancialAnalytics(dateRange = {}) {
    try {
      const { startDate, endDate } = dateRange;
      let dateCondition = '';
      
      if (startDate && endDate) {
        dateCondition = `AND ai.submitted_at BETWEEN '${startDate}' AND '${endDate}'`;
      }

      // Total approvals and amounts
      const approvalStats = await sequelize.query(`
        SELECT 
          COUNT(*) as total_approvals,
          COUNT(CASE WHEN ai.overall_status = 'approved' THEN 1 END) as approved_count,
          COUNT(CASE WHEN ai.overall_status = 'rejected' THEN 1 END) as rejected_count,
          COUNT(CASE WHEN ai.overall_status = 'pending' THEN 1 END) as pending_count,
          SUM(CASE WHEN ai.overall_status = 'approved' THEN ai.total_amount ELSE 0 END) as approved_amount,
          SUM(ai.total_amount) as total_requested_amount,
          AVG(CASE WHEN ai.overall_status = 'approved' THEN 
            EXTRACT(EPOCH FROM (ai.completed_at - ai.submitted_at))/3600 
          END) as avg_approval_time_hours
        FROM approval_instances ai
        WHERE ai.entity_type = 'rab' ${dateCondition}
      `, { type: QueryTypes.SELECT });

      // Monthly trends
      const monthlyTrends = await sequelize.query(`
        SELECT 
          DATE_TRUNC('month', ai.submitted_at) as month,
          COUNT(*) as submissions,
          COUNT(CASE WHEN ai.overall_status = 'approved' THEN 1 END) as approvals,
          SUM(CASE WHEN ai.overall_status = 'approved' THEN ai.total_amount ELSE 0 END) as approved_amount
        FROM approval_instances ai
        WHERE ai.entity_type = 'rab' ${dateCondition}
        GROUP BY DATE_TRUNC('month', ai.submitted_at)
        ORDER BY month DESC
        LIMIT 12
      `, { type: QueryTypes.SELECT });

      // Category breakdown
      const categoryBreakdown = await sequelize.query(`
        SELECT 
          ai.entity_data->>'category' as category,
          COUNT(*) as count,
          SUM(CASE WHEN ai.overall_status = 'approved' THEN ai.total_amount ELSE 0 END) as approved_amount,
          AVG(ai.total_amount) as avg_amount
        FROM approval_instances ai
        WHERE ai.entity_type = 'rab' ${dateCondition}
        GROUP BY ai.entity_data->>'category'
        ORDER BY approved_amount DESC
      `, { type: QueryTypes.SELECT });

      // Approval step performance
      const stepPerformance = await sequelize.query(`
        SELECT 
          s.step_name,
          s.required_role,
          COUNT(*) as total_steps,
          COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as approved_steps,
          AVG(CASE WHEN s.status = 'approved' THEN 
            EXTRACT(EPOCH FROM (s.approved_at - s.created_at))/3600 
          END) as avg_processing_hours
        FROM approval_steps s
        JOIN approval_instances ai ON s.instance_id = ai.id
        WHERE ai.entity_type = 'rab' ${dateCondition}
        GROUP BY s.step_name, s.required_role
        ORDER BY avg_processing_hours ASC
      `, { type: QueryTypes.SELECT });

      return {
        overview: approvalStats[0],
        monthlyTrends,
        categoryBreakdown,
        stepPerformance,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Error generating financial analytics:', error);
      throw error;
    }
  }

  /**
   * Get project-specific analytics
   */
  static async getProjectAnalytics(projectId) {
    try {
      const projectStats = await sequelize.query(`
        SELECT 
          p.name as project_name,
          p.location,
          p.startDate as start_date,
          p.endDate as end_date,
          COUNT(ai.*) as total_rabs,
          COUNT(CASE WHEN ai.overall_status = 'approved' THEN 1 END) as approved_rabs,
          SUM(CASE WHEN ai.overall_status = 'approved' THEN ai.total_amount ELSE 0 END) as approved_budget,
          SUM(ai.total_amount) as requested_budget,
          AVG(CASE WHEN ai.overall_status = 'approved' THEN 
            EXTRACT(EPOCH FROM (ai.completed_at - ai.submitted_at))/24/3600 
          END) as avg_approval_days
        FROM projects p
        LEFT JOIN approval_instances ai ON ai.entity_data->>'projectId' = p.id
        WHERE p.id = :projectId
        GROUP BY p.id, p.name, p.location, p.startDate, p.endDate
      `, { 
        replacements: { projectId },
        type: QueryTypes.SELECT 
      });

      const rabTimeline = await sequelize.query(`
        SELECT 
          ai.submitted_at,
          ai.completed_at,
          ai.overall_status,
          ai.total_amount,
          ai.entity_data->>'category' as category,
          ai.entity_data->>'description' as description
        FROM approval_instances ai
        WHERE ai.entity_data->>'projectId' = :projectId
        ORDER BY ai.submitted_at DESC
      `, { 
        replacements: { projectId },
        type: QueryTypes.SELECT 
      });

      return {
        project: projectStats[0],
        rabTimeline,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Error generating project analytics:', error);
      throw error;
    }
  }

  /**
   * Get approval efficiency metrics
   */
  static async getApprovalEfficiencyMetrics() {
    try {
      // Bottleneck analysis
      const bottleneckAnalysis = await sequelize.query(`
        SELECT 
          s.step_name,
          s.required_role,
          COUNT(*) as total_instances,
          COUNT(CASE WHEN s.status = 'pending' THEN 1 END) as pending_instances,
          AVG(CASE WHEN s.status IN ('approved', 'rejected') THEN 
            EXTRACT(EPOCH FROM (s.approved_at - s.created_at))/3600 
          END) as avg_processing_hours,
          MAX(CASE WHEN s.status = 'pending' THEN 
            EXTRACT(EPOCH FROM (NOW() - s.created_at))/24/3600 
          END) as max_pending_days
        FROM approval_steps s
        JOIN approval_instances ai ON s.instance_id = ai.id
        WHERE ai.entity_type = 'rab'
        GROUP BY s.step_name, s.required_role
        ORDER BY avg_processing_hours DESC
      `, { type: QueryTypes.SELECT });

      // Approval rate by amount ranges
      const approvalRatesByAmount = await sequelize.query(`
        SELECT 
          CASE 
            WHEN ai.total_amount < 50000000 THEN 'Under 50M'
            WHEN ai.total_amount < 500000000 THEN '50M - 500M'
            WHEN ai.total_amount < 2000000000 THEN '500M - 2B'
            ELSE 'Over 2B'
          END as amount_range,
          COUNT(*) as total_count,
          COUNT(CASE WHEN ai.overall_status = 'approved' THEN 1 END) as approved_count,
          ROUND(
            COUNT(CASE WHEN ai.overall_status = 'approved' THEN 1 END) * 100.0 / COUNT(*), 2
          ) as approval_rate_percent
        FROM approval_instances ai
        WHERE ai.entity_type = 'rab'
        GROUP BY 
          CASE 
            WHEN ai.total_amount < 50000000 THEN 'Under 50M'
            WHEN ai.total_amount < 500000000 THEN '50M - 500M'
            WHEN ai.total_amount < 2000000000 THEN '500M - 2B'
            ELSE 'Over 2B'
          END
        ORDER BY MIN(ai.total_amount)
      `, { type: QueryTypes.SELECT });

      return {
        bottleneckAnalysis,
        approvalRatesByAmount,
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('Error generating efficiency metrics:', error);
      throw error;
    }
  }

  /**
   * Get real-time dashboard metrics
   */
  static async getDashboardMetrics() {
    try {
      const metrics = await sequelize.query(`
        SELECT 
          -- Today's metrics
          COUNT(CASE WHEN DATE(ai.submitted_at) = CURRENT_DATE THEN 1 END) as today_submissions,
          COUNT(CASE WHEN DATE(ai.completed_at) = CURRENT_DATE THEN 1 END) as today_completions,
          
          -- This week's metrics
          COUNT(CASE WHEN ai.submitted_at >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) as week_submissions,
          COUNT(CASE WHEN ai.completed_at >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) as week_completions,
          
          -- Pending metrics
          COUNT(CASE WHEN ai.overall_status = 'pending' THEN 1 END) as total_pending,
          COUNT(CASE WHEN ai.overall_status = 'pending' AND ai.submitted_at < CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as overdue_pending,
          
          -- Financial metrics
          SUM(CASE WHEN ai.overall_status = 'approved' AND DATE(ai.completed_at) = CURRENT_DATE THEN ai.total_amount ELSE 0 END) as today_approved_amount,
          SUM(CASE WHEN ai.overall_status = 'pending' THEN ai.total_amount ELSE 0 END) as pending_amount
          
        FROM approval_instances ai
        WHERE ai.entity_type = 'rab'
      `, { type: QueryTypes.SELECT });

      return {
        ...metrics[0],
        lastUpdated: new Date()
      };

    } catch (error) {
      console.error('Error generating dashboard metrics:', error);
      throw error;
    }
  }
}

module.exports = AnalyticsService;
