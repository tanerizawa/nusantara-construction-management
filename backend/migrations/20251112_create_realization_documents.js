'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create realization_documents table
    await queryInterface.createTable('realization_documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      realization_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'rab_realizations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke rab_realizations'
      },
      
      // File Details
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Nama file original'
      },
      file_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: 'Path file di server/storage'
      },
      file_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Extension file: pdf, jpg, png, etc'
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Ukuran file dalam bytes'
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'MIME type: application/pdf, image/jpeg, etc'
      },
      
      // Document Classification
      document_type: {
        type: Sequelize.ENUM('invoice', 'receipt', 'photo', 'contract', 'delivery_note', 'other'),
        defaultValue: 'other',
        allowNull: false,
        comment: 'Kategori dokumen'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Deskripsi/keterangan dokumen'
      },
      
      // Metadata
      uploaded_by: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'User ID yang upload'
      },
      uploaded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Timestamp upload'
      },
      
      // Audit
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

    // Create indexes
    await queryInterface.addIndex('realization_documents', ['realization_id'], {
      name: 'idx_docs_realization'
    });
    
    await queryInterface.addIndex('realization_documents', ['document_type'], {
      name: 'idx_docs_type'
    });
    
    await queryInterface.addIndex('realization_documents', ['uploaded_by'], {
      name: 'idx_docs_uploaded_by'
    });

    console.log('✅ Table realization_documents created successfully with indexes');
  },

  down: async (queryInterface, Sequelize) => {
    // Drop indexes
    await queryInterface.removeIndex('realization_documents', 'idx_docs_uploaded_by');
    await queryInterface.removeIndex('realization_documents', 'idx_docs_type');
    await queryInterface.removeIndex('realization_documents', 'idx_docs_realization');
    
    // Drop table
    await queryInterface.dropTable('realization_documents');
    
    console.log('✅ Table realization_documents dropped successfully');
  }
};
