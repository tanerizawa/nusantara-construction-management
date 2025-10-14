const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FinanceTransaction = sequelize.define('FinanceTransaction', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM,
    values: ['income', 'expense', 'transfer'],
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'project_id'
  },
  accountFrom: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'account_from',
    comment: 'COA Account ID for expense/transfer source'
  },
  accountTo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'account_to',
    comment: 'COA Account ID for income/transfer destination'
  },
  paymentMethod: {
    type: DataTypes.ENUM,
    values: ['cash', 'bank_transfer', 'check', 'credit_card', 'debit_card', 'other'],
    allowNull: true,  // Changed to true - now optional, legacy field
    field: 'payment_method',
    defaultValue: null
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reference_number'
  },
  purchaseOrderId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'purchase_order_id',
    comment: 'References PurchaseOrder.id for PO-related transactions'
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'completed', 'cancelled', 'failed'],
    allowNull: false,
    defaultValue: 'completed'
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    field: 'is_recurring',
    defaultValue: false
  },
  recurringPattern: {
    type: DataTypes.JSONB,
    field: 'recurring_pattern',
    allowNull: true,
    defaultValue: null
  },
  attachments: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  taxInfo: {
    type: DataTypes.JSONB,
    field: 'tax_info',
    allowNull: true,
    defaultValue: {}
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'approved_by'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at'
  }
}, {
  tableName: 'finance_transactions',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['date']
    },
    {
      fields: ['project_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['payment_method']
    }
  ]
});

// Instance methods
FinanceTransaction.prototype.getFormattedAmount = function() {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(this.amount);
};

FinanceTransaction.prototype.isExpense = function() {
  return this.type === 'expense';
};

FinanceTransaction.prototype.isIncome = function() {
  return this.type === 'income';
};

// Class methods
FinanceTransaction.getTotalByType = async function(type, startDate, endDate) {
  const whereClause = { type };
  if (startDate && endDate) {
    whereClause.date = {
      [sequelize.Sequelize.Op.between]: [startDate, endDate]
    };
  }
  
  const result = await this.sum('amount', { where: whereClause });
  return result || 0;
};

FinanceTransaction.getBalanceForPeriod = async function(startDate, endDate) {
  const income = await this.getTotalByType('income', startDate, endDate);
  const expense = await this.getTotalByType('expense', startDate, endDate);
  return income - expense;
};

module.exports = FinanceTransaction;
