const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params from parent router
const { ProjectRAB, RABRealization, RealizationDocument, Project } = require('../../models').models;
const { Op } = require('sequelize');
const { verifyToken } = require('../../middleware/auth');

// Apply authentication to all routes
router.use(verifyToken);

/**
 * @route   GET /api/projects/:projectId/rab-realizations/summary
 * @desc    Get all RAB items with realization aggregation for a project
 * @access  Private
 */
router.get('/:projectId/rab-realizations/summary', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, category, itemType, dateFrom, dateTo } = req.query;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Build where clause for RAB items
    const rabWhere = { projectId };
    if (category) rabWhere.category = category;
    if (itemType) rabWhere.item_type = itemType;

    // Build where clause for realizations (for filtering)
    const realizationWhere = {};
    if (status) realizationWhere.status = status;
    if (dateFrom || dateTo) {
      realizationWhere.transactionDate = {};
      if (dateFrom) realizationWhere.transactionDate[Op.gte] = dateFrom;
      if (dateTo) realizationWhere.transactionDate[Op.lte] = dateTo;
    }

    // Fetch all RAB items with their realizations
    const rabItems = await ProjectRAB.findAll({
      where: rabWhere,
      include: [
        {
          model: RABRealization,
          as: 'realizations',
          where: Object.keys(realizationWhere).length > 0 ? realizationWhere : undefined,
          required: false, // LEFT JOIN
          include: [
            {
              model: RealizationDocument,
              as: 'documents',
              attributes: ['id', 'fileName', 'documentType', 'fileSize']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC'], [{ model: RABRealization, as: 'realizations' }, 'transactionDate', 'DESC']]
    });

    // Transform data and calculate aggregations
    const itemsWithRealizations = rabItems.map(rabItem => {
      const item = rabItem.toJSON();
      const realizations = item.realizations || [];

      // Calculate aggregations
      const totalQuantityRealized = realizations.reduce((sum, r) => sum + parseFloat(r.quantity || 0), 0);
      const totalAmountRealized = realizations.reduce((sum, r) => sum + parseFloat(r.totalAmount || 0), 0);
      const budgetTotal = parseFloat(item.quantity) * parseFloat(item.unitPrice);
      const varianceTotal = totalAmountRealized - budgetTotal;
      const variancePercentage = budgetTotal > 0 ? ((varianceTotal / budgetTotal) * 100).toFixed(2) : 0;

      return {
        rabItem: {
          id: item.id,
          category: item.category,
          description: item.description,
          itemType: item.itemType || item.item_type,
          unit: item.unit,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          totalBudget: budgetTotal,
          status: item.status
        },
        realizations: {
          count: realizations.length,
          totalQuantity: totalQuantityRealized,
          totalAmount: totalAmountRealized,
          avgUnitPrice: totalQuantityRealized > 0 ? (totalAmountRealized / totalQuantityRealized).toFixed(2) : 0,
          variance: varianceTotal,
          variancePercentage: parseFloat(variancePercentage),
          lastTransaction: realizations.length > 0 ? realizations[0].transactionDate : null,
          entries: realizations.map(r => ({
            id: r.id,
            transactionDate: r.transactionDate,
            quantity: parseFloat(r.quantity),
            unitPrice: parseFloat(r.unitPrice),
            totalAmount: parseFloat(r.totalAmount),
            vendorName: r.vendorName,
            invoiceNumber: r.invoiceNumber,
            status: r.status,
            variance: parseFloat(r.varianceAmount || 0),
            variancePercentage: parseFloat(r.variancePercentage || 0),
            documentsCount: r.documents ? r.documents.length : 0,
            createdBy: r.createdBy,
            createdAt: r.createdAt
          }))
        }
      };
    });

    // Calculate project-level summary
    const totalBudget = rabItems.reduce((sum, item) => 
      sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0
    );
    const totalRealization = itemsWithRealizations.reduce((sum, item) => 
      sum + item.realizations.totalAmount, 0
    );
    const totalVariance = totalRealization - totalBudget;
    const totalVariancePercentage = totalBudget > 0 ? ((totalVariance / totalBudget) * 100).toFixed(2) : 0;
    
    const itemsWithRealizations_count = itemsWithRealizations.filter(item => item.realizations.count > 0).length;
    const completionRate = rabItems.length > 0 ? ((itemsWithRealizations_count / rabItems.length) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalBudget: parseFloat(totalBudget.toFixed(2)),
          totalRealization: parseFloat(totalRealization.toFixed(2)),
          variance: parseFloat(totalVariance.toFixed(2)),
          variancePercentage: parseFloat(totalVariancePercentage),
          completionRate: parseFloat(completionRate),
          itemsCount: rabItems.length,
          realizedItemsCount: itemsWithRealizations_count
        },
        items: itemsWithRealizations
      }
    });
  } catch (error) {
    console.error('Error fetching RAB realizations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RAB realizations',
      details: error.message
    });
  }
});

/**
 * Backward compatibility route - handles old endpoint /rab/realizations
 * @route   GET /api/projects/:projectId/rab/realizations  
 */
router.get('/:projectId/rab/realizations', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, category, itemType, dateFrom, dateTo } = req.query;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Build where clause for RAB items
    const rabWhere = { projectId };
    if (category) rabWhere.category = category;
    if (itemType) rabWhere.item_type = itemType;

    // Build where clause for realizations (for filtering)
    const realizationWhere = {};
    if (status) realizationWhere.status = status;
    if (dateFrom || dateTo) {
      realizationWhere.transactionDate = {};
      if (dateFrom) realizationWhere.transactionDate[Op.gte] = dateFrom;
      if (dateTo) realizationWhere.transactionDate[Op.lte] = dateTo;
    }

    // Fetch all RAB items with their realizations
    const rabItems = await ProjectRAB.findAll({
      where: rabWhere,
      include: [
        {
          model: RABRealization,
          as: 'realizations',
          where: Object.keys(realizationWhere).length > 0 ? realizationWhere : undefined,
          required: false, // LEFT JOIN
          include: [
            {
              model: RealizationDocument,
              as: 'documents',
              attributes: ['id', 'fileName', 'documentType', 'fileSize']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC'], [{ model: RABRealization, as: 'realizations' }, 'transactionDate', 'DESC']]
    });

    // Transform data and calculate aggregations
    const itemsWithRealizations = rabItems.map(rabItem => {
      const item = rabItem.toJSON();
      const realizations = item.realizations || [];

      // Calculate aggregations
      const totalQuantityRealized = realizations.reduce((sum, r) => sum + parseFloat(r.quantity || 0), 0);
      const totalAmountRealized = realizations.reduce((sum, r) => sum + parseFloat(r.totalAmount || 0), 0);
      const budgetTotal = parseFloat(item.quantity) * parseFloat(item.unitPrice);
      const varianceTotal = totalAmountRealized - budgetTotal;
      const variancePercentage = budgetTotal > 0 ? ((varianceTotal / budgetTotal) * 100).toFixed(2) : 0;

      return {
        rabItem: {
          id: item.id,
          category: item.category,
          description: item.description,
          itemType: item.itemType || item.item_type,
          unit: item.unit,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          totalBudget: budgetTotal,
          status: item.status
        },
        realizations: {
          count: realizations.length,
          totalQuantity: totalQuantityRealized,
          totalAmount: totalAmountRealized,
          avgUnitPrice: totalQuantityRealized > 0 ? (totalAmountRealized / totalQuantityRealized).toFixed(2) : 0,
          variance: varianceTotal,
          variancePercentage: parseFloat(variancePercentage),
          lastTransaction: realizations.length > 0 ? realizations[0].transactionDate : null,
          entries: realizations.map(r => ({
            id: r.id,
            transactionDate: r.transactionDate,
            quantity: parseFloat(r.quantity),
            unitPrice: parseFloat(r.unitPrice),
            totalAmount: parseFloat(r.totalAmount),
            vendorName: r.vendorName,
            invoiceNumber: r.invoiceNumber,
            status: r.status,
            variance: parseFloat(r.varianceAmount || 0),
            variancePercentage: parseFloat(r.variancePercentage || 0),
            documentsCount: r.documents ? r.documents.length : 0,
            createdBy: r.createdBy,
            createdAt: r.createdAt
          }))
        }
      };
    });

    // Calculate project-level summary
    const totalBudget = rabItems.reduce((sum, item) => 
      sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0
    );
    const totalRealization = itemsWithRealizations.reduce((sum, item) => 
      sum + item.realizations.totalAmount, 0
    );
    const totalVariance = totalRealization - totalBudget;
    const totalVariancePercentage = totalBudget > 0 ? ((totalVariance / totalBudget) * 100).toFixed(2) : 0;
    
    const itemsWithRealizations_count = itemsWithRealizations.filter(item => item.realizations.count > 0).length;
    const completionRate = rabItems.length > 0 ? ((itemsWithRealizations_count / rabItems.length) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalBudget: parseFloat(totalBudget.toFixed(2)),
          totalRealization: parseFloat(totalRealization.toFixed(2)),
          variance: parseFloat(totalVariance.toFixed(2)),
          variancePercentage: parseFloat(totalVariancePercentage),
          completionRate: parseFloat(completionRate),
          itemsCount: rabItems.length,
          realizedItemsCount: itemsWithRealizations_count
        },
        items: itemsWithRealizations
      }
    });
  } catch (error) {
    console.error('Error fetching RAB realizations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RAB realizations',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:projectId/rab/:rabItemId/realizations
 * @desc    Get detailed realization history for a specific RAB item
 * @access  Private
 * @note    This route will NOT match if rabItemId is literally 'realizations'
 */
router.get('/:projectId/rab/:rabItemId/realizations', async (req, res, next) => {
  try {
    const { projectId, rabItemId } = req.params;

    // Skip this route if rabItemId is 'realizations' - let it be handled by the summary route
    if (rabItemId === 'realizations') {
      return next('route'); // Skip to next route handler
    }

    // Check if RAB item exists
    const rabItem = await ProjectRAB.findOne({
      where: { id: rabItemId, projectId }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    // Fetch all realizations for this RAB item
    const realizations = await RABRealization.findAll({
      where: { rabItemId },
      include: [
        {
          model: RealizationDocument,
          as: 'documents',
          attributes: ['id', 'fileName', 'filePath', 'fileType', 'fileSize', 'mimeType', 'documentType', 'description', 'uploadedBy', 'uploadedAt']
        }
      ],
      order: [['transactionDate', 'DESC']]
    });

    // Calculate totals
    const totalQuantity = realizations.reduce((sum, r) => sum + parseFloat(r.quantity || 0), 0);
    const totalAmount = realizations.reduce((sum, r) => sum + parseFloat(r.totalAmount || 0), 0);
    const avgUnitPrice = totalQuantity > 0 ? (totalAmount / totalQuantity).toFixed(2) : 0;
    
    const budgetTotal = parseFloat(rabItem.quantity) * parseFloat(rabItem.unitPrice);
    const variance = totalAmount - budgetTotal;
    const variancePercentage = budgetTotal > 0 ? ((variance / budgetTotal) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        rabItem: {
          id: rabItem.id,
          category: rabItem.category,
          description: rabItem.description,
          itemType: rabItem.itemType || rabItem.item_type,
          unit: rabItem.unit,
          quantity: parseFloat(rabItem.quantity),
          unitPrice: parseFloat(rabItem.unitPrice),
          totalBudget: budgetTotal
        },
        budget: {
          quantity: parseFloat(rabItem.quantity),
          unitPrice: parseFloat(rabItem.unitPrice),
          totalBudget: budgetTotal
        },
        realizations: realizations.map(r => ({
          id: r.id,
          transactionDate: r.transactionDate,
          quantity: parseFloat(r.quantity),
          unitPrice: parseFloat(r.unitPrice),
          totalAmount: parseFloat(r.totalAmount),
          vendorName: r.vendorName,
          invoiceNumber: r.invoiceNumber,
          paymentMethod: r.paymentMethod,
          notes: r.notes,
          budgetUnitPrice: parseFloat(r.budgetUnitPrice || 0),
          varianceAmount: parseFloat(r.varianceAmount || 0),
          variancePercentage: parseFloat(r.variancePercentage || 0),
          status: r.status,
          approvedBy: r.approvedBy,
          approvedAt: r.approvedAt,
          rejectionReason: r.rejectionReason,
          documents: r.documents || [],
          createdBy: r.createdBy,
          createdAt: r.createdAt,
          updatedBy: r.updatedBy,
          updatedAt: r.updatedAt
        })),
        totals: {
          count: realizations.length,
          totalQuantity: parseFloat(totalQuantity.toFixed(2)),
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          avgUnitPrice: parseFloat(avgUnitPrice),
          variance: parseFloat(variance.toFixed(2)),
          variancePercentage: parseFloat(variancePercentage)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching realization details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch realization details',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/rab/:rabItemId/realizations
 * @desc    Create new realization entry for a RAB item
 * @access  Private
 */
router.post('/:projectId/rab/:rabItemId/realizations', async (req, res) => {
  try {
    const { projectId, rabItemId } = req.params;
    const {
      realizationDate,
      transactionDate,
      quantity,
      unitPrice,
      referenceType,
      poNumber,
      woNumber,
      vendor,
      vendorName,
      invoiceNumber,
      paymentMethod,
      notes,
      status = 'draft',
      createdBy
    } = req.body;

    // Support both realizationDate (frontend) and transactionDate (legacy)
    const finalTransactionDate = realizationDate || transactionDate;
    const finalVendorName = vendor || vendorName;

    // Validation
    if (!finalTransactionDate || !quantity || !unitPrice) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: realizationDate/transactionDate, quantity, unitPrice'
      });
    }

    // Check if RAB item exists
    const rabItem = await ProjectRAB.findOne({
      where: { id: rabItemId, projectId }
    });

    if (!rabItem) {
      return res.status(404).json({
        success: false,
        error: 'RAB item not found'
      });
    }

    // Calculate total amount and variance
    const totalAmount = parseFloat(quantity) * parseFloat(unitPrice);
    const varianceAmount = totalAmount - (parseFloat(quantity) * parseFloat(rabItem.unitPrice));
    const variancePercentage = rabItem.unitPrice > 0 
      ? (varianceAmount / (parseFloat(quantity) * parseFloat(rabItem.unitPrice))) * 100 
      : 0;

    // Create realization
    const realization = await RABRealization.create({
      projectId,
      rabItemId,
      transactionDate: finalTransactionDate,
      quantity,
      unitPrice,
      totalAmount,
      referenceType: referenceType || 'DIRECT',
      poNumber: referenceType === 'PO' ? poNumber : null,
      woNumber: referenceType === 'WO' ? woNumber : null,
      vendorName: finalVendorName,
      invoiceNumber,
      paymentMethod,
      notes,
      budgetUnitPrice: rabItem.unitPrice,
      varianceAmount,
      variancePercentage,
      status,
      createdBy: createdBy || req.user?.id
    });

    // Fetch created realization with associations
    const created = await RABRealization.findByPk(realization.id, {
      include: [
        {
          model: RealizationDocument,
          as: 'documents'
        },
        {
          model: ProjectRAB,
          as: 'rabItem',
          attributes: ['id', 'description', 'category', 'unit']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Realisasi berhasil disimpan',
      data: created
    });
  } catch (error) {
    console.error('Error creating realization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create realization',
      details: error.message
    });
  }
});

/**
 * @route   PUT /api/projects/:projectId/rab/:rabItemId/realizations/:realizationId
 * @desc    Update realization entry
 * @access  Private
 */
router.put('/:projectId/rab/:rabItemId/realizations/:realizationId', async (req, res) => {
  try {
    const { projectId, rabItemId, realizationId } = req.params;
    const { updatedBy, ...updateData } = req.body;

    if (!updatedBy) {
      return res.status(400).json({
        success: false,
        error: 'updatedBy is required'
      });
    }

    // Find realization
    const realization = await RABRealization.findOne({
      where: { id: realizationId, projectId, rabItemId }
    });

    if (!realization) {
      return res.status(404).json({
        success: false,
        error: 'Realization not found'
      });
    }

    // Check if approved (approved realizations cannot be edited)
    if (realization.status === 'approved') {
      return res.status(403).json({
        success: false,
        error: 'Approved realizations cannot be edited'
      });
    }

    // Update realization
    await realization.update({
      ...updateData,
      updatedBy
    });

    // Fetch updated realization
    const updated = await RABRealization.findByPk(realizationId, {
      include: [
        {
          model: RealizationDocument,
          as: 'documents'
        }
      ]
    });

    res.json({
      success: true,
      message: 'Realization updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating realization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update realization',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/:projectId/rab/:rabItemId/realizations/:realizationId
 * @desc    Soft delete realization entry
 * @access  Private
 */
router.delete('/:projectId/rab/:rabItemId/realizations/:realizationId', async (req, res) => {
  try {
    const { projectId, rabItemId, realizationId } = req.params;

    // Find realization
    const realization = await RABRealization.findOne({
      where: { id: realizationId, projectId, rabItemId }
    });

    if (!realization) {
      return res.status(404).json({
        success: false,
        error: 'Realization not found'
      });
    }

    // Check if approved
    if (realization.status === 'approved') {
      return res.status(403).json({
        success: false,
        error: 'Approved realizations cannot be deleted'
      });
    }

    // Soft delete (paranoid: true akan set deletedAt)
    await realization.destroy();

    res.json({
      success: true,
      message: 'Realization deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting realization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete realization',
      details: error.message
    });
  }
});

module.exports = router;
