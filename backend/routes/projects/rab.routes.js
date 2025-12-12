/**
 * Projects Module - RAB (Rencana Anggaran Biaya) Routes
 * Handles: RAB CRUD, Approval, Export, Batch operations
 * Lines: ~380 (extracted from 3,031 line monolith)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const ProjectRAB = require('../../models/ProjectRAB');
const Project = require('../../models/Project');
const ProjectTeamMember = require('../../models/ProjectTeamMember');
const User = require('../../models/User');
const fcmNotificationService = require('../../services/FCMNotificationService');

const router = express.Router();

/**
 * @route   GET /api/projects/rab/download-template
 * @desc    Download RAB Excel template
 * @access  Public (no auth required for template download)
 */
router.get('/rab/download-template', (req, res) => {
  const templatePath = path.join(__dirname, '../../public/templates/template-rap-import.xlsx');
  
  // Check if file exists
  if (!fs.existsSync(templatePath)) {
    return res.status(404).json({
      success: false,
      error: 'Template file not found'
    });
  }

  // Set headers for download
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=template-rap-import.xlsx');
  
  // Send file
  res.sendFile(templatePath, (err) => {
    if (err) {
      console.error('Error sending template file:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to download template'
        });
      }
    }
  });
});

/**
 * Helper: Find users who should be notified about RAB approval requests
 * Priority: 1) Project team members 2) All admins
 */
async function getRABApprovers(projectId) {
  try {
    // Strategy 1: Find project team members with manager/admin roles
    const projectTeamMembers = await ProjectTeamMember.findAll({
      where: { 
        projectId,
        status: 'active'
      },
      attributes: ['employeeId', 'role', 'name']
    });

    // Get employee IDs (filtering out null values)
    const employeeIds = projectTeamMembers
      .filter(member => member.employeeId)
      .map(member => member.employeeId);

    if (employeeIds.length > 0) {
      console.log(`✓ Found ${employeeIds.length} project team members for RAB approval notification`);
      console.log(`  Team member IDs: ${employeeIds.join(', ')}`);
      
      // Convert EMP- IDs to USR- IDs by querying users table
      // Many project_team_members use EMP- prefix but users table uses USR- prefix
      const userIds = [];
      
      for (const empId of employeeIds) {
        // Try direct match first (if employee_id matches user.id)
        let user = await User.findByPk(empId);
        
        // If not found, try to map EMP- to USR- by finding matching username
        if (!user) {
          // Extract name from project team member and find matching user
          const teamMember = projectTeamMembers.find(m => m.employeeId === empId);
          if (teamMember && teamMember.name) {
            user = await User.findOne({
              where: { username: teamMember.name.toLowerCase() }
            });
          }
        }
        
        if (user) {
          userIds.push(user.id);
          console.log(`  Mapped ${empId} → ${user.id} (${user.username})`);
        } else {
          console.warn(`  ⚠ Could not find user for employee ID: ${empId}`);
        }
      }
      
      if (userIds.length > 0) {
        return userIds;
      }
    }

    // Strategy 2: Fallback to all active admins
    const admins = await User.findAll({
      where: { 
        role: 'admin', 
        is_active: true 
      },
      attributes: ['id']
    });

    const adminIds = admins.map(admin => admin.id);
    console.log(`✓ No project team members found, using ${adminIds.length} admins for RAB approval notification`);
    return adminIds;
  } catch (error) {
    console.error('Error finding RAB approvers:', error);
    return [];
  }
}

/**
 * Helper: Send RAB approval request notification
 */
async function sendRABApprovalNotification(projectId, rabItem, creatorName) {
  try {
    const approverIds = await getRABApprovers(projectId);
    
    if (approverIds.length === 0) {
      console.warn('⚠ No approvers found for RAB notification');
      return;
    }

    // Get project details for better notification context
    const project = await Project.findByPk(projectId);
    const projectName = project ? project.name : 'Unknown Project';

    const title = '💰 New RAB Approval Request';
    const body = `${creatorName} submitted RAB "${rabItem.description}" for ${projectName}`;
    
    const data = {
      type: 'rab_approval_request',
      rabId: rabItem.id.toString(),
      projectId: projectId,
      projectName: projectName,
      description: rabItem.description,
      category: rabItem.category,
      totalPrice: rabItem.totalPrice.toString(),
      createdBy: creatorName
    };

    const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${projectId}/rab/${rabItem.id}`;

    // Send notification to all approvers
    const results = await fcmNotificationService.sendToMultipleUsers({
      userIds: approverIds,
      title,
      body,
      data,
      clickAction
    });

    const successCount = results.filter(r => r.success).length;
    console.log(`✓ RAB approval notification sent: ${successCount}/${approverIds.length} delivered`);
  } catch (error) {
    console.error('Error sending RAB approval notification:', error);
    // Don't throw - allow RAB creation to succeed even if notification fails
  }
}

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

    // Transform items to ensure camelCase for frontend
    const transformedItems = rabItems.map(item => {
      const itemData = item.toJSON();
      // Ensure itemType is available (Sequelize should auto-convert item_type to itemType)
      return {
        ...itemData,
        itemType: itemData.itemType || itemData.item_type || 'material'
      };
    });

    // Calculate summary
    const summary = {
      total: transformedItems.length,
      totalAmount: transformedItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0),
      approved: transformedItems.filter(item => item.status === 'approved').length,
      draft: transformedItems.filter(item => item.status === 'draft').length, // Changed from 'pending' to 'draft'
      under_review: transformedItems.filter(item => item.status === 'under_review').length,
      rejected: transformedItems.filter(item => item.status === 'rejected').length,
      byCategory: transformedItems.reduce((acc, item) => {
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
      data: transformedItems,
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
router.get('/:id/rab/:rabId', async (req, res, next) => {
  try {
    const { id, rabId } = req.params;

    // Skip this route if rabId is 'realizations' - it should be handled by realization.routes.js
    if (rabId === 'realizations') {
      return next('route');
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
    const { 
      category, 
      description, 
      unit, 
      quantity, 
      unitPrice, 
      notes, 
      createdBy, 
      status = 'draft',
      itemType,     // Frontend sends camelCase
      item_type     // Backend accepts snake_case
    } = req.body;

    // Support both camelCase (frontend) and snake_case (backend)
    const receivedItemType = itemType || item_type;

    // LOG: Debug incoming data
    console.log(`[RAB Create] Received itemType: "${receivedItemType}" (from: ${itemType ? 'itemType' : 'item_type'})`);
    console.log(`[RAB Create] Description: "${description}", Category: "${category}"`);

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

    // SIMPLIFIED: Validate itemType (required field)
    const validItemTypes = ['material', 'service', 'labor', 'equipment', 'overhead'];
    if (!receivedItemType) {
      return res.status(400).json({
        success: false,
        error: 'itemType is required. Must be one of: material, service, labor, equipment, overhead'
      });
    }

    if (!validItemTypes.includes(receivedItemType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid itemType: ${receivedItemType}. Must be one of: ${validItemTypes.join(', ')}`
      });
    }

    console.log(`[RAB Create] Validated item_type: ${receivedItemType}`);

    const rabItem = await ProjectRAB.create({
      projectId: id,
      category,
      item_type: receivedItemType, // USE SNAKE_CASE for Sequelize model
      description,
      unit,
      quantity: qty,
      unitPrice: price,
      totalPrice: qty * price,
      status,
      notes,
      createdBy
    });

    // Send notification when RAB is created (including draft status)
    if (status === 'draft' || status === 'under_review' || status === 'pending_approval') {
      try {
        // Get creator name for notification
        let creatorName = 'Unknown User';
        if (req.user) {
          creatorName = req.user.profile?.full_name || req.user.username || req.user.email;
        } else if (createdBy) {
          const creator = await User.findByPk(createdBy);
          if (creator) {
            creatorName = creator.profile?.full_name || creator.username || creator.email;
          }
        }

        await sendRABApprovalNotification(id, rabItem, creatorName);
      } catch (notifError) {
        console.warn('Failed to send RAB notification:', notifError.message);
        // Don't fail the request if notification fails
      }
    }

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
    const validItemTypes = ['material', 'service', 'labor', 'equipment', 'overhead'];
    const rabItems = items.map((item, index) => {
      const qty = parseFloat(item.quantity);
      const price = parseFloat(item.unitPrice);

      if (!item.category || !item.description || !item.unit || isNaN(qty) || isNaN(price)) {
        throw new Error(`Invalid item at index ${index}: ${JSON.stringify(item)}`);
      }

      // SIMPLIFIED: Validate itemType (required field)
      // Support both camelCase (frontend) and snake_case (backend)
      const receivedItemType = item.itemType || item.item_type;
      if (!receivedItemType) {
        throw new Error(`Item at index ${index} missing itemType: ${item.description}`);
      }

      if (!validItemTypes.includes(receivedItemType)) {
        throw new Error(`Item at index ${index} has invalid itemType "${receivedItemType}": ${item.description}. Must be one of: ${validItemTypes.join(', ')}`);
      }

      console.log(`[RAB Bulk] Item ${index + 1}: item_type=${receivedItemType}, description="${item.description}"`);

      return {
        projectId: id,
        category: item.category,
        item_type: receivedItemType, // USE SNAKE_CASE for Sequelize model
        description: item.description,
        unit: item.unit,
        quantity: qty,
        unitPrice: price,
        totalPrice: qty * price,
        status: item.status || 'draft',
        notes: item.notes || '',
        createdBy: createdBy || item.createdBy
      };
    });

    // Bulk create
    const created = await ProjectRAB.bulkCreate(rabItems);

    // Send notification for all RAB items (including draft)
    const itemsRequiringApproval = created.filter(item => 
      item.status === 'draft' || item.status === 'under_review' || item.status === 'pending_approval'
    );

    console.log(`🔔 [RAB Bulk] Created items: ${created.length}, Requiring approval: ${itemsRequiringApproval.length}`);
    console.log(`🔔 [RAB Bulk] Item statuses:`, created.map(i => i.status));

    if (itemsRequiringApproval.length > 0) {
      try {
        // Get creator name for notification
        let creatorName = 'Unknown User';
        if (req.user) {
          creatorName = req.user.profile?.full_name || req.user.username || req.user.email;
        } else if (createdBy) {
          const creator = await User.findByPk(createdBy);
          if (creator) {
            creatorName = creator.profile?.full_name || creator.username || creator.email;
          }
        }

        console.log(`🔔 [RAB Bulk] Creator: ${creatorName}`);

        // Send notification for the first item (representing the batch)
        const firstItem = itemsRequiringApproval[0];
        const approverIds = await getRABApprovers(id);
        
        console.log(`🔔 [RAB Bulk] Approver IDs:`, approverIds);
        
        if (approverIds.length > 0) {
          const project = await Project.findByPk(id);
          const projectName = project ? project.name : 'Unknown Project';

          const title = '💰 New RAB Approval Request';
          const body = `${creatorName} submitted ${itemsRequiringApproval.length} RAB items for ${projectName}`;
          
          const data = {
            type: 'rab_approval_request',
            rabId: firstItem.id.toString(),
            projectId: id,
            projectName: projectName,
            itemCount: itemsRequiringApproval.length.toString(),
            createdBy: creatorName
          };

          const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${id}/rab`;

          console.log(`🔔 [RAB Bulk] Sending notification:`, { title, body, approverCount: approverIds.length });

          await fcmNotificationService.sendToMultipleUsers({
            userIds: approverIds,
            title,
            body,
            data,
            clickAction
          });

          console.log(`✅ Bulk RAB approval notification sent for ${itemsRequiringApproval.length} items to ${approverIds.length} users`);
        } else {
          console.warn(`⚠️ [RAB Bulk] No approvers found for project ${id}`);
        }
      } catch (notifError) {
        console.warn('Failed to send bulk RAB notification:', notifError.message);
      }
    }

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

    // Send notification if status changed (including draft)
    if (status && (status === 'draft' || status === 'under_review' || status === 'pending_approval') && 
        rabItem.status !== status) {
      try {
        let updaterName = 'Unknown User';
        if (req.user) {
          updaterName = req.user.profile?.full_name || req.user.username || req.user.email;
        } else if (updatedBy) {
          const updater = await User.findByPk(updatedBy);
          if (updater) {
            updaterName = updater.profile?.full_name || updater.username || updater.email;
          }
        }

        await sendRABApprovalNotification(id, rabItem, updaterName);
      } catch (notifError) {
        console.warn('Failed to send RAB update notification:', notifError.message);
      }
    }

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

    // Update with existing model fields
    await rabItem.update({
      status: 'approved',
      isApproved: true,
      approvedBy,
      approvedAt: new Date(),
      notes: notes || rabItem.notes,
      updatedBy: approvedBy
    });

    // Notify the creator that their RAB was approved
    if (rabItem.createdBy) {
      try {
        const project = await Project.findByPk(id);
        const projectName = project ? project.name : 'Unknown Project';

        const approver = await User.findByPk(approvedBy);
        const approverName = approver 
          ? (approver.profile?.full_name || approver.username || approver.email)
          : 'Admin';

        const title = '✅ RAB Approved';
        const body = `Your RAB "${rabItem.description}" for ${projectName} has been approved by ${approverName}`;
        
        const data = {
          type: 'rab_approved',
          rabId: rabItem.id.toString(),
          projectId: id,
          projectName: projectName,
          description: rabItem.description,
          approvedBy: approverName
        };

        const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${id}/rab/${rabItem.id}`;

        await fcmNotificationService.sendToUser({
          userId: rabItem.createdBy,
          title,
          body,
          data,
          clickAction
        });

        console.log(`✓ RAB approval notification sent to creator ${rabItem.createdBy}`);
      } catch (notifError) {
        console.warn('Failed to send RAB approval notification to creator:', notifError.message);
      }
    }

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

    // Store rejection reason in notes field since rejectedBy/rejectionReason fields don't exist
    await rabItem.update({
      status: 'rejected',
      notes: `Rejected by ${rejectedBy}: ${rejectionReason}`,
      updatedBy: rejectedBy
    });

    // Notify the creator that their RAB was rejected
    if (rabItem.createdBy) {
      try {
        const project = await Project.findByPk(id);
        const projectName = project ? project.name : 'Unknown Project';

        const rejector = await User.findByPk(rejectedBy);
        const rejectorName = rejector 
          ? (rejector.profile?.full_name || rejector.username || rejector.email)
          : 'Admin';

        const title = '❌ RAB Rejected';
        const body = `Your RAB "${rabItem.description}" for ${projectName} was rejected: ${rejectionReason}`;
        
        const data = {
          type: 'rab_rejected',
          rabId: rabItem.id.toString(),
          projectId: id,
          projectName: projectName,
          description: rabItem.description,
          rejectedBy: rejectorName,
          reason: rejectionReason
        };

        const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${id}/rab/${rabItem.id}`;

        await fcmNotificationService.sendToUser({
          userId: rabItem.createdBy,
          title,
          body,
          data,
          clickAction
        });

        console.log(`✓ RAB rejection notification sent to creator ${rabItem.createdBy}`);
      } catch (notifError) {
        console.warn('Failed to send RAB rejection notification to creator:', notifError.message);
      }
    }

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

    // Get RAB items before updating to send notifications
    const rabItemsToApprove = await ProjectRAB.findAll({
      where: { 
        projectId: id,
        status: 'draft' // Changed from 'pending' to 'draft'
      }
    });

    const [updatedCount] = await ProjectRAB.update({
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
      notes: notes || 'Bulk approved'
    }, {
      where: { 
        projectId: id,
        status: 'draft'
      }
    });

    // Send notification to all creators
    if (rabItemsToApprove.length > 0) {
      try {
        const project = await Project.findByPk(id);
        const projectName = project ? project.name : 'Unknown Project';

        const approver = await User.findByPk(approvedBy);
        const approverName = approver 
          ? (approver.profile?.full_name || approver.username || approver.email)
          : 'Admin';

        // Get unique creator IDs
        const creatorIds = [...new Set(rabItemsToApprove.map(item => item.createdBy).filter(Boolean))];

        const title = '✅ RAB Bulk Approved';
        const body = `${updatedCount} RAB items for ${projectName} have been approved by ${approverName}`;
        
        const data = {
          type: 'rab_bulk_approved',
          projectId: id,
          projectName: projectName,
          approvedCount: updatedCount.toString(),
          approvedBy: approverName
        };

        const clickAction = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${id}/rab`;

        await fcmNotificationService.sendToMultipleUsers({
          userIds: creatorIds,
          title,
          body,
          data,
          clickAction
        });

        console.log(`✓ Bulk RAB approval notification sent to ${creatorIds.length} creators`);
      } catch (notifError) {
        console.warn('Failed to send bulk RAB approval notification:', notifError.message);
      }
    }

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
