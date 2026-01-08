import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_ga_placement(file_path):
    """Fix Google Analytics script placement - inline script should be with external script at end"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Check if the inline GA script is in the wrong place (in head instead of with external script)
        inline_ga_pattern = r'<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];.*?gtag\(\'config\', \'G-4MZ1XEZXB6\'\);.*?</script>'
        inline_match = re.search(inline_ga_pattern, content, re.DOTALL)

        if inline_match:
            inline_script = inline_match.group(0)

            # Remove inline script from current location
            content = content.replace(inline_script, '', 1)

            # Add it right before the external GA script tag
            content = content.replace(
                '<!-- Google tag (gtag.js) -->\n  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4MZ1XEZXB6"></script>',
                f'<!-- Google tag (gtag.js) -->\n  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4MZ1XEZXB6"></script>\n  {inline_script}'
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
print('FIXING GOOGLE ANALYTICS PLACEMENT')
print('='*70)

fixed_count = 0

for file_path in glob.glob('en/**/*.html', recursive=True) + glob.glob('vn/**/*.html', recursive=True):
    if fix_ga_placement(file_path):
        fixed_count += 1
        print(f'✓ Fixed: {file_path}')

print(f'\n✅ Fixed Google Analytics placement in {fixed_count} pages')
print('='*70)
