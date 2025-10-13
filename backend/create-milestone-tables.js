/**
 * Create Milestone Detail Tables Script
 * Run: node create-milestone-tables.js
 */

const { sequelize } = require('./config/database');

const createTables = async () => {
  try {
    console.log('🚀 Creating milestone detail tables...\n');

    // 1. Milestone Photos
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS milestone_photos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
        photo_url VARCHAR(500) NOT NULL,
        photo_type VARCHAR(50) DEFAULT 'progress',
        title VARCHAR(255),
        description TEXT,
        taken_at TIMESTAMP,
        uploaded_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        weather_condition VARCHAR(50),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ milestone_photos table created');

    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_photos_milestone ON milestone_photos(milestone_id)`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_photos_type ON milestone_photos(photo_type)`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_photos_taken ON milestone_photos(taken_at)`);
    console.log('   📑 Indexes created');

    // 2. Milestone Costs
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS milestone_costs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
        cost_category VARCHAR(50) NOT NULL,
        cost_type VARCHAR(50) DEFAULT 'actual',
        amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
        description TEXT,
        reference_number VARCHAR(100),
        recorded_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        approved_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
        approved_at TIMESTAMP,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ milestone_costs table created');

    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_costs_milestone ON milestone_costs(milestone_id)`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_costs_category ON milestone_costs(cost_category)`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_costs_type ON milestone_costs(cost_type)`);
    console.log('   📑 Indexes created');

    // 3. Milestone Activities
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS milestone_activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        activity_title VARCHAR(255) NOT NULL,
        activity_description TEXT,
        performed_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
        performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        related_photo_id UUID,
        related_cost_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ milestone_activities table created');

    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_activities_milestone ON milestone_activities(milestone_id)`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_activities_type ON milestone_activities(activity_type)`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_milestone_activities_performed ON milestone_activities(performed_at DESC)`);
    console.log('   📑 Indexes created');

    console.log('\n✨ All milestone detail tables created successfully!');
    
    // Verify
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('milestone_photos', 'milestone_costs', 'milestone_activities')
      ORDER BY table_name
    `);
    
    console.log('\n📊 Verification:');
    tables.forEach(t => console.log(`   ✓ ${t.table_name}`));

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createTables();
