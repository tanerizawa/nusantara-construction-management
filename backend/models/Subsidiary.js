const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Subsidiary Company Model
 * Represents child companies within Nusantara Group
 */
const Subsidiary = sequelize.define('Subsidiary', {
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
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 10]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialization: {
    type: DataTypes.ENUM(
      'residential', 
      'commercial', 
      'industrial', 
      'infrastructure', 
      'renovation',
      'interior',
      'landscaping',
      'general'
    ),
    allowNull: false,
    defaultValue: 'general'
  },
  contactInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'contact_info',
    defaultValue: {}
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  establishedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'established_year',
    validate: {
      min: 1900,
      max: new Date().getFullYear()
    }
  },
  employeeCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'employee_count',
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  certification: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  parentCompany: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'parent_company',
    defaultValue: 'Nusantara Group'
  },
  
  // Board of Directors Data
  boardOfDirectors: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'board_of_directors',
    defaultValue: []
  },
  
  // Legal Documents and Information
  legalInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'legal_info',
    defaultValue: {
      companyRegistrationNumber: null,
      taxIdentificationNumber: null,
      businessLicenseNumber: null,
      articlesOfIncorporation: null,
      vatRegistrationNumber: null
    }
  },
  
  // Permits and Licenses
  permits: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  
  // Financial Information
  financialInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'financial_info',
    defaultValue: {
      authorizedCapital: null,
      paidUpCapital: null,
      currency: 'IDR',
      fiscalYearEnd: null
    }
  },
  
  // Document Attachments
  attachments: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  
  // Company Profile Additional Info
  profileInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'profile_info',
    defaultValue: {
      website: null,
      socialMedia: {},
      companySize: null,
      industryClassification: null,
      businessDescription: null
    }
  }
}, {
  tableName: 'subsidiaries',
  timestamps: true,
  underscored: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      fields: ['code']
    },
    {
      fields: ['specialization']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Subsidiary;
