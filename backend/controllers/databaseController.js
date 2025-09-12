// Simple Database Query API untuk development/testing
// File ini memberikan akses langsung ke database untuk keperluan development
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'yk_construction_dev',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'dev_password',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Generic database query endpoint
exports.executeQuery = async (req, res) => {
  try {
    const { query, params = [] } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // Security check - hanya allow SELECT, INSERT, UPDATE, DELETE
    const allowedOperations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
    const operation = query.trim().split(' ')[0].toUpperCase();
    
    if (!allowedOperations.includes(operation)) {
      return res.status(403).json({
        success: false,
        message: 'Operation not allowed'
      });
    }

    // Execute query
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
      operation: operation
    });
    
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// RAB specific endpoints
exports.getRABItems = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const query = `
      SELECT 
        id, project_id, category, item_name, description, unit, 
        quantity, unit_price, subtotal, notes, is_approved, 
        approved_by, approved_date, created_at, updated_at
      FROM project_rab_items 
      WHERE project_id = $1 
      ORDER BY category, item_name
    `;
    
    const result = await pool.query(query, [projectId]);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Get RAB items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RAB items',
      error: error.message
    });
  }
};

exports.createRABItem = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      category,
      item_name,
      description,
      unit,
      quantity,
      unit_price,
      notes
    } = req.body;
    
    const subtotal = quantity * unit_price;
    
    const query = `
      INSERT INTO project_rab_items 
      (id, project_id, category, item_name, description, unit, quantity, unit_price, subtotal, notes, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      projectId, category, item_name, description || '', 
      unit, quantity, unit_price, subtotal, notes || ''
    ]);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Create RAB item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create RAB item',
      error: error.message
    });
  }
};

exports.updateRABItem = async (req, res) => {
  try {
    const { projectId, itemId } = req.params;
    const {
      category,
      item_name,
      description,
      unit,
      quantity,
      unit_price,
      notes
    } = req.body;
    
    const subtotal = quantity * unit_price;
    
    const query = `
      UPDATE project_rab_items 
      SET category = $1, item_name = $2, description = $3, unit = $4, 
          quantity = $5, unit_price = $6, subtotal = $7, notes = $8, updated_at = NOW()
      WHERE id = $9 AND project_id = $10
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      category, item_name, description || '', unit,
      quantity, unit_price, subtotal, notes || '',
      itemId, projectId
    ]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'RAB item not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Update RAB item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update RAB item',
      error: error.message
    });
  }
};

exports.deleteRABItem = async (req, res) => {
  try {
    const { projectId, itemId } = req.params;
    
    const query = 'DELETE FROM project_rab_items WHERE id = $1 AND project_id = $2';
    const result = await pool.query(query, [itemId, projectId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'RAB item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'RAB item deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete RAB item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete RAB item',
      error: error.message
    });
  }
};

exports.approveRABItem = async (req, res) => {
  try {
    const { projectId, itemId } = req.params;
    const { approved_by, notes } = req.body;
    
    const query = `
      UPDATE project_rab_items 
      SET is_approved = true, approved_by = $1, approved_date = NOW(), 
          notes = COALESCE(notes, '') || $2, updated_at = NOW()
      WHERE id = $3 AND project_id = $4
      RETURNING *
    `;
    
    const noteText = notes ? `\n[${new Date().toLocaleString()}] Approved: ${notes}` : `\n[${new Date().toLocaleString()}] Approved`;
    
    const result = await pool.query(query, [
      approved_by || 'current_user', 
      noteText,
      itemId, 
      projectId
    ]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'RAB item not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Approve RAB item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve RAB item',
      error: error.message
    });
  }
};

exports.bulkApproveRABItems = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { item_ids, approved_by, notes } = req.body;
    
    if (!Array.isArray(item_ids) || item_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'item_ids array is required'
      });
    }
    
    const placeholders = item_ids.map((_, index) => `$${index + 4}`).join(',');
    const query = `
      UPDATE project_rab_items 
      SET is_approved = true, approved_by = $1, approved_date = NOW(), 
          notes = COALESCE(notes, '') || $2, updated_at = NOW()
      WHERE project_id = $3 AND id IN (${placeholders})
      RETURNING *
    `;
    
    const noteText = notes ? `\n[${new Date().toLocaleString()}] Bulk Approved: ${notes}` : `\n[${new Date().toLocaleString()}] Bulk Approved`;
    
    const result = await pool.query(query, [
      approved_by || 'current_user',
      noteText,
      projectId,
      ...item_ids
    ]);
    
    res.json({
      success: true,
      data: result.rows,
      approved_count: result.rowCount
    });
    
  } catch (error) {
    console.error('Bulk approve RAB items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk approve RAB items',
      error: error.message
    });
  }
};
