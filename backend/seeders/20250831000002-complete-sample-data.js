'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert Finance Transactions
    await queryInterface.bulkInsert('finance_transactions', [
      {
        id: 'FIN001',
        type: 'income',
        category: 'project_payment',
        amount: 2500000000,
        description: 'Pembayaran tahap 1 Gedung Perkantoran Jakarta',
        date: '2024-03-15',
        reference_number: 'INV-2024-001',
        project_id: 'PRJ001',
        account_from: 'Bank BCA 1234567890',
        status: 'completed',
        payment_method: 'bank_transfer',
        tags: JSON.stringify(['project', 'income', 'tahap1']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'FIN002',
        type: 'expense',
        category: 'material',
        amount: 850000000,
        description: 'Pembelian besi dan semen untuk proyek Jakarta',
        date: '2024-03-20',
        reference_number: 'PO-2024-001',
        project_id: 'PRJ001',
        account_to: 'Kas Operasional',
        status: 'completed',
        payment_method: 'cash',
        tags: JSON.stringify(['material', 'expense', 'konstruksi']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'FIN003',
        type: 'income',
        category: 'project_payment',
        amount: 1200000000,
        description: 'Pembayaran tahap 1 Renovasi Pabrik Bandung',
        date: '2024-04-20',
        reference_number: 'INV-2024-002',
        project_id: 'PRJ002',
        account_from: 'Bank Mandiri 9876543210',
        status: 'completed',
        payment_method: 'bank_transfer',
        tags: JSON.stringify(['project', 'income', 'renovasi']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'FIN004',
        type: 'expense',
        category: 'salary',
        amount: 450000000,
        description: 'Gaji karyawan bulan Maret 2024',
        date: '2024-03-31',
        reference_number: 'PAY-2024-003',
        account_from: 'Bank BCA 1234567890',
        status: 'completed',
        payment_method: 'bank_transfer',
        tags: JSON.stringify(['salary', 'expense', 'monthly']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'FIN005',
        type: 'expense',
        category: 'equipment',
        amount: 320000000,
        description: 'Sewa excavator dan crane untuk proyek',
        date: '2024-04-01',
        reference_number: 'RENT-2024-001',
        project_id: 'PRJ001',
        account_from: 'Kas Operasional',
        status: 'completed',
        payment_method: 'bank_transfer',
        tags: JSON.stringify(['equipment', 'rental', 'alat_berat']),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert Inventory Items
    await queryInterface.bulkInsert('inventory_items', [
      {
        id: 'INV001',
        item_code: 'STL-001',
        name: 'Besi Beton Ulir 12mm',
        category: 'material',
        description: 'Besi beton ulir diameter 12mm panjang 12 meter',
        unit: 'batang',
        quantity: 850,
        minimum_stock: 200,
        unit_cost: 85000,
        supplier: JSON.stringify({
          name: 'PT Krakatau Steel',
          contact: '+62271-123456',
          address: 'Cilegon, Banten'
        }),
        location: 'Gudang A - Rak 1',
        condition: 'good',
        last_updated: new Date(),
        expiry_date: null,
        notes: 'Stock untuk proyek Jakarta dan Bandung',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV002',
        item_code: 'CEM-001',
        name: 'Semen Portland Type I',
        category: 'material',
        description: 'Semen Portland Type I kemasan 40kg',
        unit: 'sak',
        quantity: 1250,
        minimum_stock: 300,
        unit_cost: 78000,
        supplier: JSON.stringify({
          name: 'PT Semen Indonesia',
          contact: '+62271-789012',
          address: 'Gresik, Jawa Timur'
        }),
        location: 'Gudang A - Area B',
        condition: 'good',
        last_updated: new Date(),
        expiry_date: '2025-03-15',
        notes: 'Hindari dari kelembaban',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV003',
        item_code: 'TLS-001',
        name: 'Bor Beton Makita 13mm',
        category: 'tool',
        description: 'Mesin bor beton Makita diameter 13mm',
        unit: 'unit',
        quantity: 8,
        minimum_stock: 3,
        unit_cost: 2500000,
        supplier: JSON.stringify({
          name: 'PT Makita Indonesia',
          contact: '+6221-5566789',
          address: 'Jakarta'
        }),
        location: 'Gudang Tools - Rak A',
        condition: 'good',
        last_updated: new Date(),
        expiry_date: null,
        notes: 'Lakukan maintenance rutin setiap 3 bulan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV004',
        item_code: 'TLS-002',
        name: 'Gerinda Tangan Bosch 4 inch',
        category: 'tool',
        description: 'Gerinda tangan Bosch 4 inch 720W',
        unit: 'unit',
        quantity: 12,
        minimum_stock: 5,
        unit_cost: 1200000,
        supplier: JSON.stringify({
          name: 'PT Bosch Indonesia',
          contact: '+6221-7788990',
          address: 'Jakarta'
        }),
        location: 'Gudang Tools - Rak B',
        condition: 'good',
        last_updated: new Date(),
        expiry_date: null,
        notes: 'Periksa kondisi mata gerinda sebelum digunakan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV005',
        item_code: 'PPE-001',
        name: 'Helm Safety Proyek',
        category: 'safety',
        description: 'Helm safety standar SNI warna kuning',
        unit: 'unit',
        quantity: 45,
        minimum_stock: 20,
        unit_cost: 125000,
        supplier: JSON.stringify({
          name: 'CV Safety First',
          contact: '+6221-4455667',
          address: 'Tangerang'
        }),
        location: 'Gudang Safety - Rak A',
        condition: 'good',
        last_updated: new Date(),
        expiry_date: null,
        notes: 'Cek kondisi sebelum distribusi ke lapangan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV006',
        item_code: 'MAT-001',
        name: 'Pasir Beton',
        category: 'material',
        description: 'Pasir beton kualitas grade A',
        unit: 'kubik',
        quantity: 15,
        minimum_stock: 50,
        unit_cost: 350000,
        supplier: JSON.stringify({
          name: 'CV Sumber Pasir',
          contact: '+62267-112233',
          address: 'Bogor'
        }),
        location: 'Area Terbuka - Zona 1',
        condition: 'good',
        last_updated: new Date(),
        expiry_date: null,
        notes: 'STOK RENDAH - Perlu reorder segera',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventory_items', null, {});
    await queryInterface.bulkDelete('finance_transactions', null, {});
  }
};
