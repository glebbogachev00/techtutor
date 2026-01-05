import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_vn_subfolder_en_links(file_path):
    """Fix VN subfolder pages (programs/, courses/) to use ../../en/ instead of ../en/"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Replace ../en/index.html with ../../en/index.html
        content = re.sub(
            r'href="\.\./en/index\.html"',
            r'href="../../en/index.html"',
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

print('=== FIXING VN SUBFOLDER LANGUAGE SWITCHER PATHS ===\n')

# Get all VN program and course pages
vn_subfolders = []
for root, dirs, files in os.walk('vn'):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file).replace('\\', '/')
            # Only process files in subfolders (programs/ or courses/)
            if '/programs/' in file_path or '/courses/' in file_path:
                vn_subfolders.append(file_path)

updated = 0

for file_path in sorted(vn_subfolders):
    if os.path.exists(file_path):
        result = fix_vn_subfolder_en_links(file_path)
        if result:
            updated += 1
            print(f'✓ Fixed: {file_path}')

print(f'\n{"=" * 60}')
print(f'✅ Fixed {updated} VN subfolder pages')
print('=' * 60)
