-- Add new columns to course_enrollments table
-- Run this in Supabase SQL Editor

ALTER TABLE course_enrollments
  ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_lesson INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;

-- Add constraints
ALTER TABLE course_enrollments
  ADD CONSTRAINT check_current_level CHECK (current_level BETWEEN 1 AND 3),
  ADD CONSTRAINT check_current_lesson CHECK (current_lesson > 0),
  ADD CONSTRAINT check_progress CHECK (progress BETWEEN 0 AND 100);

-- Update existing enrollments to have default values
UPDATE course_enrollments
SET
  current_level = COALESCE(current_level, 1),
  current_lesson = COALESCE(current_lesson, 1),
  status = COALESCE(status, 'active'),
  progress = COALESCE(progress, 0)
WHERE current_level IS NULL
   OR current_lesson IS NULL
   OR status IS NULL
   OR progress IS NULL;
