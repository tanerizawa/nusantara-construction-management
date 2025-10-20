const { sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Dashboard Controller
 * Handles dashboard summary, pending approvals, and quick actions
 */

/**
 * Calculate urgency level based on amount and days pending
 * @param {number} amount - Transaction amount
 * @param {Date} createdAt - Creation date
 * @returns {string} 'urgent' | 'medium' | 'normal'
 */
const calculateUrgency = (amount, createdAt) => {
  const daysPending = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  const amountInJuta = amount / 1000000;
  
  // Urgent: > 3 days pending OR amount > 500jt
  if (daysPending > 3 || amountInJuta > 500) {
    return 'urgent';
  }
  
  // Medium: 1-3 days pending OR amount 100jt-500jt
  if (daysPending >= 1 || (amountInJuta >= 100 && amountInJuta <= 500)) {
    return 'medium';
  }
  
  // Normal: < 1 day pending AND amount < 100jt
  return 'normal';
};

/**
 * Get Dashboard Summary
 * @route GET /api/dashboard/summary
 * @access Private
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. PROJECTS SUMMARY
    const projectsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'on_hold' THEN 1 ELSE 0 END) as on_hold
      FROM projects
      
    `;
    const [projects] = await sequelize.query(projectsQuery);

    // 2. APPROVALS SUMMARY
    // RAB Approvals
    const rabQuery = `
      SELECT 
        COUNT(*) as pending,
        SUM(CASE WHEN 
          (EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400) > 3 
          OR (total_price) > 500000000 
        THEN 1 ELSE 0 END) as urgent,
        SUM(total_price) as total_amount
      FROM project_rab
      WHERE status IN ('draft', 'under_review')
        
    `;
    const [rabApprovals] = await sequelize.query(rabQuery);

    // Progress Payments Approvals
    const progressPaymentQuery = `
      SELECT 
        COUNT(*) as pending,
        SUM(CASE WHEN 
          (EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400) > 3 
          OR amount > 500000000 
        THEN 1 ELSE 0 END) as urgent,
        SUM(amount) as total_amount
      FROM progress_payments
      WHERE status IN ('pending_ba', 'ba_approved')
        
    `;
    const [progressPayments] = await sequelize.query(progressPaymentQuery);

    // Delivery Receipts Approvals
    const deliveryQuery = `
      SELECT 
        COUNT(*) as pending
      FROM delivery_receipts
      WHERE inspection_result = 'pending'
        
    `;
    const [deliveryReceipts] = await sequelize.query(deliveryQuery);

    // Leave Requests Approvals
    const leaveQuery = `
      SELECT 
        COUNT(*) as pending
      FROM leave_requests
      WHERE status = 'pending'
        
    `;
    const [leaveRequests] = await sequelize.query(leaveQuery);

    // Purchase Orders Approvals
    const purchaseOrderQuery = `
      SELECT 
        COUNT(*) as pending,
        SUM(CASE WHEN 
          (EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400) > 3 
          OR total_amount > 500000000 
        THEN 1 ELSE 0 END) as urgent,
        SUM(total_amount) as total_amount
      FROM purchase_orders
      WHERE status IN ('draft', 'pending')
        
    `;
    const [purchaseOrders] = await sequelize.query(purchaseOrderQuery);

    // Work Orders Approvals
    const workOrderQuery = `
      SELECT 
        COUNT(*) as pending,
        SUM(CASE WHEN 
          (EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400) > 3 
          OR total_amount > 500000000 
        THEN 1 ELSE 0 END) as urgent,
        SUM(total_amount) as total_amount
      FROM work_orders
      WHERE status IN ('draft', 'pending')
        
    `;
    const [workOrders] = await sequelize.query(workOrderQuery);

    // 3. ATTENDANCE TODAY
    const attendanceQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'clocked_in' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'clocked_out' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'on_leave' THEN 1 ELSE 0 END) as leave
      FROM attendance_records
      WHERE attendance_date = CURRENT_DATE
    `;
    const [attendance] = await sequelize.query(attendanceQuery);

    // 4. DOCUMENTS PENDING
    const baQuery = `
      SELECT COUNT(*) as pending
      FROM berita_acara
      WHERE status IN ('draft', 'submitted', 'client_review')
        
    `;
    const [baPending] = await sequelize.query(baQuery);

    // 5. FINANCIAL SUMMARY
    const budgetQuery = `
      SELECT 
        SUM(COALESCE(budget, 0)) as total,
        SUM(COALESCE(actual_cost, 0)) as used
      FROM projects
      WHERE status = 'active'
        
    `;
    const [budget] = await sequelize.query(budgetQuery);
    
    const budgetTotal = parseFloat(budget[0]?.total || 0);
    const budgetUsed = parseFloat(budget[0]?.used || 0);
    const budgetRemaining = budgetTotal - budgetUsed;
    const budgetPercentage = budgetTotal > 0 ? ((budgetUsed / budgetTotal) * 100).toFixed(1) : 0;

    // Outstanding Payments
    const paymentsQuery = `
      SELECT 
        COUNT(*) as pending,
        SUM(CASE WHEN due_date < CURRENT_DATE THEN 1 ELSE 0 END) as overdue,
        SUM(amount) as total_amount
      FROM progress_payments
      WHERE status IN ('payment_approved', 'invoice_sent', 'processing')
        
    `;
    const [payments] = await sequelize.query(paymentsQuery);

    // 6. MATERIALS SUMMARY
    const materialsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN current_stock <= minimum_stock THEN 1 ELSE 0 END) as low_stock,
        SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock
      FROM inventory_items
      
    `;
    const [materials] = await sequelize.query(materialsQuery);

    // 7. RECENT ACTIVITIES COUNT
    const activitiesQuery = `
      SELECT COUNT(*) as total
      FROM audit_logs
      WHERE DATE(created_at) = CURRENT_DATE
    `;
    const [activities] = await sequelize.query(activitiesQuery);

    // Build response
    const summary = {
      projects: {
        total: parseInt(projects[0]?.total || 0),
        active: parseInt(projects[0]?.active || 0),
        completed: parseInt(projects[0]?.completed || 0),
        onHold: parseInt(projects[0]?.on_hold || 0)
      },
      approvals: {
        rab: {
          pending: parseInt(rabApprovals[0]?.pending || 0),
          urgent: parseInt(rabApprovals[0]?.urgent || 0),
          totalAmount: parseFloat(rabApprovals[0]?.total_amount || 0)
        },
        progressPayments: {
          pending: parseInt(progressPayments[0]?.pending || 0),
          urgent: parseInt(progressPayments[0]?.urgent || 0),
          totalAmount: parseFloat(progressPayments[0]?.total_amount || 0)
        },
        purchaseOrders: {
          pending: parseInt(purchaseOrders[0]?.pending || 0),
          urgent: parseInt(purchaseOrders[0]?.urgent || 0),
          totalAmount: parseFloat(purchaseOrders[0]?.total_amount || 0)
        },
        workOrders: {
          pending: parseInt(workOrders[0]?.pending || 0),
          urgent: parseInt(workOrders[0]?.urgent || 0),
          totalAmount: parseFloat(workOrders[0]?.total_amount || 0)
        },
        deliveryReceipts: {
          pending: parseInt(deliveryReceipts[0]?.pending || 0)
        },
        leaveRequests: {
          pending: parseInt(leaveRequests[0]?.pending || 0)
        },
        total: 
          parseInt(rabApprovals[0]?.pending || 0) +
          parseInt(progressPayments[0]?.pending || 0) +
          parseInt(purchaseOrders[0]?.pending || 0) +
          parseInt(workOrders[0]?.pending || 0) +
          parseInt(deliveryReceipts[0]?.pending || 0) +
          parseInt(leaveRequests[0]?.pending || 0)
      },
      attendance: {
        today: {
          total: parseInt(attendance[0]?.total || 0),
          present: parseInt(attendance[0]?.present || 0),
          absent: parseInt(attendance[0]?.absent || 0),
          leave: parseInt(attendance[0]?.leave || 0),
          sick: parseInt(attendance[0]?.sick || 0)
        }
      },
      documents: {
        pending: {
          ba: parseInt(baPending[0]?.pending || 0),
          deliveryReceipts: parseInt(deliveryReceipts[0]?.pending || 0)
        }
      },
      financial: {
        budget: {
          total: budgetTotal,
          used: budgetUsed,
          remaining: budgetRemaining,
          percentage: parseFloat(budgetPercentage)
        },
        payments: {
          pending: parseInt(payments[0]?.pending || 0),
          overdue: parseInt(payments[0]?.overdue || 0),
          totalAmount: parseFloat(payments[0]?.total_amount || 0)
        }
      },
      materials: {
        total: parseInt(materials[0]?.total || 0),
        lowStock: parseInt(materials[0]?.low_stock || 0),
        outOfStock: parseInt(materials[0]?.out_of_stock || 0)
      },
      activities: {
        today: parseInt(activities[0]?.total || 0)
      }
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard summary',
      error: error.message
    });
  }
};

/**
 * Get Pending Approvals
 * @route GET /api/dashboard/pending-approvals
 * @query type - Filter by type (rab, progress_payment, delivery, leave)
 * @query limit - Limit results (default: 10)
 * @access Private
 */
exports.getPendingApprovals = async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    const userId = req.user.id;

    const result = {};

    // RAB Approvals
    if (!type || type === 'rab') {
      const rabQuery = `
        SELECT 
          r.id,
          r.item_type,
          r.description,
          r.quantity,
          r.unit,
          r.unit_price,
          (r.unit_price * r.quantity) as total_amount,
          r.status,
          r.notes,
          r.created_at,
          p.id as project_id,
          p.name as project_name,
          p.name as project_code,
          u.username as created_by_name
        FROM project_rab r
        JOIN projects p ON r.project_id = p.id
        LEFT JOIN users u ON r.created_by = u.id
        WHERE r.status IN ('draft', 'under_review')
          
        ORDER BY 
          (EXTRACT(EPOCH FROM (NOW() - r.created_at)) / 86400) DESC,
          (r.unit_price * r.quantity) DESC
        LIMIT $1
      `;
      const [rabItems] = await sequelize.query(rabQuery, {
        bind: [parseInt(limit)]
      });

      result.rab = rabItems.map(item => ({
        id: item.id,
        projectId: item.project_id,
        projectName: item.project_name,
        projectCode: item.project_code,
        itemType: item.item_type,
        description: item.description,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        unitPrice: parseFloat(item.unit_price),
        totalAmount: parseFloat(item.total_amount),
        status: item.status,
        notes: item.notes,
        createdBy: item.created_by_name,
        createdAt: item.created_at,
        urgency: calculateUrgency(parseFloat(item.total_price), item.created_at)
      }));
    }

    // Progress Payment Approvals
    if (!type || type === 'progress_payment') {
      const progressQuery = `
        SELECT 
          pp.id,
          pp.invoice_number,
          pp.amount,
          pp.percentage,
          pp.net_amount,
          pp.due_date,
          pp.status,
          pp.created_at,
          p.id as project_id,
          p.name as project_name,
          p.name as project_code,
          u.username as created_by_name
        FROM progress_payments pp
        JOIN projects p ON pp.project_id = p.id
        LEFT JOIN users u ON pp.created_by = u.id
        WHERE pp.status IN ('pending_ba', 'ba_approved')
          
        ORDER BY 
          (EXTRACT(EPOCH FROM (NOW() - pp.created_at)) / 86400) DESC,
          pp.amount DESC
        LIMIT $1
      `;
      const [payments] = await sequelize.query(progressQuery, {
        bind: [parseInt(limit)]
      });

      result.progressPayments = payments.map(item => ({
        id: item.id,
        projectId: item.project_id,
        projectName: item.project_name,
        projectCode: item.project_code,
        invoiceNumber: item.invoice_number || 'N/A',
        amount: parseFloat(item.amount),
        percentage: parseFloat(item.percentage),
        netAmount: parseFloat(item.net_amount),
        dueDate: item.due_date,
        status: item.status,
        createdBy: item.created_by_name,
        createdAt: item.created_at,
        urgency: calculateUrgency(parseFloat(item.amount), item.created_at)
      }));
    }

    // Purchase Order Approvals
    if (!type || type === 'purchase_order') {
      const poQuery = `
        SELECT 
          po.id,
          po.po_number,
          po.supplier_name,
          po.total_amount,
          po.terms,
          po.expected_delivery_date,
          po.status,
          po.notes,
          po.created_at,
          p.id as project_id,
          p.name as project_name,
          p.name as project_code,
          u.username as created_by_name
        FROM purchase_orders po
        LEFT JOIN projects p ON po.project_id = p.id
        LEFT JOIN users u ON po.created_by = u.id
        WHERE po.status IN ('draft', 'pending')
        ORDER BY 
          (EXTRACT(EPOCH FROM (NOW() - po.created_at)) / 86400) DESC,
          po.total_amount DESC
        LIMIT $1
      `;
      const [pos] = await sequelize.query(poQuery, {
        bind: [parseInt(limit)]
      });

      result.purchaseOrders = pos.map(item => ({
        id: item.id,
        projectId: item.project_id,
        projectName: item.project_name,
        projectCode: item.project_code,
        poNumber: item.po_number,
        supplierName: item.supplier_name,
        totalAmount: parseFloat(item.total_amount || 0),
        paymentTerms: item.terms,
        deliveryDate: item.expected_delivery_date,
        status: item.status,
        notes: item.notes,
        createdBy: item.created_by_name,
        createdAt: item.created_at,
        urgency: calculateUrgency(parseFloat(item.total_amount || 0), item.created_at)
      }));
    }

    // Work Order Approvals
    if (!type || type === 'work_order') {
      const woQuery = `
        SELECT 
          wo.id,
          wo.wo_number,
          wo.contractor_name,
          wo.total_amount,
          wo.start_date,
          wo.end_date,
          wo.status,
          wo.notes,
          wo.created_at,
          p.id as project_id,
          p.name as project_name,
          p.name as project_code,
          u.username as created_by_name
        FROM work_orders wo
        LEFT JOIN projects p ON wo.project_id = p.id
        LEFT JOIN users u ON wo.created_by = u.id
        WHERE wo.status IN ('draft', 'pending')
        ORDER BY 
          (EXTRACT(EPOCH FROM (NOW() - wo.created_at)) / 86400) DESC,
          wo.total_amount DESC
        LIMIT $1
      `;
      const [wos] = await sequelize.query(woQuery, {
        bind: [parseInt(limit)]
      });

      result.workOrders = wos.map(item => ({
        id: item.id,
        projectId: item.project_id,
        projectName: item.project_name,
        projectCode: item.project_code,
        woNumber: item.wo_number,
        contractorName: item.contractor_name,
        totalAmount: parseFloat(item.total_amount || 0),
        startDate: item.start_date,
        endDate: item.end_date,
        status: item.status,
        notes: item.notes,
        createdBy: item.created_by_name,
        createdAt: item.created_at,
        urgency: calculateUrgency(parseFloat(item.total_amount || 0), item.created_at)
      }));
    }

    // Delivery Receipt Approvals
    if (!type || type === 'delivery') {
      const deliveryQuery = `
        SELECT 
          dr.id,
          dr.receipt_number,
          dr.delivery_date,
          dr.received_date,
          dr.delivery_location,
          dr.receiver_name,
          dr.inspection_result,
          dr.created_at,
          p.id as project_id,
          p.name as project_name,
          u.username as created_by_name
        FROM delivery_receipts dr
        LEFT JOIN projects p ON dr.project_id = p.id
        LEFT JOIN users u ON dr.received_by = u.id
        WHERE dr.inspection_result = 'pending'
          
        ORDER BY dr.created_at DESC
        LIMIT $1
      `;
      const [deliveries] = await sequelize.query(deliveryQuery, {
        bind: [parseInt(limit)]
      });

      result.deliveryReceipts = deliveries.map(item => ({
        id: item.id,
        projectId: item.project_id,
        projectName: item.project_name,
        receiptNumber: item.receipt_number,
        deliveryDate: item.delivery_date,
        receivedDate: item.received_date,
        deliveryLocation: item.delivery_location,
        receiverName: item.receiver_name,
        inspectionResult: item.inspection_result,
        createdBy: item.created_by_name,
        createdAt: item.created_at,
        urgency: 'normal'
      }));
    }

    // Leave Request Approvals
    if (!type || type === 'leave') {
      const leaveQuery = `
        SELECT 
          lr.id,
          lr.leave_type,
          lr.start_date,
          lr.end_date,
          lr.total_days,
          lr.reason,
          lr.status,
          lr.created_at,
          u.username as employee_name,
          u.id as employee_id
        FROM leave_requests lr
        JOIN users u ON lr.user_id = u.id
        WHERE lr.status = 'pending'
        ORDER BY lr.created_at DESC
        LIMIT $1
      `;
      const [leaves] = await sequelize.query(leaveQuery, {
        bind: [parseInt(limit)]
      });

      result.leaveRequests = leaves.map(item => ({
        id: item.id,
        employeeId: item.employee_id,
        employeeName: item.employee_name,
        leaveType: item.leave_type,
        startDate: item.start_date,
        endDate: item.end_date,
        totalDays: parseInt(item.total_days),
        reason: item.reason,
        status: item.status,
        createdAt: item.created_at,
        urgency: calculateUrgency(0, item.created_at) // No amount for leave
      }));
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error getting pending approvals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending approvals',
      error: error.message
    });
  }
};

/**
 * Quick Approve/Reject
 * @route POST /api/dashboard/approve/:type/:id
 * @param type - Approval type (rab, progress_payment, delivery, leave)
 * @param id - Item ID
 * @body action - 'approve' or 'reject'
 * @body comments - Optional comments
 * @access Private
 */
exports.quickApproval = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { action, comments } = req.body;
    const userId = req.user.id;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    let result;

    switch (type) {
      case 'rab':
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        const rabRows = await sequelize.query(`
          UPDATE project_rab
          SET 
            status = $1,
            is_approved = $2,
            approved_by = $3,
            approved_at = NOW(),
            updated_at = NOW()
          WHERE id = $4 
          RETURNING *
        `, {
          bind: [newStatus, action === 'approve', userId, id],
          type: sequelize.QueryTypes.UPDATE
        });
        result = rabRows[0] && rabRows[0][0]; // First array is results, second element is metadata
        break;

      case 'progress_payment':
        const paymentStatus = action === 'approve' ? 'approved' : 'rejected';
        const paymentRows = await sequelize.query(`
          UPDATE progress_payments
          SET 
            status = $1,
            payment_approved_by = $2,
            payment_approved_at = NOW(),
            approval_notes = $3,
            updated_at = NOW()
          WHERE id = $4 
          RETURNING *
        `, {
          bind: [paymentStatus, userId, comments || null, id],
          type: sequelize.QueryTypes.UPDATE
        });
        result = paymentRows[0] && paymentRows[0][0];
        break;

      case 'purchase_order':
        const poStatus = action === 'approve' ? 'approved' : 'rejected';
        const poRows = await sequelize.query(`
          UPDATE purchase_orders
          SET 
            status = $1,
            approved_by = $2,
            approved_at = NOW(),
            updated_at = NOW()
          WHERE id = $3 
          RETURNING *
        `, {
          bind: [poStatus, userId, id],
          type: sequelize.QueryTypes.UPDATE
        });
        result = poRows[0] && poRows[0][0];
        break;

      case 'work_order':
        const woStatus = action === 'approve' ? 'approved' : 'rejected';
        const woRows = await sequelize.query(`
          UPDATE work_orders
          SET 
            status = $1,
            approved_by = $2,
            approved_at = NOW(),
            approval_notes = $3,
            updated_at = NOW()
          WHERE id = $4 
          RETURNING *
        `, {
          bind: [woStatus, userId, comments || null, id],
          type: sequelize.QueryTypes.UPDATE
        });
        result = woRows[0] && woRows[0][0];
        break;

      case 'delivery':
        const inspectionStatus = action === 'approve' ? 'passed' : 'failed';
        const deliveryRows = await sequelize.query(`
          UPDATE delivery_receipts
          SET 
            inspection_status = $1,
            inspected_by = $2,
            inspection_date = NOW(),
            inspection_notes = $3,
            updated_at = NOW()
          WHERE id = $4 
          RETURNING *
        `, {
          bind: [inspectionStatus, userId, comments || null, id],
          type: sequelize.QueryTypes.UPDATE
        });
        result = deliveryRows[0] && deliveryRows[0][0];
        break;

      case 'leave':
        const leaveStatus = action === 'approve' ? 'approved' : 'rejected';
        const leaveRows = await sequelize.query(`
          UPDATE leave_requests
          SET 
            status = $1,
            approved_by = $2,
            approved_at = NOW(),
            approval_notes = $3,
            updated_at = NOW()
          WHERE id = $4 
          RETURNING *
        `, {
          bind: [leaveStatus, userId, comments || null, id],
          type: sequelize.QueryTypes.UPDATE
        });
        result = leaveRows[0] && leaveRows[0][0];
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid approval type'
        });
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`
      });
    }

    res.json({
      success: true,
      message: `Successfully ${action}d ${type}`,
      data: result
    });

  } catch (error) {
    console.error('Error in quick approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process approval',
      error: error.message
    });
  }
};

module.exports = exports;
