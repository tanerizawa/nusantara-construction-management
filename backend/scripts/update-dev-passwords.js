// Update all user passwords for development mode
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

async function updateAllPasswords() {
  console.log('🔑 Updating all user passwords for development mode...');
  
  // Development credentials - easy to remember
  const devCredentials = [
    { username: 'admin', password: 'admin123' },
    { username: 'project_manager1', password: 'pm123' },
    { username: 'finance_manager', password: 'finance123' }
  ];

  try {
    for (const cred of devCredentials) {
      console.log(`🔄 Updating password for: ${cred.username}`);
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(cred.password, 10);
      
      // Update in database
      const [results] = await sequelize.query(
        'UPDATE users SET password = :password WHERE username = :username',
        { 
          replacements: { 
            password: hashedPassword, 
            username: cred.username 
          } 
        }
      );
      
      console.log(`✅ Password updated for: ${cred.username}`);
    }
    
    console.log('\n🎉 All passwords updated successfully!');
    console.log('\n📋 Development Login Credentials:');
    console.log('================================');
    devCredentials.forEach(cred => {
      console.log(`👤 ${cred.username.padEnd(18)} : ${cred.password}`);
    });
    
    console.log('\n🔗 Frontend Login: http://localhost:3000');
    console.log('🔗 API Endpoint: http://localhost:5000/api/auth/login');
    
  } catch (error) {
    console.error('❌ Password update failed:', error.message);
    throw error;
  }
}

// Run the update
if (require.main === module) {
  updateAllPasswords()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = updateAllPasswords;
