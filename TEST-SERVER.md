# How to Test Locally - Fix "Cannot GET" Error

## ❌ The Problem

You're seeing "Cannot GET /vn/" because the local server isn't serving the files correctly.

---

## ✅ Solution 1: Use Python HTTP Server (Recommended)

```bash
cd "c:\Users\Manthan\.vscode\techtutor"

# Python 3
python -m http.server 5500

# Then visit:
# http://127.0.0.1:5500/en/
# http://127.0.0.1:5500/vn/
```

**Important:** Make sure you're in the `techtutor` directory (not inside `/en` or `/vn`)!

---

## ✅ Solution 2: Use Node.js Serve

```bash
cd "c:\Users\Manthan\.vscode\techtutor"

# Install serve globally (one time only)
npm install -g serve

# Run server
serve -p 5500

# Then visit:
# http://localhost:5500/en/
# http://localhost:5500/vn/
```

---

## ✅ Solution 3: Use VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` (the root one)
3. Select "Open with Live Server"
4. Visit `http://127.0.0.1:5500/en/`

**Note:** Make sure Live Server settings have:
```json
"liveServer.settings.root": "/"
```

---

## 🧪 Testing Steps

### 1. Start the Server
```bash
cd "c:\Users\Manthan\.vscode\techtutor"
python -m http.server 5500
```

You should see:
```
Serving HTTP on :: port 5500 (http://[::]:5500/) ...
```

### 2. Test Root Redirect
Visit: `http://127.0.0.1:5500/`

**Should:**
- Instantly redirect to `/en/` or `/vn/` based on location
- Only show language selection if JavaScript fails

### 3. Test English Version
Visit: `http://127.0.0.1:5500/en/`

**Should show:**
- TechTutor homepage in English
- All images load
- Navigation works

### 4. Test Vietnamese Version
Visit: `http://127.0.0.1:5500/vn/`

**Should show:**
- TechTutor homepage with Vietnamese translations
- All images load
- Navigation works

### 5. Test Language Switcher
1. On `/en/` page, click 🇻🇳 button
2. Should navigate to `/vn/`
3. Click 🇬🇧 button
4. Should navigate back to `/en/`

---

## 🔍 Troubleshooting

### "Cannot GET /en/" or "Cannot GET /vn/"

**Cause:** Server not in correct directory

**Fix:**
```bash
# Make sure you're in the right place:
pwd
# Should show: .../techtutor (NOT .../techtutor/en or .../techtutor/vn)

# If not, go up:
cd ..
# Then start server
python -m http.server 5500
```

### "404 Not Found" for Images

**Cause:** Asset paths incorrect

**Fix:** Images should be at:
- `http://127.0.0.1:5500/images/logo.png` ✓
- NOT `http://127.0.0.1:5500/en/images/logo.png` ✗

Check image paths in HTML:
```html
<!-- In /en/index.html -->
<img src="../images/logo.png"> ✓
<img src="images/logo.png"> ✗
```

### Redirect Happens Too Fast (Can't See Page)

**Expected behavior!** The redirect should be instant. To test language selection fallback:
1. Disable JavaScript in browser DevTools
2. Reload page
3. Should see language selection buttons

---

## 📋 Quick Reference

| URL | Expected Result |
|-----|-----------------|
| `http://127.0.0.1:5500/` | Auto-redirect to `/en/` or `/vn/` |
| `http://127.0.0.1:5500/en/` | English homepage |
| `http://127.0.0.1:5500/vn/` | Vietnamese homepage |
| `http://127.0.0.1:5500/en/free-trial.html` | English free trial page |
| `http://127.0.0.1:5500/vn/free-trial.html` | Vietnamese free trial page |
| `http://127.0.0.1:5500/en/programs/scratch-game-coder.html` | English Scratch program page |

---

## ✅ Correct Directory Structure

Your server should see:
```
techtutor/                  ← START SERVER HERE
├── index.html             ← Geo-redirect page
├── en/                    ← English pages
│   ├── index.html
│   ├── free-trial.html
│   └── programs/
├── vn/                    ← Vietnamese pages
│   ├── index.html
│   ├── free-trial.html
│   └── programs/
├── images/                ← Shared images
└── js/                    ← Shared scripts
```

**DO NOT** start the server from inside `/en` or `/vn`!

---

## 🎯 Final Test Checklist

- [ ] Server started from `techtutor/` directory
- [ ] Root `/` redirects automatically
- [ ] `/en/` loads English homepage
- [ ] `/vn/` loads Vietnamese homepage
- [ ] All images show on EN pages
- [ ] All images show on VN pages
- [ ] Language switcher works (🇬🇧 ↔ 🇻🇳)
- [ ] Navigation between pages works
- [ ] No 404 errors in browser console

---

**Having issues?**
1. Stop the server (Ctrl+C)
2. Double-check you're in `techtutor/` directory
3. Start server again
4. Clear browser cache (Ctrl+Shift+R)
