const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JournalEntryLine = sequelize.define('JournalEntryLine', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  journalEntryId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'journal_entry_id',
    references: {
      model: 'journal_entries',
      key: 'id'
    }
  },
  accountId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'account_id'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  debitAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'debit_amount'
  },
  creditAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'credit_amount'
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'project_id'
  },
  costCenterId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'cost_center_id'
  },
  lineNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'line_number'
  }
}, {
  tableName: 'journal_entry_lines',
  timestamps: true,
  indexes: [
    {
      fields: ['journal_entry_id']
    },
    {
      fields: ['account_id']
    },
    {
      fields: ['project_id']
    }
  ]
});

module.exports = JournalEntryLine;
