#!/usr/bin/env python3
"""
FINAL COMPREHENSIVE i18n FIX
Adds data-i18n attributes to ALL untranslated text in VN pages
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Comprehensive list of text replacements
# Format: (find_text, replacement_with_data_i18n, translation_key)
FIXES = [
    # Lines without data-i18n that have plain text "Login"
    (r'>\s*Login\s*</a>', ' data-i18n="nav.login">Login</a>'),

    # Hero titles on program pages
    (r'>Master Game Creation<br/>with <span[^>]*>Scratch</span></h1>',
     ' data-i18n="program.scratch.title">Master Game Creation<br/>with <span style="color: #193b92;">Scratch</span></h1>'),

    # Stats without data-i18n
    (r'<span[^>]*>4\.9/5</span>\s*rating(?!</div>)',
     '<span class="font-semibold text-ink">4.9/5</span> <span data-i18n="program.rating">rating</span>'),
    (r'<span[^>]*>95\+</span>\s*projects created(?!</div>)',
     '<span class="font-semibold text-ink">95+</span> <span data-i18n="program.projects">projects created</span>'),
]

def add_all_missing_i18n(file_path):
    """Add ALL missing data-i18n attributes"""
    print(f"Fixing {file_path.name}...")

    content = file_path.read_text(encoding='utf-8')
    original = content
    changes = 0

    for pattern, replacement in FIXES:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            changes += 1

    if content != original:
        file_path.write_text(content, encoding='utf-8')
        print(f"  ✓ Made {changes} fixes")
        return changes
    else:
        print(f"  - No changes")
        return 0

def main():
    print("="*60)
    print("FINAL COMPREHENSIVE i18n FIX")
    print("="*60)

    total_changes = 0

    # Fix VN pages
    vn_dir = BASE_DIR / 'vn'
    for html_file in vn_dir.glob('*.html'):
        total_changes += add_all_missing_i18n(html_file)

    # Fix VN program pages
    vn_programs = vn_dir / 'programs'
    for html_file in vn_programs.glob('*.html'):
        total_changes += add_all_missing_i18n(html_file)

    print("="*60)
    print(f"DONE! Made {total_changes} total fixes")
    print("="*60)

if __name__ == '__main__':
    main()
