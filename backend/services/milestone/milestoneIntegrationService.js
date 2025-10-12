/**
 * Milestone Integration Service
 * Handles integration between Milestones and RAB workflow
 */

const { sequelize } = require('../../config/database');

class MilestoneIntegrationService {
  /**
   * Get RAB categories available for milestone linking
   */
  async getAvailableRABCategories(projectId) {
    try {
      const query = `
        SELECT DISTINCT
          category as name,
          COUNT(*) as item_count,
          SUM(CAST(quantity AS DECIMAL) * CAST(unit_price AS DECIMAL)) as total_value,
          MAX(created_at) as last_updated
        FROM rab_items
        WHERE project_id = $1
          AND approval_status = 'approved'
        GROUP BY category
        ORDER BY category
      `;

      const results = await sequelize.query(query, {
        bind: [projectId],
        type: sequelize.QueryTypes.SELECT
      });

      return results.map(cat => ({
        name: cat.name,
        itemCount: parseInt(cat.item_count),
        totalValue: parseFloat(cat.total_value),
        lastUpdated: cat.last_updated
      }));
    } catch (error) {
      console.error('[MilestoneIntegrationService] Error getting RAB categories:', error);
      throw error;
    }
  }

  /**
   * Suggest milestones from approved RAB categories
   */
  async suggestMilestonesFromRAB(projectId) {
    try {
      const categories = await this.getAvailableRABCategories(projectId);

      // Get existing milestones to avoid duplicates
      const existingQuery = `
        SELECT category_link->>'category_name' as category_name
        FROM project_milestones
        WHERE "projectId" = $1
          AND category_link IS NOT NULL
          AND category_link->>'enabled' = 'true'
      `;

      const existingMilestones = await sequelize.query(existingQuery, {
        bind: [projectId],
        type: sequelize.QueryTypes.SELECT
      });

      const existingCategories = new Set(
        existingMilestones.map(m => m.category_name)
      );

      // Filter out categories that already have milestones
      const suggestions = categories
        .filter(cat => !existingCategories.has(cat.name))
        .map((cat, index) => ({
          category: cat.name,
          itemCount: cat.itemCount,
          totalValue: cat.totalValue,
          suggestedTitle: `${cat.name} - Fase 1`,
          suggestedDescription: `Implementasi ${cat.name} sesuai RAB yang telah disetujui`,
          // Suggest timeline based on value (1 month per 100M)
          estimatedDuration: Math.ceil(cat.totalValue / 100000000) * 30,
          suggestedStartDate: this.calculateStartDate(index * 30), // Stagger by 30 days
          suggestedEndDate: this.calculateEndDate(index * 30, Math.ceil(cat.totalValue / 100000000) * 30)
        }));

      return suggestions;
    } catch (error) {
      console.error('[MilestoneIntegrationService] Error suggesting milestones:', error);
      throw error;
    }
  }

  /**
   * Calculate workflow progress for a milestone
   */
  async calculateWorkflowProgress(milestoneId) {
    try {
      const milestone = await this.getMilestoneWithCategory(milestoneId);
      
      if (!milestone || !milestone.category_link || !milestone.category_link.enabled) {
        return null;
      }

      const categoryName = milestone.category_link.category_name;
      const projectId = milestone.projectId;

      // Stage 1: RAB Approved
      const rabData = await this.getRABData(projectId, categoryName);

      // Stage 2: Purchase Orders
      const poData = await this.getPOData(projectId, categoryName);

      // Stage 3: Tanda Terima (Receipts)
      const receiptData = await this.getReceiptData(projectId, poData.po_ids);

      // Stage 4: Berita Acara
      const baData = await this.getBeritaAcaraData(projectId, milestoneId);

      // Stage 5: Progress Payments
      const paymentData = await this.getPaymentData(projectId, milestoneId);

      const workflowProgress = {
        rab_approved: {
          status: true,
          total_value: rabData.total_value,
          total_items: rabData.total_items,
          approved_date: rabData.approved_date
        },
        purchase_orders: {
          total_count: poData.total_count,
          approved_count: poData.approved_count,
          pending_count: poData.pending_count,
          total_value: poData.total_value,
          items: poData.items
        },
        receipts: {
          received_count: receiptData.received_count,
          expected_count: poData.approved_count,
          received_value: receiptData.received_value,
          pending_value: poData.total_value - receiptData.received_value,
          items: receiptData.items,
          alerts: this.generateReceiptAlerts(poData.items, receiptData.items)
        },
        berita_acara: {
          total_count: baData.total_count,
          completed_percentage: baData.completed_percentage,
          total_value: baData.total_value,
          items: baData.items
        },
        payments: {
          paid_count: paymentData.paid_count,
          paid_value: paymentData.paid_value,
          pending_value: rabData.total_value - paymentData.paid_value,
          payment_percentage: (paymentData.paid_value / rabData.total_value) * 100,
          items: paymentData.items
        }
      };

      // Calculate overall progress
      const overallProgress = this.calculateOverallProgress(workflowProgress);

      // Update milestone
      await this.updateMilestoneProgress(milestoneId, workflowProgress, overallProgress);

      return {
        milestoneId,
        workflow_progress: workflowProgress,
        overall_progress: overallProgress,
        last_synced: new Date()
      };
    } catch (error) {
      console.error('[MilestoneIntegrationService] Error calculating progress:', error);
      throw error;
    }
  }

  /**
   * Get RAB data for category
   */
  async getRABData(projectId, categoryName) {
    const query = `
      SELECT 
        COUNT(*) as total_items,
        SUM(CAST(quantity AS DECIMAL) * CAST(unit_price AS DECIMAL)) as total_value,
        MAX(updated_at) as approved_date
      FROM rab_items
      WHERE project_id = $1
        AND category = $2
        AND approval_status = 'approved'
    `;

    const results = await sequelize.query(query, {
      bind: [projectId, categoryName],
      type: sequelize.QueryTypes.SELECT
    });

    const result = results[0] || {};

    return {
      total_items: parseInt(result.total_items || 0),
      total_value: parseFloat(result.total_value || 0),
      approved_date: result.approved_date
    };
  }

  /**
   * Get Purchase Order data
   */
  async getPOData(projectId, categoryName) {
    // Get RAB item IDs for this category
    const rabQuery = `
      SELECT id 
      FROM rab_items 
      WHERE project_id = $1 AND category = $2
    `;

    const rabItems = await sequelize.query(rabQuery, {
      bind: [projectId, categoryName],
      type: sequelize.QueryTypes.SELECT
    });

    const rabItemIds = rabItems.map(r => r.id);

    if (rabItemIds.length === 0) {
      return {
        total_count: 0,
        approved_count: 0,
        pending_count: 0,
        total_value: 0,
        items: [],
        po_ids: []
      };
    }

    // Get POs related to these RAB items
    const poQuery = `
      SELECT DISTINCT
        po.id,
        po.po_number,
        po.supplier_name,
        po.status,
        po.total_amount,
        po.created_at
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      WHERE po.project_id = $1
        AND poi.rab_item_id = ANY($2::uuid[])
      ORDER BY po.created_at DESC
    `;

    const pos = await sequelize.query(poQuery, {
      bind: [projectId, rabItemIds],
      type: sequelize.QueryTypes.SELECT
    });

    const approvedPOs = pos.filter(po => po.status === 'approved');
    const pendingPOs = pos.filter(po => po.status === 'pending');

    return {
      total_count: pos.length,
      approved_count: approvedPOs.length,
      pending_count: pendingPOs.length,
      total_value: pos.reduce((sum, po) => sum + parseFloat(po.total_amount || 0), 0),
      items: pos.map(po => ({
        po_id: po.id,
        po_number: po.po_number,
        supplier: po.supplier_name,
        value: parseFloat(po.total_amount || 0),
        status: po.status,
        date: po.created_at
      })),
      po_ids: pos.map(po => po.id)
    };
  }

  /**
   * Get Receipt (Tanda Terima) data
   */
  async getReceiptData(projectId, poIds) {
    if (poIds.length === 0) {
      return {
        received_count: 0,
        received_value: 0,
        items: []
      };
    }

    const query = `
      SELECT 
        r.id,
        r.receipt_number,
        r.po_id,
        po.po_number,
        r.received_date,
        r.total_value,
        r.status
      FROM receipts r
      JOIN purchase_orders po ON r.po_id = po.id
      WHERE r.po_id = ANY($1::uuid[])
      ORDER BY r.received_date DESC
    `;

    try {
      const receipts = await sequelize.query(query, {
        bind: [poIds],
        type: sequelize.QueryTypes.SELECT
      });

      return {
        received_count: receipts.length,
        received_value: receipts.reduce((sum, r) => sum + parseFloat(r.total_value || 0), 0),
        items: receipts.map(r => ({
          receipt_id: r.id,
          receipt_number: r.receipt_number,
          po_number: r.po_number,
          received_date: r.received_date,
          value: parseFloat(r.total_value || 0),
          status: r.status
        }))
      };
    } catch (error) {
      // Table might not exist yet
      console.log('[MilestoneIntegrationService] Receipts table not ready:', error.message);
      return {
        received_count: 0,
        received_value: 0,
        items: []
      };
    }
  }

  /**
   * Get Berita Acara data
   */
  async getBeritaAcaraData(projectId, milestoneId) {
    const query = `
      SELECT 
        COUNT(*) as total_count,
        AVG(CAST(progress_percentage AS DECIMAL)) as avg_progress,
        SUM(CAST(total_value AS DECIMAL)) as total_value
      FROM berita_acara
      WHERE project_id = $1
        AND ("milestoneId" = $2 OR "milestoneId" IS NULL)
    `;

    try {
      const results = await sequelize.query(query, {
        bind: [projectId, milestoneId],
        type: sequelize.QueryTypes.SELECT
      });

      const result = results[0] || {};

      return {
        total_count: parseInt(result.total_count || 0),
        completed_percentage: parseFloat(result.avg_progress || 0),
        total_value: parseFloat(result.total_value || 0),
        items: []
      };
    } catch (error) {
      console.log('[MilestoneIntegrationService] BA query error:', error.message);
      return {
        total_count: 0,
        completed_percentage: 0,
        total_value: 0,
        items: []
      };
    }
  }

  /**
   * Get Progress Payment data
   */
  async getPaymentData(projectId, milestoneId) {
    const query = `
      SELECT 
        COUNT(*) as paid_count,
        SUM(CAST(amount_paid AS DECIMAL)) as paid_value
      FROM progress_payments
      WHERE project_id = $1
        AND milestone_id = $2
        AND payment_status = 'paid'
    `;

    try {
      const results = await sequelize.query(query, {
        bind: [projectId, milestoneId],
        type: sequelize.QueryTypes.SELECT
      });

      const result = results[0] || {};

      return {
        paid_count: parseInt(result.paid_count || 0),
        paid_value: parseFloat(result.paid_value || 0),
        items: []
      };
    } catch (error) {
      console.log('[MilestoneIntegrationService] Payment query error:', error.message);
      return {
        paid_count: 0,
        paid_value: 0,
        items: []
      };
    }
  }

  /**
   * Generate alerts for receipt delays
   */
  generateReceiptAlerts(poItems, receiptItems) {
    const alerts = [];
    const now = new Date();
    const receivedPONumbers = new Set(receiptItems.map(r => r.po_number));

    poItems.forEach(po => {
      if (po.status === 'approved' && !receivedPONumbers.has(po.po_number)) {
        const daysSinceApproval = (now - new Date(po.date)) / (1000 * 60 * 60 * 24);
        
        if (daysSinceApproval > 7) {
          alerts.push({
            type: 'delivery_delay',
            severity: daysSinceApproval > 14 ? 'high' : 'medium',
            message: `${po.po_number} approved ${Math.floor(daysSinceApproval)} days ago, no receipt yet`,
            po_id: po.po_id,
            days_waiting: Math.floor(daysSinceApproval)
          });
        }
      }
    });

    return alerts;
  }

  /**
   * Calculate overall progress based on workflow stages
   */
  calculateOverallProgress(workflowProgress) {
    const weights = {
      rab_approved: 10,
      po_created: 20,
      receipts_received: 20,
      ba_completed: 30,
      payment_completed: 20
    };

    let progress = 0;

    // Stage 1: RAB
    if (workflowProgress.rab_approved.status) {
      progress += weights.rab_approved;
    }

    // Stage 2: PO
    if (workflowProgress.purchase_orders.total_count > 0) {
      const poProgress = workflowProgress.purchase_orders.approved_count / 
                        workflowProgress.purchase_orders.total_count;
      progress += weights.po_created * poProgress;
    }

    // Stage 3: Receipts
    if (workflowProgress.receipts.expected_count > 0) {
      const receiptProgress = workflowProgress.receipts.received_count / 
                             workflowProgress.receipts.expected_count;
      progress += weights.receipts_received * receiptProgress;
    }

    // Stage 4: BA
    progress += (weights.ba_completed * workflowProgress.berita_acara.completed_percentage) / 100;

    // Stage 5: Payment
    progress += (weights.payment_completed * workflowProgress.payments.payment_percentage) / 100;

    return Math.round(progress);
  }

  /**
   * Update milestone with progress data
   */
  async updateMilestoneProgress(milestoneId, workflowProgress, overallProgress) {
    const query = `
      UPDATE project_milestones
      SET 
        workflow_progress = $1,
        progress = $2,
        last_synced = $3,
        "updatedAt" = $3
      WHERE id = $4
    `;

    await sequelize.query(query, {
      bind: [
        JSON.stringify(workflowProgress),
        overallProgress,
        new Date(),
        milestoneId
      ],
      type: sequelize.QueryTypes.UPDATE
    });
  }

  /**
   * Helper: Get milestone with category
   */
  async getMilestoneWithCategory(milestoneId) {
    const query = `
      SELECT *
      FROM project_milestones
      WHERE id = $1
    `;

    const results = await sequelize.query(query, {
      bind: [milestoneId],
      type: sequelize.QueryTypes.SELECT
    });

    return results[0] || null;
  }

  /**
   * Helper: Calculate start date
   */
  calculateStartDate(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper: Calculate end date
   */
  calculateEndDate(startOffsetDays, durationDays) {
    const date = new Date();
    date.setDate(date.getDate() + startOffsetDays + durationDays);
    return date.toISOString().split('T')[0];
  }
}

module.exports = new MilestoneIntegrationService();
