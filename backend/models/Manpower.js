const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Manpower = sequelize.define('Manpower', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false
  },
  employeeId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'employee_id'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  position: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  department: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  joinDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'join_date'
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'birth_date'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'active'
  },
  employmentType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'employment_type'
  },
  salary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  currentProject: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'current_project'
  },
  subsidiaryId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'subsidiary_id',
    references: {
      model: 'subsidiaries',
      key: 'id'
    }
  },
  // Optional link to user account
  // NULL if employee does not need system access (e.g., field worker, laborer)
  userId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  skills: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'manpower',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: false
});

// Model methods
Manpower.prototype.toJSON = function() {
  const values = { ...this.get() };
  
  // Parse JSON fields if they're strings
  if (typeof values.skills === 'string') {
    try {
      values.skills = JSON.parse(values.skills);
    } catch (e) {
      values.skills = [];
    }
  }
  
  if (typeof values.metadata === 'string') {
    try {
      values.metadata = JSON.parse(values.metadata);
    } catch (e) {
      values.metadata = {};
    }
  }
  
  return values;
};

// Static methods
Manpower.findByStatus = function(status) {
  return this.findAll({
    where: { status },
    order: [['name', 'ASC']]
  });
};

Manpower.findByDepartment = function(department) {
  return this.findAll({
    where: { department },
    order: [['name', 'ASC']]
  });
};

Manpower.findActiveEmployees = function() {
  return this.findAll({
    where: { status: 'active' },
    order: [['name', 'ASC']]
  });
};

Manpower.getByProject = function(projectId) {
  return this.findAll({
    where: { currentProject: projectId },
    order: [['name', 'ASC']]
  });
};

// Check if employee has user account
Manpower.prototype.hasUserAccount = function() {
  return !!this.userId;
};

// Get employee data with user account info
Manpower.prototype.getWithUserAccount = async function() {
  if (!this.userId) {
    return this.toJSON();
  }
  
  const User = require('./User');
  const user = await User.findByPk(this.userId, {
    attributes: { exclude: ['password'] }  // Don't expose password
  });
  
  return {
    ...this.toJSON(),
    userAccount: user ? user.toSafeObject() : null
  };
};

// Association method (will be called in models/index.js)
Manpower.associate = function(models) {
  Manpower.hasOne(models.User, {
    foreignKey: 'employeeId',
    as: 'userAccount'
  });
  
  // Keep existing association
  Manpower.belongsTo(models.Subsidiary, {
    foreignKey: 'subsidiaryId',
    as: 'subsidiary'
  });
};

module.exports = Manpower;
