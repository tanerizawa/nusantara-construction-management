const { Pool } = require('pg');

async function generateRABData() {
  console.log('🚀 Starting Simple RAB Data Generation...');

  // Connection with direct IP
  const pool = new Pool({
    host: '172.19.0.3',
    port: 5432,
    database: 'yk_construction_dev',
    user: 'postgres',
    password: 'dev_password',
  });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');

    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'project_rab_items'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Table project_rab_items does not exist');
      client.release();
      return;
    }

    console.log('✅ Table project_rab_items found');

    // Get projects to generate RAB for
    const projectsResult = await client.query('SELECT id, name, type FROM projects ORDER BY id LIMIT 10');
    const projects = projectsResult.rows;

    console.log(`📊 Found ${projects.length} projects to generate RAB for`);

    // Simple RAB items for testing
    const rabCategories = [
      {
        name: 'Pekerjaan Persiapan',
        items: [
          { name: 'Pembersihan Lahan', unit: 'M2', unit_price: 15000 },
          { name: 'Pengukuran dan Pematokan', unit: 'M2', unit_price: 8000 },
          { name: 'Mobilisasi Alat', unit: 'LS', unit_price: 5000000 }
        ]
      },
      {
        name: 'Pekerjaan Tanah',
        items: [
          { name: 'Galian Tanah Biasa', unit: 'M3', unit_price: 45000 },
          { name: 'Timbunan Tanah', unit: 'M3', unit_price: 35000 },
          { name: 'Pemadatan Tanah', unit: 'M2', unit_price: 12000 }
        ]
      }
    ];

    let totalGenerated = 0;

    for (const project of projects) {
      console.log(`📝 Generating RAB for project: ${project.name}`);

      for (const category of rabCategories) {
        for (const item of category.items) {
          const quantity = Math.floor(Math.random() * 100) + 10;
          const total_price = quantity * item.unit_price;

          await client.query(`
            INSERT INTO project_rab_items (
              project_id, category, item_name, unit, quantity, 
              unit_price, total_price, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          `, [
            project.id,
            category.name,
            item.name,
            item.unit,
            quantity,
            item.unit_price,
            total_price
          ]);

          totalGenerated++;
        }
      }
    }

    console.log(`✅ Generated ${totalGenerated} RAB items successfully!`);
    client.release();

  } catch (error) {
    console.error('❌ Error generating RAB data:', error);
  } finally {
    await pool.end();
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
