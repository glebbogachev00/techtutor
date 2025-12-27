-- Add class schedule fields to course_enrollments table
-- Run this in Supabase SQL Editor

ALTER TABLE course_enrollments
  ADD COLUMN IF NOT EXISTS class_day TEXT,
  ADD COLUMN IF NOT EXISTS class_time TEXT;

-- Update existing enrollments to have null values for new columns
UPDATE course_enrollments
SET
  class_day = NULL,
  class_time = NULL
WHERE class_day IS NULL OR class_time IS NULL;
