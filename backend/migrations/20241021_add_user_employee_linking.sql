-- ============================================================================
-- Migration: Add User-Employee Linking
-- Date: 2024-10-21
-- Purpose: Create bidirectional optional linking between users and employees
-- ============================================================================

-- Step 1: Add employee_id column to users table
ALTER TABLE users 
ADD COLUMN employee_id VARCHAR(50) DEFAULT NULL;

-- Step 2: Add user_id column to manpower table
ALTER TABLE manpower 
ADD COLUMN user_id VARCHAR(50) DEFAULT NULL;

-- Step 3: Add foreign key constraint for users.employee_id -> manpower.id
ALTER TABLE users
ADD CONSTRAINT fk_users_employee_id
FOREIGN KEY (employee_id) 
REFERENCES manpower(id)
ON UPDATE CASCADE
ON DELETE SET NULL;

-- Step 4: Add foreign key constraint for manpower.user_id -> users.id
ALTER TABLE manpower
ADD CONSTRAINT fk_manpower_user_id
FOREIGN KEY (user_id)
REFERENCES users(id)
ON UPDATE CASCADE
ON DELETE SET NULL;

-- Step 5: Add indexes for performance
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_manpower_user_id ON manpower(user_id);

-- Step 6: Add comments for documentation
COMMENT ON COLUMN users.employee_id IS 'Optional link to employee record (manpower table). NULL if user is not an employee (e.g., external consultant, client)';
COMMENT ON COLUMN manpower.user_id IS 'Optional link to user account. NULL if employee does not need system access (e.g., field worker, laborer)';

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Check users table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name = 'employee_id';

-- Check manpower table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'manpower' 
  AND column_name = 'user_id';

-- Check foreign key constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('users', 'manpower')
  AND (kcu.column_name = 'employee_id' OR kcu.column_name = 'user_id');

-- ============================================================================
-- Rollback Script (if needed)
-- ============================================================================
/*
-- Remove foreign key constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_employee_id;
ALTER TABLE manpower DROP CONSTRAINT IF EXISTS fk_manpower_user_id;

-- Remove indexes
DROP INDEX IF EXISTS idx_users_employee_id;
DROP INDEX IF EXISTS idx_manpower_user_id;

-- Remove columns
ALTER TABLE users DROP COLUMN IF EXISTS employee_id;
ALTER TABLE manpower DROP COLUMN IF EXISTS user_id;
*/
