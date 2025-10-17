const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChartOfAccounts = sequelize.define('ChartOfAccounts', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  accountCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'account_code',
    comment: 'Standard 4-level account code (e.g., 1101.01)'
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'account_name'
  },
  accountType: {
    type: DataTypes.ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'),
    allowNull: false,
    field: 'account_type'
  },
  accountSubType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'account_sub_type',
    comment: 'Current Asset, Fixed Asset, Current Liability, etc.'
  },
  parentAccountId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'parent_account_id',
    references: {
      model: 'chart_of_accounts',
      key: 'id'
    }
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '1=Main, 2=Sub, 3=Detail, 4=Sub-detail'
  },
  normalBalance: {
    type: DataTypes.ENUM('DEBIT', 'CREDIT'),
    allowNull: false,
    field: 'normal_balance'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  isControlAccount: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_control_account',
    comment: 'True if this account has sub-accounts'
  },
  constructionSpecific: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'construction_specific',
    comment: 'True for construction industry specific accounts'
  },
  taxDeductible: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'tax_deductible',
    comment: 'For expense accounts - tax deductibility'
  },
  vatApplicable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'vat_applicable',
    comment: 'True if VAT applies to this account'
  },
  projectCostCenter: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'project_cost_center',
    comment: 'True if this account can be allocated to projects'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  currentBalance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    field: 'current_balance',
    comment: 'Current account balance (for ASSET and LIABILITY accounts)'
  },
  subsidiaryId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'subsidiary_id',
    references: {
      model: 'subsidiaries',
      key: 'id'
    },
    comment: 'Reference to subsidiary for multi-entity accounting'
  }
}, {
  tableName: 'chart_of_accounts',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['account_code'],
      unique: true
    },
    {
      fields: ['account_type']
    },
    {
      fields: ['level']
    },
    {
      fields: ['parent_account_id']
    },
    {
      fields: ['is_active']
    }
  ]
});

// Model associations
ChartOfAccounts.hasMany(ChartOfAccounts, {
  as: 'SubAccounts',
  foreignKey: 'parentAccountId'
});

ChartOfAccounts.belongsTo(ChartOfAccounts, {
  as: 'ParentAccount',
  foreignKey: 'parentAccountId'
});

// Association with Subsidiary for multi-entity accounting
ChartOfAccounts.associate = (models) => {
  if (models.Subsidiary) {
    ChartOfAccounts.belongsTo(models.Subsidiary, {
      as: 'Subsidiary',
      foreignKey: 'subsidiaryId'
    });
  }
};

module.exports = ChartOfAccounts;
