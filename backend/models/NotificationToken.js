const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationToken = sequelize.define('NotificationToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_id'
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  device_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'web',
    field: 'device_type'
  },
  browser_info: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    field: 'browser_info'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  last_used_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_used_at'
  }
}, {
  tableName: 'notification_tokens',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
NotificationToken.associate = (models) => {
  NotificationToken.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

// Instance methods
NotificationToken.prototype.markAsUsed = async function() {
  this.last_used_at = new Date();
  await this.save();
};

NotificationToken.prototype.deactivate = async function() {
  this.is_active = false;
  await this.save();
};

// Class methods
NotificationToken.findActiveByUser = async function(userId) {
  return await this.findAll({
    where: {
      user_id: userId,
      is_active: true
    },
    order: [['last_used_at', 'DESC']]
  });
};

NotificationToken.findByToken = async function(token) {
  return await this.findOne({
    where: { token }
  });
};

NotificationToken.deactivateOldTokens = async function(userId, currentToken) {
  // Deactivate tokens older than 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  await this.update(
    { is_active: false },
    {
      where: {
        user_id: userId,
        token: { [sequelize.Sequelize.Op.ne]: currentToken },
        updated_at: { [sequelize.Sequelize.Op.lt]: ninetyDaysAgo }
      }
    }
  );
};

module.exports = NotificationToken;
