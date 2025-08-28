const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
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
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'client_name'
  },
  clientContact: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'client_contact',
    defaultValue: {}
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  actualCost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'actual_cost',
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
    allowNull: false,
    defaultValue: 'planning'
  },
  priority: {
    type: DataTypes.ENUM,
    values: ['low', 'medium', 'high', 'urgent'],
    allowNull: false,
    defaultValue: 'medium'
  },
  progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'end_date'
  },
  estimatedDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'estimated_duration',
    comment: 'Duration in days'
  },
  projectManagerId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'project_manager_id'
  },
  team: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  milestones: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
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
  tags: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'projects',
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['project_manager_id']
    },
    {
      fields: ['start_date']
    },
    {
      fields: ['end_date']
    }
  ]
});

// Instance methods
Project.prototype.calculateProgress = function() {
  if (this.milestones && this.milestones.length > 0) {
    const completedMilestones = this.milestones.filter(m => m.status === 'completed');
    return Math.round((completedMilestones.length / this.milestones.length) * 100);
  }
  return this.progress;
};

Project.prototype.isOverBudget = function() {
  return this.budget && this.actualCost > this.budget;
};

Project.prototype.getDaysRemaining = function() {
  if (!this.endDate) return null;
  const today = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = Project;
