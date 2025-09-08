const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TaxRecord = sequelize.define('TaxRecord', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('pajak_penghasilan', 'ppn', 'pph21', 'pph23', 'pph4_ayat2', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Format: YYYY-MM'
  },
  baseAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'base_amount'
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'tax_rate',
    comment: 'Tax rate in percentage'
  },
  taxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'tax_amount'
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_paid'
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'paid_date'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'due_date'
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'payment_reference'
  },
  documents: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'calculated', 'filed', 'paid', 'overdue'),
    allowNull: false,
    defaultValue: 'draft'
  },
  filingReference: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'filing_reference'
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
  }
}, {
  tableName: 'tax_records',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['period']
    },
    {
      fields: ['status']
    },
    {
      fields: ['due_date']
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
TaxRecord.prototype.calculateTaxAmount = function() {
  return (this.baseAmount * this.taxRate) / 100;
};

TaxRecord.prototype.isOverdue = function() {
  if (!this.dueDate || this.isPaid) return false;
  return new Date() > new Date(this.dueDate);
};

TaxRecord.prototype.getDaysUntilDue = function() {
  if (!this.dueDate || this.isPaid) return null;
  const today = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = TaxRecord;
