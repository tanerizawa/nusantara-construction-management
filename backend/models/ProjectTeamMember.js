const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectTeamMember = sequelize.define('ProjectTeamMember', {
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
  employeeId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allocation: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Percentage allocation to project (0-100)'
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'completed'),
    defaultValue: 'active'
  },
  contact: {
    type: DataTypes.JSON,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
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
  tableName: 'project_team_members',
  timestamps: true,
  underscored: true,
});

module.exports = ProjectTeamMember;
