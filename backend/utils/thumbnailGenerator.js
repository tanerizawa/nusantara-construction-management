/**
 * Image Thumbnail Generator
 * Uses Sharp library to create optimized thumbnails
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Thumbnail configuration
 */
const THUMBNAIL_CONFIG = {
  width: 600,
  height: 600,
  quality: 80,
  format: 'jpeg',
  fit: 'cover', // 'cover', 'contain', 'fill', 'inside', 'outside'
  prefix: 'thumb_'
};

/**
 * Generate thumbnail for an uploaded image
 * @param {string} originalPath - Full path to original image
 * @param {string} filename - Original filename
 * @returns {Promise<{thumbnailPath: string, thumbnailUrl: string}>}
 */
async function generateThumbnail(originalPath, filename) {
  try {
    // Keep original extension instead of forcing .jpeg
    const ext = path.extname(filename);  // .jpg or .jpeg or .png
    const nameWithoutExt = path.basename(filename, ext);
    const thumbnailFilename = `${THUMBNAIL_CONFIG.prefix}${nameWithoutExt}${ext}`;  // Keep original ext
    
    // Create thumbnails subdirectory
    const directory = path.dirname(originalPath);
    const thumbnailDir = path.join(directory, 'thumbnails');
    
    // Ensure thumbnails directory exists
    try {
      await fs.mkdir(thumbnailDir, { recursive: true });
    } catch (err) {
      console.log('Thumbnails dir already exists or created');
    }
    
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);
    
    // Determine format based on extension
    const format = ext.toLowerCase().replace('.', ''); // jpg, jpeg, png, etc.
    const isJpeg = ['jpg', 'jpeg'].includes(format);
    
    // Generate thumbnail using Sharp with appropriate format
    let pipeline = sharp(originalPath)
      .resize(THUMBNAIL_CONFIG.width, THUMBNAIL_CONFIG.height, {
        fit: THUMBNAIL_CONFIG.fit,
        withoutEnlargement: true // Don't upscale small images
      });
    
    // Apply format-specific options
    if (isJpeg) {
      pipeline = pipeline.jpeg({
        quality: THUMBNAIL_CONFIG.quality,
        progressive: true,
        mozjpeg: true // Better compression
      });
    } else if (format === 'png') {
      pipeline = pipeline.png({
        quality: THUMBNAIL_CONFIG.quality,
        compressionLevel: 9
      });
    } else {
      // For other formats, convert to JPEG
      pipeline = pipeline.jpeg({
        quality: THUMBNAIL_CONFIG.quality
      });
    }
    
    // Save thumbnail
    await pipeline.toFile(thumbnailPath);
    
    // Create URL path relative to uploads, in thumbnails subdirectory
    const relativePath = `thumbnails/${thumbnailFilename}`;
    const thumbnailUrl = `/uploads/milestones/${relativePath}`;
    
    console.log(`✅ Thumbnail generated: ${thumbnailUrl}`);
    
    return {
      thumbnailPath,
      thumbnailUrl,
      thumbnailFilename
    };
  } catch (error) {
    console.error('❌ Error generating thumbnail:', error);
    throw new Error(`Failed to generate thumbnail: ${error.message}`);
  }
}

/**
 * Generate thumbnails for multiple images
 * @param {Array} files - Array of uploaded files from Multer
 * @returns {Promise<Array>} Array of thumbnail info
 */
async function generateThumbnails(files) {
  const results = [];
  
  for (const file of files) {
    try {
      const result = await generateThumbnail(file.path, file.filename);
      results.push({
        originalFilename: file.filename,
        ...result
      });
    } catch (error) {
      console.error(`Failed to generate thumbnail for ${file.filename}:`, error);
      // Continue with other files even if one fails
      results.push({
        originalFilename: file.filename,
        thumbnailUrl: null, // Will fallback to original
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Delete thumbnail file when original is deleted
 * @param {string} originalUrl - URL of original photo
 */
async function deleteThumbnail(originalUrl) {
  try {
    // Extract filename from URL
    const filename = path.basename(originalUrl);
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    
    // Construct thumbnail filename
    const thumbnailFilename = `${THUMBNAIL_CONFIG.prefix}${nameWithoutExt}.${THUMBNAIL_CONFIG.format}`;
    const directory = path.dirname(originalUrl.replace('/uploads/milestones/', ''));
    const thumbnailPath = path.join(__dirname, '../uploads/milestones', thumbnailFilename);
    
    // Delete thumbnail file
    await fs.unlink(thumbnailPath);
    console.log(`✅ Thumbnail deleted: ${thumbnailFilename}`);
  } catch (error) {
    console.warn('⚠️  Could not delete thumbnail:', error.message);
    // Don't throw - thumbnail deletion is not critical
  }
}

/**
 * Get image metadata (dimensions, size, etc.)
 * @param {string} imagePath - Path to image file
 * @returns {Promise<object>} Image metadata
 */
async function getImageMetadata(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation
    };
  } catch (error) {
    console.error('Error reading image metadata:', error);
    return null;
  }
}

module.exports = {
  generateThumbnail,
  generateThumbnails,
  deleteThumbnail,
  getImageMetadata,
  THUMBNAIL_CONFIG
};
