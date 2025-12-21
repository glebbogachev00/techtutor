# TechTutor Academy - Supabase Backend Setup Guide

## 📋 Prerequisites

- Supabase account (free tier is sufficient)
- Access to TechTutor repository
- Basic knowledge of SQL

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. **Go to [https://supabase.com](https://supabase.com)** and sign up/login
2. **Click "New Project"**
3. **Fill in project details:**
   - **Name:** `techtutor-academy`
   - **Database Password:** Create a strong password and **SAVE IT SECURELY**
   - **Region:** Choose closest to your users (e.g., Southeast Asia, Singapore)
   - **Pricing Plan:** Free (to start)
4. **Wait for project to initialize** (takes 1-2 minutes)

### Step 2: Run Database Schema

1. **Open Supabase Dashboard** → Your project
2. **Navigate to:** SQL Editor (left sidebar)
3. **Click "New Query"**
4. **Copy the entire contents** of `supabase-schema.sql` file
5. **Paste into the SQL editor**
6. **Click "Run"** or press Cmd/Ctrl + Enter
7. **Verify success:** You should see "Success. No rows returned" message

### Step 3: Configure Storage Buckets

1. **Navigate to:** Storage (left sidebar)
2. **Create two new buckets:**

   **Bucket 1: documents**
   - Click "New bucket"
   - Name: `documents`
   - Public bucket: **Yes** ✓
   - File size limit: 50MB
   - Allowed MIME types: `application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png`
   - Click "Create bucket"

   **Bucket 2: videos**
   - Click "New bucket"
   - Name: `videos`
   - Public bucket: **Yes** ✓
   - File size limit: 100MB
   - Allowed MIME types: `video/mp4,video/quicktime,video/webm`
   - Click "Create bucket"

3. **Set up Storage Policies:**

   For each bucket, go to Policies tab and add:

   **documents bucket policies:**
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload documents"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'documents');

   -- Allow public read access
   CREATE POLICY "Public read access for documents"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'documents');

   -- Allow admins to delete
   CREATE POLICY "Admins can delete documents"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'documents' AND is_admin());
   ```

   **videos bucket policies:**
   ```sql
   -- Allow authenticated users to upload videos
   CREATE POLICY "Authenticated users can upload videos"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'videos');

   -- Allow public read access
   CREATE POLICY "Public read access for videos"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'videos');

   -- Allow admins to delete
   CREATE POLICY "Admins can delete videos"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'videos' AND is_admin());
   ```

### Step 4: Get API Credentials

1. **Navigate to:** Project Settings → API (left sidebar)
2. **Copy these values:**
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (long string starting with `eyJ...`)
   - **Service Role Key** (keep secret! only for admin tools)

3. **Update `js/supabase-client.js`:**

   Replace lines 7-8:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

### Step 5: Create Admin User

1. **Navigate to:** Authentication → Users
2. **Click "Add user"**
3. **Fill in:**
   - Email: `admin@techtutor.academy` (or your email)
   - Password: Create strong password
   - Auto Confirm User: **Yes** ✓
4. **Click "Create user"**
5. **Copy the User ID** (UUID format)

6. **Go to SQL Editor** and run:
   ```sql
   INSERT INTO admins (user_id, full_name)
   VALUES ('paste-user-id-here', 'Admin Name');
   ```

### Step 6: Add Supabase Library to HTML

Add this script tag to the `<head>` section of all relevant pages (login.html, admin-portal.html, student-portal.html):

```html
<!-- Supabase Client Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- TechTutor Supabase Client -->
<script src="js/supabase-client.js"></script>
```

**Order is important!** Supabase library must load before your client file.

### Step 7: Test the Setup

1. **Open browser console** (F12)
2. **Open `login.html`** in browser
3. **In console, test connection:**
   ```javascript
   // Test connection
   supabase.from('courses').select('*').then(console.log);

   // Should see 7 courses returned
   ```

4. **Test admin login:**
   - Email: `admin@techtutor.academy`
   - Password: (the password you set)
   - Should successfully log in

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] 7 courses visible in `courses` table
- [ ] Storage buckets created (`documents`, `videos`)
- [ ] Storage policies configured
- [ ] API credentials copied and updated in `supabase-client.js`
- [ ] Admin user created in Authentication
- [ ] Admin user added to `admins` table
- [ ] Supabase library added to HTML pages
- [ ] Connection test successful in console

## 🔐 Security Notes

1. **Never commit** `SUPABASE_ANON_KEY` to public repositories
   - It's safe to expose in client-side code (it's "public")
   - But keep it in `.env` files for production

2. **Keep Service Role Key secret**
   - Never use in frontend code
   - Only for server-side admin operations

3. **Row-Level Security** is enabled
   - Students can only see their own data
   - Admins can see everything
   - Policies are enforced at database level

## 📊 Database Overview

### Tables Created:
- `courses` - 7 pre-loaded courses
- `students` - Student profiles
- `admins` - Admin users
- `course_enrollments` - Student-course relationships
- `course_progress` - Progress tracking per course level
- `documents` - Certificates and reports
- `portfolio_items` - Student project showcase
- `achievements` - Student achievements
- `activity_log` - Admin action tracking

### Storage Buckets:
- `documents` - PDFs, certificates, reports
- `videos` - Portfolio project videos

## 🆘 Troubleshooting

### "relation does not exist" error
- Make sure you ran the entire schema SQL
- Check SQL Editor for any errors during execution

### "Row level security policy violated"
- Verify user is authenticated
- Check if admin user is in `admins` table
- Review RLS policies in Table Editor → Policies

### Storage upload fails
- Verify bucket exists
- Check file size limits
- Verify MIME type is allowed
- Check storage policies are created

### Can't login
- Verify user exists in Authentication → Users
- Check password is correct
- Verify user has confirmed email (or auto-confirm is enabled)

## 📞 Next Steps

After setup is complete:

1. ✅ Update login.html to use Supabase auth
2. ✅ Update student-portal.html to fetch from database
3. ✅ Update admin-portal.html to use Supabase API
4. ✅ Create data migration script for existing localStorage data
5. ✅ Test all functionality

See `MIGRATION_GUIDE.md` for detailed migration instructions.

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript/introduction)
