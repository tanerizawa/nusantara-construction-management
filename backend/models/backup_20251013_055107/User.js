const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM,
    values: ['admin', 'project_manager', 'finance_manager', 'inventory_manager', 'hr_manager', 'supervisor'],
    allowNull: false,
    defaultValue: 'supervisor'
  },
  // Profile information stored as JSONB for flexibility
  profile: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  // Permissions array stored as JSONB
  permissions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['role']
    },
    {
      fields: ['isActive']
    }
  ]
});

// Instance methods
User.prototype.toSafeObject = function() {
  const { password, loginAttempts, lockUntil, ...safeUser } = this.toJSON();
  return safeUser;
};

// Class methods
User.findByIdentifier = function(identifier) {
  return this.findOne({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { username: identifier },
        { email: identifier }
      ]
    }
  });
};

module.exports = User;
