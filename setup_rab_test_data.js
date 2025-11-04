/**
 * Setup Test Data for RAB System
 * 
 * Creates:
 * - Sample RAB items with different categories
 * - Test milestones linked to RAB categories
 */

const { Sequelize, DataTypes } = require('sequelize');

// Database configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nusantara_construction',
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  logging: false
});

async function setupTestData() {
  try {
    console.log('🚀 Setting up test data for RAB system...\n');

    const projectId = '2025BSR002';

    // Check if project exists
    const [projects] = await sequelize.query(`
      SELECT id, name FROM projects WHERE id = :projectId
    `, {
      replacements: { projectId }
    });

    if (projects.length === 0) {
      console.log(`❌ Project ${projectId} not found in database`);
      console.log('   Available projects:');
      const [allProjects] = await sequelize.query('SELECT id, name FROM projects LIMIT 5');
      allProjects.forEach(p => console.log(`   - ${p.id}: ${p.name}`));
      return;
    }

    console.log(`✅ Found project: ${projects[0].name} (${projectId})\n`);

    // Create RAB items for different categories
    const categories = [
      {
        name: 'Pekerjaan Persiapan',
        items: [
          { desc: 'Pembersihan Lahan', qty: 1000, unit: 'm2', price: 15000 },
          { desc: 'Pengukuran dan Pematokan', qty: 500, unit: 'm2', price: 25000 },
          { desc: 'Direksi Keet', qty: 1, unit: 'ls', price: 50000000 }
        ]
      },
      {
        name: 'Pekerjaan Struktur',
        items: [
          { desc: 'Pondasi Footplate', qty: 20, unit: 'm3', price: 2500000 },
          { desc: 'Kolom Beton K-300', qty: 15, unit: 'm3', price: 3000000 },
          { desc: 'Balok Beton K-300', qty: 25, unit: 'm3', price: 2800000 }
        ]
      },
      {
        name: 'Pekerjaan Arsitektur',
        items: [
          { desc: 'Dinding Bata Merah', qty: 500, unit: 'm2', price: 350000 },
          { desc: 'Plesteran', qty: 1000, unit: 'm2', price: 75000 },
          { desc: 'Pengecatan Tembok', qty: 1000, unit: 'm2', price: 45000 }
        ]
      }
    ];

    console.log('📝 Creating RAB items...\n');

    for (const category of categories) {
      console.log(`📦 Category: ${category.name}`);
      
      for (const item of category.items) {
        const totalPrice = item.qty * item.price;
        
        await sequelize.query(`
          INSERT INTO rab_items (
            project_id, category, description, quantity, unit, unit_price, approval_status
          ) VALUES (
            :projectId, :category, :description, :quantity, :unit, :unitPrice, 'approved'
          )
        `, {
          replacements: {
            projectId,
            category: category.name,
            description: item.desc,
            quantity: item.qty,
            unit: item.unit,
            unitPrice: item.price
          }
        });

        console.log(`   ✓ ${item.desc} - ${item.qty} ${item.unit} @ Rp ${item.price.toLocaleString('id-ID')}`);
      }
      
      console.log('');
    }

    // Calculate totals per category
    console.log('📊 RAB Summary by Category:\n');
    
    const [summary] = await sequelize.query(`
      SELECT 
        category,
        COUNT(*) as item_count,
        SUM(quantity * unit_price) as total_value
      FROM rab_items
      WHERE project_id = :projectId
      GROUP BY category
      ORDER BY category
    `, {
      replacements: { projectId }
    });

    summary.forEach(cat => {
      console.log(`   ${cat.category}:`);
      console.log(`      Items: ${cat.item_count}`);
      console.log(`      Total: Rp ${parseFloat(cat.total_value).toLocaleString('id-ID')}\n`);
    });

    const totalValue = summary.reduce((sum, cat) => sum + parseFloat(cat.total_value), 0);
    console.log(`   💰 Grand Total: Rp ${totalValue.toLocaleString('id-ID')}\n`);

    console.log('✨ Test data created successfully!');
    console.log('   You can now:');
    console.log('   1. Create a new milestone in the UI');
    console.log('   2. Link it to RAB and select a category');
    console.log('   3. View RAB items in the milestone detail\n');

  } catch (error) {
    console.error('❌ Error setting up test data:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

// Run setup
setupTestData();
