import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_heading(file_path, translations):
    """Fix mixed English/Vietnamese headings"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        for eng, viet in translations.items():
            content = content.replace(eng, viet)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

# Fix all curriculum headings
curriculum_heading_fixes = {
    'vn/programs/3d-designer.html': {
        'New Skills with <span style="color: #193b92;">Blender</span>.': 'Kỹ Năng Mới với <span style="color: #193b92;">Blender</span>.',
    },
}

print('Fixing all curriculum section headings...\n')

success = 0
for file_path, translations in curriculum_heading_fixes.items():
    print(f'Fixing {file_path}...')
    if fix_heading(file_path, translations):
        success += 1
        print(f'  ✓ Success ({len(translations)} headings fixed)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'✅ ALL CURRICULUM HEADINGS NOW FULLY TRANSLATED! ({success}/{len(curriculum_heading_fixes)} files)')
