/**
 * Projects Module - RAB (Rencana Anggaran Biaya) Routes
 * Handles: RAB CRUD, Approval, Export, Batch operations
 * Lines: ~380 (extracted from 3,031 line monolith)
 */

const express = require('express');
const ProjectRAB = require('../../models/ProjectRAB');
const Project = require('../../models/Project');

const router = express.Router();

/**
 * @route   GET /api/projects/:id/rab
 * @desc    Get all RAB items for a project
 * @access  Private
 */
router.get('/:id/rab', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, category, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Build where clause
    const where = { projectId: id };
    if (status) where.status = status;
    if (category) where.category = category;

    const rabItems = await ProjectRAB.findAll({
      where,
      order: [[sortBy, sortOrder]]
    });

    // Calculate summary
    const summary = {
      total: rabItems.length,
      totalAmount: rabItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0),
      approved: rabItems.filter(item => item.status === 'approved').length,
      draft: rabItems.filter(item => item.status === 'draft').length, // Changed from 'pending' to 'draft'
      under_review: rabItems.filter(item => item.status === 'under_review').length,
      rejected: rabItems.filter(item => item.status === 'rejected').length,
      byCategory: rabItems.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = { count: 0, amount: 0 };
        }
        acc[item.category].count++;
        acc[item.category].amount += parseFloat(item.totalPrice || 0);
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: rabItems,
      summary
    });
  } catch (error) {
    console.error('Error fetching RAB items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RAB items',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:id/rab/:rabId
 * @desc    Get single RAB item details
 * @access  Private
 */
router.get('/:id/rab/:rabId', async (req, res) => {
  try {
    const { id, rabId } = req.params;

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    res.json({
      success: true,
      data: rabItem
    });
  } catch (error) {
    console.error('Error fetching RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RAB item',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/rab
 * @desc    Create new RAB item for a project
 * @access  Private
 */
router.post('/:id/rab', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, unit, quantity, unitPrice, notes, createdBy, status = 'draft' } = req.body; // Changed default from 'pending' to 'draft'

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Validate required fields
    if (!category || !description || !unit || quantity == null || unitPrice == null) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: category, description, unit, quantity, unitPrice'
      });
    }

    // Validate numeric values
    const qty = parseFloat(quantity);
    const price = parseFloat(unitPrice);
    
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be a positive number'
      });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        error: 'Unit price must be a non-negative number'
      });
    }

    const rabItem = await ProjectRAB.create({
      projectId: id,
      category,
      description,
      unit,
      quantity: qty,
      unitPrice: price,
      totalPrice: qty * price,
      status,
      notes,
      createdBy
    });

    res.status(201).json({
      success: true,
      data: rabItem,
      message: 'RAB item created successfully'
    });
  } catch (error) {
    console.error('Error creating RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create RAB item',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/rab/bulk
 * @desc    Create multiple RAB items at once
 * @access  Private
 */
router.post('/:id/rab/bulk', async (req, res) => {
  try {
    const { id } = req.params;
    const { items, createdBy } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required and must not be empty'
      });
    }

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Validate and prepare items
    const rabItems = items.map(item => {
      const qty = parseFloat(item.quantity);
      const price = parseFloat(item.unitPrice);

      if (!item.category || !item.description || !item.unit || isNaN(qty) || isNaN(price)) {
        throw new Error(`Invalid item: ${JSON.stringify(item)}`);
      }

      return {
        projectId: id,
        category: item.category,
        description: item.description,
        unit: item.unit,
        quantity: qty,
        unitPrice: price,
        totalPrice: qty * price,
        status: item.status || 'draft', // Changed from 'pending' to 'draft'
        notes: item.notes || '',
        createdBy: createdBy || item.createdBy
      };
    });

    // Bulk create
    const created = await ProjectRAB.bulkCreate(rabItems);

    res.status(201).json({
      success: true,
      data: created,
      message: `${created.length} RAB items created successfully`
    });
  } catch (error) {
    console.error('Error creating bulk RAB items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bulk RAB items',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id/rab/:rabId
 * @desc    Update RAB item
 * @access  Private
 */
router.put('/:id/rab/:rabId', async (req, res) => {
  try {
    const { id, rabId } = req.params;
    const { 
      category, description, unit, quantity, unitPrice, notes, updatedBy,
      status, approvedBy, approvedAt, rejectedBy, rejectedAt, rejectionReason
    } = req.body;

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    // Prepare update data
    const updateData = {
      updatedBy
    };

    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (unit !== undefined) updateData.unit = unit;
    
    if (quantity !== undefined) {
      const qty = parseFloat(quantity);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number'
        });
      }
      updateData.quantity = qty;
    }

    if (unitPrice !== undefined) {
      const price = parseFloat(unitPrice);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          error: 'Unit price must be a non-negative number'
        });
      }
      updateData.unitPrice = price;
    }

    // Recalculate total price if quantity or unitPrice changed
    if (updateData.quantity !== undefined || updateData.unitPrice !== undefined) {
      const finalQty = updateData.quantity !== undefined ? updateData.quantity : rabItem.quantity;
      const finalPrice = updateData.unitPrice !== undefined ? updateData.unitPrice : rabItem.unitPrice;
      updateData.totalPrice = finalQty * finalPrice;
    }

    if (notes !== undefined) updateData.notes = notes;
    if (status !== undefined) updateData.status = status;
    if (approvedBy !== undefined) updateData.approvedBy = approvedBy;
    if (approvedAt !== undefined) updateData.approvedAt = approvedAt;
    if (rejectedBy !== undefined) updateData.rejectedBy = rejectedBy;
    if (rejectedAt !== undefined) updateData.rejectedAt = rejectedAt;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;

    await rabItem.update(updateData);

    res.json({
      success: true,
      data: rabItem,
      message: 'RAB item updated successfully'
    });
  } catch (error) {
    console.error('Error updating RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update RAB item',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:id/rab/:rabId/approve
 * @desc    Approve a single RAB item
 * @access  Private
 */
router.put('/:id/rab/:rabId/approve', async (req, res) => {
  try {
    const { id, rabId } = req.params;
    const { approvedBy, notes } = req.body;

    if (!approvedBy) {
      return res.status(400).json({
        success: false,
        error: 'approvedBy is required'
      });
    }

    const rabItem = await ProjectRAB.findOne({ 
      where: { id: rabId, projectId: id } 
    });

    if (!rabItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'RAB item not found' 
      });
    }

    if (rabItem.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'RAB item is already approved'
      });
    }

    await rabItem.update({
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
      notes: notes || rabItem.notes
    });

    res.json({ 
      success: true, 
      data: rabItem, 
      message: 'RAB item approved successfully' 
    });
  } catch (error) {
    console.error('Error approving RAB item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to approve RAB item', 
      details: error.message 
    });
  }
});

/**
 * @route   PUT /api/projects/:id/rab/:rabId/reject
 * @desc    Reject a single RAB item
 * @access  Private
 */
router.put('/:id/rab/:rabId/reject', async (req, res) => {
  try {
    const { id, rabId } = req.params;
    const { rejectedBy, rejectionReason } = req.body;

    if (!rejectedBy || !rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'rejectedBy and rejectionReason are required'
      });
    }

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    await rabItem.update({
      status: 'rejected',
      rejectedBy,
      rejectedAt: new Date(),
      rejectionReason
    });

    res.json({
      success: true,
      data: rabItem,
      message: 'RAB item rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject RAB item',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/rab/approve-all
 * @desc    Approve all pending RAB items for a project
 * @access  Private
 */
router.post('/:id/rab/approve-all', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy, notes } = req.body;

    if (!approvedBy) {
      return res.status(400).json({
        success: false,
        error: 'approvedBy is required'
      });
    }

    const [updatedCount] = await ProjectRAB.update({
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
      notes: notes || 'Bulk approved'
    }, {
      where: { 
        projectId: id,
        status: 'draft' // Changed from 'pending' to 'draft'
      }
    });

    res.json({
      success: true,
      message: `${updatedCount} RAB items approved successfully`,
      approvedCount: updatedCount
    });
  } catch (error) {
    console.error('Error approving all RAB items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve RAB items',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:id/rab/:rabId
 * @desc    Delete RAB item
 * @access  Private
 */
router.delete('/:id/rab/:rabId', async (req, res) => {
  try {
    const { id, rabId } = req.params;

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    // Prevent deletion of approved items
    if (rabItem.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete approved RAB item. Please reject it first.'
      });
    }

    await rabItem.destroy();

    res.json({
      success: true,
      message: 'RAB item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete RAB item',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:id/rab
 * @desc    Delete all RAB items (with optional filter)
 * @access  Private
 */
router.delete('/:id/rab', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const where = { projectId: id };
    
    // Only allow deletion of non-approved items
    if (status) {
      where.status = status;
    } else {
      where.status = { [Op.ne]: 'approved' };
    }

    const deletedCount = await ProjectRAB.destroy({ where });

    res.json({
      success: true,
      message: `${deletedCount} RAB items deleted successfully`,
      deletedCount
    });
  } catch (error) {
    console.error('Error deleting RAB items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete RAB items',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/rab/:rabId/approve
 * @desc    Approve a RAB item
 * @access  Private
 */
router.post('/:id/rab/:rabId/approve', async (req, res) => {
  try {
    const { id, rabId } = req.params;
    const { notes, approval_date } = req.body;

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    // Update to approved status
    rabItem.isApproved = true;
    rabItem.approvedBy = req.user ? req.user.id : null;
    rabItem.approvedAt = approval_date || new Date();
    if (notes) {
      rabItem.notes = notes;
    }
    
    await rabItem.save();

    res.json({
      success: true,
      data: rabItem,
      message: 'RAB item approved successfully'
    });
  } catch (error) {
    console.error('Error approving RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve RAB item',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:id/rab/:rabId/reject
 * @desc    Reject a RAB item
 * @access  Private
 */
router.post('/:id/rab/:rabId/reject', async (req, res) => {
  try {
    const { id, rabId } = req.params;
    const { reason, rejection_date } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    // Update to rejected
    rabItem.isApproved = false;
    rabItem.approvedBy = null;
    rabItem.approvedAt = null;
    rabItem.notes = reason;
    
    await rabItem.save();

    res.json({
      success: true,
      data: rabItem,
      message: 'RAB item rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting RAB item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject RAB item',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:id/rab/:rabId/status
 * @desc    Update RAB item status (for review/pending workflow)
 * @access  Private
 */
router.patch('/:id/rab/:rabId/status', async (req, res) => {
  try {
    const { id, rabId } = req.params;
    const { approval_status, notes } = req.body;

    const validStatuses = ['draft', 'pending_approval', 'reviewed', 'approved', 'rejected'];
    if (!validStatuses.includes(approval_status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const rabItem = await ProjectRAB.findOne({
      where: { id: rabId, projectId: id }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    // Update approval status
    if (approval_status === 'approved') {
      rabItem.isApproved = true;
      rabItem.approvedBy = req.user ? req.user.id : null;
      rabItem.approvedAt = new Date();
    } else if (approval_status === 'rejected') {
      rabItem.isApproved = false;
      rabItem.approvedBy = null;
      rabItem.approvedAt = null;
    }

    if (notes) {
      rabItem.notes = notes;
    }
    
    await rabItem.save();

    res.json({
      success: true,
      data: rabItem,
      message: `RAB item status updated to ${approval_status}`
    });
  } catch (error) {
    console.error('Error updating RAB item status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update RAB item status',
      details: error.message
    });
  }
});

module.exports = router;
