#!/usr/bin/env python3
"""
Fix Vietnamese translation loading issues:
1. Remove inline auto-translate script
2. Add vn-auto-translate.js script instead
3. Ensure translations.js loads properly
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).parent

def fix_vn_file(file_path):
    """Fix translation loading in VN file"""
    print(f"Fixing {file_path}...")

    content = file_path.read_text(encoding='utf-8')
    modified = False

    # Remove the inline auto-translate script if present
    if 'Auto-translate Vietnamese pages on load' in content:
        # Remove the entire inline script block
        pattern = r'  <script>\s*// Auto-translate Vietnamese.*?</script>\n'
        content = re.sub(pattern, '', content, flags=re.DOTALL)
        modified = True
        print(f"  Removed inline auto-translate script")

    # Determine the correct path for vn-auto-translate.js
    if 'programs' in str(file_path):
        translate_path = '../../js/vn-auto-translate.js'
    else:
        translate_path = '../js/vn-auto-translate.js'

    # Check if vn-auto-translate.js is already added
    if 'vn-auto-translate.js' not in content:
        # Add vn-auto-translate.js after translations.js
        pattern = r'(<script src="[^"]*translations\.js"[^>]*></script>)'
        replacement = f'\\1\n  <script src="{translate_path}" defer></script>'
        content = re.sub(pattern, replacement, content)
        modified = True
        print(f"  Added vn-auto-translate.js")

    if modified:
        file_path.write_text(content, encoding='utf-8')
        print(f"[OK] Fixed {file_path}")
    else:
        print(f"[SKIP] No changes needed for {file_path}")

def main():
    print("=" * 60)
    print("Fixing Vietnamese translation loading...")
    print("=" * 60)

    # Process VN root files
    vn_dir = BASE_DIR / 'vn'
    count = 0

    for html_file in vn_dir.glob('*.html'):
        if html_file.is_file():
            fix_vn_file(html_file)
            count += 1

    # Process VN programs files
    vn_programs = vn_dir / 'programs'
    if vn_programs.exists():
        for html_file in vn_programs.glob('*.html'):
            if html_file.is_file():
                fix_vn_file(html_file)
                count += 1

    print("\n" + "=" * 60)
    print(f"[SUCCESS] Fixed {count} Vietnamese pages!")
    print("=" * 60)
    print("\nNext: Hard refresh browser (Ctrl+Shift+R) to see translations!")

if __name__ == '__main__':
    main()
