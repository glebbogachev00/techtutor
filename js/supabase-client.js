/**
 * Supabase Client Configuration
 * TechTutor Academy - Backend Integration
 */

// IMPORTANT: Replace these with your actual Supabase credentials
// Get these from: Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Public anon key (safe to expose)

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

/**
 * Sign in with email and password
 */
async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
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

    const { error } = await supabase.auth.signOut();
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
    const { data: { session }, error } = await supabase.auth.getSession();
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
    const { data: { user }, error } = await supabase.auth.getUser();
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
async function isAdmin() {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .single();

    return !error && data !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Create a new student (admin only)
 */
async function createStudent(email, password, studentData) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;

    // Create student profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        user_id: authData.user.id,
        student_id: studentData.studentId,
        full_name: studentData.fullName,
        status: 'active'
      })
      .select()
      .single();

    if (studentError) throw studentError;

    await logActivity('create_student', 'students', student.id, { studentId: studentData.studentId });

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
    let query = supabase
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
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        course_enrollments (
          *,
          courses (*),
          course_progress (*)
        )
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
    const { data, error } = await supabase
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
    const { error } = await supabase
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
    const { data, error } = await supabase
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
    // Create enrollment
    const { data: enrollment, error: enrollError } = await supabase
      .from('course_enrollments')
      .insert({
        student_id: studentId,
        course_id: courseId
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

    const { error: progressError } = await supabase
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

    const { data, error } = await supabase
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
 * Complete course and award trophy
 */
async function completeCourse(enrollmentId, trophy) {
  try {
    const { data, error } = await supabase
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
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Save metadata to database
    const { data: doc, error: dbError } = await supabase
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
  const { data } = supabase.storage
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
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
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

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file);

    if (error) throw error;

    return { data: data.path, error: null };
  } catch (error) {
    console.error('Upload video error:', error);
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
    const { data, error } = await supabase
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
      await supabase.storage
        .from('videos')
        .remove([videoPath]);
    }

    const { error } = await supabase
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
    const { data, error } = await supabase
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
    const { error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
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
    const { data, error } = await supabase
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
  updateCourseProgress,
  completeCourse,

  // Files
  uploadDocument,
  getFileUrl,
  deleteDocument,
  uploadPortfolioVideo,

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
