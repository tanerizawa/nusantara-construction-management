const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectRAB = sequelize.define('ProjectRAB', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  unitPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  totalPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'under_review', 'approved', 'rejected'),
    defaultValue: 'draft'
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'project_rab',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeSave: (instance) => {
      // Auto-calculate total price
      instance.totalPrice = instance.quantity * instance.unitPrice;
      
      // Auto-sync isApproved with status for consistency
      if (instance.status === 'approved') {
        instance.isApproved = true;
        if (!instance.approvedAt) {
          instance.approvedAt = new Date();
        }
      } else if (instance.status === 'rejected') {
        instance.isApproved = false;
      }
    }
  }
});

module.exports = ProjectRAB;
