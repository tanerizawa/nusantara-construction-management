const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * RealizationDocument Model
 * Manages documents attached to realization entries (invoices, receipts, photos, etc.)
 */
const RealizationDocument = sequelize.define('RealizationDocument', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  realizationId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'realization_id',
    references: {
      model: 'rab_realizations',
      key: 'id'
    }
  },
  
  // File Details
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'file_name'
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'file_path'
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'file_type'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'file_size'
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'mime_type'
  },
  
  // Document Classification
  documentType: {
    type: DataTypes.ENUM('invoice', 'receipt', 'photo', 'contract', 'delivery_note', 'other'),
    defaultValue: 'other',
    allowNull: false,
    field: 'document_type'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Metadata
  uploadedBy: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'uploaded_by'
  },
  uploadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'uploaded_at'
  },
  
  // Soft Delete
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'realization_documents',
  timestamps: true,
  underscored: true,
  paranoid: true, // Enable soft delete
  createdAt: 'uploaded_at',
  updatedAt: false // Disable updatedAt karena tidak ada di database
});

module.exports = RealizationDocument;
