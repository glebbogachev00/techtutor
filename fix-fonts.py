import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_font_in_file(file_path):
    """Add Inter font configuration to a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        modified = False

        # Add Inter font import if missing
        if 'fonts.googleapis.com/css2?family=Inter' not in content:
            # Find the icon link and add Inter font after it
            icon_pattern = r'(<link rel="icon"[^>]*>)'
            if re.search(icon_pattern, content):
                inter_font_links = '''
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />'''
                content = re.sub(icon_pattern, r'\1' + inter_font_links, content)
                modified = True

        # Add font-family to tailwind config if missing
        if "fontFamily: { sans: ['Inter'" not in content:
            # Find tailwind.config and add fontFamily
            tailwind_pattern = r'(tailwind\.config\s*=\s*\{[\s\S]*?theme:\s*\{[\s\S]*?extend:\s*\{)'
            if re.search(tailwind_pattern, content):
                content = re.sub(
                    r'(extend:\s*\{)',
                    r'\1\n                    fontFamily: { sans: [\'Inter\', \'system-ui\', \'sans-serif\'] },',
                    content
                )
                modified = True

        # Add body font-family if missing
        if not re.search(r'body\s*\{[^}]*font-family', content):
            # Find body style and add font-family
            body_pattern = r'(body\s*\{)'
            if re.search(body_pattern, content):
                content = re.sub(
                    body_pattern,
                    r'\1\n            font-family: \'Inter\', sans-serif;',
                    content
                )
                modified = True
            else:
                # If no body style exists, add it in the style section
                style_pattern = r'(<style>)'
                if re.search(style_pattern, content):
                    content = re.sub(
                        style_pattern,
                        r'\1\n        body { font-family: \'Inter\', sans-serif; }',
                        content
                    )
                    modified = True

        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

# Fix the 4 problematic files
files_to_fix = [
    'en/admin-portal.html',
    'en/login.html',
    'vn/admin-portal.html',
    'vn/login.html'
]

print('Adding Inter font configuration to pages...\n')

for file_path in files_to_fix:
    print(f'Fixing {file_path}...')
    if fix_font_in_file(file_path):
        print(f'  ✓ Inter font added\n')
    else:
        print(f'  ✗ No changes needed or failed\n')

print('Font standardization completed!')
