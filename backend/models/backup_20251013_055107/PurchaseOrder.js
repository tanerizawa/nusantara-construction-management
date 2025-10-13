const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  poNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'po_number'
  },
  supplierId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'supplier_id'
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'supplier_name'
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'order_date'
  },
  expectedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expected_delivery_date'
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'received', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'tax_amount'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_amount'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'delivery_address'
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'project_id',
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'approved_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at'
  }
}, {
  tableName: 'purchase_orders',
  timestamps: true,
  indexes: [
    {
      fields: ['po_number'],
      unique: true
    },
    {
      fields: ['supplier_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['order_date']
    },
    {
      fields: ['project_id']
    },
    {
      fields: ['created_by']
    }
  ]
});

// Instance methods
PurchaseOrder.prototype.getTotalItems = function() {
  return this.items ? this.items.length : 0;
};

PurchaseOrder.prototype.getTotalQuantity = function() {
  if (!this.items) return 0;
  return this.items.reduce((total, item) => total + (item.quantity || 0), 0);
};

PurchaseOrder.prototype.canBeApproved = function() {
  return this.status === 'pending';
};

PurchaseOrder.prototype.canBeCancelled = function() {
  return ['draft', 'pending', 'approved'].includes(this.status);
};

module.exports = PurchaseOrder;
