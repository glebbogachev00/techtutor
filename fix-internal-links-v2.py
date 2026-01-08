import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_links_in_file(file_path):
    """Fix links to avoid going through root redirects"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Determine if file is in a subfolder (programs/ or courses/)
        is_subfolder = '/programs/' in file_path.replace('\\', '/') or '/courses/' in file_path.replace('\\', '/')

        # Fix links that go to root: href="../../xxx.html" → href="../xxx.html" (for subfolders)
        # or href="../xxx.html" → href="xxx.html" (for root level pages)

        if is_subfolder:
            # For files in subfolders (en/programs/*, vn/courses/*),
            # ../../blog.html goes to root (wrong), should be ../blog.html (goes to en/ or vn/)
            content = re.sub(
                r'href="\.\./\.\./(?!en/|vn/|images/|js/)([\w-]+\.html)"',
                r'href="../\1"',
                content
            )
            # Also fix index.html#programs specifically
            content = re.sub(
                r'href="\.\./\.\./index\.html',
                r'href="../index.html',
                content
            )
        else:
            # For root level pages in en/ or vn/ folders
            # ../blog.html goes to root (wrong), should be blog.html (stays in en/ or vn/)
            content = re.sub(
                r'href="\.\./([\w-]+\.html)"',
                r'href="\1"',
                content
            )

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'✗ Error processing {file_path}: {e}')
        return False

print('='*70)
print('FIXING INTERNAL LINKS - CORRECT VERSION')
print('='*70)

fixed_count = 0

# Fix all EN pages
print('\nFixing EN pages...')
for file_path in glob.glob('en/**/*.html', recursive=True):
    if fix_links_in_file(file_path):
        fixed_count += 1
        print(f'✓ Fixed: {file_path}')

# Fix all VN pages
print('\nFixing VN pages...')
for file_path in glob.glob('vn/**/*.html', recursive=True):
    if fix_links_in_file(file_path):
        fixed_count += 1
        print(f'✓ Fixed: {file_path}')

print(f'\n✅ Fixed internal links in {fixed_count} files')
print('='*70)
print('\nFixed path structure:')
print('  • Root level pages (en/*.html): links stay within en/')
print('  • Subfolder pages (en/programs/*.html): use ../ to reach en/')
print('  • No links go through root redirect pages')
print('='*70)
