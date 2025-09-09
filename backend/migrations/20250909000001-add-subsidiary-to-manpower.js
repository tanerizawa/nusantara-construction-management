'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tambah kolom subsidiary_id ke tabel manpower
    await queryInterface.addColumn('manpower', 'subsidiary_id', {
      type: Sequelize.STRING(50),
      allowNull: true,
      references: {
        model: 'subsidiaries',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Tambah index untuk performa
    await queryInterface.addIndex('manpower', ['subsidiary_id'], {
      name: 'manpower_subsidiary_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Hapus index terlebih dahulu
    await queryInterface.removeIndex('manpower', 'manpower_subsidiary_id_idx');
    
    // Hapus kolom
    await queryInterface.removeColumn('manpower', 'subsidiary_id');
  }
};
