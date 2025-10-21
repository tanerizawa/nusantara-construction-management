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
  // Optional link to employee record (manpower table)
  // NULL if user is not an employee (e.g., external consultant, client)
  employeeId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'employee_id',
    references: {
      model: 'manpower',
      key: 'id'
    }
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
  underscored: true,
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

// Check if user has linked employee record
User.prototype.hasEmployeeRecord = function() {
  return !!this.employeeId;
};

// Get full profile including employee data
User.prototype.getFullProfile = async function() {
  if (!this.employeeId) {
    return this.toSafeObject();
  }
  
  const Manpower = require('./Manpower');
  const employee = await Manpower.findByPk(this.employeeId);
  
  return {
    ...this.toSafeObject(),
    employee: employee ? employee.toJSON() : null
  };
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

// Association method (will be called in models/index.js)
User.associate = function(models) {
  User.belongsTo(models.Manpower, {
    foreignKey: 'employeeId',
    as: 'employee'
  });
};

module.exports = User;
