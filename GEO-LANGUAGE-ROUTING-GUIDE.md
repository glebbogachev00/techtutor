# Geo-Language Routing Implementation Guide

## 🎯 Overview

This branch (`feature/geo-language-routing`) implements automatic language detection and routing based on user geolocation. Vietnamese users are redirected to `/vn/` while all others go to `/en/`.

---

## 📁 File Structure

```
techtutor/
├── index.html                      [MODIFIED] - Geo-redirect landing page
├── index.html.original-backup      [NEW] - Backup of original index
├── en/                            [NEW] - English version
│   └── index.html                 English homepage (paths updated)
├── vn/                            [NEW] - Vietnamese version (TODO)
│   └── index.html                 Vietnamese homepage (to be created)
├── js/
│   ├── geo-redirect.js            [NEW] - Geo-location detection
│   ├── lang-switcher.js           [NEW] - Manual language switching
│   ├── carousel.js                [UNCHANGED]
│   ├── site.js                    [UNCHANGED]
│   └── app.js                     [UNCHANGED]
└── images/                        [SHARED] - All images remain in root
```

---

## 🚀 How It Works

### 1. Root Landing Page (`/`)
- Shows loading spinner with TechTutor branding
- Runs [geo-redirect.js](js/geo-redirect.js)
- Manual language selection available

### 2. Geo-Detection Logic
```javascript
// Uses CloudFlare CDN trace API
fetch('https://cloudflare.com/cdn-cgi/trace')
  └─> Detects country code
      ├─> VN → Redirect to /vn/
      └─> Others → Redirect to /en/
```

### 3. User Override
- Manual selection saves preference to `localStorage` (key: `tt-lang-manual`)
- Future visits skip geo-detection and use saved preference
- Language switcher buttons (🇬🇧 / 🇻🇳) trigger [lang-switcher.js](js/lang-switcher.js)

---

## ✅ Completed Tasks

- ✅ Created new git branch `feature/geo-language-routing`
- ✅ Backed up original [index.html](index.html.original-backup)
- ✅ Created `/en` and `/vn` directories
- ✅ Implemented [geo-redirect.js](js/geo-redirect.js)
- ✅ Implemented [lang-switcher.js](js/lang-switcher.js)
- ✅ Created new root [index.html](index.html) with redirect logic
- ✅ Updated English version with:
  - Hreflang tags for SEO
  - Canonical URLs
  - Corrected asset paths (`../images/`, `../js/`)
  - Language-prefixed internal links

---

## 📋 TODO: Next Steps

### 1. Create Vietnamese Version
```bash
# Copy English version as base
cp en/index.html vn/index.html

# Replace English content with Vietnamese translations
# Use the existing translations from js/translations.js (vi object)
```

### 2. Update All Page Links
All internal navigation links need language prefixes:

**English version (`/en/`):**
```html
<a href="/en/free-trial.html">Free Trial</a>
<a href="/en/programs/scratch-game-coder.html">Scratch</a>
```

**Vietnamese version (`/vn/`):**
```html
<a href="/vn/free-trial.html">Dùng Thử Miễn Phí</a>
<a href="/vn/programs/scratch-game-coder.html">Scratch</a>
```

### 3. Create Other Language Pages
Each major page needs both /en and /vn versions:
- [ ] free-trial.html
- [ ] how-it-works.html
- [ ] blog.html
- [ ] plans-and-faq.html
- [ ] student-projects.html
- [ ] online-courses.html
- [ ] login.html
- [ ] student-portal.html
- [ ] admin-portal.html
- [ ] All program pages (`programs/*.html`)
- [ ] All blog pages (`blog-*.html`)

### 4. Update `sitemap.xml`
```xml
<url>
  <loc>https://techtutor.academy/en/</loc>
  <xhtml:link rel="alternate" hreflang="vi" href="https://techtutor.academy/vn/"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://techtutor.academy/en/"/>
</url>
```

### 5. Update `robots.txt`
```txt
User-agent: *
Allow: /en/
Allow: /vn/
Disallow: /js/
Disallow: /css/
```

### 6. Test Locally
```bash
# Start local server
python3 -m http.server 8000
# or
npx serve

# Test scenarios:
# 1. Visit localhost:8000/ → should redirect
# 2. Click English → should go to /en/
# 3. Click Vietnamese → should go to /vn/
# 4. Switch language → should save preference
# 5. Reload → should respect saved preference
```

### 7. Deploy to Staging
- Push branch to GitHub
- Deploy to Vercel staging environment
- Test with actual geo-location (use VPN to test Vietnam IP)

---

## 🔍 Testing Checklist

### Local Testing
- [ ] Root `/` shows redirect page
- [ ] English button navigates to `/en/`
- [ ] Vietnamese button navigates to `/vn/`
- [ ] All images load correctly in `/en/`
- [ ] All images load correctly in `/vn/`
- [ ] Language switcher works in both versions
- [ ] localStorage saves preference

### Geo-Location Testing
- [ ] Test from Vietnam IP → redirects to `/vn/`
- [ ] Test from US IP → redirects to `/en/`
- [ ] Test from other countries → redirects to `/en/`
- [ ] After manual selection, no auto-redirect occurs

### SEO Testing
- [ ] Hreflang tags present on all pages
- [ ] Canonical URLs correct
- [ ] Sitemap includes all language versions
- [ ] No duplicate content issues
- [ ] Google Search Console validates hreflang

---

## 🛡️ SEO Protection

### Implemented:
- ✅ Hreflang tags on all pages
- ✅ Canonical URLs
- ✅ `x-default` hreflang points to `/en/`
- ✅ Language switcher for user override

### To Implement:
- [ ] Update sitemap.xml with all language URLs
- [ ] Submit to Google Search Console
- [ ] Monitor for crawl errors
- [ ] Verify hreflang implementation

---

## 🚨 Important Notes

1. **Asset Paths**: All `/en/` and `/vn/` pages use relative paths:
   - Images: `../images/filename.png`
   - Scripts: `../js/filename.js`
   - CSS: `../css/filename.css`

2. **No Duplicate Images**: Images remain in `/images/` (shared by both languages)

3. **User Choice Preserved**: Once a user manually selects a language, they won't be auto-redirected again

4. **Fallback to English**: If geo-detection fails, default to English

5. **Static Content**: No runtime translation - each language has static HTML

---

## 📞 Questions?

If you encounter issues:
1. Check browser console for errors
2. Verify localStorage value (`tt-lang-manual`)
3. Test with browser DevTools Network tab
4. Clear localStorage to reset preference

---

## 🎉 When Complete

Merge this branch to `main`:
```bash
git add .
git commit -m "Implement geo-based language routing with EN/VN support"
git push origin feature/geo-language-routing

# Create Pull Request for review
# After approval, merge to main
```

---

**Created:** January 2, 2026
**Branch:** `feature/geo-language-routing`
**Status:** In Progress (English version complete, Vietnamese pending)
