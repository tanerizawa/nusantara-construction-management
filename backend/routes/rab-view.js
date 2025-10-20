const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

/**
 * Create RAB Items View with Real-time Availability
 * This view automatically calculates available quantity based on purchase tracking
 */
const createRABAvailabilityView = async () => {
  try {
    // Drop view if exists
    await sequelize.query(`
      DROP VIEW IF EXISTS rab_items_availability CASCADE;
    `);

    // Create view with real-time calculations
    await sequelize.query(`
      CREATE VIEW rab_items_availability AS
      SELECT 
        r.id,
        r.project_id,
        r.category,
        r.description,
        r.unit,
        r.quantity as original_quantity,
        r.unit_price,
        r.total_price,
        r.notes,
        r.status,
        r.is_approved,
        r.approved_by,
        r.approved_at,
        r.created_by,
        r.updated_by,
        r.created_at,
        r.updated_at,
        -- Purchase tracking aggregations
        COALESCE(SUM(t.quantity), 0)::DECIMAL(10,2) as total_purchased,
        COALESCE(SUM(t.total_amount), 0)::DECIMAL(15,2) as total_purchase_amount,
        COUNT(DISTINCT t.po_number) as active_po_count,
        MAX(t.purchase_date) as last_purchase_date,
        -- Calculated availability
        (r.quantity - COALESCE(SUM(t.quantity), 0))::DECIMAL(10,2) as available_quantity,
        ((r.quantity - COALESCE(SUM(t.quantity), 0)) * r.unit_price)::DECIMAL(15,2) as available_value,
        -- Progress percentage
        CASE 
          WHEN r.quantity > 0 
          THEN (COALESCE(SUM(t.quantity), 0) / r.quantity * 100)::DECIMAL(5,2)
          ELSE 0 
        END as purchase_progress_percent
      FROM project_rab r
      LEFT JOIN rab_purchase_tracking t ON r.id::text = t.rab_item_id
      GROUP BY 
        r.id,
        r.project_id,
        r.category,
        r.description,
        r.unit,
        r.quantity,
        r.unit_price,
        r.total_price,
        r.notes,
        r.status,
        r.is_approved,
        r.approved_by,
        r.approved_at,
        r.created_by,
        r.updated_by,
        r.created_at,
        r.updated_at;
    `);

    return true;
  } catch (error) {
    console.error('Error creating RAB Availability View:', error);
    return false;
  }
};

/**
 * GET /api/rab-view/projects/:projectId/items
 * Get RAB items with real-time availability from database view
 */
router.get('/projects/:projectId/items', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { category, approvedOnly } = req.query;

    let whereClause = `WHERE "projectId" = '${projectId}'`;
    
    if (category) {
      whereClause += ` AND category = '${category}'`;
    }
    
    if (approvedOnly === 'true') {
      whereClause += ` AND "isApproved" = true`;
    }

    const [results] = await sequelize.query(`
      SELECT * FROM rab_items_availability
      ${whereClause}
      ORDER BY "createdAt" DESC
    `);

    res.json({
      success: true,
      data: results,
      meta: {
        count: results.length,
        source: 'database_view',
        realtime: true
      }
    });
  } catch (error) {
    console.error('Error fetching RAB items from view:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RAB items',
      details: error.message
    });
  }
});

/**
 * GET /api/rab-view/projects/:projectId/items/:itemId
 * Get single RAB item with real-time availability
 */
router.get('/projects/:projectId/items/:itemId', async (req, res) => {
  try {
    const { projectId, itemId } = req.params;

    const [results] = await sequelize.query(`
      SELECT * FROM rab_items_availability
      WHERE "projectId" = :projectId AND id = :itemId
    `, {
      replacements: { projectId, itemId }
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    res.json({
      success: true,
      data: results[0],
      meta: {
        source: 'database_view',
        realtime: true
      }
    });
  } catch (error) {
    console.error('Error fetching RAB item from view:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RAB item',
      details: error.message
    });
  }
});

/**
 * GET /api/rab-view/init
 * Initialize/recreate the view
 */
router.post('/init', async (req, res) => {
  try {
    const success = await createRABAvailabilityView();
    
    if (success) {
      res.json({
        success: true,
        message: 'RAB Availability View initialized successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to initialize view'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Initialize view on module load
createRABAvailabilityView();

module.exports = router;
