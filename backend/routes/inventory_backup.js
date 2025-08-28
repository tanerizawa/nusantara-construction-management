const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const Joi = require('joi');

const router = express.Router();

// Load inventory data
const loadInventory = async () => {
  try {
    const inventoryPath = path.join(__dirname, '../../data/inventory.json');
    const data = await fs.readFile(inventoryPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading inventory:', error);
    return { inventory: [], transactions: [], suppliers: [] };
  }
};

// Save inventory data
const saveInventory = async (data) => {
  try {
    const inventoryPath = path.join(__dirname, '../../data/inventory.json');
    await fs.writeFile(inventoryPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving inventory:', error);
  }
};

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
  const { category, lowStock, search, q, sort = 'name', order = 'asc', limit = 20, page = 1 } = req.query;

    let items = inventoryData.inventory || [];

    // Filter by category
    if (category) {
      items = items.filter(item => item.category === category);
    }

    // Filter low stock items
    if (lowStock === 'true') {
      items = items.filter(item => item.stock.available <= item.stock.minimum);
    }

    // Search functionality
    const qVal = (q || search || '').toString().toLowerCase();
    if (qVal) {
      items = items.filter(item =>
        (item.name || '').toLowerCase().includes(qVal) ||
        (item.itemCode || '').toLowerCase().includes(qVal) ||
        (item.brand || '').toLowerCase().includes(qVal)
      );
    }

    // Sort
    const safeOrder = String(order).toLowerCase() === 'desc' ? 'desc' : 'asc';
    const safeSort = ['name', 'itemCode', 'stock', 'price'].includes(sort) ? sort : 'name';
    items.sort((a, b) => {
      let aVal;
      let bVal;
      if (safeSort === 'itemCode') {
        aVal = (a.itemCode || '').toLowerCase();
        bVal = (b.itemCode || '').toLowerCase();
      } else if (safeSort === 'stock') {
        aVal = a.stock?.available || 0;
        bVal = b.stock?.available || 0;
      } else if (safeSort === 'price') {
        aVal = a.pricing?.averagePrice || 0;
        bVal = b.pricing?.averagePrice || 0;
      } else {
        aVal = (a.name || '').toLowerCase();
        bVal = (b.name || '').toLowerCase();
      }
      if (aVal === bVal) return 0;
      if (safeOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedItems,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(items.length / limit),
        count: items.length
      }
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/inventory/:id
// @desc    Get inventory item by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const item = inventoryData.inventory.find(i => i.id === req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/inventory
// @desc    Add new inventory item
// @access  Private (Inventory Manager, Admin)
router.post('/', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const items = inventoryData.inventory || [];

    // Generate new item ID
    const newId = `INV${String(items.length + 1).padStart(3, '0')}`;
    const itemCode = req.body.itemCode || `${req.body.category.substring(0, 3).toUpperCase()}-${String(items.length + 1).padStart(3, '0')}`;

    const newItem = {
      id: newId,
      itemCode,
      ...req.body,
      stock: {
        available: req.body.stock?.available || 0,
        reserved: 0,
        onOrder: 0,
        minimum: req.body.stock?.minimum || 10,
        maximum: req.body.stock?.maximum || 1000
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.push(newItem);
    inventoryData.inventory = items;
    await saveInventory(inventoryData);

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      data: newItem
    });

  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
// @access  Private (Inventory Manager, Admin)
router.put('/:id', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const itemIndex = inventoryData.inventory.findIndex(i => i.id === req.params.id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update item
    inventoryData.inventory[itemIndex] = {
      ...inventoryData.inventory[itemIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveInventory(inventoryData);

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: inventoryData.inventory[itemIndex]
    });

  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/inventory/:id/transaction
// @desc    Add inventory transaction (in/out)
// @access  Private
router.post('/:id/transaction', async (req, res) => {
  try {
    const { type, quantity, reference, notes } = req.body;
    
    if (!['in', 'out'].includes(type)) {
      return res.status(400).json({ error: 'Transaction type must be "in" or "out"' });
    }

    const inventoryData = await loadInventory();
    const itemIndex = inventoryData.inventory.findIndex(i => i.id === req.params.id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = inventoryData.inventory[itemIndex];

    // Check stock availability for outbound transactions
    if (type === 'out' && item.stock.available < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update stock
    if (type === 'in') {
      item.stock.available += quantity;
    } else {
      item.stock.available -= quantity;
    }

    // Create transaction record
    const transaction = {
      id: `TXN${Date.now()}`,
      itemId: req.params.id,
      type,
      quantity,
      reference,
      notes,
      balanceAfter: item.stock.available,
      createdAt: new Date().toISOString(),
      createdBy: req.user?.id || 'USR001'
    };

    if (!inventoryData.transactions) {
      inventoryData.transactions = [];
    }
    inventoryData.transactions.unshift(transaction);

    item.updatedAt = new Date().toISOString();
    await saveInventory(inventoryData);

    res.json({
      success: true,
      message: 'Transaction recorded successfully',
      data: {
        transaction,
        item: item
      }
    });

  } catch (error) {
    console.error('Error processing transaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/inventory/transactions
// @desc    Get inventory transactions
// @access  Private
router.get('/transactions/history', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const { itemId, type, limit = 50, page = 1 } = req.query;

    let transactions = inventoryData.transactions || [];

    // Filter by item ID
    if (itemId) {
      transactions = transactions.filter(t => t.itemId === itemId);
    }

    // Filter by type
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

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
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/inventory/stats/overview
// @desc    Get inventory statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const items = inventoryData.inventory || [];

    const stats = {
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => sum + (item.stock.available * (item.pricing?.averagePrice || 0)), 0),
      lowStockItems: items.filter(item => item.stock.available <= item.stock.minimum).length,
      outOfStockItems: items.filter(item => item.stock.available === 0).length,
      categories: [...new Set(items.map(item => item.category))].length,
      recentTransactions: (inventoryData.transactions || []).slice(0, 10)
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/inventory/categories
// @desc    Get inventory categories
// @access  Private
router.get('/categories/list', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const items = inventoryData.inventory || [];

    const categories = [...new Set(items.map(item => item.category))].map(category => ({
      name: category,
      count: items.filter(item => item.category === category).length
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

// @route   GET /api/inventory/categories
// @desc    Get all inventory categories with statistics
// @access  Private
router.get('/categories', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const items = inventoryData.inventory || [];

    // Calculate category statistics
    const categoryStats = items.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = {
          name: category,
          itemCount: 0,
          totalValue: 0,
          lowStockCount: 0,
          status: 'active'
        };
      }
      
      acc[category].itemCount += 1;
      acc[category].totalValue += (item.quantity || 0) * (item.price || 0);
      
      if ((item.quantity || 0) <= (item.minStock || 10)) {
        acc[category].lowStockCount += 1;
      }
      
      return acc;
    }, {});

    // Convert to array and add IDs
    const categories = Object.values(categoryStats).map((category, index) => ({
      id: index + 1,
      ...category,
      description: `Kategori ${category.name.toLowerCase()}`,
      lastUpdated: new Date().toISOString()
    }));

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
});

// @route   POST /api/inventory/categories
// @desc    Create a new category
// @access  Private
router.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }

    const inventoryData = await loadInventory();
    
    // Initialize categories array if it doesn't exist
    if (!inventoryData.categories) {
      inventoryData.categories = [];
    }

    // Check if category already exists
    const existingCategory = inventoryData.categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists'
      });
    }

    // Create new category
    const newCategory = {
      id: Date.now(),
      name,
      description: description || `Kategori ${name.toLowerCase()}`,
      status: 'active',
      itemCount: 0,
      totalValue: 0,
      lowStockCount: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    inventoryData.categories.push(newCategory);
    await saveInventory(inventoryData);

    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    });

  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// @route   PUT /api/inventory/categories/:id
// @desc    Update a category
// @access  Private
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const inventoryData = await loadInventory();
    
    if (!inventoryData.categories) {
      inventoryData.categories = [];
    }

    const categoryIndex = inventoryData.categories.findIndex(cat => cat.id === parseInt(id));

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Update category
    inventoryData.categories[categoryIndex] = {
      ...inventoryData.categories[categoryIndex],
      name: name || inventoryData.categories[categoryIndex].name,
      description: description || inventoryData.categories[categoryIndex].description,
      status: status || inventoryData.categories[categoryIndex].status,
      lastUpdated: new Date().toISOString()
    };

    await saveInventory(inventoryData);

    res.json({
      success: true,
      data: inventoryData.categories[categoryIndex],
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

// @route   DELETE /api/inventory/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryData = await loadInventory();
    
    if (!inventoryData.categories) {
      inventoryData.categories = [];
    }

    const categoryIndex = inventoryData.categories.findIndex(cat => cat.id === parseInt(id));

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category is being used by inventory items
    const categoryName = inventoryData.categories[categoryIndex].name;
    const itemsUsingCategory = inventoryData.inventory.filter(item => 
      item.category === categoryName
    );

    if (itemsUsingCategory.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category that is being used by inventory items',
        itemCount: itemsUsingCategory.length
      });
    }

    // Remove category
    inventoryData.categories.splice(categoryIndex, 1);
    await saveInventory(inventoryData);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

module.exports = router;
