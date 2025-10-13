#!/usr/bin/env node
/**
 * Regenerate ALL thumbnails dengan extension yang benar
 */

const { generateThumbnail, deleteThumbnail } = require('./thumbnailGenerator');
const path = require('path');
const fs = require('fs').promises;

async function regenerateAllThumbnails() {
  console.log('🔄 Starting thumbnail regeneration...\n');
  
  const uploadsDir = '/app/uploads/milestones';  // Absolute path in container
  
  try {
    // Get all files in uploads directory
    const files = await fs.readdir(uploadsDir);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      // Skip directories and thumbnail files
      if (file.startsWith('thumb_') || file === 'thumbnails') {
        continue;
      }
      
      const ext = path.extname(file).toLowerCase();
      // Only process image files
      if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        continue;
      }
      
      const fullPath = path.join(uploadsDir, file);
      
      try {
        console.log(`📸 Processing: ${file}`);
        
        // Delete old thumbnail if exists (wrong format)
        try {
          await deleteThumbnail(fullPath, file);
        } catch (e) {
          // Ignore if doesn't exist
        }
        
        // Generate new thumbnail with correct extension
        const result = await generateThumbnail(fullPath, file);
        console.log(`✅ Generated: ${result.thumbnailUrl}\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed for ${file}:`, error.message, '\n');
        errorCount++;
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  regenerateAllThumbnails()
    .then(() => {
      console.log('✅ Regeneration complete!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Regeneration failed:', err);
      process.exit(1);
    });
}

module.exports = { regenerateAllThumbnails };
