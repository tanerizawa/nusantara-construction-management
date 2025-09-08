// Simple User Migration - Direct Database Insert
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

async function migrateUsers() {
  console.log('👥 Starting simple user migration...');
  
  try {
    // Sample user data from mockup
    const users = [
      {
        id: 'USR001',
        username: 'admin',
        email: 'admin@ykconstruction.com',
        password: 'admin123',
        role: 'admin',
        profile: {
          fullName: 'Administrator',
          position: 'System Admin',
          department: 'IT'
        },
        permissions: ['all'],
        isActive: true
      },
      {
        id: 'USR002', 
        username: 'project_manager1',
        email: 'pm1@ykconstruction.com',
        password: 'pm123',
        role: 'project_manager',
        profile: {
          fullName: 'Project Manager 1',
          position: 'Senior Project Manager',
          department: 'Projects'
        },
        permissions: ['projects', 'reports'],
        isActive: true
      }
    ];

    for (const userData of users) {
      console.log(`🔄 Creating user: ${userData.username}`);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Insert user directly via SQL
      const query = `
        INSERT INTO users (
          id, username, email, password, role, profile, permissions, 
          "isActive", "createdAt", "updatedAt"
        ) VALUES (
          :id, :username, :email, :password, :role, :profile, :permissions,
          :isActive, NOW(), NOW()
        ) ON CONFLICT (id) DO NOTHING;
      `;
      
      await sequelize.query(query, {
        replacements: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          profile: JSON.stringify(userData.profile),
          permissions: JSON.stringify(userData.permissions),
          isActive: userData.isActive
        }
      });
      
      console.log(`✅ User created: ${userData.username}`);
    }
    
    // Check results
    const [results] = await sequelize.query('SELECT id, username, email, role FROM users ORDER BY id');
    console.log('\n📊 Users in database:');
    results.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - ${user.role}`);
    });
    
    console.log('\n✅ User migration completed successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin / admin123');
    console.log('PM: project_manager1 / pm123');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

// Run migration
if (require.main === module) {
  migrateUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = migrateUsers;
