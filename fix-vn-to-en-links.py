import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_vn_to_en_links(file_path):
    """Update VN pages settings icon to point to en/index.html instead of root"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Determine correct path to en/index.html based on file location
        if '/programs/' in file_path or '/courses/' in file_path:
            en_path = '../../en/index.html'
        else:
            en_path = '../en/index.html'

        # Replace settings icon link from ../index.html to ../en/index.html
        # Pattern 1: For vn/ pages (not in subfolders)
        content = re.sub(
            r'href="\.\.\/index\.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition" onclick="localStorage\.setItem\(\\\'tt-lang-manual\\\', \\\'en\\\'\);"',
            f'href="{en_path}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition"',
            content
        )

        # Pattern 2: For vn/programs/ or vn/courses/ pages
        content = re.sub(
            r'href="\.\.\/\.\.\/index\.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition" onclick="localStorage\.setItem\(\\\'tt-lang-manual\\\', \\\'en\\\'\);"',
            f'href="{en_path}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition"',
            content
        )

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== UPDATING VN SETTINGS ICON TO LINK TO EN/ ===\n')

# Get all VN pages
vn_files = glob.glob('vn/**/*.html', recursive=True) + glob.glob('vn/*.html')
vn_files = [f for f in vn_files if 'login.html' not in f and 'admin-portal.html' not in f and 'student-portal.html' not in f]

updated = 0

for file_path in sorted(vn_files):
    if os.path.exists(file_path):
        result = fix_vn_to_en_links(file_path)
        if result:
            updated += 1
            print(f'✓ Fixed: {file_path}')

print(f'\n{"=" * 60}')
print(f'✅ Updated {updated} VN pages to link to en/index.html')
print('=' * 60)
