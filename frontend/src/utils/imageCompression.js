/**
 * Image Compression Utility
 * Compresses images to reduce file size before upload
 * Target: Reduce 5MB photos to ~1MB or less
 */

/**
 * Compress image file or blob
 * 
 * @param {File|Blob} file - Image file or blob to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    mimeType = 'image/jpeg',
    maxSizeMB = 1,
  } = options;

  return new Promise((resolve, reject) => {
    // Validate input
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    // Create file reader
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            
            if (width > height) {
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else {
              height = maxHeight;
              width = maxHeight * aspectRatio;
            }
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          // Draw image on canvas
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF'; // White background for JPEG
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              // Check size - if still too large, reduce quality
              const sizeMB = blob.size / (1024 * 1024);
              
              if (sizeMB > maxSizeMB && quality > 0.3) {
                // Recursively compress with lower quality
                const newQuality = quality - 0.1;
                try {
                  const compressedBlob = await compressImage(blob, {
                    ...options,
                    quality: newQuality,
                  });
                  resolve(compressedBlob);
                } catch (err) {
                  reject(err);
                }
              } else {
                resolve(blob);
              }
            },
            mimeType,
            quality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Compress image and return as File object
 * 
 * @param {File} file - Original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed image file
 */
export const compressImageFile = async (file, options = {}) => {
  const blob = await compressImage(file, options);
  
  const fileName = file.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '.jpg');
  
  return new File([blob], fileName, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
};

/**
 * Compress image from dataUrl
 * 
 * @param {string} dataUrl - Base64 data URL
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} { blob, dataUrl, size }
 */
export const compressDataUrl = async (dataUrl, options = {}) => {
  // Convert dataUrl to blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  
  // Compress
  const compressedBlob = await compressImage(blob, options);
  
  // Convert back to dataUrl
  const compressedDataUrl = await blobToDataUrl(compressedBlob);
  
  return {
    blob: compressedBlob,
    dataUrl: compressedDataUrl,
    size: compressedBlob.size,
    sizeMB: (compressedBlob.size / (1024 * 1024)).toFixed(2),
  };
};

/**
 * Convert blob to data URL
 * 
 * @param {Blob} blob - Blob to convert
 * @returns {Promise<string>} Data URL
 */
export const blobToDataUrl = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Convert data URL to blob
 * 
 * @param {string} dataUrl - Data URL to convert
 * @returns {Promise<Blob>} Blob
 */
export const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return await response.blob();
};

/**
 * Get image dimensions from file
 * 
 * @param {File|Blob} file - Image file
 * @returns {Promise<Object>} { width, height }
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
        });
      };
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Format file size for display
 * 
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate image file
 * 
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} { valid, error }
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    minWidth = 0,
    minHeight = 0,
    maxWidth = 10000,
    maxHeight = 10000,
  } = options;

  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File too large (${sizeMB.toFixed(2)} MB). Max: ${maxSizeMB} MB`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Batch compress multiple images
 * 
 * @param {File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<File[]>} Array of compressed files
 */
export const compressMultipleImages = async (files, options = {}, onProgress) => {
  const compressed = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const compressedFile = await compressImageFile(files[i], options);
      compressed.push(compressedFile);
      
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    } catch (err) {
      console.error(`Failed to compress file ${files[i].name}:`, err);
      // Add original file if compression fails
      compressed.push(files[i]);
    }
  }
  
  return compressed;
};

/**
 * Create thumbnail from image
 * 
 * @param {File|Blob} file - Image file
 * @param {number} size - Thumbnail size (width/height)
 * @returns {Promise<Blob>} Thumbnail blob
 */
export const createThumbnail = async (file, size = 150) => {
  return compressImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    mimeType: 'image/jpeg',
  });
};

/**
 * Resize image to exact dimensions (may crop)
 * 
 * @param {File|Blob} file - Image file
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @param {string} fit - Fit mode: 'cover' or 'contain'
 * @returns {Promise<Blob>} Resized image blob
 */
export const resizeImage = async (file, width, height, fit = 'cover') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        let sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight;
        
        if (fit === 'cover') {
          // Cover - may crop
          const scale = Math.max(width / img.width, height / img.height);
          sWidth = width / scale;
          sHeight = height / scale;
          sx = (img.width - sWidth) / 2;
          sy = (img.height - sHeight) / 2;
          dx = 0;
          dy = 0;
          dWidth = width;
          dHeight = height;
        } else {
          // Contain - may have bars
          const scale = Math.min(width / img.width, height / img.height);
          sWidth = img.width;
          sHeight = img.height;
          sx = 0;
          sy = 0;
          dWidth = img.width * scale;
          dHeight = img.height * scale;
          dx = (width - dWidth) / 2;
          dy = (height - dHeight) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.85
        );
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
};

export default {
  compressImage,
  compressImageFile,
  compressDataUrl,
  blobToDataUrl,
  dataUrlToBlob,
  getImageDimensions,
  formatFileSize,
  validateImageFile,
  compressMultipleImages,
  createThumbnail,
  resizeImage,
};
