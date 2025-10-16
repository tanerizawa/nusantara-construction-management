const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WorkOrder = sequelize.define('WorkOrder', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  woNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'wo_number'
  },
  contractorId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'contractor_id'
  },
  contractorName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contractor_name'
  },
  contractorContact: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contractor_contact'
  },
  contractorAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'contractor_address'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date'
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
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
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'updated_by',
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
  },
  approvalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'approval_notes'
  },
  rejectedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'rejected_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'rejected_at'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason'
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  },
  deletedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'deleted_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'work_orders',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['wo_number'],
      unique: true
    },
    {
      fields: ['contractor_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['start_date']
    },
    {
      fields: ['end_date']
    },
    {
      fields: ['project_id']
    },
    {
      fields: ['created_by']
    },
    {
      fields: ['deleted']
    }
  ]
});

// Instance methods
WorkOrder.prototype.getTotalItems = function() {
  return this.items ? this.items.length : 0;
};

WorkOrder.prototype.getTotalQuantity = function() {
  if (!this.items) return 0;
  return this.items.reduce((total, item) => total + (item.quantity || 0), 0);
};

WorkOrder.prototype.canBeApproved = function() {
  return this.status === 'pending';
};

WorkOrder.prototype.canBeCancelled = function() {
  return ['draft', 'pending', 'approved', 'in_progress'].includes(this.status);
};

WorkOrder.prototype.isActive = function() {
  return ['approved', 'in_progress'].includes(this.status);
};

WorkOrder.prototype.isCompleted = function() {
  return this.status === 'completed';
};

module.exports = WorkOrder;
