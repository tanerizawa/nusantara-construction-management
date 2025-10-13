-- Add thumbnail_url column to milestone_photos table
-- This will store the path to the thumbnail version of uploaded photos
-- Thumbnails improve performance by loading smaller images in grid views

ALTER TABLE milestone_photos 
ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_milestone_photos_thumbnail 
ON milestone_photos(thumbnail_url);

-- Add comment
COMMENT ON COLUMN milestone_photos.thumbnail_url IS 'Path to thumbnail version of the photo (e.g., /uploads/milestones/thumb_filename.jpg)';
