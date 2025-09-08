const express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');
const InventoryItem = require('../models/InventoryItem');

const router = express.Router();

// Validation schema
const inventorySchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  subcategory: Joi.string().allow('').optional(),
  unit: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  currentStock: Joi.number().min(0).default(0),
  minimumStock: Joi.number().min(0).default(0),
  maximumStock: Joi.number().min(0).optional(),
  unitPrice: Joi.number().min(0).optional()
});

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', async (req, res) => {
  try {
    const {
      category,
      q,
      sort = 'name',
      order = 'asc',
      limit = 50,
      page = 1
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (q) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const { count, rows: items } = await InventoryItem.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: limitNum,
      offset: offset
    });

    res.json({
      success: true,
      data: items,
      pagination: {
        current: pageNum,
        total: Math.ceil(count / limitNum),
        count: count,
        perPage: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory items',
      details: error.message
    });
  }
});

// @route   GET /api/inventory/:id
// @desc    Get single inventory item
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await InventoryItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory item',
      details: error.message
    });
  }
});

// @route   POST /api/inventory
// @desc    Create new inventory item
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { error, value } = inventorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    // Generate ID
    const itemCount = await InventoryItem.count();
    const itemId = `INV${String(itemCount + 1).padStart(3, '0')}`;

    const item = await InventoryItem.create({
      id: itemId,
      ...value
    });

    res.status(201).json({
      success: true,
      data: item,
      message: 'Inventory item created successfully'
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create inventory item',
      details: error.message
    });
  }
});

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await InventoryItem.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    const updateSchema = inventorySchema.fork(
      ['name', 'category', 'unit'],
      (schema) => schema.optional()
    );
    
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }

    await item.update(value);

    res.json({
      success: true,
      data: item,
      message: 'Inventory item updated successfully'
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update inventory item',
      details: error.message
    });
  }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await InventoryItem.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    await item.destroy();

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete inventory item',
      details: error.message
    });
  }
});

module.exports = router;
