-- TechTutor Academy Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Courses table (static data)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  total_levels INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table (extends Supabase auth.users)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  completion_date DATE,
  trophy TEXT,
  current_level INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 3),
  current_lesson INTEGER DEFAULT 1 CHECK (current_lesson > 0),
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Course progress (per level)
CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
  level_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(enrollment_id, level)
);

-- Documents (certificates & reports)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('certificate', 'eoc_report')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Portfolio projects
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  project_link TEXT,
  video_path TEXT,
  thumbnail_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  achievement_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_course_progress_enrollment ON course_progress(enrollment_id);
CREATE INDEX idx_documents_student ON documents(student_id);
CREATE INDEX idx_portfolio_student ON portfolio_items(student_id);
CREATE INDEX idx_achievements_student ON achievements(student_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get student_id from user_id
CREATE OR REPLACE FUNCTION get_student_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM students
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- COURSES: Everyone can read
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

-- STUDENTS: Students see own data, admins see all
CREATE POLICY "Students can view own profile"
  ON students FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can insert students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update students"
  ON students FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete students"
  ON students FOR DELETE
  TO authenticated
  USING (is_admin());

-- ADMINS: Only admins can view
CREATE POLICY "Admins can view admins"
  ON admins FOR SELECT
  TO authenticated
  USING (is_admin());

-- COURSE ENROLLMENTS: Students see own, admins see all
CREATE POLICY "Students can view own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING (student_id = get_student_id() OR is_admin());

CREATE POLICY "Admins can manage enrollments"
  ON course_enrollments FOR ALL
  TO authenticated
  USING (is_admin());

-- COURSE PROGRESS: Students see own, admins manage all
CREATE POLICY "Students can view own progress"
  ON course_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_enrollments.id = enrollment_id
      AND (course_enrollments.student_id = get_student_id() OR is_admin())
    )
  );

CREATE POLICY "Admins can manage progress"
  ON course_progress FOR ALL
  TO authenticated
  USING (is_admin());

-- DOCUMENTS: Students see own, admins manage all
CREATE POLICY "Students can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (student_id = get_student_id() OR is_admin());

CREATE POLICY "Admins can manage documents"
  ON documents FOR ALL
  TO authenticated
  USING (is_admin());

-- PORTFOLIO: Students see own, admins manage all
CREATE POLICY "Students can view own portfolio"
  ON portfolio_items FOR SELECT
  TO authenticated
  USING (student_id = get_student_id() OR is_admin());

CREATE POLICY "Admins can manage portfolio"
  ON portfolio_items FOR ALL
  TO authenticated
  USING (is_admin());

-- ACHIEVEMENTS: Students see own, admins manage all
CREATE POLICY "Students can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (student_id = get_student_id() OR is_admin());

CREATE POLICY "Admins can manage achievements"
  ON achievements FOR ALL
  TO authenticated
  USING (is_admin());

-- ACTIVITY LOG: Admins only
CREATE POLICY "Admins can view activity log"
  ON activity_log FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert activity log"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_progress_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert courses
INSERT INTO courses (name, slug, description, total_levels) VALUES
  ('Scratch Game Coder', 'scratch-game-coder', 'Learn programming fundamentals through game creation with Scratch', 3),
  ('GDevelop Game Designer', 'gdevelop-game-designer', 'Create professional 2D games without coding using GDevelop', 3),
  ('Roblox World Creator', 'roblox-world-creator', 'Build immersive 3D worlds and games on Roblox', 3),
  ('3D Designer', '3d-designer', 'Master 3D modeling and design with professional tools', 3),
  ('AI & Programming Quest', 'ai-programming-quest', 'Explore artificial intelligence and advanced programming', 3),
  ('Generative AI Magic', 'generative-ai-magic', 'Harness the power of generative AI tools and technologies', 3),
  ('App Development', 'app-development', 'Build real-world mobile and web applications', 3)
ON CONFLICT (slug) DO NOTHING;

-- Create a demo admin user (you'll need to create this user in Supabase Auth first)
-- After creating the auth user, insert into admins table with:
-- INSERT INTO admins (user_id, full_name) VALUES ('auth-user-id-here', 'Admin Name');
