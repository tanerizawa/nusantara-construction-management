const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DeliveryReceipt = sequelize.define('DeliveryReceipt', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  receiptNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'receipt_number'
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'project_id',
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  purchaseOrderId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'purchase_order_id',
    references: {
      model: 'purchase_orders',
      key: 'id'
    }
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'delivery_date'
  },
  receivedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'received_date',
    defaultValue: DataTypes.NOW
  },
  deliveryLocation: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'delivery_location'
  },
  receivedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'received_by'
  },
  receiverName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'receiver_name'
  },
  receiverPosition: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'receiver_position'
  },
  receiverPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'receiver_phone'
  },
  supplierDeliveryPerson: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'supplier_delivery_person'
  },
  supplierDeliveryPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'supplier_delivery_phone'
  },
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'vehicle_number'
  },
  deliveryMethod: {
    type: DataTypes.ENUM('truck', 'pickup', 'van', 'container', 'other'),
    allowNull: false,
    defaultValue: 'truck',
    field: 'delivery_method'
  },
  status: {
    type: DataTypes.ENUM('pending_delivery', 'partial_delivered', 'fully_delivered', 'received', 'completed', 'rejected'),
    allowNull: false,
    defaultValue: 'pending_delivery'
  },
  receiptType: {
    type: DataTypes.ENUM('full_delivery', 'partial_delivery'),
    allowNull: false,
    defaultValue: 'full_delivery',
    field: 'receipt_type'
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidItems(value) {
        if (!Array.isArray(value)) {
          throw new Error('Items must be an array');
        }
        for (const item of value) {
          if (!item.itemName || !item.orderedQuantity || !item.deliveredQuantity) {
            throw new Error('Each item must have itemName, orderedQuantity, and deliveredQuantity');
          }
        }
      }
    }
  },
  qualityNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'quality_notes'
  },
  conditionNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'condition_notes'
  },
  deliveryNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'delivery_notes'
  },
  photos: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  documents: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  inspectionResult: {
    type: DataTypes.ENUM('passed', 'conditional', 'rejected', 'pending'),
    allowNull: false,
    defaultValue: 'pending',
    field: 'inspection_result'
  },
  inspectedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'inspected_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  inspectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'inspected_at'
  },
  digitalSignature: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'digital_signature'
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'approved_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at'
  },
  rejectedReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejected_reason'
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'delivery_receipts',
  timestamps: true,
  indexes: [
    {
      fields: ['receipt_number'],
      unique: true
    },
    {
      fields: ['project_id']
    },
    {
      fields: ['purchase_order_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['delivery_date']
    },
    {
      fields: ['received_date']
    },
    {
      fields: ['received_by']
    },
    {
      fields: ['inspection_result']
    }
  ]
});

// Instance methods
DeliveryReceipt.prototype.getDeliveryPercentage = function() {
  if (!this.items || this.items.length === 0) return 0;
  
  let totalOrdered = 0;
  let totalDelivered = 0;
  
  for (const item of this.items) {
    totalOrdered += item.orderedQuantity || 0;
    totalDelivered += item.deliveredQuantity || 0;
  }
  
  return totalOrdered > 0 ? Math.round((totalDelivered / totalOrdered) * 100) : 0;
};

DeliveryReceipt.prototype.getItemsCount = function() {
  return this.items ? this.items.length : 0;
};

DeliveryReceipt.prototype.getTotalItemsDelivered = function() {
  if (!this.items) return 0;
  return this.items.reduce((total, item) => total + (item.deliveredQuantity || 0), 0);
};

DeliveryReceipt.prototype.getTotalItemsOrdered = function() {
  if (!this.items) return 0;
  return this.items.reduce((total, item) => total + (item.orderedQuantity || 0), 0);
};

DeliveryReceipt.prototype.isPartialDelivery = function() {
  const percentage = this.getDeliveryPercentage();
  return percentage > 0 && percentage < 100;
};

DeliveryReceipt.prototype.isFullDelivery = function() {
  return this.getDeliveryPercentage() === 100;
};

DeliveryReceipt.prototype.canBeApproved = function() {
  return ['received', 'pending_delivery'].includes(this.status) && this.inspectionResult === 'passed';
};

DeliveryReceipt.prototype.canBeRejected = function() {
  return ['received', 'pending_delivery'].includes(this.status);
};

// Static methods
DeliveryReceipt.generateReceiptNumber = function(projectId, sequence) {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const projectCode = projectId.slice(-6).toUpperCase();
  return `TR-${year}${month}-${projectCode}-${String(sequence).padStart(3, '0')}`;
};

module.exports = DeliveryReceipt;