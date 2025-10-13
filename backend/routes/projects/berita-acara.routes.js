/**
 * Projects Module - Berita Acara Routes
 * Handles: BA CRUD operations and approval workflow
 * Enhanced with RBAC, audit trail, and client signature
 */

const express = require('express');
const Joi = require('joi');
const BeritaAcara = require('../../models/BeritaAcara');
const Project = require('../../models/Project');
const ProjectMilestone = require('../../models/ProjectMilestone');
const { checkBAPermission, checkProjectAccess } = require('../../middleware/baPermissions');

const router = express.Router();

// Validation schema for Berita Acara
const beritaAcaraSchema = Joi.object({
  milestoneId: Joi.string().optional(),
  baType: Joi.string().valid('partial', 'final', 'provisional').default('partial'),
  workDescription: Joi.string().required(),
  completionPercentage: Joi.number().min(0).max(100).required(),
  completionDate: Joi.date().required(),
  status: Joi.string().valid('draft', 'submitted', 'approved', 'rejected', 'client_review').default('draft'),
  clientNotes: Joi.string().allow('').optional(),
  clientRepresentative: Joi.string().allow('').optional(),
  clientSignature: Joi.string().allow('').optional(),
  contractorSignature: Joi.string().allow('').optional(),
  workLocation: Joi.string().allow('').optional(),
  contractReference: Joi.string().allow('').optional(),
  notes: Joi.string().allow('').optional(),
  clientApprovalDate: Joi.date().optional(),
  clientApprovalNotes: Joi.string().allow('').optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  witnesses: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    position: Joi.string().required(),
    organization: Joi.string().optional()
  })).optional(),
  photos: Joi.array().items(Joi.string()).optional(),
  documents: Joi.array().items(Joi.string()).optional()
});

// Validation schema for PATCH (partial update) - all fields optional
const beritaAcaraUpdateSchema = Joi.object({
  milestoneId: Joi.string().optional(),
  baType: Joi.string().valid('partial', 'final', 'provisional').optional(),
  workDescription: Joi.string().optional(),
  completionPercentage: Joi.number().min(0).max(100).optional(),
  completionDate: Joi.date().optional(),
  status: Joi.string().valid('draft', 'submitted', 'approved', 'rejected', 'client_review').optional(),
  
  // Review & approval fields
  reviewedBy: Joi.string().optional(),
  reviewedAt: Joi.date().optional(),
  approvedBy: Joi.string().optional(),
  approvedAt: Joi.date().optional(),
  submittedBy: Joi.string().optional(),
  submittedAt: Joi.date().optional(),
  rejectionReason: Joi.string().allow('').optional(),
  
  // Client fields
  clientNotes: Joi.string().allow('').optional(),
  clientRepresentative: Joi.string().allow('').optional(),
  clientSignature: Joi.string().allow('').optional(),
  contractorSignature: Joi.string().allow('').optional(),
  clientApprovalDate: Joi.date().optional(),
  clientApprovalNotes: Joi.string().allow('').optional(),
  clientSignDate: Joi.date().optional(),
  
  // Location & contract
  workLocation: Joi.string().allow('').optional(),
  contractReference: Joi.string().allow('').optional(),
  notes: Joi.string().allow('').optional(),
  
  // Payment fields
  paymentAuthorized: Joi.boolean().optional(),
  paymentAmount: Joi.number().optional(),
  paymentDueDate: Joi.date().optional(),
  
  // Attachments
  attachments: Joi.array().items(Joi.string()).optional(),
  witnesses: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    position: Joi.string().required(),
    organization: Joi.string().optional()
  })).optional(),
  photos: Joi.array().items(Joi.string()).optional(),
  documents: Joi.array().items(Joi.string()).optional(),
  qualityChecklist: Joi.array().optional(),
  
  // Audit
  updatedBy: Joi.string().optional(),
  createdBy: Joi.string().optional()
}).min(1); // At least one field must be provided

/**
 * @route   GET /api/projects/:projectId/berita-acara
 * @desc    Get all Berita Acara for a project
 * @access  Private - Requires read permission
 */
router.get('/:projectId/berita-acara', checkProjectAccess, checkBAPermission('read'), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, baType, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Build where clause
    const where = { projectId };
    if (status) where.status = status;
    if (baType) where.baType = baType;

    const beritaAcaraList = await BeritaAcara.findAll({
      where,
      include: [
        {
          model: ProjectMilestone,
          as: 'milestone',
          attributes: ['id', 'title', 'targetDate', 'status'],
          required: false
        }
      ],
      order: [[sortBy, sortOrder]]
    });

    // Calculate statistics
    const stats = {
      total: beritaAcaraList.length,
      draft: beritaAcaraList.filter(ba => ba.status === 'draft').length,
      submitted: beritaAcaraList.filter(ba => ba.status === 'submitted').length,
      approved: beritaAcaraList.filter(ba => ba.status === 'approved').length,
      rejected: beritaAcaraList.filter(ba => ba.status === 'rejected').length,
      byType: beritaAcaraList.reduce((acc, ba) => {
        acc[ba.baType] = (acc[ba.baType] || 0) + 1;
        return acc;
      }, {}),
      avgCompletion: beritaAcaraList.length > 0
        ? (beritaAcaraList.reduce((sum, ba) => sum + parseFloat(ba.completionPercentage || 0), 0) / beritaAcaraList.length).toFixed(1)
        : 0
    };

    // Transform data for frontend
    const transformedData = beritaAcaraList.map(ba => ({
      id: ba.id,
      baNumber: ba.baNumber,
      baType: ba.baType,
      workDescription: ba.workDescription,
      completionPercentage: parseFloat(ba.completionPercentage),
      completionDate: ba.completionDate,
      status: ba.status,
      clientApprovalDate: ba.clientApprovalDate,
      clientApprovalNotes: ba.clientApprovalNotes,
      clientNotes: ba.clientNotes,
      milestone: ba.milestone,
      createdAt: ba.createdAt,
      updatedAt: ba.updatedAt
    }));

    res.json({
      success: true,
      data: transformedData,
      stats
    });
  } catch (error) {
    console.error('Error fetching Berita Acara:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Berita Acara',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:projectId/berita-acara/:baId
 * @desc    Get single Berita Acara details
 * @access  Private - Requires read permission
 */
router.get('/:projectId/berita-acara/:baId', checkProjectAccess, checkBAPermission('read'), async (req, res) => {
  try {
    const { projectId, baId } = req.params;

    const beritaAcara = await BeritaAcara.findOne({
      where: { id: baId, projectId },
      include: [
        {
          model: ProjectMilestone,
          as: 'milestone',
          attributes: ['id', 'title', 'targetDate', 'status'],
          required: false
        }
      ]
    });

    if (!beritaAcara) {
      return res.status(404).json({
        success: false,
        error: 'Berita Acara not found'
      });
    }

    res.json({
      success: true,
      data: beritaAcara
    });
  } catch (error) {
    console.error('Error fetching Berita Acara:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Berita Acara',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/berita-acara
 * @desc    Create new Berita Acara
 * @access  Private - Requires create permission
 */
router.post('/:projectId/berita-acara', checkProjectAccess, checkBAPermission('create'), async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Validate request body
    const { error, value } = beritaAcaraSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    // Generate BA number
    const baCount = await BeritaAcara.count({ where: { projectId } });
    const baNumber = `BA-${projectId.substring(0, 8)}-${String(baCount + 1).padStart(3, '0')}`;

    const beritaAcara = await BeritaAcara.create({
      projectId,
      baNumber,
      ...value,
      createdBy: req.body.createdBy || req.user?.email || 'system',
      statusHistory: [{
        status: 'draft',
        previousStatus: null,
        changedBy: req.body.createdBy || req.user?.email || 'system',
        changedAt: new Date(),
        notes: 'BA created'
      }]
    });

    res.status(201).json({
      success: true,
      data: beritaAcara,
      message: 'Berita Acara created successfully'
    });
  } catch (error) {
    console.error('Error creating Berita Acara:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Berita Acara',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:projectId/berita-acara/:baId
 * @desc    Update Berita Acara
 * @access  Private - Requires update permission
 */
router.patch('/:projectId/berita-acara/:baId', checkProjectAccess, checkBAPermission('update'), async (req, res) => {
  try {
    const { projectId, baId } = req.params;

    const beritaAcara = await BeritaAcara.findOne({
      where: { id: baId, projectId }
    });

    if (!beritaAcara) {
      return res.status(404).json({
        success: false,
        error: 'Berita Acara not found'
      });
    }

    // Validate request body with partial update schema
    const { error, value } = beritaAcaraUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    await beritaAcara.update({
      ...value,
      updatedBy: req.body.updatedBy || req.user?.email || 'system'
    });

    res.json({
      success: true,
      data: beritaAcara,
      message: 'Berita Acara updated successfully'
    });
  } catch (error) {
    console.error('Error updating Berita Acara:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update Berita Acara',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/berita-acara/:baId/submit
 * @desc    Submit Berita Acara for review
 * @access  Private - Requires submit permission
 */
router.post('/:projectId/berita-acara/:baId/submit', checkProjectAccess, checkBAPermission('submit'), async (req, res) => {
  try {
    const { projectId, baId } = req.params;
    const { submittedBy } = req.body;

    const beritaAcara = await BeritaAcara.findOne({
      where: { id: baId, projectId }
    });

    if (!beritaAcara) {
      return res.status(404).json({
        success: false,
        error: 'Berita Acara not found'
      });
    }

    if (beritaAcara.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Only draft Berita Acara can be submitted'
      });
    }

    await beritaAcara.update({
      status: 'submitted',
      submittedBy: submittedBy || req.user?.email || 'system',
      submittedAt: new Date()
    });
    
    // Add to status history
    await beritaAcara.addStatusHistory(
      'submitted',
      submittedBy || req.user?.email || 'system',
      'BA submitted for client review'
    );

    res.json({
      success: true,
      data: beritaAcara,
      message: 'Berita Acara submitted successfully for review'
    });
  } catch (error) {
    console.error('Error submitting Berita Acara:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit Berita Acara',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:projectId/berita-acara/:baId/approve
 * @desc    Approve Berita Acara
 * @access  Private - Requires approve permission (client/admin only)
 */
router.patch('/:projectId/berita-acara/:baId/approve', checkProjectAccess, checkBAPermission('approve'), async (req, res) => {
  try {
    const { projectId, baId } = req.params;
    const { approvedBy, clientApprovalNotes } = req.body;

    const beritaAcara = await BeritaAcara.findOne({
      where: { id: baId, projectId }
    });

    if (!beritaAcara) {
      return res.status(404).json({
        success: false,
        error: 'Berita Acara not found'
      });
    }

    if (beritaAcara.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Berita Acara is already approved'
      });
    }

    await beritaAcara.update({
      status: 'approved',
      clientApprovalDate: new Date(),
      clientApprovalNotes: clientApprovalNotes || 'Approved',
      updatedBy: approvedBy || req.user?.email || 'system'
    });

    // Add to status history
    await beritaAcara.addStatusHistory(
      'approved',
      approvedBy || req.user?.email || 'system',
      clientApprovalNotes || 'BA approved by client'
    );

    res.json({
      success: true,
      data: beritaAcara,
      message: 'Berita Acara approved successfully'
    });
  } catch (error) {
    console.error('Error approving Berita Acara:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve Berita Acara',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:projectId/berita-acara/:baId/reject
 * @desc    Reject Berita Acara
 * @access  Private - Requires approve permission (client/admin only)
 */
router.patch('/:projectId/berita-acara/:baId/reject', checkProjectAccess, checkBAPermission('approve'), async (req, res) => {
  try {
    const { projectId, baId } = req.params;
    const { reason, rejectedBy } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const beritaAcara = await BeritaAcara.findOne({
      where: { id: baId, projectId }
    });

    if (!beritaAcara) {
      return res.status(404).json({
        success: false,
        error: 'Berita Acara not found'
      });
    }

    if (beritaAcara.status === 'rejected') {
      return res.status(400).json({
        success: false,
        error: 'Berita Acara is already rejected'
      });
    }

    await beritaAcara.update({
      status: 'rejected',
      rejectionReason: reason.trim(),
      clientApprovalNotes: `Rejected: ${reason.trim()}`,
      updatedBy: rejectedBy || req.user?.email || 'system'
    });

    // Add to status history
    await beritaAcara.addStatusHistory(
      'rejected',
      rejectedBy || req.user?.email || 'system',
      `BA rejected: ${reason.trim()}`
    );

    res.json({
      success: true,
      data: beritaAcara,
      message: 'Berita Acara rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting Berita Acara:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject Berita Acara',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:projectId/berita-acara/:baId
 * @desc    Delete Berita Acara
 * @access  Private - Requires delete permission (admin/pm/site_manager only)
 */
router.delete('/:projectId/berita-acara/:baId', checkProjectAccess, checkBAPermission('delete'), async (req, res) => {
  try {
    const { projectId, baId } = req.params;

    const beritaAcara = await BeritaAcara.findOne({
      where: { id: baId, projectId }
    });

    if (!beritaAcara) {
      return res.status(404).json({
        success: false,
        error: 'Berita Acara not found'
      });
    }

    // Prevent deletion of approved BA
    if (beritaAcara.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete approved Berita Acara'
      });
    }

    // Add to status history before deletion
    await beritaAcara.addStatusHistory(
      'deleted',
      req.user?.email || 'system',
      'BA deleted'
    );

    await beritaAcara.destroy();

    res.json({
      success: true,
      message: 'Berita Acara deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting Berita Acara:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete Berita Acara',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/berita-acara/:baId/client-sign
 * @desc    Add client signature to BA (after approval)
 * @access  Private - Requires clientSign permission (client only)
 */
router.post('/:projectId/berita-acara/:baId/client-sign', checkProjectAccess, checkBAPermission('clientSign'), async (req, res) => {
  try {
    const { projectId, baId } = req.params;
    const { clientSignature, clientRepresentative } = req.body;

    // Validation
    const schema = Joi.object({
      clientSignature: Joi.string().required(),
      clientRepresentative: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const beritaAcara = await BeritaAcara.findOne({
      where: { id: baId, projectId }
    });

    if (!beritaAcara) {
      return res.status(404).json({
        success: false,
        error: 'Berita Acara not found'
      });
    }

    // BA must be approved before client can sign
    if (beritaAcara.status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'BA must be approved before client can sign'
      });
    }

    // Check if client already signed
    if (beritaAcara.clientSignature) {
      return res.status(400).json({
        success: false,
        error: 'Client has already signed this BA'
      });
    }

    await beritaAcara.update({
      clientSignature,
      clientRepresentative,
      clientSignDate: new Date()
    });

    // Add to status history
    await beritaAcara.addStatusHistory(
      'approved', // Status remains approved
      req.user?.email || 'system',
      `Client signature added by ${clientRepresentative}`
    );

    res.json({
      success: true,
      data: beritaAcara,
      message: 'Client signature added successfully'
    });
  } catch (error) {
    console.error('Error adding client signature:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add client signature',
      details: error.message
    });
  }
});

module.exports = router;
