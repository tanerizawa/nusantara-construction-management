const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BeritaAcara = sequelize.define('BeritaAcara', {
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
  milestoneId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'project_milestones',
      key: 'id'
    }
  },
  baNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  baType: {
    type: DataTypes.ENUM('provisional', 'final', 'partial'),
    defaultValue: 'partial'
  },
  workDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  completionPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  // Approval workflow
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'client_review', 'approved', 'rejected'),
    defaultValue: 'draft'
  },
  submittedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Payment trigger
  paymentAuthorized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  paymentDueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Client sign-off
  clientRepresentative: {
    type: DataTypes.STRING,
    allowNull: true
  },
  clientSignature: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  clientSignDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  clientNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Attachments & documentation
  photos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Technical details
  workLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contractReference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qualityChecklist: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
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
  tableName: 'berita_acara',
  timestamps: true,
  
  // Add hooks for business logic
  hooks: {
    beforeCreate: async (beritaAcara, options) => {
      // Auto-generate BA number if not provided
      if (!beritaAcara.baNumber) {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const count = await BeritaAcara.count({
          where: sequelize.where(
            sequelize.fn('YEAR', sequelize.col('createdAt')), year
          )
        });
        beritaAcara.baNumber = `BA-${year}${month}-${String(count + 1).padStart(4, '0')}`;
      }
    },
    
    afterUpdate: async (beritaAcara, options) => {
      // Trigger payment authorization when BA is approved
      if (beritaAcara.status === 'approved' && !beritaAcara.paymentAuthorized) {
        await beritaAcara.update({
          paymentAuthorized: true,
          paymentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });
        
        // Here you would trigger payment workflow
        // await createProgressPayment(beritaAcara);
      }
    }
  }
});

// Instance methods
BeritaAcara.prototype.canBeApproved = function() {
  return this.status === 'submitted' && this.clientSignDate;
};

BeritaAcara.prototype.isPaymentReady = function() {
  return this.status === 'approved' && this.paymentAuthorized;
};

BeritaAcara.prototype.getWorkProgress = function() {
  return {
    percentage: this.completionPercentage,
    description: this.workDescription,
    completionDate: this.completionDate,
    isComplete: this.completionPercentage >= 100
  };
};

// Class methods
BeritaAcara.findPendingApproval = function() {
  return this.findAll({
    where: {
      status: ['submitted', 'client_review']
    },
    include: [
      {
        model: sequelize.models.Project,
        as: 'project',
        attributes: ['id', 'name', 'client_name']
      }
    ],
    order: [['submittedAt', 'ASC']]
  });
};

BeritaAcara.findReadyForPayment = function() {
  return this.findAll({
    where: {
      status: 'approved',
      paymentAuthorized: true
    },
    include: [
      {
        model: sequelize.models.Project,
        as: 'project',
        attributes: ['id', 'name', 'client_name', 'budget']
      }
    ],
    order: [['approvedAt', 'ASC']]
  });
};

BeritaAcara.getProjectProgress = async function(projectId) {
  const baList = await this.findAll({
    where: { projectId },
    order: [['completionDate', 'ASC']]
  });
  
  const totalProgress = baList.reduce((sum, ba) => sum + parseFloat(ba.completionPercentage), 0);
  const averageProgress = baList.length > 0 ? totalProgress / baList.length : 0;
  
  return {
    totalBA: baList.length,
    approvedBA: baList.filter(ba => ba.status === 'approved').length,
    pendingBA: baList.filter(ba => ba.status === 'submitted').length,
    averageProgress: averageProgress,
    latestBA: baList[baList.length - 1] || null
  };
};

module.exports = BeritaAcara;