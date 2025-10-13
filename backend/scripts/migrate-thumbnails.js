/**
 * Migrate existing photos to generate thumbnails
 * Run: node scripts/migrate-thumbnails.js
 */

const { sequelize } = require('../config/database');
const { generateThumbnail } = require('../utils/thumbnailGenerator');
const path = require('path');
const fs = require('fs').promises;

async function migratePhotos() {
  console.log('🔄 Starting thumbnail migration...\n');

  try {
    // Get all photos without thumbnails
    const [photos] = await sequelize.query(`
      SELECT id, photo_url, thumbnail_url, title
      FROM milestone_photos
      WHERE thumbnail_url IS NULL OR thumbnail_url = ''
      ORDER BY created_at DESC
    `);

    console.log(`📊 Found ${photos.length} photos without thumbnails\n`);

    if (photos.length === 0) {
      console.log('✅ All photos already have thumbnails!');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const photo of photos) {
      try {
        // Extract filename from photo_url
        // Format: /uploads/milestones/filename.jpg
        const filename = path.basename(photo.photo_url);
        const filePath = path.join(__dirname, '../uploads/milestones', filename);

        console.log(`📸 Processing: ${photo.title || filename}`);
        console.log(`   File: ${filename}`);

        // Check if original file exists
        try {
          await fs.access(filePath);
        } catch (err) {
          console.log(`   ⚠️  Original file not found, skipping`);
          failCount++;
          continue;
        }

        // Generate thumbnail
        const thumbnailResult = await generateThumbnail(filePath, filename);
        console.log(`   ✅ Thumbnail generated: ${thumbnailResult.thumbnailUrl}`);

        // Update database
        await sequelize.query(`
          UPDATE milestone_photos
          SET thumbnail_url = :thumbnailUrl,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = :photoId
        `, {
          replacements: {
            thumbnailUrl: thumbnailResult.thumbnailUrl,
            photoId: photo.id
          }
        });

        console.log(`   ✅ Database updated\n`);
        successCount++;

      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);
        failCount++;
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📊 Total: ${photos.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (successCount > 0) {
      console.log('✅ Migration complete! Thumbnails generated successfully.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  migratePhotos()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Error:', err);
      process.exit(1);
    });
}

module.exports = { migratePhotos };
