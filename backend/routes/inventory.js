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

// @route   GET /api/inventory/items
// @desc    Get all inventory items with filtering and pagination
// @access  Private
router.get('/items', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    let items = inventoryData.inventory || [];

    // Extract query parameters
    const { 
      q: searchTerm, 
      category, 
      warehouse, 
      status, 
      sort = 'name', 
      order = 'asc',
      limit = 50,
      page = 1 
    } = req.query;

    // Apply filters
    if (searchTerm) {
      const needle = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.name?.toLowerCase().includes(needle) ||
        item.itemCode?.toLowerCase().includes(needle) ||
        item.category?.toLowerCase().includes(needle) ||
        item.brand?.toLowerCase().includes(needle)
      );
    }

    if (category) {
      items = items.filter(item => item.category === category);
    }

    if (warehouse) {
      items = items.filter(item => 
        (item.location?.warehouse || item.warehouse) === warehouse
      );
    }

    if (status) {
      items = items.filter(item => {
        const stock = item.stock?.available || item.quantity || 0;
        const minStock = item.stock?.minimum || item.minStock || 10;
        
        if (status === 'out-of-stock') return stock === 0;
        if (status === 'low-stock') return stock <= minStock && stock > 0;
        if (status === 'in-stock') return stock > minStock;
        return true;
      });
    }

    // Apply sorting
    items.sort((a, b) => {
      let aVal = a[sort];
      let bVal = b[sort];
      
      // Handle nested properties
      if (sort === 'stock') {
        aVal = a.stock?.available || a.quantity || 0;
        bVal = b.stock?.available || b.quantity || 0;
      } else if (sort === 'price') {
        aVal = a.pricing?.lastPurchasePrice || a.price || 0;
        bVal = b.pricing?.lastPurchasePrice || b.price || 0;
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedItems = items.slice(startIndex, endIndex);

    res.json({
      data: paginatedItems,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(items.length / parseInt(limit)),
        count: items.length,
        perPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/inventory/items
// @desc    Create new inventory item
// @access  Private
router.post('/items', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    
    // Generate ID
    const newId = `INV${String(inventoryData.inventory.length + 1).padStart(3, '0')}`;
    
    const newItem = {
      id: newId,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inventoryData.inventory.push(newItem);
    await saveInventory(inventoryData);

    res.status(201).json({ 
      message: 'Item created successfully', 
      data: newItem 
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/inventory/items/:id
// @desc    Update inventory item
// @access  Private
router.put('/items/:id', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const itemIndex = inventoryData.inventory.findIndex(item => item.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    inventoryData.inventory[itemIndex] = {
      ...inventoryData.inventory[itemIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveInventory(inventoryData);

    res.json({ 
      message: 'Item updated successfully', 
      data: inventoryData.inventory[itemIndex] 
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/inventory/items/:id
// @desc    Delete inventory item
// @access  Private
router.delete('/items/:id', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const itemIndex = inventoryData.inventory.findIndex(item => item.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    inventoryData.inventory.splice(itemIndex, 1);
    await saveInventory(inventoryData);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/inventory/warehouses  
// @desc    Get all warehouses
// @access  Private
router.get('/warehouses', async (req, res) => {
  try {
    const inventoryData = await loadInventory();
    const items = inventoryData.inventory || [];
    
    // Extract unique warehouses
    const warehouses = [...new Set(items.map(item => 
      item.location?.warehouse || item.warehouse
    ).filter(Boolean))].map((name, index) => ({
      id: index + 1,
      name,
      label: name,
      itemCount: items.filter(item => 
        (item.location?.warehouse || item.warehouse) === name
      ).length
    }));

    res.json({ data: warehouses });
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/inventory/import
// @desc    Import inventory from CSV
// @access  Private  
router.post('/import', async (req, res) => {
  try {
    // Mock import functionality
    // In a real implementation, you would parse the CSV file
    const result = {
      success: true,
      message: 'Import completed successfully',
      imported: 10,
      errors: []
    };

    res.json(result);
  } catch (error) {
    console.error('Error importing inventory:', error);
    res.status(500).json({ 
      success: false,
      message: 'Import failed: ' + error.message,
      imported: 0,
      errors: [error.message]
    });
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
