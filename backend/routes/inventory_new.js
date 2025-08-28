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
    return { inventory: [], transactions: [], suppliers: [], categories: [] };
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
      items = items.filter(item => (item.quantity || 0) <= (item.minStock || 10));
    }

    // Search functionality
    const searchTerm = search || q;
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      items = items.filter(item => 
        (item.name || '').toLowerCase().includes(lowerSearchTerm) ||
        (item.category || '').toLowerCase().includes(lowerSearchTerm) ||
        (item.description || '').toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Sorting
    items.sort((a, b) => {
      let aValue = a[sort] || '';
      let bValue = b[sort] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedItems = items.slice(startIndex, endIndex);

    res.json(paginatedItems);

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

    res.json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
