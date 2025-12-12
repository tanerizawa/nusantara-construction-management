const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * RABRealization Model
 * Tracks actual spending/realization for each RAB item
 * Supports multiple realizations per RAB item (progressive/staged purchases)
 */
const RABRealization = sequelize.define('RABRealization', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  projectId: {
    type: DataTypes.STRING(255), // Match projects.id type
    allowNull: false,
    field: 'project_id',
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  rabItemId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'rab_item_id',
    references: {
      model: 'project_rab',
      key: 'id'
    }
  },
  
  // Transaction Details
  transactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'transaction_date'
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  unitPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'unit_price'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_amount'
  },
  
  // Vendor & Payment Info
  vendorName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'vendor_name'
  },
  invoiceNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'invoice_number'
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'payment_method'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Variance Tracking
  budgetUnitPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'budget_unit_price'
  },
  varianceAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'variance_amount'
  },
  variancePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'variance_percentage'
  },
  
  // Status & Approval
  status: {
    type: DataTypes.ENUM('draft', 'pending_review', 'approved', 'rejected'),
    defaultValue: 'draft',
    allowNull: false
  },
  approvedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'approved_by'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason'
  },
  
  // Audit Trail
  createdBy: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'created_by'
  },
  updatedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'updated_by'
  },
  
  // Soft Delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'rab_realizations',
  timestamps: true,
  underscored: true,
  paranoid: true, // Enable soft delete
  hooks: {
    beforeSave: (instance) => {
      // Auto-calculate total amount
      if (instance.quantity && instance.unitPrice) {
        instance.totalAmount = parseFloat(instance.quantity) * parseFloat(instance.unitPrice);
      }
      
      // Auto-calculate variance if budgetUnitPrice exists
      if (instance.budgetUnitPrice && instance.unitPrice && instance.quantity) {
        const budgetTotal = parseFloat(instance.budgetUnitPrice) * parseFloat(instance.quantity);
        const actualTotal = parseFloat(instance.unitPrice) * parseFloat(instance.quantity);
        instance.varianceAmount = actualTotal - budgetTotal;
        instance.variancePercentage = budgetTotal > 0 
          ? ((instance.varianceAmount / budgetTotal) * 100).toFixed(2)
          : 0;
      }
    }
  }
});

module.exports = RABRealization;
