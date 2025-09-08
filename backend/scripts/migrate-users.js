// Phase 3: User Migration Script
// Migrates users from mockup to database

const MockupDataMapper = require('./data-mapper');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

class UserMigrator {
  constructor() {
    this.mapper = new MockupDataMapper();
    this.migrationReport = {
      started: new Date(),
      completed: null,
      usersProcessed: 0,
      usersCreated: 0,
      usersUpdated: 0,
      usersSkipped: 0,
      errors: []
    };
  }

  async validateUser(userData) {
    const errors = [];

    // Required field validation
    if (!userData.username) errors.push('Username is required');
    if (!userData.email) errors.push('Email is required');
    if (!userData.password) errors.push('Password is required');

    // Format validation
    if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push('Invalid email format');
    }

    if (userData.username && userData.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    // Check for existing users
    if (userData.username) {
      const existingUsername = await User.findOne({ where: { username: userData.username } });
      if (existingUsername) {
        errors.push(`Username '${userData.username}' already exists`);
      }
    }

    if (userData.email) {
      const existingEmail = await User.findOne({ where: { email: userData.email } });
      if (existingEmail) {
        errors.push(`Email '${userData.email}' already exists`);
      }
    }

    return errors;
  }

  async hashPassword(password) {
    // Check if password is already hashed
    if (password.startsWith('$2b$') || password.startsWith('$2a$')) {
      console.log('🔒 Password already hashed, using as-is');
      return password;
    }

    // Hash plain text password
    console.log('🔒 Hashing plain text password');
    return await bcrypt.hash(password, 10);
  }

  async migrateUser(userData) {
    try {
      this.migrationReport.usersProcessed++;

      // Validate user data
      const validationErrors = await this.validateUser(userData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Hash password if needed
      const hashedPassword = await this.hashPassword(userData.password);

      // Prepare user data for database
      const userToCreate = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'supervisor',
        profile: userData.profile || {},
        permissions: userData.permissions || [],
        isActive: userData.isActive !== false,
        lastLogin: userData.lastLogin || null,
        loginAttempts: userData.loginAttempts || 0
      };

      // Create user in database
      const createdUser = await User.create(userToCreate);
      this.migrationReport.usersCreated++;

      console.log(`✅ User created: ${createdUser.username} (${createdUser.email})`);
      return createdUser;

    } catch (error) {
      this.migrationReport.errors.push({
        userId: userData.id,
        username: userData.username,
        email: userData.email,
        error: error.message
      });

      console.error(`❌ Failed to migrate user ${userData.username}: ${error.message}`);
      this.migrationReport.usersSkipped++;
      return null;
    }
  }

  async migrateAllUsers() {
    console.log('👥 Starting user migration...');
    console.log('================================');

    try {
      // Transform mockup data
      const transformedData = await this.mapper.transformAllData();
      const users = transformedData.users;

      console.log(`📊 Found ${users.length} users to migrate`);

      // Migrate each user
      const results = [];
      for (const userData of users) {
        const result = await this.migrateUser(userData);
        if (result) {
          results.push(result);
        }
      }

      // Complete migration report
      this.migrationReport.completed = new Date();
      
      console.log('\n📊 Migration Summary:');
      console.log('====================');
      console.log(`👥 Users processed: ${this.migrationReport.usersProcessed}`);
      console.log(`✅ Users created: ${this.migrationReport.usersCreated}`);
      console.log(`🔄 Users updated: ${this.migrationReport.usersUpdated}`);
      console.log(`⏭️ Users skipped: ${this.migrationReport.usersSkipped}`);
      console.log(`❌ Errors: ${this.migrationReport.errors.length}`);

      if (this.migrationReport.errors.length > 0) {
        console.log('\n❌ Migration Errors:');
        this.migrationReport.errors.forEach(error => {
          console.log(`  - ${error.username} (${error.email}): ${error.error}`);
        });
      }

      // Save migration report
      const fs = require('fs');
      const path = require('path');
      const reportPath = path.join(__dirname, '../logs/user-migration-report.json');
      
      // Ensure logs directory exists
      const logsDir = path.dirname(reportPath);
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      fs.writeFileSync(reportPath, JSON.stringify(this.migrationReport, null, 2));
      console.log(`📄 Migration report saved: ${reportPath}`);

      return {
        success: this.migrationReport.errors.length === 0,
        report: this.migrationReport,
        users: results
      };

    } catch (error) {
      console.error('❌ User migration failed:', error.message);
      throw error;
    }
  }

  async createDefaultAdminUser() {
    console.log('👤 Creating default admin user...');

    const adminUser = {
      id: 'USR000',
      username: 'admin',
      email: 'admin@ykconstruction.com',
      password: 'admin123', // Will be hashed
      role: 'admin',
      profile: {
        fullName: 'System Administrator',
        position: 'System Admin',
        department: 'IT',
        joinDate: new Date().toISOString().split('T')[0]
      },
      permissions: ['all'],
      isActive: true
    };

    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({
        where: { username: 'admin' }
      });

      if (existingAdmin) {
        console.log('⚠️ Admin user already exists');
        return existingAdmin;
      }

      // Create admin user
      const result = await this.migrateUser(adminUser);
      if (result) {
        console.log('✅ Default admin user created successfully');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   ⚠️ Please change the password after first login!');
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to create admin user:', error.message);
      throw error;
    }
  }

  // Rollback migration (for testing)
  async rollbackMigration() {
    console.log('🔄 Rolling back user migration...');
    
    try {
      const deletedCount = await User.destroy({
        where: {},
        truncate: true
      });

      console.log(`✅ Rollback completed. ${deletedCount} users removed.`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      throw error;
    }
  }
}

module.exports = UserMigrator;

// CLI usage
if (require.main === module) {
  const migrator = new UserMigrator();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const command = args[0];

  async function runMigration() {
    try {
      switch (command) {
        case 'rollback':
          await migrator.rollbackMigration();
          break;
        case 'admin':
          await migrator.createDefaultAdminUser();
          break;
        case 'migrate':
        default:
          await migrator.migrateAllUsers();
          break;
      }
      
      console.log('✅ Operation completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Operation failed:', error.message);
      process.exit(1);
    }
  }

  runMigration();
}
