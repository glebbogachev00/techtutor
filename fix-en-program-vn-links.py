import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_en_program_vn_links(file_path):
    """Fix EN program pages to use ../../vn/ instead of ../vn/"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Replace ../vn/index.html with ../../vn/index.html
        content = re.sub(
            r'href="\.\./vn/index\.html"',
            r'href="../../vn/index.html"',
            content
        )

        # Replace ../index.html (back to homepage) with ../../index.html
        content = re.sub(
            r'href="\.\./index\.html',
            r'href="../../index.html',
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

print('=== FIXING EN PROGRAM PAGE LINKS ===\n')

# Get all EN program pages
en_programs = []
for file in os.listdir('en/programs'):
    if file.endswith('.html'):
        en_programs.append(f'en/programs/{file}')

updated = 0

for file_path in sorted(en_programs):
    if os.path.exists(file_path):
        result = fix_en_program_vn_links(file_path)
        if result:
            updated += 1
            print(f'✓ Fixed: {file_path}')

print(f'\n{"=" * 60}')
print(f'✅ Fixed {updated} EN program pages')
print('=' * 60)
