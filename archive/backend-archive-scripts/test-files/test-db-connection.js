const { Sequelize } = require('sequelize');

async function testConnection() {
  console.log('🧪 Testing Database Connection...');
  
  // Test berbagai konfigurasi koneksi
  const configs = [
    {
      name: 'IP Address Direct',
      config: {
        host: '172.19.0.3',
        port: 5432,
        database: 'yk_construction_dev',
        username: 'postgres',
        password: 'dev_password',
        dialect: 'postgres',
        logging: false
      }
    },
    {
      name: 'Container Name',
      config: {
        host: 'yk-postgres-dev',
        port: 5432,
        database: 'yk_construction_dev',
        username: 'postgres',
        password: 'dev_password',
        dialect: 'postgres',
        logging: false
      }
    },
    {
      name: 'Localhost',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'yk_construction_dev',
        username: 'postgres',
        password: 'dev_password',
        dialect: 'postgres',
        logging: false
      }
    }
  ];

  for (const { name, config } of configs) {
    console.log(`\n🔍 Testing ${name}...`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.username}`);
    
    const sequelize = new Sequelize(config);
    
    try {
      await sequelize.authenticate();
      console.log(`✅ ${name}: Connection successful!`);
      
      // Test query
      const result = await sequelize.query('SELECT NOW() as current_time, version() as version', { 
        type: Sequelize.QueryTypes.SELECT 
      });
      console.log(`   📅 Server time: ${result[0].current_time}`);
      console.log(`   📝 Version: ${result[0].version.substring(0, 50)}...`);
      
      // Test projects table
      const projects = await sequelize.query('SELECT COUNT(*) as count FROM projects', { 
        type: Sequelize.QueryTypes.SELECT 
      });
      console.log(`   📊 Projects count: ${projects[0].count}`);
      
      await sequelize.close();
      
      // Jika berhasil, gunakan konfigurasi ini untuk seeder
      console.log(`\n🎯 Using ${name} configuration for RAB generation...`);
      return config;
      
    } catch (error) {
      console.log(`❌ ${name}: Failed - ${error.message}`);
      await sequelize.close().catch(() => {});
    }
  }
  
  throw new Error('No working database connection found');
}

testConnection().then((workingConfig) => {
  console.log('\n🚀 Starting RAB Generation with working config...');
  return generateRAB(workingConfig);
}).catch(error => {
  console.error('❌ Database connection test failed:', error.message);
  process.exit(1);
});

async function generateRAB(dbConfig) {
  const sequelize = new Sequelize(dbConfig);
  
  try {
    console.log('📋 Generating sample RAB data...');
    
    // Get projects
    const projects = await sequelize.query(
      'SELECT id, name, type FROM projects ORDER BY id LIMIT 5',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log(`📊 Found ${projects.length} projects for RAB generation`);
    
    if (projects.length === 0) {
      console.log('⚠️ No projects found. Creating sample projects first...');
      
      await sequelize.query(`
        INSERT INTO projects (name, type, status, start_date, created_at, updated_at) 
        VALUES 
        ('Pembangunan Gedung Perkantoran', 'Commercial', 'Active', NOW(), NOW(), NOW()),
        ('Renovasi Rumah Tinggal', 'Residential', 'Active', NOW(), NOW(), NOW()),
        ('Konstruksi Jembatan', 'Infrastructure', 'Planning', NOW(), NOW(), NOW())
      `);
      
      const newProjects = await sequelize.query(
        'SELECT id, name, type FROM projects ORDER BY id DESC LIMIT 3',
        { type: Sequelize.QueryTypes.SELECT }
      );
      
      console.log(`✅ Created ${newProjects.length} sample projects`);
      projects.push(...newProjects);
    }
    
    // Simple RAB items
    const rabItems = [
      { category: 'Pekerjaan Persiapan', item_name: 'Pembersihan Lahan', unit: 'M2', unit_price: 15000 },
      { category: 'Pekerjaan Persiapan', item_name: 'Pengukuran dan Pematokan', unit: 'M2', unit_price: 8000 },
      { category: 'Pekerjaan Tanah', item_name: 'Galian Tanah Biasa', unit: 'M3', unit_price: 45000 },
      { category: 'Pekerjaan Tanah', item_name: 'Timbunan Tanah', unit: 'M3', unit_price: 35000 },
      { category: 'Pekerjaan Pondasi', item_name: 'Pondasi Batu Kali', unit: 'M3', unit_price: 850000 },
      { category: 'Pekerjaan Pondasi', item_name: 'Cor Beton K225', unit: 'M3', unit_price: 1250000 }
    ];
    
    let totalGenerated = 0;
    
    for (const project of projects) {
      console.log(`📝 Generating RAB for: ${project.name}`);
      
      for (const item of rabItems) {
        const quantity = Math.floor(Math.random() * 100) + 10;
        const total_price = quantity * item.unit_price;
        
        await sequelize.query(`
          INSERT INTO project_rab_items (
            project_id, category, item_name, unit, quantity, 
            unit_price, total_price, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, {
          replacements: [
            project.id, item.category, item.item_name, 
            item.unit, quantity, item.unit_price, total_price
          ]
        });
        
        totalGenerated++;
      }
    }
    
    console.log(`✅ Successfully generated ${totalGenerated} RAB items!`);
    
    // Show summary
    for (const project of projects) {
      const rabCount = await sequelize.query(
        'SELECT COUNT(*) as count FROM project_rab_items WHERE project_id = ?',
        { 
          replacements: [project.id],
          type: Sequelize.QueryTypes.SELECT 
        }
      );
      console.log(`   📊 ${project.name}: ${rabCount[0].count} RAB items`);
    }
    
  } catch (error) {
    console.error('❌ RAB generation error:', error.message);
  } finally {
    await sequelize.close();
  }
}
