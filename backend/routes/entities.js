const express = require('express');
const Entity = require('../models/Entity');

const router = express.Router();

// @route   GET /api/entities
// @desc    Get all entities
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    
    let whereClause = { isActive: true };
    
    if (type) {
      whereClause.entityType = type;
    }

    const entities = await Entity.findAll({
      where: whereClause,
      order: [['entityCode', 'ASC']],
      include: [
        {
          model: Entity,
          as: 'SubEntities',
          where: { isActive: true },
          required: false
        },
        {
          model: Entity,
          as: 'ParentEntity',
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: entities
    });
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch entities'
    });
  }
});

// @route   GET /api/entities/hierarchy
// @desc    Get entities in hierarchical structure
// @access  Private
router.get('/hierarchy', async (req, res) => {
  try {
    const entities = await Entity.findAll({
      where: { isActive: true, parentEntityId: null },
      order: [['entityCode', 'ASC']],
      include: [
        {
          model: Entity,
          as: 'SubEntities',
          where: { isActive: true },
          required: false,
          include: [
            {
              model: Entity,
              as: 'SubEntities',
              where: { isActive: true },
              required: false
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: entities
    });
  } catch (error) {
    console.error('Error fetching entity hierarchy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch entity hierarchy'
    });
  }
});

// @route   POST /api/entities
// @desc    Create new entity
// @access  Private
router.post('/', async (req, res) => {
  try {
    const entity = await Entity.create(req.body);
    res.status(201).json({
      success: true,
      data: entity
    });
  } catch (error) {
    console.error('Error creating entity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create entity'
    });
  }
});

// @route   PUT /api/entities/:id
// @desc    Update entity
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRowsCount] = await Entity.update(req.body, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found'
      });
    }

    const updatedEntity = await Entity.findByPk(id);
    res.json({
      success: true,
      data: updatedEntity
    });
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update entity'
    });
  }
});

// @route   DELETE /api/entities/:id
// @desc    Delete entity (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRowsCount] = await Entity.update(
      { isActive: false },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Entity not found'
      });
    }

    res.json({
      success: true,
      message: 'Entity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete entity'
    });
  }
});

module.exports = router;