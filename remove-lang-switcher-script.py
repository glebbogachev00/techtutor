import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def remove_lang_switcher_script(file_path):
    """Remove lang-switcher.js script from EN pages"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Remove the lang-switcher.js script tag (handles both ../ and ../../ paths)
        content = re.sub(
            r'\s*<script src="\.\.\/(?:\.\.\/)?js\/lang-switcher\.js" defer><\/script>\s*',
            '\n',
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

print('=== REMOVING LANG-SWITCHER.JS FROM EN PAGES ===\n')

# Get all EN pages
en_files = glob.glob('en/**/*.html', recursive=True) + glob.glob('en/*.html')

updated = 0

for file_path in sorted(en_files):
    if os.path.exists(file_path):
        result = remove_lang_switcher_script(file_path)
        if result:
            updated += 1
            print(f'✓ Removed script: {file_path}')

print(f'\n{"=" * 60}')
print(f'✅ Removed lang-switcher.js from {updated} EN pages')
print('=' * 60)
