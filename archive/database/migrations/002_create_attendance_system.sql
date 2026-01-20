-- ============================================================================
-- ATTENDANCE SYSTEM MIGRATION
-- ============================================================================
-- Purpose: Complete attendance/absensi system with GPS verification
-- Features: Clock in/out, Location tracking, Selfie photos, Leave requests
-- Created: 2025-10-19
-- ============================================================================

-- ============================================================================
-- 1. PROJECT LOCATIONS TABLE
-- ============================================================================
-- Store project site locations with GPS coordinates for verification
CREATE TABLE IF NOT EXISTS project_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    location_name VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INTEGER NOT NULL DEFAULT 100,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180),
    CONSTRAINT valid_radius CHECK (radius_meters > 0 AND radius_meters <= 5000)
);

CREATE INDEX idx_project_locations_project ON project_locations(project_id);
CREATE INDEX idx_project_locations_active ON project_locations(is_active);

COMMENT ON TABLE project_locations IS 'GPS locations for project sites with verification radius';
COMMENT ON COLUMN project_locations.radius_meters IS 'Allowed distance from location center (default 100m)';

-- ============================================================================
-- 2. ATTENDANCE RECORDS TABLE
-- ============================================================================
-- Main attendance table for clock in/out tracking
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_location_id UUID REFERENCES project_locations(id) ON DELETE SET NULL,
    
    -- Clock In Data
    clock_in_time TIMESTAMP NOT NULL,
    clock_in_latitude DECIMAL(10, 8),
    clock_in_longitude DECIMAL(11, 8),
    clock_in_address TEXT,
    clock_in_photo_url VARCHAR(500),
    clock_in_device_info JSONB,
    clock_in_notes TEXT,
    clock_in_distance_meters DECIMAL(10, 2),
    clock_in_is_valid BOOLEAN DEFAULT true,
    
    -- Clock Out Data
    clock_out_time TIMESTAMP,
    clock_out_latitude DECIMAL(10, 8),
    clock_out_longitude DECIMAL(11, 8),
    clock_out_address TEXT,
    clock_out_photo_url VARCHAR(500),
    clock_out_device_info JSONB,
    clock_out_notes TEXT,
    clock_out_distance_meters DECIMAL(10, 2),
    clock_out_is_valid BOOLEAN,
    
    -- Calculated Fields
    work_duration_minutes INTEGER,
    attendance_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'clocked_in',
    -- Status values: 'clocked_in', 'clocked_out', 'incomplete', 'late', 'early_leave'
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_clock_times CHECK (
        clock_out_time IS NULL OR clock_out_time >= clock_in_time
    ),
    CONSTRAINT valid_status CHECK (
        status IN ('clocked_in', 'clocked_out', 'incomplete', 'late', 'early_leave')
    )
);

CREATE INDEX idx_attendance_user ON attendance_records(user_id);
CREATE INDEX idx_attendance_project ON attendance_records(project_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_status ON attendance_records(status);
CREATE INDEX idx_attendance_user_date ON attendance_records(user_id, attendance_date);
CREATE UNIQUE INDEX idx_attendance_unique_daily ON attendance_records(user_id, project_id, attendance_date);

COMMENT ON TABLE attendance_records IS 'Daily attendance records with GPS verification and selfie photos';
COMMENT ON COLUMN attendance_records.work_duration_minutes IS 'Auto-calculated work duration in minutes';
COMMENT ON COLUMN attendance_records.clock_in_distance_meters IS 'Distance from project location (0 if within radius)';

-- ============================================================================
-- 3. ATTENDANCE SETTINGS TABLE
-- ============================================================================
-- Configurable attendance rules per project
CREATE TABLE IF NOT EXISTS attendance_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id VARCHAR(255) UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Working Hours
    work_start_time TIME NOT NULL DEFAULT '08:00:00',
    work_end_time TIME NOT NULL DEFAULT '17:00:00',
    late_tolerance_minutes INTEGER DEFAULT 15,
    early_leave_tolerance_minutes INTEGER DEFAULT 15,
    
    -- GPS Settings
    require_gps_verification BOOLEAN DEFAULT true,
    max_distance_meters INTEGER DEFAULT 100,
    allow_manual_location BOOLEAN DEFAULT false,
    
    -- Photo Settings
    require_clock_in_photo BOOLEAN DEFAULT true,
    require_clock_out_photo BOOLEAN DEFAULT false,
    
    -- Break Time
    has_break_time BOOLEAN DEFAULT true,
    break_start_time TIME DEFAULT '12:00:00',
    break_end_time TIME DEFAULT '13:00:00',
    
    -- Working Days
    work_days JSONB DEFAULT '["monday", "tuesday", "wednesday", "thursday", "friday"]'::jsonb,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_work_times CHECK (work_end_time > work_start_time),
    CONSTRAINT valid_break_times CHECK (
        NOT has_break_time OR (break_end_time > break_start_time)
    )
);

CREATE INDEX idx_attendance_settings_project ON attendance_settings(project_id);

COMMENT ON TABLE attendance_settings IS 'Configurable attendance rules and working hours per project';
COMMENT ON COLUMN attendance_settings.late_tolerance_minutes IS 'Grace period before marked as late (default 15 minutes)';

-- ============================================================================
-- 4. LEAVE REQUESTS TABLE
-- ============================================================================
-- Employee leave/cuti management
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(255) REFERENCES projects(id) ON DELETE SET NULL,
    
    leave_type VARCHAR(50) NOT NULL,
    -- Leave types: 'sick', 'annual', 'unpaid', 'emergency', 'maternity', 'paternity'
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    attachment_url VARCHAR(500),
    
    status VARCHAR(50) DEFAULT 'pending',
    -- Status values: 'pending', 'approved', 'rejected', 'cancelled'
    
    approved_by VARCHAR(255) REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_leave_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_total_days CHECK (total_days > 0),
    CONSTRAINT valid_leave_type CHECK (
        leave_type IN ('sick', 'annual', 'unpaid', 'emergency', 'maternity', 'paternity')
    ),
    CONSTRAINT valid_leave_status CHECK (
        status IN ('pending', 'approved', 'rejected', 'cancelled')
    )
);

CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_project ON leave_requests(project_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);

COMMENT ON TABLE leave_requests IS 'Employee leave/cuti requests with approval workflow';
COMMENT ON COLUMN leave_requests.total_days IS 'Number of working days (excluding weekends)';

-- ============================================================================
-- 5. ATTENDANCE SUMMARY VIEW
-- ============================================================================
-- Materialized view for monthly attendance summaries
CREATE OR REPLACE VIEW attendance_monthly_summary AS
SELECT 
    user_id,
    project_id,
    DATE_TRUNC('month', attendance_date) as month,
    COUNT(*) as total_days_present,
    COUNT(*) FILTER (WHERE status = 'late') as total_days_late,
    COUNT(*) FILTER (WHERE status = 'early_leave') as total_days_early_leave,
    COUNT(*) FILTER (WHERE status = 'incomplete') as total_days_incomplete,
    AVG(work_duration_minutes) FILTER (WHERE work_duration_minutes IS NOT NULL) as avg_work_hours,
    SUM(work_duration_minutes) as total_work_minutes
FROM attendance_records
GROUP BY user_id, project_id, DATE_TRUNC('month', attendance_date);

COMMENT ON VIEW attendance_monthly_summary IS 'Monthly attendance statistics per user and project';

-- ============================================================================
-- 6. TRIGGERS FOR AUTO-UPDATE
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_locations_updated_at
    BEFORE UPDATE ON project_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
    BEFORE UPDATE ON attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_settings_updated_at
    BEFORE UPDATE ON attendance_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
    BEFORE UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate work duration on clock out
CREATE OR REPLACE FUNCTION calculate_work_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.clock_out_time IS NOT NULL AND NEW.clock_in_time IS NOT NULL THEN
        NEW.work_duration_minutes = EXTRACT(EPOCH FROM (NEW.clock_out_time - NEW.clock_in_time)) / 60;
        NEW.status = 'clocked_out';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_attendance_duration
    BEFORE INSERT OR UPDATE ON attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION calculate_work_duration();

-- ============================================================================
-- 7. SAMPLE DATA (OPTIONAL - FOR DEVELOPMENT)
-- ============================================================================

-- Insert default attendance settings for existing projects
-- INSERT INTO attendance_settings (project_id)
-- SELECT id FROM projects WHERE id NOT IN (SELECT project_id FROM attendance_settings);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

SELECT 'Attendance System Migration Completed Successfully!' as status;
