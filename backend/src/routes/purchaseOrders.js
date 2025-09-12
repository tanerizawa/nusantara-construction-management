const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'yk-postgres-dev',
  database: process.env.DB_NAME || 'yk_construction_dev',
  password: process.env.DB_PASSWORD || 'postgres123',
  port: process.env.DB_PORT || 5432,
});

// Helper function to generate unique PO number
const generatePONumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PO-${year}${month}${day}-${random}`;
};

// Helper function to generate unique ID
const generateId = (prefix = 'PO') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// GET /api/purchase-orders - Get all purchase orders
router.get('/', async (req, res) => {
  try {
    const { status, project_id, supplier_id, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        po.*,
        p.name as project_name,
        s.name as supplier_name,
        s.code as supplier_code
      FROM purchase_orders po
      LEFT JOIN projects p ON po.project_id = p.id
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      query += ` AND po.status = $${paramCount}`;
      params.push(status);
    }
    
    if (project_id) {
      paramCount++;
      query += ` AND po.project_id = $${paramCount}`;
      params.push(project_id);
    }
    
    if (supplier_id) {
      paramCount++;
      query += ` AND po.supplier_id = $${paramCount}`;
      params.push(supplier_id);
    }
    
    query += ` ORDER BY po.order_date DESC, po.createdAt DESC`;
    
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(parseInt(offset));
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase orders',
      error: error.message
    });
  }
});

// GET /api/purchase-orders/:id - Get specific purchase order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get PO details
    const poResult = await pool.query(`
      SELECT 
        po.*,
        p.name as project_name,
        p.description as project_description,
        p.location as project_location,
        s.name as supplier_name,
        s.code as supplier_code,
        s.contact_person,
        s.phone as supplier_phone,
        s.email as supplier_email,
        s.address as supplier_address
      FROM purchase_orders po
      LEFT JOIN projects p ON po.project_id = p.id
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      WHERE po.id = $1
    `, [id]);
    
    if (poResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    
    const po = poResult.rows[0];
    
    // Get PO items
    const itemsResult = await pool.query(`
      SELECT 
        poi.*,
        rab.category,
        rab.description as rab_description
      FROM purchase_order_items poi
      LEFT JOIN project_rab_items rab ON poi.rab_item_id = rab.id
      WHERE poi.po_id = $1
      ORDER BY poi.created_at
    `, [id]);
    
    po.items = itemsResult.rows;
    
    res.json({
      success: true,
      data: po
    });
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase order',
      error: error.message
    });
  }
});

// POST /api/purchase-orders - Create new purchase order
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      project_id,
      supplier_id,
      supplier_name,
      order_date,
      expected_delivery_date,
      delivery_address,
      payment_terms,
      notes,
      status = 'draft',
      subtotal,
      tax_amount,
      total_amount,
      items = []
    } = req.body;
    
    // Validate required fields
    if (!project_id || !supplier_id || !items.length) {
      throw new Error('Missing required fields: project_id, supplier_id, and items');
    }
    
    // Generate unique IDs
    const poId = generateId('PO');
    const poNumber = generatePONumber();
    
    // Insert purchase order
    const insertPOQuery = `
      INSERT INTO purchase_orders (
        id, po_number, project_id, supplier_id, supplier_name,
        order_date, expected_delivery_date, delivery_address,
        payment_terms, notes, status, subtotal, tax_amount, total_amount,
        createdAt, updatedAt
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING *
    `;
    
    const poResult = await client.query(insertPOQuery, [
      poId, poNumber, project_id, supplier_id, supplier_name,
      order_date, expected_delivery_date, delivery_address,
      payment_terms, notes, status, subtotal, tax_amount, total_amount
    ]);
    
    // Insert purchase order items
    for (const item of items) {
      const itemId = generateId('POI');
      
      await client.query(`
        INSERT INTO purchase_order_items (
          id, po_id, rab_item_id, item_name, description, unit,
          ordered_quantity, unit_price, total_price, notes, status,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `, [
        itemId, poId, item.id, item.item_name, item.description, item.unit,
        item.po_quantity, item.unit_price, item.po_total, item.notes || '', 'ordered'
      ]);
      
      // Update RAB item quantities
      await client.query(`
        UPDATE project_rab_items 
        SET 
          po_quantity = po_quantity + $1,
          po_status = CASE 
            WHEN (po_quantity + $1) >= quantity THEN 'fully_ordered'
            ELSE 'partially_ordered'
          END,
          last_po_date = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [item.po_quantity, item.id]);
    }
    
    await client.query('COMMIT');
    
    // Fetch the created PO with all details
    const createdPO = await pool.query(`
      SELECT 
        po.*,
        p.name as project_name,
        s.name as supplier_name
      FROM purchase_orders po
      LEFT JOIN projects p ON po.project_id = p.id
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      WHERE po.id = $1
    `, [poId]);
    
    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: createdPO.rows[0]
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create purchase order',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// PUT /api/purchase-orders/:id - Update purchase order
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const {
      supplier_id,
      supplier_name,
      order_date,
      expected_delivery_date,
      delivery_address,
      payment_terms,
      notes,
      status,
      subtotal,
      tax_amount,
      total_amount
    } = req.body;
    
    // Check if PO exists
    const existingPO = await client.query('SELECT * FROM purchase_orders WHERE id = $1', [id]);
    if (existingPO.rows.length === 0) {
      throw new Error('Purchase order not found');
    }
    
    // Update purchase order
    const updateQuery = `
      UPDATE purchase_orders 
      SET 
        supplier_id = COALESCE($1, supplier_id),
        supplier_name = COALESCE($2, supplier_name),
        order_date = COALESCE($3, order_date),
        expected_delivery_date = COALESCE($4, expected_delivery_date),
        delivery_address = COALESCE($5, delivery_address),
        payment_terms = COALESCE($6, payment_terms),
        notes = COALESCE($7, notes),
        status = COALESCE($8, status),
        subtotal = COALESCE($9, subtotal),
        tax_amount = COALESCE($10, tax_amount),
        total_amount = COALESCE($11, total_amount),
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, [
      supplier_id, supplier_name, order_date, expected_delivery_date,
      delivery_address, payment_terms, notes, status, subtotal,
      tax_amount, total_amount, id
    ]);
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Purchase order updated successfully',
      data: result.rows[0]
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update purchase order',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// DELETE /api/purchase-orders/:id - Delete purchase order
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Get PO items to restore RAB quantities
    const itemsResult = await client.query(`
      SELECT poi.*, rab.id as rab_item_id
      FROM purchase_order_items poi
      LEFT JOIN project_rab_items rab ON poi.rab_item_id = rab.id
      WHERE poi.po_id = $1
    `, [id]);
    
    // Restore RAB quantities
    for (const item of itemsResult.rows) {
      if (item.rab_item_id) {
        await client.query(`
          UPDATE project_rab_items 
          SET 
            po_quantity = GREATEST(0, po_quantity - $1),
            po_status = CASE 
              WHEN (po_quantity - $1) <= 0 THEN 'not_ordered'
              WHEN (po_quantity - $1) < quantity THEN 'partially_ordered'
              ELSE 'fully_ordered'
            END,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, [item.ordered_quantity, item.rab_item_id]);
      }
    }
    
    // Delete PO items
    await client.query('DELETE FROM purchase_order_items WHERE po_id = $1', [id]);
    
    // Delete purchase order
    const result = await client.query('DELETE FROM purchase_orders WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Purchase order not found');
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Purchase order deleted successfully'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete purchase order',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// GET /api/purchase-orders/projects/ready - Get projects ready for PO
router.get('/projects/ready', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM po_dashboard_view 
      WHERE approved_rab_items > 0 AND available_for_po > 0
      ORDER BY project_name
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching ready projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ready projects',
      error: error.message
    });
  }
});

// GET /api/purchase-orders/projects/:projectId/rab-items - Get available RAB items for PO
router.get('/projects/:projectId/rab-items', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        id,
        category,
        item_name,
        description,
        unit,
        quantity,
        unit_price,
        subtotal,
        po_quantity,
        (quantity - po_quantity) as remaining_quantity,
        po_status
      FROM project_rab_items 
      WHERE project_id = $1 
        AND is_approved = true 
        AND (quantity - po_quantity) > 0
      ORDER BY category, item_name
    `, [projectId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching RAB items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch RAB items',
      error: error.message
    });
  }
});

// GET /api/purchase-orders/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_pos,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'ordered' THEN 1 END) as ordered_count,
        COUNT(CASE WHEN status = 'received' THEN 1 END) as received_count,
        COALESCE(SUM(total_amount), 0) as total_value,
        COALESCE(SUM(CASE WHEN status IN ('approved', 'ordered', 'received') THEN total_amount ELSE 0 END), 0) as approved_value
      FROM purchase_orders
      WHERE createdAt >= CURRENT_DATE - INTERVAL '12 months'
    `);
    
    const projectStats = await pool.query(`
      SELECT COUNT(*) as projects_with_available_items
      FROM po_dashboard_view
      WHERE available_for_po > 0
    `);
    
    res.json({
      success: true,
      data: {
        ...stats.rows[0],
        projects_ready: projectStats.rows[0].projects_with_available_items
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

module.exports = router;
