const { sequelize, testConnection, models } = require('./models');
const { syncDatabase } = require('./models');

async function testDatabaseSetup() {
  console.log('🧪 Testing Database Setup');
  console.log('========================');
  
  try {
    // Test connection
    console.log('\n1. Testing database connection...');
    const connectionSuccess = await testConnection();
    
    if (!connectionSuccess) {
      throw new Error('Database connection failed');
    }
    
    // Test models
    console.log('\n2. Testing models...');
    const { User, Project, InventoryItem, FinanceTransaction } = models;
    
    console.log('✅ User model loaded');
    console.log('✅ Project model loaded');
    console.log('✅ InventoryItem model loaded');
    console.log('✅ FinanceTransaction model loaded');
    
    // Test database sync (optional - will create tables if not exist)
    console.log('\n3. Testing database sync...');
    await syncDatabase({ alter: true });
    
    // Test simple query
    console.log('\n4. Testing simple queries...');
    const userCount = await User.count();
    const projectCount = await Project.count();
    
    console.log(`📊 Users in database: ${userCount}`);
    console.log(`📊 Projects in database: ${projectCount}`);
    
    console.log('\n🎉 All database tests passed!');
    console.log('\nDatabase is ready for use.');
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    console.error('Please check your database configuration and ensure PostgreSQL is running.');
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run test if script is executed directly
if (require.main === module) {
  testDatabaseSetup();
}

module.exports = { testDatabaseSetup };
