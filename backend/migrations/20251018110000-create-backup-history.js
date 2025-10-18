const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('backup_history', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      backupType: {
        type: DataTypes.ENUM('FULL', 'INCREMENTAL', 'MANUAL'),
        allowNull: false,
        defaultValue: 'FULL'
      },
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      filePath: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      fileSize: {
        type: DataTypes.BIGINT
      },
      status: {
        type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED', 'VERIFIED', 'CORRUPTED'),
        allowNull: false,
        defaultValue: 'IN_PROGRESS'
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      completedAt: {
        type: DataTypes.DATE
      },
      duration: {
        type: DataTypes.INTEGER
      },
      databaseSize: {
        type: DataTypes.BIGINT
      },
      tableCount: {
        type: DataTypes.INTEGER
      },
      rowCount: {
        type: DataTypes.BIGINT
      },
      compressionRatio: {
        type: DataTypes.DECIMAL(5, 2)
      },
      checksum: {
        type: DataTypes.STRING(64)
      },
      verifiedAt: {
        type: DataTypes.DATE
      },
      isEncrypted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      triggeredBy: {
        type: DataTypes.STRING(50)
      },
      triggeredByUsername: {
        type: DataTypes.STRING(100)
      },
      errorMessage: {
        type: DataTypes.TEXT
      },
      metadata: {
        type: DataTypes.JSONB
      },
      retentionDays: {
        type: DataTypes.INTEGER,
        defaultValue: 30
      },
      expiresAt: {
        type: DataTypes.DATE
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      deletedAt: {
        type: DataTypes.DATE
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('backup_history', ['status'], {
      name: 'idx_backup_history_status'
    });
    
    await queryInterface.addIndex('backup_history', ['backupType'], {
      name: 'idx_backup_history_type'
    });
    
    await queryInterface.addIndex('backup_history', ['startedAt'], {
      name: 'idx_backup_history_started_at'
    });
    
    await queryInterface.addIndex('backup_history', ['completedAt'], {
      name: 'idx_backup_history_completed_at'
    });
    
    await queryInterface.addIndex('backup_history', ['expiresAt'], {
      name: 'idx_backup_history_expires_at'
    });
    
    await queryInterface.addIndex('backup_history', ['isDeleted'], {
      name: 'idx_backup_history_deleted'
    });

    console.log('Backup history table created successfully');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('backup_history');
    console.log('Backup history table dropped');
  }
};
