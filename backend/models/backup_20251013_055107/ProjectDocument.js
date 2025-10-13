const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProjectDocument = sequelize.define('ProjectDocument', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('contract', 'specification', 'drawing', 'report', 'photo', 'other'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  version: {
    type: DataTypes.STRING,
    defaultValue: '1.0'
  },
  status: {
    type: DataTypes.ENUM('draft', 'review', 'approved', 'archived'),
    defaultValue: 'draft'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  uploadedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  accessLevel: {
    type: DataTypes.ENUM('public', 'team', 'restricted'),
    defaultValue: 'team'
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastAccessed: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'project_documents',
  timestamps: true
});

module.exports = ProjectDocument;
