const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Load finance data
const loadFinance = async () => {
  try {
    const financePath = path.join(__dirname, '../../data/finance.json');
    const data = await fs.readFile(financePath, 'utf8');
    return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading finance:', error);
    return [];
  }
};

// Save finance data
const saveFinance = async (data) => {
  try {
    const financePath = path.join(__dirname, '../../data/finance.json');
    await fs.writeFile(financePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving finance:', error);
  }
};

// @route   GET /api/finance
// @desc    Get all financial transactions
// @access  Private
router.get('/', async (req, res) => {
  try {
    const financeData = await loadFinance();
  const { type, startDate, endDate, q, sort = 'date', order = 'desc', limit = 20, page = 1 } = req.query;

  let transactions = financeData;

    // Filter by type
    if (type) {
      transactions = transactions.filter(t => t.type.toLowerCase() === type.toLowerCase());
    }

    // Filter by date range
    if (startDate || endDate) {
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        if (startDate && transactionDate < new Date(startDate)) return false;
        if (endDate && transactionDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Text search (desc/reference)
    if (q) {
      const needle = String(q).toLowerCase();
      transactions = transactions.filter(t =>
        (t.desc || t.description || '').toLowerCase().includes(needle) ||
        (t.reference || '').toLowerCase().includes(needle)
      );
    }

    // Sort
    const safeOrder = String(order).toLowerCase() === 'asc' ? 'asc' : 'desc';
    const safeSort = ['date', 'amount', 'type'].includes(sort) ? sort : 'date';
    transactions.sort((a, b) => {
      let aVal;
      let bVal;
      if (safeSort === 'amount') {
        aVal = a.amount || 0;
        bVal = b.amount || 0;
      } else if (safeSort === 'type') {
        aVal = (a.type || '').toLowerCase();
        bVal = (b.type || '').toLowerCase();
      } else {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      }
      if (aVal === bVal) return 0;
      if (safeOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(transactions.length / limit),
        count: transactions.length
      }
    });

  } catch (error) {
    console.error('Error fetching finance data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/finance/:id
// @desc    Get financial transaction by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const financeData = await loadFinance();
    const transaction = financeData.find(t => t.id === parseInt(req.params.id));

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/finance
// @desc    Add new financial transaction
// @access  Private (Finance Manager, Admin)
router.post('/', async (req, res) => {
  try {
    const financeData = await loadFinance();
    
    // Generate new transaction ID
    const newId = financeData.length > 0 
      ? Math.max(...financeData.map(t => t.id)) + 1 
      : 1;

    const newTransaction = {
      id: newId,
      type: req.body.type, // "Pemasukan" or "Pengeluaran"
      amount: parseInt(req.body.amount),
      desc: req.body.desc || req.body.description,
      date: req.body.date || new Date().toISOString().split('T')[0],
      category: req.body.category || 'general',
      projectId: req.body.projectId || null,
      reference: req.body.reference || '',
      paymentMethod: req.body.paymentMethod || 'transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user?.id || 'USR001'
    };

    financeData.push(newTransaction);
    await saveFinance(financeData);

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: newTransaction
    });

  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/finance/:id
// @desc    Update financial transaction
// @access  Private (Finance Manager, Admin)
router.put('/:id', async (req, res) => {
  try {
    const financeData = await loadFinance();
    const transactionIndex = financeData.findIndex(t => t.id === parseInt(req.params.id));

    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction
    financeData[transactionIndex] = {
      ...financeData[transactionIndex],
      ...req.body,
      amount: parseInt(req.body.amount || financeData[transactionIndex].amount),
      updatedAt: new Date().toISOString()
    };

    await saveFinance(financeData);

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: financeData[transactionIndex]
    });

  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/finance/:id
// @desc    Delete financial transaction
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const financeData = await loadFinance();
    const transactionIndex = financeData.findIndex(t => t.id === parseInt(req.params.id));

    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Remove transaction
    const deletedTransaction = financeData.splice(transactionIndex, 1)[0];
    await saveFinance(financeData);

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: deletedTransaction
    });

  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/finance/stats/overview
// @desc    Get financial statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const financeData = await loadFinance();
    const { startDate, endDate } = req.query;

    let transactions = financeData;

    // Filter by date range if provided
    if (startDate || endDate) {
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        if (startDate && transactionDate < new Date(startDate)) return false;
        if (endDate && transactionDate > new Date(endDate)) return false;
        return true;
      });
    }

    const income = transactions
      .filter(t => t.type === 'Pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'Pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);

    const stats = {
      totalIncome: income,
      totalExpense: expense,
      netIncome: income - expense,
      transactionCount: transactions.length,
      incomeTransactions: transactions.filter(t => t.type === 'Pemasukan').length,
      expenseTransactions: transactions.filter(t => t.type === 'Pengeluaran').length,
      averageTransaction: transactions.length > 0 
        ? Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)
        : 0,
      recentTransactions: financeData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching finance stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/finance/reports/monthly
// @desc    Get monthly financial report
// @access  Private
router.get('/reports/monthly', async (req, res) => {
  try {
    const financeData = await loadFinance();
    const { year = new Date().getFullYear() } = req.query;

    const monthlyData = {};
    
    // Initialize months
    for (let month = 1; month <= 12; month++) {
      monthlyData[month] = {
        month,
        income: 0,
        expense: 0,
        net: 0,
        transactions: 0
      };
    }

    // Process transactions
    financeData
      .filter(t => new Date(t.date).getFullYear() === parseInt(year))
      .forEach(transaction => {
        const month = new Date(transaction.date).getMonth() + 1;
        monthlyData[month].transactions++;
        
        if (transaction.type === 'Pemasukan') {
          monthlyData[month].income += transaction.amount;
        } else {
          monthlyData[month].expense += transaction.amount;
        }
        
        monthlyData[month].net = monthlyData[month].income - monthlyData[month].expense;
      });

    res.json({
      success: true,
      data: Object.values(monthlyData)
    });

  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/finance/categories
// @desc    Get transaction categories
// @access  Private
router.get('/categories/list', async (req, res) => {
  try {
    const financeData = await loadFinance();
    const categories = [...new Set(financeData.map(t => t.category || 'general'))].map(category => ({
      name: category,
      count: financeData.filter(t => (t.category || 'general') === category).length,
      total: financeData
        .filter(t => (t.category || 'general') === category)
        .reduce((sum, t) => sum + t.amount, 0)
    }));

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
