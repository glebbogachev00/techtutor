import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_heading(file_path):
    """Fix mixed English/Vietnamese heading"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix the mixed heading
        content = content.replace(
            'New Skills with <span style="color: #193b92;">Thunkable</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học Của Chúng Tôi',
            'Kỹ Năng Mới với <span style="color: #193b92;">Thunkable</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học Của Chúng Tôi'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('Fixing app development heading...\n')

if fix_heading('vn/programs/app-development.html'):
    print('✓ Heading translated:')
    print('  "New Skills with Thunkable" → "Kỹ Năng Mới với Thunkable"')
    print('\n✅ APP DEVELOPMENT PAGE HEADING FIXED!')
else:
    print('✗ Failed to fix heading')
