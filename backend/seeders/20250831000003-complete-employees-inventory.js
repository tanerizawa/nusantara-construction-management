'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    
    // === MANPOWER/EMPLOYEES DATA ===
    await queryInterface.bulkInsert('manpower', [
      {
        id: 'EMP001',
        employee_id: 'EMP-2024-001',
        name: 'Dedi Kurniawan',
        position: 'Site Engineer',
        department: 'Engineering',
        email: 'dedi@ykconstruction.com',
        phone: '+62812-1111-2222',
        join_date: '2023-01-15',
        birth_date: '1985-06-20',
        address: 'Jl. Kemanggisan Raya No. 45, Jakarta Barat',
        status: 'active',
        employment_type: 'permanent',
        salary: 12000000,
        current_project: 'PRJ001',
        skills: JSON.stringify([
          { name: 'Structural Engineering', level: 'advanced' },
          { name: 'AutoCAD', level: 'advanced' },
          { name: 'Project Management', level: 'intermediate' }
        ]),
        metadata: JSON.stringify({
          certifications: ['PJK3', 'LSP_Konstruksi', 'AutoCAD_Professional'],
          performance_rating: 4.5,
          notes: 'Engineer berpengalaman dengan track record excellent di proyek-proyek besar'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'EMP002',
        employee_id: 'EMP-2024-002',
        name: 'Rini Sari',
        position: 'Safety Officer',
        department: 'Safety',
        email: 'rini@ykconstruction.com',
        phone: '+62813-2222-3333',
        join_date: '2023-03-20',
        birth_date: '1987-09-14',
        address: 'Jl. Cipete Raya No. 78, Jakarta Selatan',
        status: 'active',
        employment_type: 'permanent',
        salary: 9500000,
        current_project: 'PRJ001',
        skills: JSON.stringify([
          { name: 'Safety Management', level: 'expert' },
          { name: 'Risk Assessment', level: 'advanced' },
          { name: 'Emergency Response', level: 'advanced' }
        ]),
        metadata: JSON.stringify({
          certifications: ['NEBOSH', 'K3_Construction', 'First_Aid', 'Fire_Safety'],
          performance_rating: 4.8,
          notes: 'Safety officer sangat teliti dan kompeten, zero accident record'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'EMP003',
        employee_id: 'EMP-2024-003',
        name: 'Andi Wijaya',
        position: 'Civil Engineer',
        department: 'Engineering',
        email: 'andi@ykconstruction.com',
        phone: '+62814-3333-4444',
        join_date: '2023-06-01',
        birth_date: '1990-03-12',
        address: 'Jl. Sudirman No. 123, Bandung',
        status: 'active',
        employment_type: 'permanent',
        salary: 11000000,
        current_project: 'PRJ002',
        skills: JSON.stringify([
          { name: 'Civil Engineering', level: 'advanced' },
          { name: 'Structural Design', level: 'advanced' },
          { name: 'Quality Control', level: 'intermediate' }
        ]),
        certifications: JSON.stringify(['SKA_Ahli_Muda', 'ISO_9001', 'Concrete_Technology']),
        performance_rating: 4.3,
        notes: 'Engineer muda dengan potensi besar dan dedikasi tinggi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'EMP004',
        employee_id: 'EMP-2024-004',
        name: 'Linda Sari',
        position: 'Electrical Engineer',
        department: 'Engineering',
        email: 'linda@ykconstruction.com',
        phone: '+62815-4444-5555',
        join_date: '2023-08-15',
        birth_date: '1988-11-28',
        address: 'Jl. Setiabudhi No. 89, Bandung',
        status: 'active',
        employment_type: 'permanent',
        salary: 11500000,
        current_project: 'PRJ002',
        skills: JSON.stringify([
          { name: 'Electrical Systems', level: 'expert' },
          { name: 'Industrial Automation', level: 'advanced' },
          { name: 'Power Distribution', level: 'advanced' }
        ]),
        certifications: JSON.stringify(['SKA_Electrical', 'PJK3_Electrical', 'PLC_Programming']),
        performance_rating: 4.6,
        notes: 'Spesialis sistem kelistrikan industri dengan pengalaman automation',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'EMP005',
        employee_id: 'EMP-2024-005',
        name: 'Bambang Sutrisno',
        position: 'Foreman',
        department: 'Construction',
        email: 'bambang@ykconstruction.com',
        phone: '+62816-5555-6666',
        join_date: '2022-12-01',
        birth_date: '1975-04-18',
        address: 'Jl. Raya Bekasi No. 234, Bekasi',
        status: 'active',
        employment_type: 'permanent',
        salary: 8500000,
        current_project: 'PRJ001',
        skills: JSON.stringify([
          { name: 'Construction Management', level: 'expert' },
          { name: 'Team Leadership', level: 'expert' },
          { name: 'Quality Assurance', level: 'advanced' }
        ]),
        certifications: JSON.stringify(['Sertifikat_Tukang_Ahli', 'K3_Umum', 'Leadership']),
        performance_rating: 4.4,
        notes: 'Foreman berpengalaman 15+ tahun dengan leadership yang kuat',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'EMP006',
        employee_id: 'EMP-2024-006',
        name: 'Maya Indira',
        position: 'Quantity Surveyor',
        department: 'Engineering',
        email: 'maya@ykconstruction.com',
        phone: '+62817-6666-7777',
        join_date: '2023-04-10',
        birth_date: '1989-01-15',
        address: 'Jl. Gatot Subroto No. 45, Jakarta',
        status: 'active',
        employment_type: 'permanent',
        salary: 10500000,
        current_project: 'PRJ001',
        skills: JSON.stringify([
          { name: 'Quantity Surveying', level: 'advanced' },
          { name: 'Cost Estimation', level: 'advanced' },
          { name: 'Contract Management', level: 'intermediate' }
        ]),
        certifications: JSON.stringify(['RICS', 'QS_Professional', 'Contract_Law']),
        performance_rating: 4.2,
        notes: 'QS dengan ketelitian tinggi dalam estimasi dan kontrol biaya',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // === INVENTORY ITEMS DATA ===
    // Check structure dari migration
    await queryInterface.bulkInsert('inventory_items', [
      {
        id: 'INV001',
        name: 'Besi Beton Ulir 12mm',
        description: 'Besi beton ulir diameter 12mm panjang 12 meter, grade BJTD 24',
        category: 'material',
        subcategory: 'steel',
        sku: 'STL-BU-12-12M',
        unit: 'batang',
        current_stock: 850,
        minimum_stock: 200,
        maximum_stock: 2000,
        unit_price: 85000,
        last_purchase_price: 83000,
        average_price: 84000,
        location: 'Gudang A - Rak 1-3',
        condition: 'good',
        supplier_info: JSON.stringify({
          name: 'PT Krakatau Steel',
          contact: '+62254-123456',
          address: 'Cilegon, Banten',
          lead_time: 7
        }),
        purchase_info: JSON.stringify({
          last_order_date: '2024-08-15',
          last_order_qty: 500,
          next_order_date: '2024-09-15'
        }),
        notes: 'Stock untuk proyek Jakarta dan Bandung. Periksa kondisi sebelum distribusi.',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV002',
        name: 'Semen Portland Type I',
        description: 'Semen Portland Type I kemasan 40kg, merk Tiga Roda',
        category: 'material',
        subcategory: 'cement',
        sku: 'CEM-PT1-40KG',
        unit: 'sak',
        current_stock: 1250,
        minimum_stock: 300,
        maximum_stock: 3000,
        unit_price: 78000,
        last_purchase_price: 76500,
        average_price: 77250,
        location: 'Gudang A - Area B',
        condition: 'good',
        supplier_info: JSON.stringify({
          name: 'PT Semen Indonesia',
          contact: '+62271-789012',
          address: 'Gresik, Jawa Timur',
          lead_time: 5
        }),
        purchase_info: JSON.stringify({
          last_order_date: '2024-08-20',
          last_order_qty: 800,
          next_order_date: '2024-09-10'
        }),
        notes: 'Hindari dari kelembaban. Rotasi stock FIFO wajib dilakukan.',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV003',
        name: 'Bor Beton Makita 13mm',
        description: 'Mesin bor beton Makita HP1630 diameter 13mm 710W',
        category: 'tool',
        subcategory: 'power_tool',
        sku: 'TLS-MKT-BR13',
        unit: 'unit',
        current_stock: 8,
        minimum_stock: 3,
        maximum_stock: 15,
        unit_price: 2500000,
        last_purchase_price: 2450000,
        average_price: 2475000,
        location: 'Gudang Tools - Rak A1',
        condition: 'good',
        supplier_info: JSON.stringify({
          name: 'PT Makita Indonesia',
          contact: '+6221-5566789',
          address: 'Jakarta',
          lead_time: 3
        }),
        purchase_info: JSON.stringify({
          last_order_date: '2024-07-10',
          last_order_qty: 3,
          next_order_date: '2024-10-01'
        }),
        notes: 'Lakukan maintenance rutin setiap 3 bulan. Check log penggunaan.',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV004',
        name: 'Gerinda Tangan Bosch 4 inch',
        description: 'Gerinda tangan Bosch GWS 060 4 inch 670W',
        category: 'tool',
        subcategory: 'power_tool',
        sku: 'TLS-BSH-GR4',
        unit: 'unit',
        current_stock: 12,
        minimum_stock: 5,
        maximum_stock: 20,
        unit_price: 1200000,
        last_purchase_price: 1150000,
        average_price: 1175000,
        location: 'Gudang Tools - Rak A2',
        condition: 'good',
        supplier_info: JSON.stringify({
          name: 'PT Bosch Indonesia',
          contact: '+6221-7788990',
          address: 'Jakarta',
          lead_time: 3
        }),
        purchase_info: JSON.stringify({
          last_order_date: '2024-07-25',
          last_order_qty: 5,
          next_order_date: '2024-11-01'
        }),
        notes: 'Periksa kondisi mata gerinda sebelum digunakan. Stock spare part tersedia.',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV005',
        name: 'Helm Safety Proyek',
        description: 'Helm safety standar SNI warna kuning dengan chin strap',
        category: 'safety',
        subcategory: 'ppe',
        sku: 'PPE-HLM-YLW',
        unit: 'unit',
        current_stock: 45,
        minimum_stock: 20,
        maximum_stock: 100,
        unit_price: 125000,
        last_purchase_price: 120000,
        average_price: 122500,
        location: 'Gudang Safety - Rak A1',
        condition: 'good',
        supplier_info: JSON.stringify({
          name: 'CV Safety First',
          contact: '+6221-4455667',
          address: 'Tangerang',
          lead_time: 2
        }),
        purchase_info: JSON.stringify({
          last_order_date: '2024-08-01',
          last_order_qty: 25,
          next_order_date: '2024-09-01'
        }),
        notes: 'Cek kondisi sebelum distribusi ke lapangan. Replace jika ada retak.',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV006',
        name: 'Pasir Beton',
        description: 'Pasir beton kualitas grade A dari Bogor',
        category: 'material',
        subcategory: 'aggregate',
        sku: 'MAT-PSR-BGR',
        unit: 'kubik',
        current_stock: 15,
        minimum_stock: 50,
        maximum_stock: 200,
        unit_price: 350000,
        last_purchase_price: 340000,
        average_price: 345000,
        location: 'Area Terbuka - Zona 1',
        condition: 'good',
        supplier_info: JSON.stringify({
          name: 'CV Sumber Pasir Bogor',
          contact: '+62267-112233',
          address: 'Bogor',
          lead_time: 1
        }),
        purchase_info: JSON.stringify({
          last_order_date: '2024-08-10',
          last_order_qty: 30,
          next_order_date: '2024-09-05'
        }),
        notes: 'STOK RENDAH - Perlu reorder segera. Pastikan kualitas sebelum terima.',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV007',
        name: 'Kerikil Split 1-2 cm',
        description: 'Kerikil split ukuran 1-2 cm untuk campuran beton',
        category: 'material',
        subcategory: 'aggregate',
        sku: 'MAT-KRK-12',
        unit: 'kubik',
        current_stock: 25,
        minimum_stock: 40,
        maximum_stock: 150,
        unit_price: 400000,
        last_purchase_price: 395000,
        average_price: 397500,
        location: 'Area Terbuka - Zona 2',
        condition: 'good',
        supplier_info: JSON.stringify({
          name: 'PT Aneka Quarry',
          contact: '+62267-334455',
          address: 'Sukabumi',
          lead_time: 2
        }),
        purchase_info: JSON.stringify({
          last_order_date: '2024-08-12',
          last_order_qty: 40,
          next_order_date: '2024-09-15'
        }),
        notes: 'Stock mendekati minimum. Monitor penggunaan harian.',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV008',
        name: 'Kawat Bendrat BWG 16',
        description: 'Kawat bendrat galvanis BWG 16 untuk ikat besi beton',
        category: 'material',
        subcategory: 'accessories',
        sku: 'MAT-KWT-BWG16',
        unit: 'kg',
        current_stock: 180,
        minimum_stock: 100,
        maximum_stock: 500,
        unit_price: 25000,
        last_purchase_price: 24500,
        average_price: 24750,
        location: 'Gudang A - Rak 5',
        condition: 'good',
        supplier_info: JSON.stringify({
          name: 'CV Logam Jaya',
          contact: '+6221-8899001',
          address: 'Bekasi',
          lead_time: 2
        }),
        purchase_info: JSON.stringify({
          last_order_date: '2024-08-05',
          last_order_qty: 100,
          next_order_date: '2024-09-20'
        }),
        notes: 'Stock cukup untuk 2 minggu ke depan.',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventory_items', null, {});
    await queryInterface.bulkDelete('manpower', null, {});
  }
};
