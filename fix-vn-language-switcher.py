import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_vn_language_switcher(file_path):
    """Fix VN pages to properly save language preference when switching to English"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Find settings icon links and add onclick handler
        # Pattern: <a href="../index.html" or <a href="../../index.html"
        pattern = r'(<a href="\.\.\/(?:\.\.\/)?index\.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">)'

        # Add onclick to save 'en' preference
        replacement = r'<a href="../index.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition" onclick="localStorage.setItem(\'tt-lang-manual\', \'en\');">'

        # For files in vn/programs or vn/courses (need ../../)
        if '/programs/' in file_path or '/courses/' in file_path:
            replacement = r'<a href="../../index.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition" onclick="localStorage.setItem(\'tt-lang-manual\', \'en\');">'

        content = re.sub(pattern, replacement, content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== FIXING VN LANGUAGE SWITCHER ===\n')

# Get all VN pages
vn_files = glob.glob('vn/**/*.html', recursive=True) + glob.glob('vn/*.html')
vn_files = [f for f in vn_files if 'login.html' not in f and 'admin-portal.html' not in f and 'student-portal.html' not in f]

updated = 0

for file_path in sorted(vn_files):
    if os.path.exists(file_path):
        result = fix_vn_language_switcher(file_path)
        if result:
            updated += 1
            print(f'✓ Fixed: {file_path}')

print(f'\n{"=" * 60}')
print(f'✅ Fixed language switcher on {updated} VN pages')
print('=' * 60)
