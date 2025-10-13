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
const { uploadPaymentEvidence, uploadDeliveryEvidence, getFileUrl } = require('../../middleware/fileUpload');

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
  referenceNumber: Joi.string().optional(),
  taxAmount: Joi.number().min(0).default(0).optional(),
  retentionAmount: Joi.number().min(0).default(0).optional()
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
      approved: progressPayments.filter(p => p.status === 'payment_approved').length,
      paid: progressPayments.filter(p => p.status === 'paid').length,
      rejected: progressPayments.filter(p => p.status === 'cancelled').length,
      paidAmount: progressPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
      approvedAmount: progressPayments
        .filter(p => p.status === 'payment_approved')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
      pendingAmount: progressPayments
        .filter(p => p.status.includes('pending') || p.status === 'processing')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    };

    // Transform data for frontend
    const transformedData = progressPayments.map((payment, index) => {
      // Generate payment number from created date
      const createdDate = new Date(payment.createdAt);
      const paymentNumber = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
      
      // Map backend status to frontend expected format
      // Backend: pending_ba, ba_approved, payment_approved, processing, paid, cancelled
      // Frontend: pending_ba, pending_approval, approved, paid, rejected
      let frontendStatus = payment.status;
      if (payment.status === 'ba_approved') {
        frontendStatus = 'pending_approval';
      } else if (payment.status === 'payment_approved') {
        frontendStatus = 'approved';
      } else if (payment.status === 'cancelled') {
        frontendStatus = 'rejected';
      }
      
      return {
        id: payment.id,
        paymentNumber: paymentNumber,
        amount: parseFloat(payment.amount),
        percentage: parseFloat(payment.percentage),
        taxAmount: parseFloat(payment.taxAmount || 0),
        retentionAmount: parseFloat(payment.retentionAmount || 0),
        netAmount: parseFloat(payment.netAmount),
        dueDate: payment.dueDate,
        status: frontendStatus,
        approvalDate: payment.paymentApprovedAt,
        paymentDate: payment.paidAt,
        approvedBy: payment.paymentApprovedBy,
        notes: payment.notes,
        paymentMethod: payment.paymentMethod,
        bankAccount: payment.bankAccount,
        referenceNumber: payment.referenceNumber,
        // Invoice info
        invoiceNumber: payment.invoiceNumber,
        invoiceDate: payment.invoiceDate,
        invoiceStatus: payment.status === 'paid' ? 'paid' : 
                      payment.status === 'invoice_sent' ? 'invoice_sent' :
                      payment.status === 'payment_approved' ? 'generated' : 
                      payment.status === 'approved' ? 'generated' :
                      payment.status === 'processing' ? 'pending' : 
                      payment.status === 'cancelled' ? 'rejected' :
                      'draft',
        // Relations
        beritaAcara: payment.beritaAcara,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt
      };
    });

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

    // Calculate netAmount explicitly
    const grossAmount = parseFloat(value.amount);
    const taxAmount = parseFloat(value.taxAmount || 0);
    const retentionAmount = parseFloat(value.retentionAmount || 0);
    const netAmount = grossAmount - taxAmount - retentionAmount;

    // Generate invoice number automatically
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV-${projectId}-${year}${month}${day}-${random}`;

    console.log('💰 Payment calculation:', {
      grossAmount,
      taxAmount,
      retentionAmount,
      netAmount,
      invoiceNumber,
      invoiceDate: now
    });

    const progressPayment = await ProgressPayment.create({
      projectId,
      ...value,
      taxAmount,
      retentionAmount,
      netAmount,
      invoiceNumber,
      invoiceDate: now,
      status: 'pending_ba',
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
 * @route   PUT /api/projects/:projectId/progress-payments/:paymentId/status
 * @desc    Update Progress Payment status (for approval workflow)
 * @access  Private
 */
router.put('/:projectId/progress-payments/:paymentId/status', async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;
    const { status, approvedBy, approvalDate } = req.body;

    // Find payment
    const progressPayment = await ProgressPayment.findOne({
      where: { id: paymentId, projectId }
    });

    if (!progressPayment) {
      return res.status(404).json({
        success: false,
        error: 'Progress Payment not found'
      });
    }

    // Map frontend status to backend enum
    // Frontend: draft, pending, approved, paid, rejected
    // Backend:  pending_ba, ba_approved, processing, payment_approved, paid, cancelled
    let backendStatus = status;
    
    // Direct mapping for common statuses
    if (status === 'approved') {
      backendStatus = 'payment_approved';
    } else if (status === 'rejected') {
      backendStatus = 'cancelled';
    } else if (status === 'processing' || status === 'pending') {
      backendStatus = 'processing';
    } else if (status === 'paid') {
      backendStatus = 'paid';
    }
    // Keep backend statuses as-is (pending_ba, ba_approved, payment_approved, processing, paid, cancelled)

    // Validate status against backend enum
    const validStatuses = ['pending_ba', 'ba_approved', 'payment_approved', 'processing', 'paid', 'cancelled'];
    if (backendStatus && !validStatuses.includes(backendStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status value: ${status}. Valid values: pending, approved, paid, rejected, processing`
      });
    }

    // Update payment status
    const updateData = {
      status: backendStatus
    };

    // Set approval fields based on status
    if (backendStatus === 'payment_approved') {
      updateData.paymentApprovedAt = approvalDate || new Date();
      updateData.paymentApprovedBy = approvedBy || req.user?.name || req.user?.email || 'System';
    }

    // Set rejection fields if rejected
    if (backendStatus === 'cancelled' && req.body.reason) {
      updateData.rejectionReason = req.body.reason;
      updateData.rejectedAt = new Date();
      updateData.rejectedBy = req.user?.name || req.user?.email || 'System';
    }

    await progressPayment.update(updateData);

    // Fetch updated payment with relations
    const updatedPayment = await ProgressPayment.findByPk(paymentId, {
      include: [
        {
          model: BeritaAcara,
          as: 'beritaAcara',
          attributes: ['id', 'baNumber', 'baType', 'workDescription', 'completionPercentage', 'status']
        }
      ]
    });

    console.log('✅ Payment status updated:', {
      paymentId,
      oldStatus: progressPayment.status,
      requestedStatus: status,
      mappedStatus: backendStatus,
      approvedBy
    });

    res.json({
      success: true,
      data: updatedPayment,
      message: `Payment status updated to ${backendStatus}`
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment status',
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

/**
 * @route   GET /api/projects/:projectId/progress-payments/:paymentId/invoice/pdf
 * @desc    Generate and download invoice PDF for printing
 * @access  Private
 */
router.get('/:projectId/progress-payments/:paymentId/invoice/pdf', async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;

    // Get payment with all related data
    const payment = await ProgressPayment.findOne({
      where: { id: paymentId, projectId },
      include: [
        {
          model: BeritaAcara,
          as: 'beritaAcara',
          attributes: ['id', 'baNumber', 'baType', 'workDescription', 'completionPercentage']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Get project data
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Prepare invoice data
    const invoiceData = {
      invoiceNumber: payment.invoiceNumber || `INV-${payment.id}`,
      invoiceDate: payment.invoiceDate || payment.createdAt,
      dueDate: payment.dueDate,
      amount: payment.amount,
      netAmount: payment.netAmount,
      taxAmount: payment.taxAmount || 0,
      taxRate: 11, // Default PPN 11%
      retentionAmount: payment.retentionAmount || 0,
      retentionRate: 5, // Default retention 5%
      projectName: project.projectName,
      description: payment.notes || `Pembayaran Progress ${payment.percentage}%`,
      beritaAcara: {
        baNumber: payment.beritaAcara?.baNumber || 'N/A'
      },
      // Bank details (should come from company settings or project)
      bankName: 'Bank Mandiri',
      accountNumber: '1234567890',
      accountName: 'PT YK Construction'
    };

    // Company info (should come from settings/database)
    const companyInfo = {
      name: 'PT YK CONSTRUCTION',
      address: 'Jl. Raya Konstruksi No. 123, Jakarta Selatan 12345',
      phone: '021-12345678',
      email: 'info@ykconstruction.com',
      npwp: '01.234.567.8-901.000',
      website: 'www.ykconstruction.com',
      directorName: 'Budi Santoso',
      directorTitle: 'Direktur Utama'
      // logoPath: './assets/logo.png' // Optional
    };

    // Client info (should come from project)
    const clientInfo = {
      name: project.clientName || 'Nama Klien',
      address: project.clientAddress || 'Alamat Klien',
      phone: project.clientPhone || ''
    };

    // Generate PDF
    const invoicePdfGenerator = require('../../utils/invoicePdfGenerator');
    const pdfBuffer = await invoicePdfGenerator.generateInvoice(
      invoiceData,
      companyInfo,
      clientInfo
    );

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice-${invoiceData.invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate invoice PDF',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:projectId/progress-payments/:paymentId/mark-sent
 * @desc    Mark invoice as sent (hardcopy delivered) with evidence
 * @access  Private
 */
router.patch('/:projectId/progress-payments/:paymentId/mark-sent', uploadDeliveryEvidence, async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;
    const { recipientName, sentDate, deliveryMethod, deliveryNotes, courierService, trackingNumber } = req.body;

    // Validation
    if (!recipientName || recipientName.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Recipient name is required (minimum 3 characters)'
      });
    }

    if (!sentDate) {
      return res.status(400).json({
        success: false,
        error: 'Send date is required'
      });
    }

    // Validate date is not in future
    const sendDate = new Date(sentDate);
    const today = new Date();
    if (sendDate > today) {
      return res.status(400).json({
        success: false,
        error: 'Send date cannot be in the future'
      });
    }

    if (!deliveryMethod) {
      return res.status(400).json({
        success: false,
        error: 'Delivery method is required'
      });
    }

    // If courier, validate courier service
    if (deliveryMethod === 'courier' && (!courierService || courierService.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'Courier service name is required when using courier delivery'
      });
    }

    const payment = await ProgressPayment.findOne({
      where: { id: paymentId, projectId }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Check if payment is approved (can only mark as sent after approved)
    if (payment.status !== 'approved' && payment.status !== 'payment_approved') {
      return res.status(400).json({
        success: false,
        error: 'Payment must be approved before marking invoice as sent'
      });
    }

    // Get uploaded file info
    const deliveryEvidenceFile = req.file ? getFileUrl(req.file.path) : null;

    // Prepare delivery tracking data
    const deliveryTracking = {
      recipientName: recipientName.trim(),
      deliveryMethod,
      courierService: courierService?.trim() || null,
      trackingNumber: trackingNumber?.trim() || null,
      deliveryNotes: deliveryNotes?.trim() || null
    };

    // Update payment with invoice sent information
    await payment.update({
      status: 'invoice_sent', // Update status to invoice_sent
      invoiceSent: true,
      invoiceSentAt: sendDate,
      invoiceSentBy: req.user?.email || req.user?.username || 'System',
      invoiceRecipient: recipientName.trim(),
      deliveryMethod,
      deliveryEvidence: deliveryEvidenceFile,
      invoiceSentNotes: JSON.stringify(deliveryTracking)
    });

    res.json({
      success: true,
      message: 'Invoice berhasil ditandai sebagai terkirim',
      data: {
        id: payment.id,
        invoiceNumber: payment.invoiceNumber,
        invoiceSent: payment.invoiceSent,
        invoiceSentAt: payment.invoiceSentAt,
        invoiceRecipient: payment.invoiceRecipient,
        deliveryMethod: payment.deliveryMethod,
        deliveryEvidence: deliveryEvidenceFile,
        status: payment.status
      }
    });

  } catch (error) {
    console.error('Error marking invoice as sent:', error);
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum 5MB allowed.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to mark invoice as sent',
      details: error.message
    });
  }
});

/**
 * @route   PATCH /api/projects/:projectId/progress-payments/:paymentId/confirm-payment
 * @desc    Confirm payment received with evidence (mark as paid)
 * @access  Private
 */
router.patch('/:projectId/progress-payments/:paymentId/confirm-payment', uploadPaymentEvidence, async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;
    const { paidAmount, paidDate, bank, paymentReference, paymentNotes } = req.body;

    // Validation
    if (!paidAmount || parseFloat(paidAmount) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Paid amount is required and must be greater than 0'
      });
    }

    if (!paidDate) {
      return res.status(400).json({
        success: false,
        error: 'Payment date is required'
      });
    }

    if (!bank || bank.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bank is required'
      });
    }

    // Payment evidence is REQUIRED
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Payment evidence (bukti transfer) is required'
      });
    }

    const payment = await ProgressPayment.findOne({
      where: { id: paymentId, projectId }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Validate payment status (must be invoice_sent or approved)
    if (payment.status !== 'invoice_sent' && payment.status !== 'approved' && payment.status !== 'payment_approved') {
      return res.status(400).json({
        success: false,
        error: `Cannot confirm payment with status: ${payment.status}. Invoice must be sent first.`
      });
    }

    // Validate amount matches invoice
    const invoiceAmount = parseFloat(payment.netAmount);
    const receivedAmount = parseFloat(paidAmount);
    
    if (Math.abs(invoiceAmount - receivedAmount) > 0.01) { // Allow 1 cent difference for floating point
      return res.status(400).json({
        success: false,
        error: `Payment amount (${receivedAmount}) does not match invoice amount (${invoiceAmount})`
      });
    }

    // Validate date
    const paymentDate = new Date(paidDate);
    const today = new Date();
    
    if (paymentDate > today) {
      return res.status(400).json({
        success: false,
        error: 'Payment date cannot be in the future'
      });
    }

    // If invoice was sent, validate payment date is not before sent date
    if (payment.invoiceSentAt) {
      const sentDate = new Date(payment.invoiceSentAt);
      if (paymentDate < sentDate) {
        return res.status(400).json({
          success: false,
          error: 'Payment date cannot be before invoice sent date'
        });
      }
    }

    // Get uploaded evidence file
    const paymentEvidenceFile = getFileUrl(req.file.path);

    // Prepare payment confirmation data
    const paymentConfirmation = {
      paidAmount: receivedAmount,
      bank: bank.trim(),
      paymentReference: paymentReference?.trim() || null,
      paymentNotes: paymentNotes?.trim() || null,
      confirmedBy: req.user?.email || req.user?.username || 'System',
      confirmedAt: new Date()
    };

    // Update payment status to paid
    await payment.update({
      status: 'paid',
      paidAt: paymentDate,
      paymentEvidence: paymentEvidenceFile,
      paymentReference: paymentReference?.trim() || null,
      paymentReceivedBank: bank.trim(),
      paymentConfirmation: JSON.stringify(paymentConfirmation),
      notes: paymentNotes?.trim() || payment.notes
    });

    res.json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi',
      data: {
        id: payment.id,
        invoiceNumber: payment.invoiceNumber,
        status: payment.status,
        paidAt: payment.paidAt,
        paidAmount: receivedAmount,
        bank: bank.trim(),
        paymentEvidence: paymentEvidenceFile,
        paymentReference: payment.paymentReference
      }
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum 5MB allowed.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment',
      details: error.message
    });
  }
});

module.exports = router;
