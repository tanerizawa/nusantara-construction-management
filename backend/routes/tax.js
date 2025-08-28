const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Load tax data
const loadTax = async () => {
  try {
    const taxPath = path.join(__dirname, '../../data/tax.json');
    const data = await fs.readFile(taxPath, 'utf8');
    return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading tax:', error);
    return [];
  }
};

// Save tax data
const saveTax = async (data) => {
  try {
    const taxPath = path.join(__dirname, '../../data/tax.json');
    await fs.writeFile(taxPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving tax:', error);
  }
};

// @route   GET /api/tax
// @desc    Get all tax records
// @access  Private
router.get('/', async (req, res) => {
  try {
    const taxData = await loadTax();
    const {
      q,
      status,
      type,
      startDate,
      endDate,
      sort = 'date',
      order = 'desc',
      limit = 20,
      page = 1
    } = req.query;

    let taxes = taxData;

    // Keyword search (desc, description, reference, type)
    if (q) {
      const keyword = String(q).toLowerCase();
      taxes = taxes.filter((t) => {
        const desc = (t.desc || t.description || '').toLowerCase();
        const ref = (t.reference || '').toLowerCase();
        const ttype = (t.type || '').toLowerCase();
        return (
          desc.includes(keyword) ||
          ref.includes(keyword) ||
          ttype.includes(keyword)
        );
      });
    }

    // Filter by status
    if (status) {
      const s = String(status).toLowerCase();
      taxes = taxes.filter((t) => String(t.status || '').toLowerCase() === s);
    }

    // Filter by type
    if (type) {
      taxes = taxes.filter(t => t.type.toLowerCase() === type.toLowerCase());
    }

    // Filter by date range
    if (startDate || endDate) {
      taxes = taxes.filter(t => {
        const taxDate = new Date(t.date);
        if (startDate && taxDate < new Date(startDate)) return false;
        if (endDate && taxDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Sorting
    const sortKey = String(sort);
    const sortOrder = String(order).toLowerCase() === 'asc' ? 1 : -1;
    taxes.sort((a, b) => {
      let av, bv;
      if (sortKey === 'amount') {
        av = Number(a.amount) || 0;
        bv = Number(b.amount) || 0;
      } else {
        // default date
        av = new Date(a.date).getTime();
        bv = new Date(b.date).getTime();
      }
      return (av - bv) * sortOrder;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTaxes = taxes.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedTaxes,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(taxes.length / limit),
        count: taxes.length
      }
    });

  } catch (error) {
    console.error('Error fetching tax data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/tax/:id
// @desc    Get tax record by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const taxData = await loadTax();
    const tax = taxData.find(t => t.id === parseInt(req.params.id));

    if (!tax) {
      return res.status(404).json({ error: 'Tax record not found' });
    }

    res.json({
      success: true,
      data: tax
    });

  } catch (error) {
    console.error('Error fetching tax record:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/tax
// @desc    Add new tax record
// @access  Private (Finance Manager, Admin)
router.post('/', async (req, res) => {
  try {
    const taxData = await loadTax();
    
    // Generate new tax ID
    const newId = taxData.length > 0 
      ? Math.max(...taxData.map(t => t.id)) + 1 
      : 1;

    const newTax = {
      id: newId,
      type: req.body.type, // "PPN", "PPh", "PBB", etc.
      amount: parseInt(req.body.amount),
      desc: req.body.desc || req.body.description,
      date: req.body.date || new Date().toISOString().split('T')[0],
      period: req.body.period || new Date().toISOString().substring(0, 7), // YYYY-MM
      taxRate: req.body.taxRate || 0,
      baseAmount: req.body.baseAmount || 0,
      projectId: req.body.projectId || null,
      status: req.body.status || 'pending', // pending, paid, overdue
      dueDate: req.body.dueDate || null,
      paidDate: req.body.paidDate || null,
      reference: req.body.reference || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user?.id || 'USR001'
    };

    taxData.push(newTax);
    await saveTax(taxData);

    res.status(201).json({
      success: true,
      message: 'Tax record added successfully',
      data: newTax
    });

  } catch (error) {
    console.error('Error adding tax record:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/tax/:id
// @desc    Update tax record
// @access  Private (Finance Manager, Admin)
router.put('/:id', async (req, res) => {
  try {
    const taxData = await loadTax();
    const taxIndex = taxData.findIndex(t => t.id === parseInt(req.params.id));

    if (taxIndex === -1) {
      return res.status(404).json({ error: 'Tax record not found' });
    }

    // Update tax record
    taxData[taxIndex] = {
      ...taxData[taxIndex],
      ...req.body,
      amount: parseInt(req.body.amount || taxData[taxIndex].amount),
      updatedAt: new Date().toISOString()
    };

    await saveTax(taxData);

    res.json({
      success: true,
      message: 'Tax record updated successfully',
      data: taxData[taxIndex]
    });

  } catch (error) {
    console.error('Error updating tax record:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/tax/:id/pay
// @desc    Mark tax as paid
// @access  Private (Finance Manager, Admin)
router.put('/:id/pay', async (req, res) => {
  try {
    const taxData = await loadTax();
    const taxIndex = taxData.findIndex(t => t.id === parseInt(req.params.id));

    if (taxIndex === -1) {
      return res.status(404).json({ error: 'Tax record not found' });
    }

    // Mark as paid
    taxData[taxIndex].status = 'paid';
    taxData[taxIndex].paidDate = req.body.paidDate || new Date().toISOString().split('T')[0];
    taxData[taxIndex].reference = req.body.reference || taxData[taxIndex].reference;
    taxData[taxIndex].updatedAt = new Date().toISOString();

    await saveTax(taxData);

    res.json({
      success: true,
      message: 'Tax marked as paid successfully',
      data: taxData[taxIndex]
    });

  } catch (error) {
    console.error('Error marking tax as paid:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/tax/:id
// @desc    Delete tax record
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const taxData = await loadTax();
    const taxIndex = taxData.findIndex(t => t.id === parseInt(req.params.id));

    if (taxIndex === -1) {
      return res.status(404).json({ error: 'Tax record not found' });
    }

    // Remove tax record
    const deletedTax = taxData.splice(taxIndex, 1)[0];
    await saveTax(taxData);

    res.json({
      success: true,
      message: 'Tax record deleted successfully',
      data: deletedTax
    });

  } catch (error) {
    console.error('Error deleting tax record:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/tax/stats/overview
// @desc    Get tax statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const taxData = await loadTax();
    const { startDate, endDate } = req.query;

    let taxes = taxData;

    // Filter by date range if provided
    if (startDate || endDate) {
      taxes = taxes.filter(t => {
        const taxDate = new Date(t.date);
        if (startDate && taxDate < new Date(startDate)) return false;
        if (endDate && taxDate > new Date(endDate)) return false;
        return true;
      });
    }

    const stats = {
      totalTax: taxes.reduce((sum, t) => sum + t.amount, 0),
      paidTax: taxes.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0),
      pendingTax: taxes.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
      overdueTax: taxes.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.amount, 0),
      totalRecords: taxes.length,
      paidRecords: taxes.filter(t => t.status === 'paid').length,
      pendingRecords: taxes.filter(t => t.status === 'pending').length,
      overdueRecords: taxes.filter(t => t.status === 'overdue').length,
      byType: taxes.reduce((acc, tax) => {
        acc[tax.type] = (acc[tax.type] || 0) + tax.amount;
        return acc;
      }, {}),
      recentTaxes: taxData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching tax stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/tax/reports/monthly
// @desc    Get monthly tax report
// @access  Private
router.get('/reports/monthly', async (req, res) => {
  try {
    const taxData = await loadTax();
    const { year = new Date().getFullYear() } = req.query;

    const monthlyData = {};
    
    // Initialize months
    for (let month = 1; month <= 12; month++) {
      monthlyData[month] = {
        month,
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        records: 0
      };
    }

    // Process tax records
    taxData
      .filter(t => new Date(t.date).getFullYear() === parseInt(year))
      .forEach(tax => {
        const month = new Date(tax.date).getMonth() + 1;
        monthlyData[month].records++;
        monthlyData[month].total += tax.amount;
        
        if (tax.status === 'paid') {
          monthlyData[month].paid += tax.amount;
        } else if (tax.status === 'pending') {
          monthlyData[month].pending += tax.amount;
        } else if (tax.status === 'overdue') {
          monthlyData[month].overdue += tax.amount;
        }
      });

    res.json({
      success: true,
      data: Object.values(monthlyData)
    });

  } catch (error) {
    console.error('Error fetching monthly tax report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/tax/types
// @desc    Get tax types
// @access  Private
router.get('/types/list', async (req, res) => {
  try {
    const taxData = await loadTax();
    const types = [...new Set(taxData.map(t => t.type))].map(type => ({
      name: type,
      count: taxData.filter(t => t.type === type).length,
      total: taxData
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0)
    }));

    res.json({
      success: true,
      data: types
    });

  } catch (error) {
    console.error('Error fetching tax types:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
