const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Entity = sequelize.define('Entity', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  entityCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    field: 'entity_code'
  },
  entityName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'entity_name'
  },
  entityType: {
    type: DataTypes.ENUM('subsidiary', 'branch', 'project', 'division'),
    allowNull: false,
    field: 'entity_type'
  },
  parentEntityId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'parent_entity_id',
    references: {
      model: 'entities',
      key: 'id'
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'entities',
  timestamps: true,
  indexes: [
    {
      fields: ['entity_code']
    },
    {
      fields: ['entity_type']
    },
    {
      fields: ['parent_entity_id']
    },
    {
      fields: ['is_active']
    }
  ]
});

// Model associations
Entity.hasMany(Entity, {
  as: 'SubEntities',
  foreignKey: 'parentEntityId'
});

Entity.belongsTo(Entity, {
  as: 'ParentEntity',
  foreignKey: 'parentEntityId'
});

module.exports = Entity;