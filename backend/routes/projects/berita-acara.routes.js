/**
 * Projects Module - Berita Acara Routes
 * Handles: BA CRUD operations and approval workflow
 * Lines: ~280 (extracted from 3,031 line monolith)
 */

const express = require('express');
const Joi = require('joi');
const BeritaAcara = require('../../models/BeritaAcara');
const Project = require('../../models/Project');
const ProjectMilestone = require('../../models/ProjectMilestone');

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

/**
 * @route   GET /api/projects/:projectId/berita-acara
 * @desc    Get all Berita Acara for a project
 * @access  Private
 */
router.get('/:projectId/berita-acara', async (req, res) => {
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
 * @access  Private
 */
router.get('/:projectId/berita-acara/:baId', async (req, res) => {
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
 * @access  Private
 */
router.post('/:projectId/berita-acara', async (req, res) => {
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
      createdBy: req.body.createdBy
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
 * @access  Private
 */
router.patch('/:projectId/berita-acara/:baId', async (req, res) => {
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

    // Validate request body
    const { error, value } = beritaAcaraSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    await beritaAcara.update({
      ...value,
      updatedBy: req.body.updatedBy
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
 * @access  Private
 */
router.post('/:projectId/berita-acara/:baId/submit', async (req, res) => {
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
      submittedBy: submittedBy || 'system',
      submittedAt: new Date()
    });

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
 * @access  Private
 */
router.patch('/:projectId/berita-acara/:baId/approve', async (req, res) => {
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
      updatedBy: approvedBy
    });

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
 * @route   DELETE /api/projects/:projectId/berita-acara/:baId
 * @desc    Delete Berita Acara
 * @access  Private
 */
router.delete('/:projectId/berita-acara/:baId', async (req, res) => {
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

module.exports = router;
