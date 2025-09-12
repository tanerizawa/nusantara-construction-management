console.log('🚀 Starting Comprehensive RAB Generation...');

const { Sequelize } = require('sequelize');

async function generateComprehensiveRAB() {
  try {
    console.log('📊 Connecting to database...');
    
    const sequelize = new Sequelize('yk_construction_dev', 'postgres', 'dev_password', {
      host: 'database',
      port: 5432,
      dialect: 'postgres',
      logging: false
    });

    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    
    // Get all projects
    const projects = await sequelize.query(
      'SELECT id, name, status, priority FROM projects ORDER BY name',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log(`📊 Found ${projects.length} projects for RAB generation`);
    
    // Clear existing RAB items
    console.log('🗑️ Clearing existing RAB data...');
    await sequelize.query('DELETE FROM project_rab_items');
    console.log('✅ Existing RAB data cleared');
    
    // Comprehensive RAB categories with realistic construction items
    const rabCategories = [
      {
        name: 'Pekerjaan Persiapan',
        items: [
          { name: 'Pembersihan Lahan', unit: 'M2', base_price: 15000 },
          { name: 'Pengukuran dan Pematokan', unit: 'M2', base_price: 8000 },
          { name: 'Mobilisasi Alat Berat', unit: 'LS', base_price: 5000000 },
          { name: 'Papan Nama Proyek', unit: 'Unit', base_price: 2500000 },
          { name: 'Pagar Sementara', unit: 'M', base_price: 125000 },
          { name: 'Direksi Keet', unit: 'M2', base_price: 850000 }
        ]
      },
      {
        name: 'Pekerjaan Tanah',
        items: [
          { name: 'Galian Tanah Biasa', unit: 'M3', base_price: 45000 },
          { name: 'Galian Tanah Keras', unit: 'M3', base_price: 65000 },
          { name: 'Timbunan Tanah', unit: 'M3', base_price: 35000 },
          { name: 'Pemadatan Tanah', unit: 'M2', base_price: 12000 },
          { name: 'Urugan Pasir', unit: 'M3', base_price: 180000 },
          { name: 'Urugan Batu Kosong', unit: 'M3', base_price: 210000 }
        ]
      },
      {
        name: 'Pekerjaan Pondasi',
        items: [
          { name: 'Pondasi Batu Kali', unit: 'M3', base_price: 850000 },
          { name: 'Cor Beton K225 Pondasi', unit: 'M3', base_price: 1250000 },
          { name: 'Pembesian Pondasi', unit: 'Kg', base_price: 18000 },
          { name: 'Bekisting Pondasi', unit: 'M2', base_price: 185000 },
          { name: 'Waterproofing Pondasi', unit: 'M2', base_price: 95000 },
          { name: 'Pondasi Tiang Pancang', unit: 'M', base_price: 450000 }
        ]
      },
      {
        name: 'Pekerjaan Struktur',
        items: [
          { name: 'Kolom Beton K300', unit: 'M3', base_price: 1450000 },
          { name: 'Balok Beton K300', unit: 'M3', base_price: 1450000 },
          { name: 'Plat Lantai K250', unit: 'M3', base_price: 1350000 },
          { name: 'Bekisting Kolom', unit: 'M2', base_price: 195000 },
          { name: 'Bekisting Balok', unit: 'M2', base_price: 185000 },
          { name: 'Pembesian Struktur', unit: 'Kg', base_price: 19000 },
          { name: 'Tangga Beton', unit: 'M2', base_price: 1850000 }
        ]
      },
      {
        name: 'Pekerjaan Arsitektur',
        items: [
          { name: 'Dinding Bata Merah', unit: 'M2', base_price: 185000 },
          { name: 'Dinding Hebel', unit: 'M2', base_price: 165000 },
          { name: 'Plester Dinding', unit: 'M2', base_price: 45000 },
          { name: 'Acian Dinding', unit: 'M2', base_price: 25000 },
          { name: 'Cat Tembok Interior', unit: 'M2', base_price: 35000 },
          { name: 'Cat Tembok Eksterior', unit: 'M2', base_price: 45000 },
          { name: 'Keramik Lantai 60x60', unit: 'M2', base_price: 125000 },
          { name: 'Granite Lantai', unit: 'M2', base_price: 285000 }
        ]
      },
      {
        name: 'Pekerjaan Atap',
        items: [
          { name: 'Rangka Atap Baja Ringan', unit: 'M2', base_price: 185000 },
          { name: 'Rangka Atap Kayu Kelas I', unit: 'M2', base_price: 225000 },
          { name: 'Genteng Beton', unit: 'M2', base_price: 95000 },
          { name: 'Genteng Keramik', unit: 'M2', base_price: 125000 },
          { name: 'Talang Air', unit: 'M', base_price: 125000 },
          { name: 'Lisplang', unit: 'M', base_price: 85000 },
          { name: 'Plafon Gypsum', unit: 'M2', base_price: 95000 }
        ]
      },
      {
        name: 'Pekerjaan MEP',
        items: [
          { name: 'Instalasi Listrik', unit: 'Titik', base_price: 185000 },
          { name: 'Panel Listrik', unit: 'Unit', base_price: 2500000 },
          { name: 'Instalasi Air Bersih', unit: 'Titik', base_price: 125000 },
          { name: 'Instalasi Air Kotor', unit: 'Titik', base_price: 145000 },
          { name: 'Septictank', unit: 'Unit', base_price: 8500000 },
          { name: 'Sumur Bor', unit: 'M', base_price: 385000 }
        ]
      },
      {
        name: 'Pekerjaan Finishing',
        items: [
          { name: 'Pintu Kayu', unit: 'Unit', base_price: 1850000 },
          { name: 'Jendela Aluminium', unit: 'M2', base_price: 785000 },
          { name: 'Kunci Pintu', unit: 'Set', base_price: 285000 },
          { name: 'Hardware Jendela', unit: 'Set', base_price: 185000 },
          { name: 'Sanitair Toilet', unit: 'Set', base_price: 2850000 },
          { name: 'Kitchen Set', unit: 'M', base_price: 1850000 }
        ]
      }
    ];
    
    let totalGenerated = 0;
    let totalValue = 0;
    
    console.log('🏗️ Generating RAB items for all projects...');
    
    for (const project of projects) {
      console.log(`📝 Processing: ${project.name}`);
      
      // Faktor harga berdasarkan priority proyek
      const priceMultiplier = {
        'high': 1.3,
        'medium': 1.1, 
        'low': 1.0
      };
      
      const multiplier = priceMultiplier[project.priority] || 1.0;
      let projectTotal = 0;
      
      for (const category of rabCategories) {
        for (const item of category.items) {
          // Random quantity based on item type
          let quantity;
          if (item.unit === 'LS') {
            quantity = 1;
          } else if (item.unit === 'Unit' || item.unit === 'Set') {
            quantity = Math.floor(Math.random() * 20) + 1;
          } else {
            quantity = Math.floor(Math.random() * 500) + 50;
          }
          
          const adjusted_price = Math.round(item.base_price * multiplier);
          const subtotal = quantity * adjusted_price;
          
          await sequelize.query(`
            INSERT INTO project_rab_items (
              id, project_id, category, item_name, unit, quantity, unit_price, subtotal, created_at, updated_at
            ) VALUES (gen_random_uuid(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `, {
            replacements: [
              project.id, category.name, item.name, 
              item.unit, quantity, adjusted_price, subtotal
            ]
          });
          
          totalGenerated++;
          totalValue += subtotal;
          projectTotal += subtotal;
        }
      }
      
      console.log(`   ✅ ${project.name}: Rp ${projectTotal.toLocaleString('id-ID')}`);
    }
    
    console.log(`\n🎉 RAB Generation Complete!`);
    console.log(`📊 Statistics:`);
    console.log(`   • Total Projects: ${projects.length}`);
    console.log(`   • Total RAB Items: ${totalGenerated}`);
    console.log(`   • Total Project Value: Rp ${totalValue.toLocaleString('id-ID')}`);
    console.log(`   • Average per Project: Rp ${Math.round(totalValue/projects.length).toLocaleString('id-ID')}`);
    
    // Show summary per project
    console.log(`\n📋 Project Summary:`);
    for (const project of projects) {
      const rabProjectData = await sequelize.query(
        'SELECT COUNT(*) as count, SUM(subtotal) as total FROM project_rab_items WHERE project_id = ?',
        { 
          replacements: [project.id],
          type: Sequelize.QueryTypes.SELECT 
        }
      );
      
      const total = parseInt(rabProjectData[0].total || 0);
      console.log(`   📊 ${project.name}:`);
      console.log(`      Items: ${rabProjectData[0].count}, Value: Rp ${total.toLocaleString('id-ID')}`);
    }
    
    await sequelize.close();
    console.log(`\n✅ Database connection closed`);
    console.log(`🎊 RAB generation completed successfully!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📍 Stack:', error.stack);
  }
}

generateComprehensiveRAB();
