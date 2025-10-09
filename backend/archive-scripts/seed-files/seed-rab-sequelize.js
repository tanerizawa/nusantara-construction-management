const { Sequelize, DataTypes } = require('sequelize');

async function generateRABData() {
  console.log('🚀 Starting RAB Data Generation with Sequelize...');

  // Direct database connection
  const sequelize = new Sequelize('yk_construction_dev', 'postgres', 'dev_password', {
    host: '172.19.0.3',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  });

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Define RAB model
    const ProjectRABItem = sequelize.define('ProjectRABItem', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      item_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      unit: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false
      },
      unit_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },
      total_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      }
    }, {
      tableName: 'project_rab_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

    // Get projects
    const projects = await sequelize.query(
      'SELECT id, name, type FROM projects ORDER BY id LIMIT 10',
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log(`📊 Found ${projects.length} projects to generate RAB for`);

    // RAB data
    const rabCategories = [
      {
        name: 'Pekerjaan Persiapan',
        items: [
          { name: 'Pembersihan Lahan', unit: 'M2', unit_price: 15000 },
          { name: 'Pengukuran dan Pematokan', unit: 'M2', unit_price: 8000 },
          { name: 'Mobilisasi Alat', unit: 'LS', unit_price: 5000000 },
          { name: 'Papan Nama Proyek', unit: 'Unit', unit_price: 2500000 }
        ]
      },
      {
        name: 'Pekerjaan Tanah',
        items: [
          { name: 'Galian Tanah Biasa', unit: 'M3', unit_price: 45000 },
          { name: 'Timbunan Tanah', unit: 'M3', unit_price: 35000 },
          { name: 'Pemadatan Tanah', unit: 'M2', unit_price: 12000 },
          { name: 'Galian Tanah Keras', unit: 'M3', unit_price: 65000 }
        ]
      },
      {
        name: 'Pekerjaan Pondasi',
        items: [
          { name: 'Pondasi Batu Kali', unit: 'M3', unit_price: 850000 },
          { name: 'Cor Beton K225', unit: 'M3', unit_price: 1250000 },
          { name: 'Pembesian Pondasi', unit: 'Kg', unit_price: 18000 },
          { name: 'Bekisting Pondasi', unit: 'M2', unit_price: 185000 }
        ]
      },
      {
        name: 'Pekerjaan Struktur',
        items: [
          { name: 'Kolom Beton K300', unit: 'M3', unit_price: 1450000 },
          { name: 'Balok Beton K300', unit: 'M3', unit_price: 1450000 },
          { name: 'Plat Lantai K250', unit: 'M3', unit_price: 1350000 },
          { name: 'Bekisting Kolom', unit: 'M2', unit_price: 195000 }
        ]
      }
    ];

    let totalGenerated = 0;

    for (const project of projects) {
      console.log(`📝 Generating RAB for project: ${project.name}`);

      for (const category of rabCategories) {
        for (const item of category.items) {
          const quantity = Math.floor(Math.random() * 200) + 50;
          const total_price = quantity * item.unit_price;

          await ProjectRABItem.create({
            project_id: project.id,
            category: category.name,
            item_name: item.name,
            unit: item.unit,
            quantity: quantity,
            unit_price: item.unit_price,
            total_price: total_price
          });

          totalGenerated++;
        }
      }
    }

    console.log(`✅ Generated ${totalGenerated} RAB items successfully!`);

    // Show summary
    for (const project of projects) {
      const rabCount = await ProjectRABItem.count({
        where: { project_id: project.id }
      });
      console.log(`📊 Project "${project.name}": ${rabCount} RAB items`);
    }

  } catch (error) {
    console.error('❌ Error generating RAB data:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the generation
generateRABData().then(() => {
  console.log('🎉 RAB generation completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ RAB generation failed:', error);
  process.exit(1);
});
