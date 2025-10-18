const { sequelize } = require('./config/database');
const migration = require('./migrations/20251018110000-create-backup-history');

async function runMigration() {
  try {
    console.log('Running backup history migration...');
    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
