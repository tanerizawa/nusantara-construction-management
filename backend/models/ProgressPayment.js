const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProgressPayment = sequelize.define('ProgressPayment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  beritaAcaraId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'berita_acara',
      key: 'id'
    }
  },
  paymentScheduleId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  
  // Payment details
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  // Payment status workflow
  status: {
    type: DataTypes.ENUM('pending_ba', 'ba_approved', 'payment_approved', 'processing', 'paid', 'cancelled'),
    defaultValue: 'pending_ba'
  },
  
  // BA approval tracking
  baApprovedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Payment approval chain
  paymentApprovedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentApprovedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Payment execution
  processingStartedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Financial details
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Tax and deductions
  taxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  retentionAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  netAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  
  // Approval workflow
  approvalWorkflow: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  
  // Payment method
  paymentMethod: {
    type: DataTypes.ENUM('bank_transfer', 'check', 'cash', 'other'),
    defaultValue: 'bank_transfer'
  },
  
  // Notes and comments
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  approvalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'progress_payments',
  timestamps: true,
  
  hooks: {
    beforeCreate: async (progressPayment, options) => {
      // Calculate net amount after tax and retention
      const grossAmount = parseFloat(progressPayment.amount);
      const tax = parseFloat(progressPayment.taxAmount || 0);
      const retention = parseFloat(progressPayment.retentionAmount || 0);
      progressPayment.netAmount = grossAmount - tax - retention;
    },
    
    beforeUpdate: async (progressPayment, options) => {
      // Recalculate net amount if amounts change
      if (progressPayment.changed('amount') || progressPayment.changed('taxAmount') || progressPayment.changed('retentionAmount')) {
        const grossAmount = parseFloat(progressPayment.amount);
        const tax = parseFloat(progressPayment.taxAmount || 0);
        const retention = parseFloat(progressPayment.retentionAmount || 0);
        progressPayment.netAmount = grossAmount - tax - retention;
      }
    }
  }
});

// Instance methods
ProgressPayment.prototype.canBeProcessed = function() {
  return this.status === 'payment_approved' && this.beritaAcaraApproved;
};

ProgressPayment.prototype.isOverdue = function() {
  return new Date() > this.dueDate && this.status !== 'paid';
};

ProgressPayment.prototype.getDaysUntilDue = function() {
  const today = new Date();
  const diffTime = this.dueDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

ProgressPayment.prototype.addApprovalStep = function(approverRole, approverUserId, decision, comments) {
  const approvalStep = {
    step: this.approvalWorkflow.length + 1,
    approverRole,
    approverUserId,
    decision,
    comments,
    timestamp: new Date()
  };
  
  this.approvalWorkflow.push(approvalStep);
  return this.save();
};

// Class methods
ProgressPayment.findAwaitingBAApproval = function() {
  return this.findAll({
    where: {
      status: 'pending_ba'
    },
    include: [
      {
        model: sequelize.models.Project,
        as: 'project',
        attributes: ['id', 'name', 'client_name']
      },
      {
        model: sequelize.models.BeritaAcara,
        as: 'beritaAcara',
        attributes: ['id', 'baNumber', 'status', 'workDescription']
      }
    ],
    order: [['dueDate', 'ASC']]
  });
};

ProgressPayment.findAwaitingPaymentApproval = function() {
  return this.findAll({
    where: {
      status: 'ba_approved'
    },
    include: [
      {
        model: sequelize.models.Project,
        as: 'project',
        attributes: ['id', 'name', 'client_name', 'budget']
      },
      {
        model: sequelize.models.BeritaAcara,
        as: 'beritaAcara',
        attributes: ['id', 'baNumber', 'approvedAt', 'workDescription']
      }
    ],
    order: [['baApprovedAt', 'ASC']]
  });
};

ProgressPayment.findOverduePayments = function() {
  return this.findAll({
    where: {
      dueDate: {
        [sequelize.Op.lt]: new Date()
      },
      status: {
        [sequelize.Op.notIn]: ['paid', 'cancelled']
      }
    },
    include: [
      {
        model: sequelize.models.Project,
        as: 'project',
        attributes: ['id', 'name', 'client_name']
      }
    ],
    order: [['dueDate', 'ASC']]
  });
};

ProgressPayment.getProjectPaymentSummary = async function(projectId) {
  const payments = await this.findAll({
    where: { projectId },
    order: [['createdAt', 'ASC']]
  });
  
  const summary = {
    totalPayments: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
    totalNetAmount: payments.reduce((sum, p) => sum + parseFloat(p.netAmount), 0),
    paidAmount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.netAmount), 0),
    pendingAmount: payments.filter(p => p.status !== 'paid' && p.status !== 'cancelled').reduce((sum, p) => sum + parseFloat(p.netAmount), 0),
    
    statusBreakdown: {
      pending_ba: payments.filter(p => p.status === 'pending_ba').length,
      ba_approved: payments.filter(p => p.status === 'ba_approved').length,
      payment_approved: payments.filter(p => p.status === 'payment_approved').length,
      processing: payments.filter(p => p.status === 'processing').length,
      paid: payments.filter(p => p.status === 'paid').length,
      cancelled: payments.filter(p => p.status === 'cancelled').length
    },
    
    overduePayments: payments.filter(p => p.isOverdue()).length
  };
  
  return summary;
};

ProgressPayment.createFromBA = async function(beritaAcara, contractAmount) {
  // Calculate payment amount based on completion percentage
  const paymentAmount = (contractAmount * parseFloat(beritaAcara.completionPercentage)) / 100;
  
  // Calculate standard deductions (example: 2% tax, 5% retention)
  const taxAmount = paymentAmount * 0.02;
  const retentionAmount = paymentAmount * 0.05;
  
  return this.create({
    projectId: beritaAcara.projectId,
    beritaAcaraId: beritaAcara.id,
    amount: paymentAmount,
    percentage: beritaAcara.completionPercentage,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    taxAmount: taxAmount,
    retentionAmount: retentionAmount,
    status: 'ba_approved', // Since BA is already approved
    baApprovedAt: beritaAcara.approvedAt,
    createdBy: 'system'
  });
};

module.exports = ProgressPayment;