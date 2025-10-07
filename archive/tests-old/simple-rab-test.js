console.log('🚀 Starting Simple RAB Test...');

const { Sequelize } = require('sequelize');

async function simpleTest() {
  try {
    console.log('📊 Testing database connection...');
    
    const sequelize = new Sequelize('yk_construction_dev', 'postgres', 'dev_password', {
      host: 'database',
      port: 5432,
      dialect: 'postgres',
      logging: false
    });

    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    
    // Test simple query
    const result = await sequelize.query('SELECT NOW() as time', { 
      type: Sequelize.QueryTypes.SELECT 
    });
    console.log('⏰ Current time:', result[0].time);
    
    // Count projects
    const projects = await sequelize.query('SELECT COUNT(*) as count FROM projects', { 
      type: Sequelize.QueryTypes.SELECT 
    });
    console.log('📊 Projects count:', projects[0].count);
    
    // Count RAB items
    const rabItems = await sequelize.query('SELECT COUNT(*) as count FROM project_rab_items', { 
      type: Sequelize.QueryTypes.SELECT 
    });
    console.log('📋 Current RAB items:', rabItems[0].count);
    
    // Test insert one RAB item
    if (projects[0].count > 0) {
      const firstProject = await sequelize.query('SELECT id FROM projects LIMIT 1', { 
        type: Sequelize.QueryTypes.SELECT 
      });
      
      console.log('🧪 Testing RAB insert...');
      await sequelize.query(`
        INSERT INTO project_rab_items (
          id, project_id, category, item_name, unit, quantity, unit_price, subtotal, created_at, updated_at
        ) VALUES (gen_random_uuid(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, {
        replacements: [
          firstProject[0].id, 
          'Test Category', 
          'Test Item', 
          'M2', 
          100, 
          50000, 
          5000000
        ]
      });
      
      console.log('✅ RAB item inserted successfully!');
      
      // Count again
      const newCount = await sequelize.query('SELECT COUNT(*) as count FROM project_rab_items', { 
        type: Sequelize.QueryTypes.SELECT 
      });
      console.log('📋 New RAB items count:', newCount[0].count);
    }
    
    await sequelize.close();
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📍 Stack:', error.stack);
  }
}

simpleTest();
