/**
 * Supabase Client Configuration
 * TechTutor Academy - Backend Integration
 */

// IMPORTANT: Replace these with your actual Supabase credentials
// Get these from: Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://bcjmswzubfyjcdgwowfb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjam1zd3p1YmZ5amNkZ3dvd2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyOTUyMjIsImV4cCI6MjA4MTg3MTIyMn0.MQNORtCMAQxwHxQTQ3f7HMOCIOeM2I_O0KrEmtaM8LI'; // ← REPLACE THIS with your actual anon/public key

// Initialize Supabase client using CDN pattern
// The CDN loads the library into window.supabase, and we extract createClient from it
const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

/**
 * Sign in with email and password
 */
async function signIn(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Log activity
    await logActivity('login', null, null, { email });

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
}

/**
 * Sign out current user
 */
async function signOut() {
  try {
    await logActivity('logout', null, null, {});

    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
}

/**
 * Get current session
 */
async function getSession() {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }
}

/**
 * Get current user
 */
async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Get user error:', error);
    return { user: null, error };
  }
}

/**
 * Check if current user is admin
 */
async function isAdmin(userId = null) {
  try {
    let targetUserId = userId;

    if (!targetUserId) {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        return false;
      }
      targetUserId = user.id;
    }

    const { data, error } = await supabaseClient
      .from('admins')
      .select('id')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (error) {
      console.warn('Admin check error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('isAdmin error:', error);
    return false;
  }
}

/**
 * Generate next student ID
 */
async function generateStudentId() {
  try {
    // Get all students and find the highest ID number
    const { data: students, error } = await supabaseClient
      .from('students')
      .select('student_id')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    if (!students || students.length === 0) {
      return 'S001';
    }

    // Extract numbers from student IDs and find max
    const numbers = students
      .map(s => {
        const match = s.student_id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      })
      .filter(n => n > 0);

    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNum = maxNum + 1;

    // Format as S001, S002, etc.
    return 'S' + String(nextNum).padStart(3, '0');
  } catch (error) {
    console.error('Generate student ID error:', error);
    // Fallback to timestamp-based ID
    return 'S' + Date.now().toString().slice(-6);
  }
}

/**
 * Create a new student (admin only)
 * Note: This uses regular signup, so students will need to verify their email
 * unless you disable email confirmation in Supabase settings
 */
async function createStudent(password, studentData) {
  let createdUserId = null;

  try {
    // Get current admin session to restore later
    const { data: { session: adminSession } } = await supabaseClient.auth.getSession();

    if (!adminSession) {
      throw new Error('Admin session required');
    }

    // Generate student ID if not provided
    const studentId = studentData.studentId || await generateStudentId();

    // Generate email from student ID
    const email = `${studentId}@techtutor.academy`;

    // Check if student already exists in database
    const { data: existingStudent } = await supabaseClient
      .from('students')
      .select('id')
      .eq('student_id', studentId)
      .single();

    if (existingStudent) {
      throw new Error(`Student ID ${studentId} already exists`);
    }

    // Sign up the new student
    console.log('Creating student with email:', email);
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          student_id: studentId,
          full_name: studentData.fullName
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      // If user already exists in auth, provide clear error
      if (authError.message.includes('already registered')) {
        throw new Error(`Email ${email} already exists. The student ID ${studentId} may have been partially created. Please contact support or use a different student ID.`);
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    createdUserId = authData.user.id;
    console.log('User created:', authData.user.id, 'Email confirmed:', authData.user.confirmed_at);

    // IMPORTANT: Restore admin session BEFORE creating student profile
    // This ensures the INSERT happens with admin privileges
    await supabaseClient.auth.setSession({
      access_token: adminSession.access_token,
      refresh_token: adminSession.refresh_token
    });

    // Now create student profile with admin session
    const { data: student, error: studentError } = await supabaseClient
      .from('students')
      .insert({
        user_id: authData.user.id,
        student_id: studentId,
        full_name: studentData.fullName,
        status: 'active'
      })
      .select()
      .single();

    if (studentError) {
      console.error('Student profile creation error:', studentError);
      throw new Error(`Failed to create student profile: ${studentError.message}. Auth user was created but profile failed.`);
    }

    await logActivity('create_student', 'students', student.id, { studentId });

    return { data: student, error: null };
  } catch (error) {
    console.error('Create student error:', error);
    return { data: null, error };
  }
}

// =====================================================
// STUDENT DATA FUNCTIONS
// =====================================================

/**
 * Get student profile with all related data
 */
async function getStudentProfile(userId = null) {
  try {
    let query = supabaseClient
      .from('students')
      .select(`
        *,
        course_enrollments (
          *,
          courses (*),
          course_progress (*)
        ),
        portfolio_items (*),
        achievements (*),
        documents (*)
      `);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get student profile error:', error);
    return { data: null, error };
  }
}

/**
 * Get all students (admin only)
 */
async function getAllStudents() {
  try {
    const { data, error } = await supabaseClient
      .from('students')
      .select(`
        *,
        course_enrollments (
          *,
          courses (*),
          course_progress (*)
        ),
        portfolio_items (*),
        achievements (*),
        documents (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get all students error:', error);
    return { data: null, error };
  }
}

/**
 * Update student profile
 */
async function updateStudent(studentId, updates) {
  try {
    const { data, error } = await supabaseClient
      .from('students')
      .update(updates)
      .eq('id', studentId)
      .select()
      .single();

    if (error) throw error;

    await logActivity('update_student', 'students', studentId, updates);

    return { data, error: null };
  } catch (error) {
    console.error('Update student error:', error);
    return { data: null, error };
  }
}

/**
 * Delete student
 */
async function deleteStudent(studentId) {
  try {
    const { error } = await supabaseClient
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) throw error;

    await logActivity('delete_student', 'students', studentId, {});

    return { error: null };
  } catch (error) {
    console.error('Delete student error:', error);
    return { error };
  }
}

// =====================================================
// COURSE FUNCTIONS
// =====================================================

/**
 * Get all courses
 */
async function getCourses() {
  try {
    const { data, error } = await supabaseClient
      .from('courses')
      .select('*')
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get courses error:', error);
    return { data: null, error };
  }
}

/**
 * Enroll student in course
 */
async function enrollInCourse(studentId, courseId) {
  try {
    // Check if already enrolled
    const { data: existing } = await supabaseClient
      .from('course_enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single();

    if (existing) {
      // Already enrolled, return existing enrollment
      return { data: existing, error: null };
    }

    // Create enrollment
    const { data: enrollment, error: enrollError } = await supabaseClient
      .from('course_enrollments')
      .insert({
        student_id: studentId,
        course_id: courseId,
        status: 'active',
        progress: 0
      })
      .select()
      .single();

    if (enrollError) throw enrollError;

    // Create progress entries for 3 levels
    const levels = [
      { name: 'Beginner', level: 1 },
      { name: 'Intermediate', level: 2 },
      { name: 'Advanced', level: 3 }
    ];

    const progressEntries = levels.map(l => ({
      enrollment_id: enrollment.id,
      level: l.level,
      level_name: l.name,
      completed: false
    }));

    const { error: progressError } = await supabaseClient
      .from('course_progress')
      .insert(progressEntries);

    if (progressError) throw progressError;

    await logActivity('enroll_course', 'course_enrollments', enrollment.id, { courseId });

    return { data: enrollment, error: null };
  } catch (error) {
    console.error('Enroll in course error:', error);
    return { data: null, error };
  }
}

/**
 * Update course progress
 */
async function updateCourseProgress(progressId, completed) {
  try {
    const updateData = {
      completed,
      completion_date: completed ? new Date().toISOString() : null
    };

    const { data, error } = await supabaseClient
      .from('course_progress')
      .update(updateData)
      .eq('id', progressId)
      .select()
      .single();

    if (error) throw error;

    await logActivity('update_progress', 'course_progress', progressId, updateData);

    return { data, error: null };
  } catch (error) {
    console.error('Update course progress error:', error);
    return { data: null, error };
  }
}

/**
 * Unenroll student from course
 */
async function unenrollFromCourse(enrollmentId) {
  try {
    // Delete course progress entries first
    const { error: progressError } = await supabaseClient
      .from('course_progress')
      .delete()
      .eq('enrollment_id', enrollmentId);

    if (progressError) throw progressError;

    // Delete enrollment
    const { error } = await supabaseClient
      .from('course_enrollments')
      .delete()
      .eq('id', enrollmentId);

    if (error) throw error;

    await logActivity('unenroll_course', 'course_enrollments', enrollmentId, {});

    return { data: null, error: null };
  } catch (error) {
    console.error('Unenroll from course error:', error);
    return { data: null, error };
  }
}

/**
 * Complete course and award trophy
 */
async function completeCourse(enrollmentId, trophy) {
  try {
    const { data, error } = await supabaseClient
      .from('course_enrollments')
      .update({
        completion_date: new Date().toISOString(),
        trophy
      })
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) throw error;

    await logActivity('complete_course', 'course_enrollments', enrollmentId, { trophy });

    return { data, error: null };
  } catch (error) {
    console.error('Complete course error:', error);
    return { data: null, error };
  }
}

// =====================================================
// FILE UPLOAD FUNCTIONS
// =====================================================

/**
 * Upload document (certificate or report)
 */
async function uploadDocument(studentId, file, docType) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}/${docType}/${Date.now()}.${fileExt}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Save metadata to database
    const { data: doc, error: dbError } = await supabaseClient
      .from('documents')
      .insert({
        student_id: studentId,
        doc_type: docType,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single();

    if (dbError) throw dbError;

    await logActivity('upload_document', 'documents', doc.id, { docType, fileName: file.name });

    return { data: doc, error: null };
  } catch (error) {
    console.error('Upload document error:', error);
    return { data: null, error };
  }
}

/**
 * Get public URL for a file
 */
function getFileUrl(bucket, filePath) {
  const { data } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Delete document
 */
async function deleteDocument(documentId, filePath) {
  try {
    // Delete from storage
    const { error: storageError } = await supabaseClient.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabaseClient
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (dbError) throw dbError;

    await logActivity('delete_document', 'documents', documentId, {});

    return { error: null };
  } catch (error) {
    console.error('Delete document error:', error);
    return { error };
  }
}

/**
 * Upload portfolio video
 */
async function uploadPortfolioVideo(studentId, file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}/portfolio/${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseClient.storage
      .from('videos')
      .upload(fileName, file);

    if (error) throw error;

    return { data: data.path, error: null };
  } catch (error) {
    console.error('Upload video error:', error);
    return { data: null, error };
  }
}

/**
 * Upload portfolio image
 */
async function uploadPortfolioImage(studentId, file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}/portfolio/${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseClient.storage
      .from('images')
      .upload(fileName, file);

    if (error) throw error;

    return { data: data.path, error: null };
  } catch (error) {
    console.error('Upload image error:', error);
    return { data: null, error };
  }
}

// =====================================================
// PORTFOLIO FUNCTIONS
// =====================================================

/**
 * Add portfolio item
 */
async function addPortfolioItem(studentId, portfolioData) {
  try {
    const { data, error } = await supabaseClient
      .from('portfolio_items')
      .insert({
        student_id: studentId,
        title: portfolioData.title,
        description: portfolioData.description,
        project_link: portfolioData.projectLink,
        video_path: portfolioData.videoPath
      })
      .select()
      .single();

    if (error) throw error;

    await logActivity('add_portfolio', 'portfolio_items', data.id, { title: portfolioData.title });

    return { data, error: null };
  } catch (error) {
    console.error('Add portfolio item error:', error);
    return { data: null, error };
  }
}

/**
 * Delete portfolio item
 */
async function deletePortfolioItem(portfolioId, videoPath) {
  try {
    // Delete video if exists
    if (videoPath) {
      await supabaseClient.storage
        .from('videos')
        .remove([videoPath]);
    }

    const { error } = await supabaseClient
      .from('portfolio_items')
      .delete()
      .eq('id', portfolioId);

    if (error) throw error;

    await logActivity('delete_portfolio', 'portfolio_items', portfolioId, {});

    return { error: null };
  } catch (error) {
    console.error('Delete portfolio item error:', error);
    return { error };
  }
}

// =====================================================
// ACHIEVEMENT FUNCTIONS
// =====================================================

/**
 * Add achievement
 */
async function addAchievement(studentId, achievementData) {
  try {
    const { data, error } = await supabaseClient
      .from('achievements')
      .insert({
        student_id: studentId,
        title: achievementData.title,
        description: achievementData.description,
        achievement_date: achievementData.date
      })
      .select()
      .single();

    if (error) throw error;

    await logActivity('add_achievement', 'achievements', data.id, { title: achievementData.title });

    return { data, error: null };
  } catch (error) {
    console.error('Add achievement error:', error);
    return { data: null, error };
  }
}

/**
 * Delete achievement
 */
async function deleteAchievement(achievementId) {
  try {
    const { error } = await supabaseClient
      .from('achievements')
      .delete()
      .eq('id', achievementId);

    if (error) throw error;

    await logActivity('delete_achievement', 'achievements', achievementId, {});

    return { error: null };
  } catch (error) {
    console.error('Delete achievement error:', error);
    return { error };
  }
}

// =====================================================
// ACTIVITY LOG
// =====================================================

/**
 * Log admin activity
 */
async function logActivity(action, entityType, entityId, details) {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) return;

    await supabaseClient
      .from('activity_log')
      .insert({
        user_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details
      });
  } catch (error) {
    console.error('Log activity error:', error);
  }
}

/**
 * Get activity log (admin only)
 */
async function getActivityLog(limit = 100) {
  try {
    const { data, error } = await supabaseClient
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get activity log error:', error);
    return { data: null, error };
  }
}

// =====================================================
// EXPORTS
// =====================================================

// Make functions available globally
window.TechTutorAPI = {
  // Auth
  signIn,
  signOut,
  getSession,
  getCurrentUser,
  isAdmin,
  createStudent,

  // Students
  getStudentProfile,
  getAllStudents,
  updateStudent,
  deleteStudent,

  // Courses
  getCourses,
  enrollInCourse,
  unenrollFromCourse,
  updateCourseProgress,
  completeCourse,

  // Files
  uploadDocument,
  getFileUrl,
  deleteDocument,
  uploadPortfolioVideo,
  uploadPortfolioImage,

  // Portfolio
  addPortfolioItem,
  deletePortfolioItem,

  // Achievements
  addAchievement,
  deleteAchievement,

  // Activity
  logActivity,
  getActivityLog
};
