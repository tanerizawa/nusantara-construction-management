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
          { name: 'AutoCAD', level: 'advanced' }
        ]),
        metadata: JSON.stringify({
          certifications: ['PJK3', 'LSP_Konstruksi'],
          performance_rating: 4.5,
          notes: 'Engineer berpengalaman'
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
          { name: 'Risk Assessment', level: 'advanced' }
        ]),
        metadata: JSON.stringify({
          certifications: ['NEBOSH', 'K3_Construction'],
          performance_rating: 4.8,
          notes: 'Safety officer kompeten'
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
          { name: 'Structural Design', level: 'advanced' }
        ]),
        metadata: JSON.stringify({
          certifications: ['SKA_Ahli_Muda', 'ISO_9001'],
          performance_rating: 4.3,
          notes: 'Engineer muda dengan potensi besar'
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // === INVENTORY ITEMS DATA ===
    await queryInterface.bulkInsert('inventory_items', [
      {
        id: 'INV001',
        name: 'Besi Beton Ulir 12mm',
        description: 'Besi beton ulir diameter 12mm panjang 12 meter',
        category: 'material',
        subcategory: 'steel',
        sku: 'STL-BU-12-12M',
        unit: 'batang',
        current_stock: 850,
        minimum_stock: 200,
        maximum_stock: 2000,
        unit_price: 85000,
        total_value: 72250000,
        location: 'Gudang A - Rak 1-3',
        warehouse: 'Gudang A',
        supplier: JSON.stringify({
          name: 'PT Krakatau Steel',
          contact: '+62254-123456',
          address: 'Cilegon, Banten'
        }),
        specifications: JSON.stringify({
          diameter: '12mm',
          length: '12m',
          grade: 'BJTD 24',
          weight_per_unit: '10.6kg'
        }),
        tags: JSON.stringify(['construction', 'steel', 'rebar']),
        is_active: true,
        last_stock_update: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV002',
        name: 'Semen Portland Type I',
        description: 'Semen portland untuk konstruksi umum',
        category: 'material',
        subcategory: 'cement',
        sku: 'CMT-POR-T1-50KG',
        unit: 'sak',
        current_stock: 2500,
        minimum_stock: 500,
        maximum_stock: 5000,
        unit_price: 75000,
        total_value: 187500000,
        location: 'Gudang B - Area 1',
        warehouse: 'Gudang B',
        supplier: JSON.stringify({
          name: 'PT Semen Indonesia',
          contact: '+6231-987654',
          address: 'Gresik, Jawa Timur'
        }),
        specifications: JSON.stringify({
          type: 'Portland Type I',
          weight_per_unit: '50kg',
          packaging: 'Paper bag',
          standard: 'SNI 15-2049-2004'
        }),
        tags: JSON.stringify(['construction', 'cement', 'building']),
        is_active: true,
        last_stock_update: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV003',
        name: 'Excavator Komatsu PC200',
        description: 'Excavator hydraulic untuk pekerjaan galian',
        category: 'equipment',
        subcategory: 'heavy_machinery',
        sku: 'EQP-EXC-PC200-001',
        unit: 'unit',
        current_stock: 2,
        minimum_stock: 1,
        maximum_stock: 5,
        unit_price: 1850000000,
        total_value: 3700000000,
        location: 'Yard A - Area Equipment',
        warehouse: 'Yard A',
        supplier: JSON.stringify({
          name: 'PT United Tractors',
          contact: '+6221-555-0123',
          address: 'Jakarta Selatan'
        }),
        specifications: JSON.stringify({
          model: 'PC200-8',
          engine_power: '110kW',
          operating_weight: '20.1 ton',
          bucket_capacity: '0.93 m³'
        }),
        tags: JSON.stringify(['equipment', 'excavator', 'heavy machinery']),
        is_active: true,
        last_stock_update: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'INV004',
        name: 'Generator Set 150 KVA',
        description: 'Generator diesel untuk kebutuhan listrik proyek',
        category: 'equipment',
        subcategory: 'power_tools',
        sku: 'EQP-GEN-150KVA-001',
        unit: 'unit',
        current_stock: 5,
        minimum_stock: 2,
        maximum_stock: 10,
        unit_price: 285000000,
        total_value: 1425000000,
        location: 'Yard B - Area Power',
        warehouse: 'Yard B',
        supplier: JSON.stringify({
          name: 'PT Cummins Indonesia',
          contact: '+6221-789-0123',
          address: 'Jakarta Pusat'
        }),
        specifications: JSON.stringify({
          capacity: '150 KVA',
          fuel_type: 'Diesel',
          engine_model: 'Cummins 6CTA8.3-G2',
          weight: '1200kg'
        }),
        tags: JSON.stringify(['equipment', 'generator', 'power']),
        is_active: true,
        last_stock_update: new Date(),
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
