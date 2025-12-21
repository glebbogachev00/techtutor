# TechTutor Backend Implementation Guide

## 📚 Overview

This guide walks you through implementing the Supabase backend for TechTutor Academy. Follow these steps in order.

## 🎯 What We're Building

- **Secure authentication** with Supabase Auth
- **PostgreSQL database** for student data, courses, progress
- **Cloud file storage** for documents, certificates, videos
- **Row-Level Security** to protect student data
- **Real-time updates** (optional future enhancement)

## 📁 Files Created

| File | Purpose |
|------|---------|
| `supabase-schema.sql` | Database schema with all tables, indexes, RLS policies |
| `js/supabase-client.js` | JavaScript API client for frontend |
| `login-supabase.html` | Updated login page using Supabase auth |
| `SUPABASE_SETUP.md` | Detailed Supabase project setup instructions |
| `IMPLEMENTATION_GUIDE.md` | This file - overall implementation guide |

## 🚀 Implementation Steps

### Phase 1: Supabase Setup (30 minutes)

1. **Follow `SUPABASE_SETUP.md` completely**
   - Create Supabase project
   - Run database schema
   - Configure storage buckets
   - Get API credentials
   - Create admin user

2. **Update `js/supabase-client.js` with your credentials:**
   ```javascript
   const SUPABASE_URL = 'https://your-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

3. **Test connection in browser console:**
   ```javascript
   // Open login-supabase.html in browser
   // Press F12 for console
   supabase.from('courses').select('*').then(console.log);
   // Should see 7 courses
   ```

### Phase 2: Update Login System (15 minutes)

1. **Test the new login page:**
   - Open `login-supabase.html` in browser
   - Try logging in with admin credentials
   - Should redirect to admin-portal.html

2. **When ready, replace old login:**
   ```bash
   # Backup old version
   mv login.html login-old.html

   # Use new version
   mv login-supabase.html login.html
   ```

3. **Add Supabase scripts to admin-portal.html and student-portal.html:**

   Add to `<head>` section:
   ```html
   <!-- Supabase Client Library -->
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

   <!-- TechTutor Supabase Client -->
   <script src="js/supabase-client.js"></script>
   ```

### Phase 3: Update Student Portal (Next Task)

The student portal needs to fetch data from Supabase instead of localStorage.

**Key changes needed in `student-portal.html`:**

1. **Replace session check:**
   ```javascript
   // OLD
   const loggedInStudentId = localStorage.getItem('techtutor_student_logged_in');

   // NEW
   const { user } = await TechTutorAPI.getCurrentUser();
   const { data: student } = await TechTutorAPI.getStudentProfile(user.id);
   ```

2. **Load student data:**
   ```javascript
   // Data comes with all relationships pre-loaded
   const courses = student.course_enrollments;
   const portfolio = student.portfolio_items;
   const achievements = student.achievements;
   const documents = student.documents;
   ```

3. **Download documents:**
   ```javascript
   // OLD: data:base64 strings
   // NEW: Real file URLs
   const certificateUrl = TechTutorAPI.getFileUrl('documents', doc.file_path);
   ```

### Phase 4: Update Admin Portal (Next Task)

The admin portal needs to use Supabase API for CRUD operations.

**Key changes needed in `admin-portal.html`:**

1. **Load all students:**
   ```javascript
   const { data: students } = await TechTutorAPI.getAllStudents();
   ```

2. **Add new student:**
   ```javascript
   const { data, error } = await TechTutorAPI.createStudent(
     email,
     password,
     {
       studentId: 'ST001',
       fullName: 'John Doe'
     }
   );
   ```

3. **Update progress:**
   ```javascript
   await TechTutorAPI.updateCourseProgress(progressId, true);
   ```

4. **Upload files:**
   ```javascript
   const fileInput = document.querySelector('input[type="file"]');
   const file = fileInput.files[0];

   const { data } = await TechTutorAPI.uploadDocument(
     studentId,
     file,
     'certificate' // or 'eoc_report'
   );
   ```

### Phase 5: Data Migration (Important!)

Before going live, migrate existing localStorage data to Supabase.

**Create migration script (`migrate-data.html`):**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Data Migration Tool</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/supabase-client.js"></script>
</head>
<body>
    <h1>TechTutor Data Migration</h1>
    <button onclick="migrateData()">Start Migration</button>
    <div id="status"></div>

    <script>
        async function migrateData() {
            const status = document.getElementById('status');
            status.innerHTML = 'Starting migration...<br>';

            // Get old data from localStorage
            const students = JSON.parse(localStorage.getItem('techtutor_students') || '[]');

            for (const oldStudent of students) {
                try {
                    // Create auth user + student profile
                    const email = `${oldStudent.id}@temp.techtutor.academy`;
                    const { data, error } = await TechTutorAPI.createStudent(
                        email,
                        oldStudent.password,
                        {
                            studentId: oldStudent.id,
                            fullName: oldStudent.name
                        }
                    );

                    if (error) throw error;

                    status.innerHTML += `✓ Migrated ${oldStudent.name}<br>`;

                    // TODO: Migrate courses, portfolio, achievements, documents
                    // This is a template - customize based on your data structure

                } catch (error) {
                    status.innerHTML += `✗ Error migrating ${oldStudent.name}: ${error.message}<br>`;
                }
            }

            status.innerHTML += '<br><strong>Migration complete!</strong>';
        }
    </script>
</body>
</html>
```

### Phase 6: Testing Checklist

Test each feature thoroughly:

**Authentication:**
- [ ] Admin can login
- [ ] Student can login
- [ ] Wrong password shows error
- [ ] Logout works
- [ ] Session persists on refresh

**Student Portal:**
- [ ] Shows correct student data
- [ ] Course progress displays
- [ ] Can download documents
- [ ] Portfolio items show
- [ ] Achievements display

**Admin Portal:**
- [ ] Can view all students
- [ ] Can add new student
- [ ] Can delete student
- [ ] Can update course progress
- [ ] Can upload documents
- [ ] Can add portfolio items
- [ ] Can add achievements

**File Storage:**
- [ ] Document upload works
- [ ] Video upload works
- [ ] Files can be downloaded
- [ ] Files can be deleted

## 🔒 Security Best Practices

1. **Never expose Service Role Key**
   - Only use Anon Key in frontend
   - Service Role is for admin scripts only

2. **Use Row-Level Security**
   - Already configured in schema
   - Students can only see own data
   - Admins can see everything

3. **Validate file uploads:**
   ```javascript
   // Check file type
   const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
   if (!allowedTypes.includes(file.type)) {
     throw new Error('Invalid file type');
   }

   // Check file size (50MB max)
   if (file.size > 50 * 1024 * 1024) {
     throw new Error('File too large');
   }
   ```

4. **Use HTTPS in production**
   - Vercel provides this automatically
   - Never send credentials over HTTP

## 📊 Database Backup

**Set up automated backups in Supabase:**

1. Go to Supabase Dashboard → Database → Backups
2. Enable Point-in-Time Recovery (PITR)
3. Set backup retention to 7 days minimum

**Manual backup:**
```sql
-- Export all data as SQL
pg_dump your_database_url > backup.sql
```

## 🎓 Learning Resources

- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)

## 🆘 Common Issues & Solutions

### "Invalid API key"
- Double-check SUPABASE_URL and SUPABASE_ANON_KEY
- Make sure no extra spaces or quotes
- Verify keys are from correct project

### "Row-level security policy violation"
- Check user is logged in
- Verify admin user in `admins` table
- Review RLS policies in Supabase Dashboard

### "Storage upload failed"
- Check file size limits
- Verify MIME type is allowed
- Ensure storage policies are created

### "User already exists"
- Each email can only be used once
- Delete old user in Auth panel if testing
- Or use unique emails for each student

## 📝 Next Steps After Implementation

1. **Remove old localStorage code**
   - Clean up old authentication code
   - Remove localStorage student management
   - Keep only Supabase calls

2. **Add features:**
   - Email notifications for achievements
   - Real-time progress updates
   - Parent dashboard
   - Analytics and reporting

3. **Optimize performance:**
   - Add database indexes
   - Use CDN for file delivery
   - Implement caching

4. **Monitor usage:**
   - Check Supabase dashboard for usage stats
   - Set up error tracking (Sentry, LogRocket)
   - Monitor performance

## 🎉 Congratulations!

Once complete, you'll have:
- ✅ Secure, scalable backend
- ✅ Real database with proper relationships
- ✅ Cloud file storage
- ✅ Professional authentication
- ✅ Data protection with RLS
- ✅ Production-ready system

Need help? Check the troubleshooting sections or Supabase documentation!
