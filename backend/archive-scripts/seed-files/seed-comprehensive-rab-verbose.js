const { Sequelize, DataTypes } = require('sequelize');

// Verbose logging function
const log = (level, message, details = null) => {
  const timestamp = new Date().toISOString();
  const icons = {
    info: '🔍',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    process: '🔄',
    database: '🗄️',
    project: '🏗️',
    rab: '📋',
    money: '💰'
  };
  
  console.log(`${icons[level] || '📝'} [${timestamp}] ${message}`);
  if (details) {
    console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
  }
};

console.log('🚀 Starting Comprehensive RAB Data Generation (Verbose Mode)...');
console.log('=' * 80);

  // Database configuration with detailed logging
  const dbConfig = {
    host: '172.19.0.3',
    port: 5432,
    database: 'yk_construction_dev',
    username: 'postgres',
    password: 'dev_password',
    dialect: 'postgres',
    logging: (msg) => console.log(`🔍 [DB Query]: ${msg}`),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000,
      requestTimeout: 30000
    }
  };log('info', 'Database Configuration:', dbConfig);

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: 'postgres',
  logging: (msg) => log('database', `SQL: ${msg}`),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Define models
const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  location: DataTypes.STRING,
  budget: DataTypes.DECIMAL,
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  status: DataTypes.STRING
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const RABItem = sequelize.define('RABItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory: DataTypes.STRING,
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  notes: DataTypes.TEXT,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
}, {
  tableName: 'project_rab_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// RAB Categories and Items
const RAB_CATEGORIES = {
  'Persiapan': {
    subcategories: {
      'Mobilisasi': [
        { desc: 'Mobilisasi peralatan dan tenaga kerja', unit: 'ls', basePrice: 15000000, factor: 0.02 },
        { desc: 'Pembuatan direksi keet', unit: 'm2', basePrice: 250000, factor: 0.001 },
        { desc: 'Pembuatan gudang material', unit: 'm2', basePrice: 300000, factor: 0.002 },
        { desc: 'Pemasangan pagar sementara', unit: 'm', basePrice: 85000, factor: 0.01 }
      ],
      'Survey dan Pengukuran': [
        { desc: 'Survey topografi dan pengukuran', unit: 'ha', basePrice: 2500000, factor: 0.001 },
        { desc: 'Pemasangan bowplank/bouwplank', unit: 'm', basePrice: 45000, factor: 0.02 },
        { desc: 'Pengukuran dan pematokan', unit: 'titik', basePrice: 25000, factor: 0.05 }
      ]
    }
  },
  'Pekerjaan Tanah': {
    subcategories: {
      'Galian': [
        { desc: 'Galian tanah pondasi', unit: 'm3', basePrice: 125000, factor: 0.15 },
        { desc: 'Galian tanah saluran drainase', unit: 'm3', basePrice: 95000, factor: 0.05 },
        { desc: 'Galian tanah untuk septic tank', unit: 'm3', basePrice: 115000, factor: 0.008 }
      ],
      'Timbunan': [
        { desc: 'Timbunan tanah kembali', unit: 'm3', basePrice: 85000, factor: 0.12 },
        { desc: 'Timbunan sirtu padat', unit: 'm3', basePrice: 155000, factor: 0.08 },
        { desc: 'Urugan pasir bawah pondasi', unit: 'm3', basePrice: 180000, factor: 0.03 }
      ]
    }
  },
  'Pondasi': {
    subcategories: {
      'Pondasi Dangkal': [
        { desc: 'Pondasi batu kali 1:3', unit: 'm3', basePrice: 850000, factor: 0.08 },
        { desc: 'Pondasi footplate beton K-250', unit: 'm3', basePrice: 1250000, factor: 0.05 },
        { desc: 'Sloof beton bertulang 15/20', unit: 'm', basePrice: 285000, factor: 0.25 }
      ],
      'Pondasi Dalam': [
        { desc: 'Tiang pancang spun pile D30cm', unit: 'm', basePrice: 450000, factor: 0.02 },
        { desc: 'Pile cap beton K-300', unit: 'm3', basePrice: 1350000, factor: 0.01 },
        { desc: 'Tie beam 20/30', unit: 'm', basePrice: 320000, factor: 0.05 }
      ]
    }
  },
  'Struktur': {
    subcategories: {
      'Kolom': [
        { desc: 'Kolom beton K-300 20/20', unit: 'm3', basePrice: 1450000, factor: 0.08 },
        { desc: 'Kolom beton K-300 25/25', unit: 'm3', basePrice: 1480000, factor: 0.06 },
        { desc: 'Kolom beton K-300 30/30', unit: 'm3', basePrice: 1520000, factor: 0.04 }
      ],
      'Balok': [
        { desc: 'Balok induk 25/40', unit: 'm3', basePrice: 1420000, factor: 0.05 },
        { desc: 'Balok anak 15/25', unit: 'm3', basePrice: 1380000, factor: 0.03 },
        { desc: 'Ring balok 15/20', unit: 'm3', basePrice: 1350000, factor: 0.04 }
      ],
      'Pelat': [
        { desc: 'Pelat lantai t=12cm K-250', unit: 'm2', basePrice: 185000, factor: 1.0 },
        { desc: 'Pelat atap t=10cm K-250', unit: 'm2', basePrice: 175000, factor: 0.8 }
      ]
    }
  },
  'Arsitektur': {
    subcategories: {
      'Dinding': [
        { desc: 'Dinding bata merah 1/2 batu', unit: 'm2', basePrice: 125000, factor: 2.5 },
        { desc: 'Dinding batako 15cm', unit: 'm2', basePrice: 95000, factor: 1.8 },
        { desc: 'Plesteran 1:3', unit: 'm2', basePrice: 45000, factor: 3.0 },
        { desc: 'Acian', unit: 'm2', basePrice: 25000, factor: 3.0 }
      ],
      'Pintu dan Jendela': [
        { desc: 'Pintu panel kayu kamper', unit: 'unit', basePrice: 850000, factor: 0.02 },
        { desc: 'Jendela aluminium + kaca', unit: 'm2', basePrice: 650000, factor: 0.15 },
        { desc: 'Kusen kayu kamper', unit: 'm', basePrice: 185000, factor: 0.3 }
      ],
      'Lantai': [
        { desc: 'Lantai keramik 40x40', unit: 'm2', basePrice: 145000, factor: 1.0 },
        { desc: 'Lantai granit 60x60', unit: 'm2', basePrice: 285000, factor: 0.3 },
        { desc: 'Lantai marmer 60x60', unit: 'm2', basePrice: 450000, factor: 0.1 }
      ],
      'Atap': [
        { desc: 'Rangka atap kayu kelas II', unit: 'm2', basePrice: 125000, factor: 1.0 },
        { desc: 'Penutup atap genteng beton', unit: 'm2', basePrice: 85000, factor: 1.0 },
        { desc: 'Penutup atap metal tile', unit: 'm2', basePrice: 145000, factor: 0.8 }
      ]
    }
  },
  'Mekanikal': {
    subcategories: {
      'Plumbing': [
        { desc: 'Pipa air bersih PVC 3/4"', unit: 'm', basePrice: 25000, factor: 0.5 },
        { desc: 'Pipa air kotor PVC 4"', unit: 'm', basePrice: 45000, factor: 0.3 },
        { desc: 'Kloset duduk', unit: 'unit', basePrice: 850000, factor: 0.008 },
        { desc: 'Wastafel', unit: 'unit', basePrice: 450000, factor: 0.012 }
      ],
      'HVAC': [
        { desc: 'AC split 1 PK', unit: 'unit', basePrice: 3500000, factor: 0.01 },
        { desc: 'AC split 1.5 PK', unit: 'unit', basePrice: 4200000, factor: 0.008 },
        { desc: 'Exhaust fan 8"', unit: 'unit', basePrice: 285000, factor: 0.015 }
      ]
    }
  },
  'Elektrikal': {
    subcategories: {
      'Instalasi': [
        { desc: 'Kabel NYA 2.5mm2', unit: 'm', basePrice: 8500, factor: 2.0 },
        { desc: 'Pipa PVC 5/8"', unit: 'm', basePrice: 12000, factor: 1.5 },
        { desc: 'Stop kontak', unit: 'titik', basePrice: 85000, factor: 0.08 },
        { desc: 'Saklar tunggal', unit: 'titik', basePrice: 65000, factor: 0.06 }
      ],
      'Panel dan MCB': [
        { desc: 'Panel listrik 12 group', unit: 'unit', basePrice: 1250000, factor: 0.002 },
        { desc: 'MCB 1 phase 10A', unit: 'unit', basePrice: 85000, factor: 0.01 },
        { desc: 'MCB 3 phase 16A', unit: 'unit', basePrice: 185000, factor: 0.005 }
      ]
    }
  },
  'Landscape': {
    subcategories: {
      'Taman': [
        { desc: 'Penanaman rumput gajah mini', unit: 'm2', basePrice: 45000, factor: 0.2 },
        { desc: 'Penanaman tanaman hias', unit: 'titik', basePrice: 85000, factor: 0.05 },
        { desc: 'Pembuatan taman', unit: 'm2', basePrice: 125000, factor: 0.1 }
      ],
      'Prasarana': [
        { desc: 'Paving block K-300', unit: 'm2', basePrice: 95000, factor: 0.15 },
        { desc: 'Rabat beton', unit: 'm2', basePrice: 65000, factor: 0.05 },
        { desc: 'Saluran drainase U-ditch', unit: 'm', basePrice: 185000, factor: 0.1 }
      ]
    }
  },
  'Pekerjaan Khusus': {
    subcategories: {
      'Finishing Khusus': [
        { desc: 'Cat tembok eksterior', unit: 'm2', basePrice: 35000, factor: 2.0 },
        { desc: 'Cat tembok interior', unit: 'm2', basePrice: 28000, factor: 3.0 },
        { desc: 'Cat kayu dan besi', unit: 'm2', basePrice: 45000, factor: 0.5 }
      ],
      'Utilitas': [
        { desc: 'Septic tank + resapan', unit: 'unit', basePrice: 3500000, factor: 0.002 },
        { desc: 'Sumur bor dalam', unit: 'titik', basePrice: 8500000, factor: 0.001 },
        { desc: 'Ground tank air 1000L', unit: 'unit', basePrice: 2850000, factor: 0.001 }
      ]
    }
  }
};

// Project type multipliers for pricing
const PROJECT_TYPE_MULTIPLIERS = {
  'residential': 1.0,
  'commercial': 1.3,
  'industrial': 1.5,
  'infrastructure': 1.4,
  'healthcare': 1.6,
  'education': 1.2,
  'hospitality': 1.4,
  'mixed-use': 1.3,
  'default': 1.0
};

function generateRABForProject(project) {
  log('process', `Generating RAB for project: ${project.name}`);
  
  const budget = parseFloat(project.budget) || 5000000000; // Default 5 billion
  const projectType = project.type?.toLowerCase() || 'residential';
  const multiplier = PROJECT_TYPE_MULTIPLIERS[projectType] || PROJECT_TYPE_MULTIPLIERS.default;
  
  log('info', 'Project details:', {
    name: project.name,
    type: projectType,
    budget: budget,
    multiplier: multiplier
  });

  const rabItems = [];
  let totalGenerated = 0;

  // Generate RAB items for each category
  Object.entries(RAB_CATEGORIES).forEach(([category, categoryData]) => {
    log('process', `Processing category: ${category}`);
    
    Object.entries(categoryData.subcategories).forEach(([subcategory, items]) => {
      log('process', `Processing subcategory: ${subcategory}`);
      
      items.forEach((item, index) => {
        try {
          // Calculate quantity based on budget and project type
          const baseQuantity = budget * item.factor * multiplier / 1000000000;
          const quantity = Math.max(1, Math.round(baseQuantity * (0.8 + Math.random() * 0.4) * 100) / 100);
          
          // Adjust unit price based on project type and market conditions
          const unitPrice = Math.round(item.basePrice * multiplier * (0.95 + Math.random() * 0.1));
          const totalPrice = Math.round(quantity * unitPrice);
          
          const rabItem = {
            project_id: project.id,
            category: category,
            subcategory: subcategory,
            description: item.desc,
            unit: item.unit,
            quantity: quantity,
            unit_price: unitPrice,
            total_price: totalPrice,
            notes: `Generated for ${projectType} project`,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
          };
          
          rabItems.push(rabItem);
          totalGenerated++;
          
          if (totalGenerated % 10 === 0) {
            log('process', `Generated ${totalGenerated} RAB items so far...`);
          }
          
        } catch (error) {
          log('error', `Failed to generate RAB item: ${item.desc}`, error.message);
        }
      });
    });
  });

  log('success', `Generated ${rabItems.length} RAB items for project ${project.name}`);
  
  // Calculate total project value
  const totalProjectValue = rabItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  log('money', `Total project RAB value: Rp ${totalProjectValue.toLocaleString()}`);
  
  return rabItems;
}

async function generateComprehensiveRAB() {
  const startTime = Date.now();
  log('info', 'Starting comprehensive RAB generation process...');

  try {
    log('database', 'Testing database connection...');
    await sequelize.authenticate();
    log('success', 'Database connection established successfully');

    log('database', 'Clearing existing RAB data...');
    const deletedCount = await RABItem.destroy({ where: {} });
    log('success', `Cleared ${deletedCount} existing RAB items`);

    log('database', 'Fetching all projects...');
    const projects = await Project.findAll();
    log('success', `Found ${projects.length} projects in database`);
    
    if (projects.length === 0) {
      log('warning', 'No projects found in database. Please add projects first.');
      return;
    }

    // Display project list
    projects.forEach((project, index) => {
      log('project', `Project ${index + 1}: ${project.name}`, {
        id: project.id,
        type: project.type || 'N/A',
        location: project.location || 'N/A',
        budget: project.budget ? `Rp ${parseFloat(project.budget).toLocaleString()}` : 'N/A',
        status: project.status || 'N/A'
      });
    });

    let totalRABItems = 0;
    let totalProjectValue = 0;
    let successfulProjects = 0;
    const failedProjects = [];

    // Process each project
    for (const [index, project] of projects.entries()) {
      log('project', `\n--- Processing Project ${index + 1}/${projects.length} ---`);
      log('project', `Project: ${project.name}`);
      
      try {
        const rabItems = generateRABForProject(project);
        
        log('database', `Saving ${rabItems.length} RAB items to database...`);
        const createdItems = await RABItem.bulkCreate(rabItems, {
          validate: true,
          ignoreDuplicates: false
        });
        
        log('success', `Successfully created ${createdItems.length} RAB items for ${project.name}`);
        
        // Calculate project total
        const projectValue = rabItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
        totalProjectValue += projectValue;
        totalRABItems += createdItems.length;
        successfulProjects++;
        
        // Show sample items
        log('rab', `Sample RAB items for ${project.name}:`);
        rabItems.slice(0, 5).forEach((item, idx) => {
          log('rab', `  ${idx + 1}. ${item.category} - ${item.description}`, {
            quantity: `${item.quantity} ${item.unit}`,
            unitPrice: `Rp ${item.unit_price.toLocaleString()}`,
            totalPrice: `Rp ${item.total_price.toLocaleString()}`
          });
        });
        
        if (rabItems.length > 5) {
          log('info', `  ... and ${rabItems.length - 5} more items`);
        }
        
        log('money', `Project ${project.name} total value: Rp ${projectValue.toLocaleString()}`);
        
      } catch (error) {
        log('error', `Failed to generate RAB for project: ${project.name}`, error.message);
        failedProjects.push({ project: project.name, error: error.message });
        continue;
      }
    }

    // Final summary
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(80));
    log('success', '🎉 RAB GENERATION COMPLETE! 🎉');
    console.log('='.repeat(80));
    
    log('success', 'SUMMARY STATISTICS:', {
      totalProjects: projects.length,
      successfulProjects: successfulProjects,
      failedProjects: failedProjects.length,
      totalRABItems: totalRABItems,
      totalProjectValue: `Rp ${totalProjectValue.toLocaleString()}`,
      averageItemsPerProject: Math.round(totalRABItems / successfulProjects),
      averageProjectValue: `Rp ${Math.round(totalProjectValue / successfulProjects).toLocaleString()}`,
      processingTime: `${duration} seconds`
    });

    if (failedProjects.length > 0) {
      log('warning', 'Failed projects:', failedProjects);
    }

    // Category breakdown
    log('info', 'Verifying data in database...');
    const verificationCount = await RABItem.count();
    log('success', `Verification: ${verificationCount} RAB items found in database`);

    // Sample category distribution
    const categoryStats = await sequelize.query(`
      SELECT category, COUNT(*) as count, SUM(total_price) as total_value
      FROM project_rab_items 
      GROUP BY category 
      ORDER BY total_value DESC
    `, { type: Sequelize.QueryTypes.SELECT });

    log('rab', 'Category distribution:');
    categoryStats.forEach(stat => {
      log('rab', `  ${stat.category}: ${stat.count} items, Rp ${parseFloat(stat.total_value).toLocaleString()}`);
    });

  } catch (error) {
    log('error', 'RAB generation failed:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    log('database', 'Closing database connection...');
    await sequelize.close();
    log('success', 'Database connection closed');
  }
}

// Run the generator
generateComprehensiveRAB()
  .then(() => {
    log('success', '🚀 RAB generation process completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    log('error', '💥 RAB generation process failed:', error.message);
    process.exit(1);
  });
