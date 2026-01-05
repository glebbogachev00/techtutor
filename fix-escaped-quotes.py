import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_escaped_quotes(file_path):
    """Fix escaped quotes in font configuration"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix escaped quotes in fontFamily
        content = content.replace(
            "fontFamily: { sans: [\\'Inter\\', \\'system-ui\\', \\'sans-serif\\'] }",
            "fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }"
        )

        # Fix escaped quotes in body font-family
        content = content.replace(
            "font-family: \\'Inter\\', sans-serif;",
            "font-family: 'Inter', sans-serif;"
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

files_to_fix = [
    'en/admin-portal.html',
    'vn/admin-portal.html',
    'vn/login.html'
]

print('Fixing escaped quotes in font configuration...\n')

for file_path in files_to_fix:
    print(f'Fixing {file_path}...')
    if fix_escaped_quotes(file_path):
        print(f'  ✓ Fixed\n')
    else:
        print(f'  ✗ Failed\n')

print('Done!')
