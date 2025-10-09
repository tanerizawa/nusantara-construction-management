const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', 
  database: process.env.DB_NAME || 'construction_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Get pending approvals for current user role
router.get('/pending', async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'] || req.query.role || 'project_manager';
    
    const query = `
      SELECT 
        ai.*,
        aw.name as workflow_name,
        aw.workflow_steps
      FROM approval_instances ai
      JOIN approval_workflows aw ON ai.workflow_id = aw.id
      WHERE ai.overall_status = 'pending'
      ORDER BY ai.created_at ASC
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending approvals',
      details: error.message
    });
  }
});

// Get approval history
router.get('/history', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    
    const query = `
      SELECT 
        ai.*,
        aw.name as workflow_name,
        aw.entity_type
      FROM approval_instances ai
      JOIN approval_workflows aw ON ai.workflow_id = aw.id
      WHERE ai.overall_status IN ('approved', 'rejected')
      ORDER BY ai.updated_at DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching approval history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch approval history'
    });
  }
});

// Get approval statistics
router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(CASE WHEN overall_status = 'pending' THEN 1 END)::integer as pending,
        COUNT(CASE WHEN overall_status = 'approved' THEN 1 END)::integer as approved,
        COUNT(CASE WHEN overall_status = 'rejected' THEN 1 END)::integer as rejected,
        COUNT(*)::integer as total
      FROM approval_instances
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `;
    
    const result = await pool.query(query);
    
    const stats = result.rows[0] || { pending: 0, approved: 0, rejected: 0, total: 0 };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch approval stats',
      details: error.message
    });
  }
});

// Submit RAB for approval
router.post('/rab/:rabId/submit', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { rabId } = req.params;
    const { workflow_type, priority, requested_by } = req.body;
    
    // Get RAB Construction Standard workflow
    const workflowQuery = `
      SELECT * FROM approval_workflows 
      WHERE name = $1 AND entity_type = 'rab' AND is_active = true
    `;
    const workflowResult = await client.query(workflowQuery, [workflow_type || 'RAB Construction Standard']);
    
    if (workflowResult.rows.length === 0) {
      throw new Error('Approval workflow not found');
    }
    
    const workflow = workflowResult.rows[0];
    
    // Create approval instance
    const instanceQuery = `
      INSERT INTO approval_instances (
        id, workflow_id, entity_type, entity_id, 
        overall_status, current_step, priority, 
        requested_by, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, 'rab', $2, 
        'pending', 1, $3, 
        $4, NOW(), NOW()
      ) RETURNING *
    `;
    
    const instanceResult = await client.query(instanceQuery, [
      workflow.id, rabId, priority || 'normal', requested_by || 'system'
    ]);
    
    const instance = instanceResult.rows[0];
    
    // Create approval steps based on workflow
    const workflowSteps = JSON.parse(workflow.workflow_steps);
    
    for (const step of workflowSteps) {
      const stepQuery = `
        INSERT INTO approval_steps (
          id, approval_instance_id, step_order, step_name,
          role, status, conditions, sla_hours, created_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, 'pending', $5, $6, NOW()
        )
      `;
      
      await client.query(stepQuery, [
        instance.id,
        step.step,
        step.name,
        step.role,
        JSON.stringify(step.conditions || {}),
        step.sla_hours || 24
      ]);
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: instance,
      message: 'RAB submitted for approval successfully'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error submitting RAB for approval:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit RAB for approval'
    });
  } finally {
    client.release();
  }
});

// Get RAB approval status
router.get('/rab/:rabId/status', async (req, res) => {
  try {
    const { rabId } = req.params;
    
    const query = `
      SELECT 
        ai.*,
        aw.name as workflow_name,
        aw.workflow_steps,
        json_agg(
          json_build_object(
            'id', ast.id,
            'step_order', ast.step_order,
            'step_name', ast.step_name,
            'role', ast.role,
            'status', ast.status,
            'approved_by', ast.approved_by,
            'approved_at', ast.approved_at,
            'comments', ast.comments,
            'sla_hours', ast.sla_hours
          ) ORDER BY ast.step_order
        ) as approval_steps
      FROM approval_instances ai
      JOIN approval_workflows aw ON ai.workflow_id = aw.id
      LEFT JOIN approval_steps ast ON ai.id = ast.approval_instance_id
      WHERE ai.entity_type = 'rab' AND ai.entity_id = $1
      GROUP BY ai.id, aw.id
      ORDER BY ai.created_at DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [rabId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Approval process not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching RAB approval status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch approval status'
    });
  }
});

// Process approval action
router.post('/:approvalId/action', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { approvalId } = req.params;
    const { action, comments, approved_by } = req.body;
    
    // Get current approval instance
    const instanceQuery = `
      SELECT ai.*, ast.id as step_id, ast.step_order
      FROM approval_instances ai
      JOIN approval_steps ast ON ai.id = ast.approval_instance_id
      WHERE ai.id = $1 AND ast.step_order = ai.current_step AND ast.status = 'pending'
    `;
    
    const instanceResult = await client.query(instanceQuery, [approvalId]);
    
    if (instanceResult.rows.length === 0) {
      throw new Error('Approval step not found or already processed');
    }
    
    const instance = instanceResult.rows[0];
    
    // Update current step
    const stepStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'info_requested';
    
    const updateStepQuery = `
      UPDATE approval_steps 
      SET status = $1, approved_by = $2, approved_at = NOW(), comments = $3
      WHERE id = $4
    `;
    
    await client.query(updateStepQuery, [stepStatus, approved_by, comments, instance.step_id]);
    
    // Determine next action
    let newOverallStatus = instance.overall_status;
    let newCurrentStep = instance.current_step;
    
    if (action === 'approve') {
      // Check if this is the last step
      const maxStepQuery = `
        SELECT MAX(step_order) as max_step 
        FROM approval_steps 
        WHERE approval_instance_id = $1
      `;
      const maxStepResult = await client.query(maxStepQuery, [approvalId]);
      const maxStep = maxStepResult.rows[0].max_step;
      
      if (instance.current_step >= maxStep) {
        newOverallStatus = 'approved';
      } else {
        newCurrentStep = instance.current_step + 1;
      }
    } else if (action === 'reject') {
      newOverallStatus = 'rejected';
    }
    
    // Update approval instance
    const updateInstanceQuery = `
      UPDATE approval_instances 
      SET overall_status = $1, current_step = $2, updated_at = NOW()
      WHERE id = $3
    `;
    
    await client.query(updateInstanceQuery, [newOverallStatus, newCurrentStep, approvalId]);
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: `Approval ${action}ed successfully`
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing approval action:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process approval action'
    });
  } finally {
    client.release();
  }
});

module.exports = router;