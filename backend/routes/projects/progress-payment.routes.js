/**
 * Projects Module - Progress Payment Routes
 * Handles: Progress payment CRUD and approval workflow
 * Lines: ~250 (extracted from 3,031 line monolith)
 */

const express = require('express');
const Joi = require('joi');
const ProgressPayment = require('../../models/ProgressPayment');
const BeritaAcara = require('../../models/BeritaAcara');
const Project = require('../../models/Project');

const router = express.Router();

// Validation schema for Progress Payment
const progressPaymentSchema = Joi.object({
  beritaAcaraId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  percentage: Joi.number().min(0).max(100).required(),
  dueDate: Joi.date().required(),
  status: Joi.string().valid('pending_ba', 'pending_approval', 'approved', 'paid', 'rejected').default('pending_ba'),
  notes: Joi.string().allow('').optional(),
  paymentMethod: Joi.string().optional(),
  bankAccount: Joi.string().optional(),
  referenceNumber: Joi.string().optional()
});

/**
 * @route   GET /api/projects/:projectId/progress-payments
 * @desc    Get all Progress Payments for a project
 * @access  Private
 */
router.get('/:projectId/progress-payments', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

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

    const progressPayments = await ProgressPayment.findAll({
      where,
      include: [
        {
          model: BeritaAcara,
          as: 'beritaAcara',
          attributes: ['id', 'baNumber', 'baType', 'workDescription', 'completionPercentage', 'status'],
          required: false
        }
      ],
      order: [[sortBy, sortOrder]]
    });

    // Calculate statistics
    const stats = {
      total: progressPayments.length,
      totalAmount: progressPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
      pending: progressPayments.filter(p => p.status.includes('pending')).length,
      approved: progressPayments.filter(p => p.status === 'approved').length,
      paid: progressPayments.filter(p => p.status === 'paid').length,
      rejected: progressPayments.filter(p => p.status === 'rejected').length,
      paidAmount: progressPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
      pendingAmount: progressPayments
        .filter(p => p.status.includes('pending') || p.status === 'approved')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    };

    // Transform data for frontend
    const transformedData = progressPayments.map(payment => ({
      id: payment.id,
      amount: parseFloat(payment.amount),
      percentage: parseFloat(payment.percentage),
      dueDate: payment.dueDate,
      status: payment.status,
      approvalDate: payment.approvalDate,
      paymentDate: payment.paymentDate,
      notes: payment.notes,
      paymentMethod: payment.paymentMethod,
      bankAccount: payment.bankAccount,
      referenceNumber: payment.referenceNumber,
      beritaAcara: payment.beritaAcara,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    }));

    res.json({
      success: true,
      data: transformedData,
      stats
    });
  } catch (error) {
    console.error('Error fetching Progress Payments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Progress Payments',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:projectId/progress-payments/:paymentId
 * @desc    Get single Progress Payment details
 * @access  Private
 */
router.get('/:projectId/progress-payments/:paymentId', async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;

    const progressPayment = await ProgressPayment.findOne({
      where: { id: paymentId, projectId },
      include: [
        {
          model: BeritaAcara,
          as: 'beritaAcara',
          attributes: ['id', 'baNumber', 'baType', 'workDescription', 'completionPercentage', 'status'],
          required: false
        }
      ]
    });

    if (!progressPayment) {
      return res.status(404).json({
        success: false,
        error: 'Progress Payment not found'
      });
    }

    res.json({
      success: true,
      data: progressPayment
    });
  } catch (error) {
    console.error('Error fetching Progress Payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Progress Payment',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/progress-payments
 * @desc    Create new Progress Payment
 * @access  Private
 */
router.post('/:projectId/progress-payments', async (req, res) => {
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
    const { error, value } = progressPaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    // Verify that the Berita Acara exists and is approved
    const beritaAcara = await BeritaAcara.findOne({
      where: { id: value.beritaAcaraId, projectId, status: 'approved' }
    });

    if (!beritaAcara) {
      return res.status(400).json({
        success: false,
        error: 'Berita Acara not found or not approved'
      });
    }

    const progressPayment = await ProgressPayment.create({
      projectId,
      ...value,
      createdBy: req.body.createdBy
    });

    // Fetch with relations
    const paymentWithBA = await ProgressPayment.findByPk(progressPayment.id, {
      include: [
        {
          model: BeritaAcara,
          as: 'beritaAcara',
          attributes: ['id', 'baNumber', 'baType', 'workDescription', 'completionPercentage', 'status']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: paymentWithBA,
      message: 'Progress Payment created successfully'
    });
  } catch (error) {
    console.error('Error creating Progress Payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Progress Payment',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:projectId/progress-payments/:paymentId
 * @desc    Update Progress Payment (approve, process, etc.)
 * @access  Private
 */
router.patch('/:projectId/progress-payments/:paymentId', async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;

    const progressPayment = await ProgressPayment.findOne({
      where: { id: paymentId, projectId }
    });

    if (!progressPayment) {
      return res.status(404).json({
        success: false,
        error: 'Progress Payment not found'
      });
    }

    const updateData = { ...req.body };

    // Handle status updates with automatic timestamps
    if (updateData.status === 'approved' && !progressPayment.approvalDate) {
      updateData.approvalDate = new Date();
    }
    if (updateData.status === 'paid' && !progressPayment.paymentDate) {
      updateData.paymentDate = new Date();
    }

    await progressPayment.update({
      ...updateData,
      updatedBy: req.body.updatedBy
    });

    // Fetch with relations
    const updatedPayment = await ProgressPayment.findByPk(progressPayment.id, {
      include: [
        {
          model: BeritaAcara,
          as: 'beritaAcara',
          attributes: ['id', 'baNumber', 'baType', 'workDescription', 'completionPercentage', 'status']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedPayment,
      message: 'Progress Payment updated successfully'
    });
  } catch (error) {
    console.error('Error updating Progress Payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update Progress Payment',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:projectId/progress-payments/:paymentId
 * @desc    Delete Progress Payment
 * @access  Private
 */
router.delete('/:projectId/progress-payments/:paymentId', async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;

    const progressPayment = await ProgressPayment.findOne({
      where: { id: paymentId, projectId }
    });

    if (!progressPayment) {
      return res.status(404).json({
        success: false,
        error: 'Progress Payment not found'
      });
    }

    // Prevent deletion of paid payments
    if (progressPayment.status === 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete paid Progress Payment'
      });
    }

    await progressPayment.destroy();

    res.json({
      success: true,
      message: 'Progress Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting Progress Payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete Progress Payment',
      details: error.message
    });
  }
});

module.exports = router;
