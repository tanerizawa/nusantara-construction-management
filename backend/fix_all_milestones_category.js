/**
 * Fix All Milestones - Add category_name to category_link
 * 
 * This script automatically fixes all milestones that have category_link
 * but are missing category_name by inferring it from their RAB items.
 */

const { Sequelize } = require('sequelize');

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

async function fixAllMilestones() {
  try {
    console.log('🔍 Searching for milestones with missing category_name...\n');

    // Find all milestones with category_link but no category_name
    const [milestones] = await sequelize.query(`
      SELECT 
        id, 
        title, 
        project_id,
        category_link
      FROM project_milestones
      WHERE category_link IS NOT NULL
        AND category_link->>'enabled' = 'true'
        AND category_link->>'category_name' IS NULL
      ORDER BY created_at DESC
    `);

    if (milestones.length === 0) {
      console.log('✅ No milestones need fixing. All have category_name!');
      return;
    }

    console.log(`Found ${milestones.length} milestones that need fixing:\n`);

    let fixedCount = 0;
    let failedCount = 0;

    for (const milestone of milestones) {
      console.log(`📌 Milestone: ${milestone.title} (${milestone.id})`);
      console.log(`   Project ID: ${milestone.project_id}`);

      // Try to infer category from RAB items linked to this project
      const [rabItems] = await sequelize.query(`
        SELECT DISTINCT category
        FROM project_rab
        WHERE project_id = :projectId
        ORDER BY category
        LIMIT 1
      `, {
        replacements: { projectId: milestone.project_id }
      });

      if (rabItems.length === 0) {
        console.log(`   ⚠️  No RAB items found for project - cannot infer category`);
        failedCount++;
        continue;
      }

      const categoryName = rabItems[0].category;
      console.log(`   🎯 Inferred category: "${categoryName}"`);

      // Update milestone with category_name
      const updatedCategoryLink = {
        ...milestone.category_link,
        category_name: categoryName
      };

      await sequelize.query(`
        UPDATE project_milestones
        SET category_link = :categoryLink
        WHERE id = :milestoneId
      `, {
        replacements: {
          categoryLink: JSON.stringify(updatedCategoryLink),
          milestoneId: milestone.id
        }
      });

      console.log(`   ✅ Fixed! Added category_name: "${categoryName}"\n`);
      fixedCount++;
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Fixed: ${fixedCount} milestones`);
    console.log(`   ⚠️  Failed: ${failedCount} milestones`);
    console.log(`   📝 Total: ${milestones.length} milestones processed\n`);

    if (fixedCount > 0) {
      console.log('✨ All fixable milestones have been updated!');
      console.log('   Users can now view RAB items without errors.\n');
    }

  } catch (error) {
    console.error('❌ Error fixing milestones:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

// Run the fix
fixAllMilestones();
