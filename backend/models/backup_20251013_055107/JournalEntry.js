const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JournalEntry = sequelize.define('JournalEntry', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  entryNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'entry_number',
    comment: 'Auto-generated journal entry number'
  },
  entryDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'entry_date'
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Reference to source document'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  totalDebit: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_debit'
  },
  totalCredit: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_credit'
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'POSTED', 'REVERSED'),
    allowNull: false,
    defaultValue: 'DRAFT'
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'project_id'
  },
  subsidiaryId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'subsidiary_id'
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'created_by'
  },
  postedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'posted_by'
  },
  postedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'posted_at'
  },
  reversed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reversalEntryId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reversal_entry_id'
  }
}, {
  tableName: 'journal_entries',
  timestamps: true,
  indexes: [
    {
      fields: ['entry_number'],
      unique: true
    },
    {
      fields: ['entry_date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['project_id']
    },
    {
      fields: ['subsidiary_id']
    }
  ]
});

module.exports = JournalEntry;
