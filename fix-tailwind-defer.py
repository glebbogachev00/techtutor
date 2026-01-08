import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_tailwind_defer(file_path):
    """Remove defer from TailwindCSS script - it breaks the styling"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Remove defer from TailwindCSS script
        content = content.replace(
            '<script src="../js/tailwind.min.js" defer></script>',
            '<script src="../js/tailwind.min.js"></script>'
        )
        content = content.replace(
            '<script src="../../js/tailwind.min.js" defer></script>',
            '<script src="../../js/tailwind.min.js"></script>'
        )

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'✗ Error processing {file_path}: {e}')
        return False

print('='*70)
print('FIXING TAILWIND DEFER ISSUE')
print('='*70)

fixed_count = 0

for file_path in glob.glob('en/**/*.html', recursive=True) + glob.glob('vn/**/*.html', recursive=True):
    if fix_tailwind_defer(file_path):
        fixed_count += 1
        print(f'✓ Fixed: {file_path}')

print(f'\n✅ Fixed TailwindCSS in {fixed_count} pages')
print('='*70)
print('TailwindCSS now loads synchronously (required for inline config)')
print('='*70)
