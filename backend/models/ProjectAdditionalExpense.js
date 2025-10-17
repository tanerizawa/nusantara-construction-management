/**
 * ProjectAdditionalExpense Model
 * 
 * Represents additional expenses outside RAB budget:
 * - Kasbon (advance payments to workers)
 * - Overtime pay
 * - Emergency expenses
 * - Transportation, accommodation, meals
 * - Equipment rental (unplanned)
 * - Repairs and other miscellaneous costs
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectAdditionalExpense = sequelize.define('ProjectAdditionalExpense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  projectId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'project_id'
  },
  
  // Expense Details
  expenseType: {
    type: DataTypes.ENUM(
      'kasbon',
      'overtime',
      'emergency',
      'transportation',
      'accommodation',
      'meals',
      'equipment_rental',
      'repair',
      'miscellaneous',
      'other'
    ),
    allowNull: false,
    defaultValue: 'other',
    field: 'expense_type'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    get() {
      const value = this.getDataValue('amount');
      return value ? parseFloat(value) : 0;
    }
  },
  
  // Related Information
  relatedMilestoneId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'related_milestone_id'
  },
  relatedRabItemId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'related_rab_item_id'
  },
  recipientName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'recipient_name'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'transfer', 'check', 'giro', 'other'),
    allowNull: true,
    defaultValue: 'cash',
    field: 'payment_method'
  },
  
  // Documentation
  receiptUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'receipt_url'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Approval
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
  approvalStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'approval_status'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason'
  },
  
  // Timestamps
  expenseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'expense_date'
  },
  createdBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'created_by'
  },
  updatedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'updated_by'
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'project_additional_expenses',
  timestamps: true,
  underscored: true,
  paranoid: true, // Enable soft deletes
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  
  // Indexes
  indexes: [
    { fields: ['project_id'] },
    { fields: ['expense_type'] },
    { fields: ['expense_date'] },
    { fields: ['approval_status'] },
    { fields: ['created_by'] }
  ],
  
  // Scopes
  scopes: {
    approved: {
      where: {
        approvalStatus: 'approved'
      }
    },
    pending: {
      where: {
        approvalStatus: 'pending'
      }
    },
    byProject: (projectId) => ({
      where: {
        projectId
      }
    }),
    byType: (expenseType) => ({
      where: {
        expenseType
      }
    }),
    byDateRange: (startDate, endDate) => ({
      where: {
        expenseDate: {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        }
      }
    })
  }
});

// Instance methods
ProjectAdditionalExpense.prototype.approve = async function(approvedBy) {
  this.approvalStatus = 'approved';
  this.approvedBy = approvedBy;
  this.approvedAt = new Date();
  this.rejectionReason = null;
  return await this.save();
};

ProjectAdditionalExpense.prototype.reject = async function(rejectedBy, reason) {
  this.approvalStatus = 'rejected';
  this.approvedBy = null;
  this.approvedAt = null;
  this.rejectionReason = reason;
  this.updatedBy = rejectedBy;
  return await this.save();
};

ProjectAdditionalExpense.prototype.cancel = async function(cancelledBy, reason) {
  this.approvalStatus = 'cancelled';
  this.rejectionReason = reason;
  this.updatedBy = cancelledBy;
  return await this.save();
};

// Class methods
ProjectAdditionalExpense.getTotalByProject = async function(projectId, approvalStatus = 'approved') {
  const result = await this.findAll({
    where: {
      projectId,
      approvalStatus
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('amount')), 'total']
    ],
    raw: true
  });
  return parseFloat(result[0]?.total || 0);
};

ProjectAdditionalExpense.getByTypeBreakdown = async function(projectId, approvalStatus = 'approved') {
  const results = await this.findAll({
    where: {
      projectId,
      approvalStatus
    },
    attributes: [
      'expense_type',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('amount')), 'total']
    ],
    group: ['expense_type'],
    raw: true
  });
  
  return results.map(r => ({
    expenseType: r.expense_type,
    count: parseInt(r.count),
    total: parseFloat(r.total)
  }));
};

module.exports = ProjectAdditionalExpense;
