-- Create Milestone Detail Tables
-- Phase 1: Photos, Costs, Activities

-- 1. Milestone Photos Table
CREATE TABLE IF NOT EXISTS milestone_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  photo_url VARCHAR(500) NOT NULL,
  photo_type VARCHAR(50) DEFAULT 'progress',
  title VARCHAR(255),
  description TEXT,
  taken_at TIMESTAMP,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  weather_condition VARCHAR(50),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_milestone_photos_milestone ON milestone_photos(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_photos_type ON milestone_photos(photo_type);
CREATE INDEX IF NOT EXISTS idx_milestone_photos_taken ON milestone_photos(taken_at);

-- 2. Milestone Costs Table
CREATE TABLE IF NOT EXISTS milestone_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  cost_category VARCHAR(50) NOT NULL,
  cost_type VARCHAR(50) DEFAULT 'actual',
  amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  description TEXT,
  reference_number VARCHAR(100),
  recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_milestone_costs_milestone ON milestone_costs(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_costs_category ON milestone_costs(cost_category);
CREATE INDEX IF NOT EXISTS idx_milestone_costs_type ON milestone_costs(cost_type);
CREATE INDEX IF NOT EXISTS idx_milestone_costs_recorded ON milestone_costs(recorded_at);

-- 3. Milestone Activities Table
CREATE TABLE IF NOT EXISTS milestone_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  activity_title VARCHAR(255) NOT NULL,
  activity_description TEXT,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  related_photo_id UUID REFERENCES milestone_photos(id) ON DELETE SET NULL,
  related_cost_id UUID REFERENCES milestone_costs(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_milestone_activities_milestone ON milestone_activities(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_activities_type ON milestone_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_milestone_activities_performed ON milestone_activities(performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_milestone_activities_performer ON milestone_activities(performed_by);

-- Success message
SELECT 'Milestone detail tables created successfully!' AS result;
