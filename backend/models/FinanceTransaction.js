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
    values: ['draft', 'pending', 'approved', 'posted', 'completed', 'cancelled', 'failed', 'voided', 'reversed'],
    allowNull: false,
    defaultValue: 'draft',
    comment: 'Transaction lifecycle: draft -> pending -> approved -> posted. Use voided/reversed for corrections.'
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
  // Reversal tracking fields
  isReversed: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'is_reversed',
    comment: 'True if this transaction has been reversed'
  },
  reversedByTransactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reversed_by_transaction_id',
    comment: 'ID of the transaction that reversed this one'
  },
  reversalOfTransactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reversal_of_transaction_id',
    comment: 'ID of the original transaction if this is a reversal'
  },
  
  // Void tracking fields
  voidDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'void_date',
    comment: 'When this transaction was voided'
  },
  voidBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'void_by',
    comment: 'User who voided this transaction'
  },
  voidReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'void_reason',
    comment: 'Why this transaction was voided (required for audit)'
  },
  
  // Submission workflow fields
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'submitted_at',
    comment: 'When submitted for approval'
  },
  submittedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'submitted_by',
    comment: 'Who submitted for approval'
  },
  
  // Approval workflow fields
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'approved_by',
    comment: 'Who approved this transaction'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
    comment: 'When this transaction was approved'
  },
  approvalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'approval_notes',
    comment: 'Notes from approver'
  },
  
  // Rejection tracking
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'rejected_at',
    comment: 'When this transaction was rejected'
  },
  rejectedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'rejected_by',
    comment: 'Who rejected this transaction'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason',
    comment: 'Why this transaction was rejected'
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

FinanceTransaction.prototype.canEdit = function() {
  return ['draft', 'pending'].includes(this.status);
};

FinanceTransaction.prototype.canDelete = function() {
  return ['draft', 'pending'].includes(this.status);
};

FinanceTransaction.prototype.canVoid = function() {
  return ['approved', 'posted', 'completed'].includes(this.status) && !this.isReversed;
};

FinanceTransaction.prototype.canReverse = function() {
  return this.status === 'posted' && !this.isReversed;
};

FinanceTransaction.prototype.isPosted = function() {
  return ['posted', 'completed'].includes(this.status);
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
