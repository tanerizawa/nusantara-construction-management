const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../../data/purchase-orders.json');

// Helper function to load purchase orders data
async function loadPurchaseOrders() {
  try {
    console.log('Loading purchase orders from:', DATA_FILE);
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    console.log('Loaded purchase orders count:', parsed.purchaseOrders?.length || 0);
    return parsed;
  } catch (error) {
    console.error('Error loading purchase orders:', error);
    return { purchaseOrders: [] };
  }
}

// Helper function to save purchase orders data
async function savePurchaseOrders(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving purchase orders:', error);
    return false;
  }
}

// GET /api/purchase-orders - Get all purchase orders with optional filtering
router.get('/', async (req, res) => {
  console.log('GET /api/purchase-orders endpoint hit');
  try {
    const { q, status, project, supplier } = req.query;
    const data = await loadPurchaseOrders();
    let purchaseOrders = data.purchaseOrders || [];

    // Apply filters
    if (q) {
      const searchTerm = q.toLowerCase();
      purchaseOrders = purchaseOrders.filter(po =>
        po.poNumber?.toLowerCase().includes(searchTerm) ||
        po.project?.name?.toLowerCase().includes(searchTerm) ||
        po.supplier?.name?.toLowerCase().includes(searchTerm)
      );
    }

    if (status) {
      purchaseOrders = purchaseOrders.filter(po => po.status === status);
    }

    if (project) {
      purchaseOrders = purchaseOrders.filter(po => po.project?.id === project);
    }

    if (supplier) {
      purchaseOrders = purchaseOrders.filter(po => po.supplier?.id === supplier);
    }

    // Sort by creation date (newest first)
    purchaseOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: purchaseOrders,
      count: purchaseOrders.length,
      total: data.purchaseOrders?.length || 0
    });

  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// GET /api/purchase-orders/stats - Get purchase order statistics
router.get('/stats', async (req, res) => {
  console.log('GET /api/purchase-orders/stats endpoint hit');
  try {
    const data = await loadPurchaseOrders();
    const purchaseOrders = data.purchaseOrders || [];

    const stats = {
      totalPOs: purchaseOrders.length,
      pendingPOs: purchaseOrders.filter(po => po.status === 'pending').length,
      approvedPOs: purchaseOrders.filter(po => po.status === 'approved').length,
      rejectedPOs: purchaseOrders.filter(po => po.status === 'rejected').length,
      totalValue: purchaseOrders.reduce((sum, po) => sum + (po.totalAmount || 0), 0),
      pendingValue: purchaseOrders
        .filter(po => po.status === 'pending')
        .reduce((sum, po) => sum + (po.totalAmount || 0), 0),
      approvedValue: purchaseOrders
        .filter(po => po.status === 'approved')
        .reduce((sum, po) => sum + (po.totalAmount || 0), 0)
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching purchase order stats:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// GET /api/purchase-orders/:id - Get specific purchase order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await loadPurchaseOrders();
    const purchaseOrder = data.purchaseOrders?.find(po => po.id === id);

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    res.json({
      success: true,
      data: purchaseOrder
    });

  } catch (error) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// POST /api/purchase-orders - Create new purchase order
router.post('/', async (req, res) => {
  try {
    const data = await loadPurchaseOrders();
    const purchaseOrders = data.purchaseOrders || [];

    // Generate new PO number
    const currentYear = new Date().getFullYear();
    const poCount = purchaseOrders.filter(po => 
      po.poNumber?.includes(currentYear.toString())
    ).length + 1;
    const poNumber = `PO-${currentYear}-${poCount.toString().padStart(3, '0')}`;

    const newPO = {
      id: `PO${(purchaseOrders.length + 1).toString().padStart(3, '0')}`,
      poNumber,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    purchaseOrders.push(newPO);
    data.purchaseOrders = purchaseOrders;

    const saved = await savePurchaseOrders(data);
    if (!saved) {
      throw new Error('Failed to save purchase order');
    }

    res.status(201).json({
      success: true,
      data: newPO,
      message: 'Purchase order created successfully'
    });

  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// PUT /api/purchase-orders/:id - Update purchase order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await loadPurchaseOrders();
    const purchaseOrders = data.purchaseOrders || [];

    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    const updatedPO = {
      ...purchaseOrders[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    purchaseOrders[index] = updatedPO;
    data.purchaseOrders = purchaseOrders;

    const saved = await savePurchaseOrders(data);
    if (!saved) {
      throw new Error('Failed to update purchase order');
    }

    res.json({
      success: true,
      data: updatedPO,
      message: 'Purchase order updated successfully'
    });

  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// PUT /api/purchase-orders/:id/approve - Approve purchase order
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await loadPurchaseOrders();
    const purchaseOrders = data.purchaseOrders || [];

    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    if (purchaseOrders[index].status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending purchase orders can be approved'
      });
    }

    const updatedPO = {
      ...purchaseOrders[index],
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: req.body.approvedBy || { id: 'SYSTEM', name: 'System' },
      updatedAt: new Date().toISOString()
    };

    purchaseOrders[index] = updatedPO;
    data.purchaseOrders = purchaseOrders;

    const saved = await savePurchaseOrders(data);
    if (!saved) {
      throw new Error('Failed to approve purchase order');
    }

    res.json({
      success: true,
      data: updatedPO,
      message: 'Purchase order approved successfully'
    });

  } catch (error) {
    console.error('Error approving purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// PUT /api/purchase-orders/:id/reject - Reject purchase order
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const data = await loadPurchaseOrders();
    const purchaseOrders = data.purchaseOrders || [];

    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    if (purchaseOrders[index].status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending purchase orders can be rejected'
      });
    }

    const updatedPO = {
      ...purchaseOrders[index],
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: req.body.rejectedBy || { id: 'SYSTEM', name: 'System' },
      rejectionReason: rejectionReason || 'No reason provided',
      updatedAt: new Date().toISOString()
    };

    purchaseOrders[index] = updatedPO;
    data.purchaseOrders = purchaseOrders;

    const saved = await savePurchaseOrders(data);
    if (!saved) {
      throw new Error('Failed to reject purchase order');
    }

    res.json({
      success: true,
      data: updatedPO,
      message: 'Purchase order rejected successfully'
    });

  } catch (error) {
    console.error('Error rejecting purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// DELETE /api/purchase-orders/:id - Delete purchase order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await loadPurchaseOrders();
    const purchaseOrders = data.purchaseOrders || [];

    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Purchase order not found'
      });
    }

    // Only allow deletion of pending or rejected POs
    if (!['pending', 'rejected'].includes(purchaseOrders[index].status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete approved purchase orders'
      });
    }

    purchaseOrders.splice(index, 1);
    data.purchaseOrders = purchaseOrders;

    const saved = await savePurchaseOrders(data);
    if (!saved) {
      throw new Error('Failed to delete purchase order');
    }

    res.json({
      success: true,
      message: 'Purchase order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting purchase order:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

module.exports = router;
