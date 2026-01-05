import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def standardize_nav(file_path):
    """Standardize navigation styling across VN pages"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Standardize text color to slate-700 for consistency
        content = content.replace(
            '<div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">',
            '<div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">'
        )

        content = content.replace(
            '<a href="#programs" class="inline-flex items-center gap-1 text-slate-600 hover:text-primary transition">',
            '<a href="#programs" class="inline-flex items-center gap-1 text-slate-700 hover:text-primary transition">'
        )

        # Fix dropdown menu links to use slate-700
        content = content.replace(
            'class="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"',
            'class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100"'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('=== STANDARDIZING VN NAVIGATION STYLING ===\n')

vn_nav_files = [
    'vn/online-courses.html',
    'vn/courses/generative-ai-course.html',
]

success = 0
for file_path in vn_nav_files:
    print(f'Fixing {file_path}...')
    if standardize_nav(file_path):
        success += 1
        print(f'  ✓ Navigation styling standardized\n')
    else:
        print(f'  ✗ Failed\n')

print(f'✅ NAVIGATION STANDARDIZED ON {success}/{len(vn_nav_files)} PAGES!')
print('\nAll VN pages now have consistent header styling matching the homepage.')
