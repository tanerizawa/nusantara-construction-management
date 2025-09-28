const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FixedAsset = sequelize.define('FixedAsset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    asset_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    asset_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    asset_category: {
      type: DataTypes.ENUM(
        'HEAVY_EQUIPMENT',
        'VEHICLES', 
        'BUILDINGS',
        'OFFICE_EQUIPMENT',
        'TOOLS_MACHINERY',
        'COMPUTERS_IT',
        'LAND',
        'INFRASTRUCTURE'
      ),
      allowNull: false
    },
    asset_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    purchase_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    supplier: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    invoice_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    depreciation_method: {
      type: DataTypes.ENUM(
        'STRAIGHT_LINE',
        'DECLINING_BALANCE',
        'DOUBLE_DECLINING',
        'UNITS_OF_PRODUCTION',
        'SUM_OF_YEARS_DIGITS'
      ),
      defaultValue: 'STRAIGHT_LINE'
    },
    useful_life: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    salvage_value: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    responsible_person: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cost_center: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'ACTIVE',
        'UNDER_MAINTENANCE',
        'IDLE',
        'DISPOSED',
        'WRITTEN_OFF',
        'LEASED_OUT'
      ),
      defaultValue: 'ACTIVE'
    },
    condition: {
      type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
      defaultValue: 'GOOD'
    },
    serial_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    model_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    depreciation_start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    accumulated_depreciation: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    book_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    last_maintenance_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    next_maintenance_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    maintenance_cost: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    subsidiary_id: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    tableName: 'fixed_assets',
    timestamps: true,
    indexes: [
      {
        fields: ['asset_code']
      },
      {
        fields: ['asset_category']
      },
      {
        fields: ['status']
      },
      {
        fields: ['purchase_date']
      }
    ]
  });

  return FixedAsset;
};