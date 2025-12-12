'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create rab_realizations table
    await queryInterface.createTable('rab_realizations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      project_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rab_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'project_rab',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      
      // Transaction Details
      transaction_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Tanggal transaksi pembelian/pembayaran'
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Jumlah quantity yang direalisasikan'
      },
      unit_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Harga per unit actual'
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total amount = quantity * unit_price'
      },
      
      // Vendor & Payment Info
      vendor_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Nama vendor/supplier'
      },
      invoice_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Nomor invoice/faktur'
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Metode pembayaran: cash, transfer, credit, etc'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Catatan tambahan untuk realisasi ini'
      },
      
      // Variance Tracking (snapshot at time of input)
      budget_unit_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Snapshot harga unit dari RAP budget saat input'
      },
      variance_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Selisih amount: (unit_price - budget_unit_price) * quantity'
      },
      variance_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Persentase variance: (variance_amount / budget_total) * 100'
      },
      
      // Status & Approval
      status: {
        type: Sequelize.ENUM('draft', 'pending_review', 'approved', 'rejected'),
        defaultValue: 'draft',
        allowNull: false,
        comment: 'Status approval realisasi'
      },
      approved_by: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'User ID yang approve'
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp approval'
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Alasan rejection jika status = rejected'
      },
      
      // Audit Trail
      created_by: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'User ID yang input'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_by: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'User ID yang terakhir update'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      
      // Soft Delete
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp'
      }
    });

    // Create indexes for performance
    await queryInterface.addIndex('rab_realizations', ['project_id'], {
      name: 'idx_realizations_project'
    });
    
    await queryInterface.addIndex('rab_realizations', ['rab_item_id'], {
      name: 'idx_realizations_rab_item'
    });
    
    await queryInterface.addIndex('rab_realizations', ['transaction_date'], {
      name: 'idx_realizations_date'
    });
    
    await queryInterface.addIndex('rab_realizations', ['status'], {
      name: 'idx_realizations_status'
    });
    
    await queryInterface.addIndex('rab_realizations', ['created_by'], {
      name: 'idx_realizations_created_by'
    });

    console.log('✅ Table rab_realizations created successfully with indexes');
  },

  down: async (queryInterface, Sequelize) => {
    // Drop indexes first
    await queryInterface.removeIndex('rab_realizations', 'idx_realizations_created_by');
    await queryInterface.removeIndex('rab_realizations', 'idx_realizations_status');
    await queryInterface.removeIndex('rab_realizations', 'idx_realizations_date');
    await queryInterface.removeIndex('rab_realizations', 'idx_realizations_rab_item');
    await queryInterface.removeIndex('rab_realizations', 'idx_realizations_project');
    
    // Drop table
    await queryInterface.dropTable('rab_realizations');
    
    console.log('✅ Table rab_realizations dropped successfully');
  }
};
