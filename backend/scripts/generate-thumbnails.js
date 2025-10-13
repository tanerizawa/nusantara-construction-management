/**
 * Generate Thumbnails for Existing Photos
 * Run this script to create thumbnails for photos uploaded before thumbnail feature
 */

const path = require('path');
const fs = require('fs').promises;
const { sequelize } = require('../config/database');
const { generateThumbnail } = require('../utils/thumbnailGenerator');

async function generateThumbnailsForExistingPhotos() {
  console.log('🔄 Starting thumbnail generation for existing photos...\n');
  
  try {
    // Get all photos without thumbnails
    const [photos] = await sequelize.query(`
      SELECT id, photo_url, title 
      FROM milestone_photos 
      WHERE thumbnail_url IS NULL 
      ORDER BY created_at DESC
    `);

    if (photos.length === 0) {
      console.log('✅ All photos already have thumbnails!');
      return;
    }

    console.log(`📸 Found ${photos.length} photos without thumbnails\n`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (const photo of photos) {
      const photoPath = path.join(__dirname, photo.photo_url);
      const filename = path.basename(photo.photo_url);
      
      console.log(`Processing: ${filename}...`);

      // Check if original file exists
      try {
        await fs.access(photoPath);
      } catch (err) {
        console.log(`  ⚠️  Skipped - Original file not found`);
        skipCount++;
        continue;
      }

      // Generate thumbnail
      try {
        const result = await generateThumbnail(photoPath, filename);
        
        // Update database
        await sequelize.query(`
          UPDATE milestone_photos 
          SET thumbnail_url = :thumbnailUrl, updated_at = CURRENT_TIMESTAMP
          WHERE id = :photoId
        `, {
          replacements: {
            thumbnailUrl: result.thumbnailUrl,
            photoId: photo.id
          }
        });

        console.log(`  ✅ Generated: ${result.thumbnailFilename}`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ Failed: ${error.message}`);
        failCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed:  ${failCount}`);
    console.log(`   ⚠️  Skipped: ${skipCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (successCount > 0) {
      console.log('🎉 Thumbnail generation complete!');
      console.log('💡 Tip: Refresh your browser to see thumbnails in action.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  generateThumbnailsForExistingPhotos()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateThumbnailsForExistingPhotos };
