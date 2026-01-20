/**
 * Direct Migration Script - Add Approval Workflow to milestone_costs
 * Run with: node run_migration_approval_workflow.js
 */

const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'nusantara_construction',
  password: 'admin123',
  port: 5432,
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Starting migration: Add approval workflow to milestone_costs...\n');

    await client.query('BEGIN');

    // 1. Add status column
    console.log('📌 Adding column: status...');
    await client.query(`
      ALTER TABLE milestone_costs 
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' NOT NULL;
    `);
    console.log('✅ Added column: status\n');

    // 2. Add submission tracking
    console.log('📌 Adding submission tracking columns...');
    await client.query(`
      ALTER TABLE milestone_costs 
      ADD COLUMN IF NOT EXISTS submitted_by VARCHAR(255),
      ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;
    `);
    console.log('✅ Added columns: submitted_by, submitted_at\n');

    // 3. Add rejection tracking
    console.log('📌 Adding rejection tracking columns...');
    await client.query(`
      ALTER TABLE milestone_costs 
      ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
      ADD COLUMN IF NOT EXISTS rejected_by VARCHAR(255),
      ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;
    `);
    console.log('✅ Added columns: rejection_reason, rejected_by, rejected_at\n');

    // 4. Add finance transaction link
    console.log('📌 Adding finance transaction link...');
    await client.query(`
      ALTER TABLE milestone_costs 
      ADD COLUMN IF NOT EXISTS finance_transaction_id VARCHAR(255);
    `);
    console.log('✅ Added column: finance_transaction_id\n');

    // 5. Add CHECK constraint for status
    console.log('📌 Adding CHECK constraint for status...');
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE milestone_costs 
        ADD CONSTRAINT chk_milestone_costs_status 
        CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'paid'));
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);
    console.log('✅ Added CHECK constraint: status values\n');

    // 6. Create indexes
    console.log('📌 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_milestone_costs_status 
      ON milestone_costs(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_milestone_costs_submitted 
      ON milestone_costs(submitted_at);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_milestone_costs_finance_txn 
      ON milestone_costs(finance_transaction_id);
    `);
    console.log('✅ Created indexes: status, submitted_at, finance_transaction_id\n');

    // 7. Migrate existing data
    console.log('📌 Migrating existing data to "approved" status...');
    const result = await client.query(`
      UPDATE milestone_costs
      SET 
        status = 'approved',
        submitted_by = recorded_by,
        submitted_at = recorded_at,
        approved_at = recorded_at
      WHERE recorded_at IS NOT NULL AND status = 'draft';
    `);
    console.log(`✅ Migrated ${result.rowCount} existing records to "approved" status\n`);

    await client.query('COMMIT');

    // Verify migration
    console.log('📊 Verifying migration...');
    const verification = await client.query(`
      SELECT 
        status, 
        COUNT(*) as count 
      FROM milestone_costs 
      GROUP BY status 
      ORDER BY status;
    `);
    console.log('\n📊 Current status distribution:');
    verification.rows.forEach(row => {
      console.log(`   ${row.status.padEnd(15)}: ${row.count} records`);
    });

    console.log('\n✅ ✅ ✅ MIGRATION COMPLETED SUCCESSFULLY ✅ ✅ ✅\n');
    console.log('📝 Summary:');
    console.log('   - Added 7 new columns (status, submitted_by, submitted_at, rejection_reason, rejected_by, rejected_at, finance_transaction_id)');
    console.log('   - Added CHECK constraint for status values');
    console.log('   - Created 3 indexes for performance');
    console.log(`   - Migrated ${result.rowCount} existing records to "approved" status`);
    console.log('\n🚀 System ready for approval workflow!\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('✅ Migration script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
