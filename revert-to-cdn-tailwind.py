import os
import sys
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def revert_to_cdn(file_path):
    """Revert from self-hosted TailwindCSS back to CDN"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Replace self-hosted TailwindCSS with CDN version
        content = content.replace(
            '<script src="../js/tailwind.min.js"></script>',
            '<script src="https://cdn.tailwindcss.com"></script>'
        )
        content = content.replace(
            '<script src="../../js/tailwind.min.js"></script>',
            '<script src="https://cdn.tailwindcss.com"></script>'
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
print('REVERTING TO CDN TAILWINDCSS')
print('='*70)

fixed_count = 0

for file_path in glob.glob('en/**/*.html', recursive=True) + glob.glob('vn/**/*.html', recursive=True):
    if revert_to_cdn(file_path):
        fixed_count += 1
        print(f'✓ Reverted: {file_path}')

print(f'\n✅ Reverted {fixed_count} pages to CDN TailwindCSS')
print('='*70)
print('This fixes the 404 NOT_FOUND error on production')
print('='*70)
