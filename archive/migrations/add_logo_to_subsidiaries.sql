-- Add logo column to subsidiaries table
-- Migration: add_logo_to_subsidiaries

ALTER TABLE subsidiaries 
ADD COLUMN IF NOT EXISTS logo VARCHAR(500) NULL;

-- Add index for faster queries if needed
CREATE INDEX IF NOT EXISTS idx_subsidiaries_logo ON subsidiaries(logo) WHERE logo IS NOT NULL;

-- Update comment
COMMENT ON COLUMN subsidiaries.logo IS 'Path to company logo file (relative path from uploads directory)';

-- Verify column added
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name = 'subsidiaries' AND column_name = 'logo';
