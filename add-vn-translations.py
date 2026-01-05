#!/usr/bin/env python3
"""
Add Vietnamese auto-translation to all VN pages
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Auto-translation script to inject
AUTO_TRANSLATE_SCRIPT = '''  <script>
    // Auto-translate Vietnamese pages on load
    if (window.pageTranslations) {
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (window.pageTranslations.vi && window.pageTranslations.vi[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.placeholder = window.pageTranslations.vi[key];
            } else {
              el.innerHTML = window.pageTranslations.vi[key];
            }
          }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
          const key = el.getAttribute('data-i18n-placeholder');
          if (window.pageTranslations.vi && window.pageTranslations.vi[key]) {
            el.placeholder = window.pageTranslations.vi[key];
          }
        });
      });
    }
  </script>
'''

def process_vn_file(file_path):
    """Add translations.js and auto-translate script to VN file"""
    print(f"Processing {file_path}...")

    content = file_path.read_text(encoding='utf-8')
    modified = False

    # Check if translations.js is already loaded
    if 'translations.js' not in content:
        # Determine the correct path based on file location
        if 'programs' in str(file_path):
            translations_path = '../../js/translations.js'
        else:
            translations_path = '../js/translations.js'

        # Add translations.js before lang-switcher.js
        pattern = r'(<script src="\.\.(/\.\.)?/js/lang-switcher\.js")'
        replacement = f'<script src="{translations_path}" defer></script>\n  \\1'
        content = re.sub(pattern, replacement, content)
        modified = True
        print(f"  Added translations.js")

    # Check if auto-translation script is already present
    if 'Auto-translate Vietnamese' not in content:
        # Add auto-translate script before </body>
        content = content.replace('</body>', AUTO_TRANSLATE_SCRIPT + '\n</body>')
        modified = True
        print(f"  Added auto-translation script")

    if modified:
        file_path.write_text(content, encoding='utf-8')
        print(f"[OK] Updated {file_path}")
    else:
        print(f"[SKIP] Already updated {file_path}")

def main():
    print("=" * 60)
    print("Adding Vietnamese translations to VN pages...")
    print("=" * 60)

    # Process VN root files
    vn_dir = BASE_DIR / 'vn'
    count = 0

    for html_file in vn_dir.glob('*.html'):
        if html_file.is_file():
            process_vn_file(html_file)
            count += 1

    # Process VN programs files
    vn_programs = vn_dir / 'programs'
    if vn_programs.exists():
        for html_file in vn_programs.glob('*.html'):
            if html_file.is_file():
                process_vn_file(html_file)
                count += 1

    print("\n" + "=" * 60)
    print(f"[SUCCESS] Updated {count} Vietnamese pages!")
    print("=" * 60)
    print("\nNext: Reload your browser to see Vietnamese translations!")

if __name__ == '__main__':
    main()
