import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_absolute_paths_en(file_path):
    """Fix absolute paths in EN pages to use relative paths"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Determine if this is a program page (in subfolder)
        is_program_page = '/programs/' in file_path

        if is_program_page:
            # For EN program pages: /en/... -> ../
            content = re.sub(r'href="/en/programs/', r'href="', content)
            content = re.sub(r'href="/en/"', r'href="../index.html"', content)
            content = re.sub(r'href="/en/#', r'href="../#', content)
            content = re.sub(r'href="/en/([^#"])', r'href="../\1', content)
        else:
            # For EN root pages: /en/... -> (same level or subfolders)
            content = re.sub(r'href="/en/programs/', r'href="programs/', content)
            content = re.sub(r'href="/en/"', r'href="index.html"', content)
            content = re.sub(r'href="/en/#', r'href="#', content)
            content = re.sub(r'href="/en/([^#"])', r'href="\1', content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

def fix_absolute_paths_vn(file_path):
    """Fix absolute paths in VN pages to use relative paths"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Determine if this is a program/course page (in subfolder)
        is_subfolder_page = '/programs/' in file_path or '/courses/' in file_path

        if is_subfolder_page:
            # For VN program/course pages: /vn/... -> ../
            content = re.sub(r'href="/vn/programs/', r'href="', content)
            content = re.sub(r'href="/vn/courses/', r'href="', content)
            content = re.sub(r'href="/vn/', r'href="../', content)
        else:
            # For VN root pages: /vn/... -> (same level or subfolders)
            content = re.sub(r'href="/vn/programs/', r'href="programs/', content)
            content = re.sub(r'href="/vn/courses/', r'href="courses/', content)
            content = re.sub(r'href="/vn/([^#"])', r'href="\1', content)
            content = re.sub(r'href="/vn/#', r'href="#', content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== FIXING ABSOLUTE PATHS TO RELATIVE PATHS ===\n')

# Get all EN pages
en_files = []
for root, dirs, files in os.walk('en'):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file).replace('\\', '/')
            # Exclude portal pages
            if 'admin-portal' not in file_path and 'student-portal' not in file_path and 'login' not in file_path:
                en_files.append(file_path)

# Get all VN pages
vn_files = []
for root, dirs, files in os.walk('vn'):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file).replace('\\', '/')
            # Exclude portal pages
            if 'admin-portal' not in file_path and 'student-portal' not in file_path and 'login' not in file_path:
                vn_files.append(file_path)

updated_en = 0
updated_vn = 0

print('Fixing EN pages...')
for file_path in sorted(en_files):
    if os.path.exists(file_path):
        result = fix_absolute_paths_en(file_path)
        if result:
            updated_en += 1
            print(f'✓ Fixed: {file_path}')

print('\nFixing VN pages...')
for file_path in sorted(vn_files):
    if os.path.exists(file_path):
        result = fix_absolute_paths_vn(file_path)
        if result:
            updated_vn += 1
            print(f'✓ Fixed: {file_path}')

print(f'\n{"=" * 60}')
print(f'✅ Fixed {updated_en} EN pages')
print(f'✅ Fixed {updated_vn} VN pages')
print(f'Total: {updated_en + updated_vn} pages updated')
print('=' * 60)
