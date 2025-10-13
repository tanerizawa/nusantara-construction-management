const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InventoryItem = sequelize.define('InventoryItem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pcs'
  },
  currentStock: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'current_stock',
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  minimumStock: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'minimum_stock',
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  maximumStock: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'maximum_stock',
    validate: {
      min: 0
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    field: 'unit_price',
    validate: {
      min: 0
    }
  },
  totalValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'total_value',
    validate: {
      min: 0
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  warehouse: {
    type: DataTypes.STRING,
    allowNull: true
  },
  supplier: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true
  },
  lastStockUpdate: {
    type: DataTypes.DATE,
    field: 'last_stock_update',
    allowNull: true
  },
  specifications: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'inventory_items',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['sku']
    },
    {
      fields: ['warehouse']
    },
    {
      fields: ['is_active']
    }
  ]
});

// Instance methods
InventoryItem.prototype.isLowStock = function() {
  return this.currentStock <= this.minimumStock;
};

InventoryItem.prototype.calculateTotalValue = function() {
  if (this.unitPrice && this.currentStock) {
    return this.currentStock * this.unitPrice;
  }
  return 0;
};

InventoryItem.prototype.updateStock = function(quantity, type = 'add') {
  if (type === 'add') {
    this.currentStock += quantity;
  } else if (type === 'subtract') {
    this.currentStock = Math.max(0, this.currentStock - quantity);
  } else if (type === 'set') {
    this.currentStock = Math.max(0, quantity);
  }
  
  this.lastStockUpdate = new Date();
  this.totalValue = this.calculateTotalValue();
};

module.exports = InventoryItem;
