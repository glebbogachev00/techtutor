#!/usr/bin/env python3
"""
Fix Vietnamese page button states:
1. Change data-lang="vn" to data-lang="vi" (for Vietnamese language code)
2. Fix aria-pressed and classes so VN button is highlighted by default
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).parent

def fix_buttons_in_file(file_path):
    """Fix language button states in VN pages"""
    print(f"Fixing buttons in {file_path}...")

    content = file_path.read_text(encoding='utf-8')
    modified = False

    # Fix desktop buttons - English button should NOT be active
    # Pattern: EN button with aria-pressed="true" and active styling
    en_button_pattern = r'<button type="button" data-lang="en" aria-pressed="true" class="inline-flex h-9 w-11 items-center justify-center rounded-full bg-primary text-white text-sm">🇬🇧</button>'
    en_button_fixed = '<button type="button" data-lang="en" aria-pressed="false" class="inline-flex h-9 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇬🇧</button>'

    if en_button_pattern in content:
        content = content.replace(en_button_pattern, en_button_fixed)
        modified = True
        print(f"  Fixed desktop EN button")

    # Fix desktop VN button - should be active
    vn_button_pattern = r'<button type="button" data-lang="vn" aria-pressed="false" class="inline-flex h-9 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇻🇳</button>'
    vn_button_fixed = '<button type="button" data-lang="vi" aria-pressed="true" class="inline-flex h-9 w-11 items-center justify-center rounded-full bg-primary text-white text-sm">🇻🇳</button>'

    if vn_button_pattern in content:
        content = content.replace(vn_button_pattern, vn_button_fixed)
        modified = True
        print(f"  Fixed desktop VN button")

    # Fix mobile buttons - English button
    en_mobile_pattern = r'<button type="button" data-lang="en" aria-pressed="true" class="inline-flex h-8 w-10 items-center justify-center rounded-full bg-primary text-white text-sm">🇬🇧</button>'
    en_mobile_fixed = '<button type="button" data-lang="en" aria-pressed="false" class="inline-flex h-8 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇬🇧</button>'

    if en_mobile_pattern in content:
        content = content.replace(en_mobile_pattern, en_mobile_fixed)
        modified = True
        print(f"  Fixed mobile EN button")

    # Fix mobile VN button - should be active
    vn_mobile_pattern = r'<button type="button" data-lang="vn" aria-pressed="false" class="inline-flex h-8 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇻🇳</button>'
    vn_mobile_fixed = '<button type="button" data-lang="vi" aria-pressed="true" class="inline-flex h-8 w-10 items-center justify-center rounded-full bg-primary text-white text-sm">🇻🇳</button>'

    if vn_mobile_pattern in content:
        content = content.replace(vn_mobile_pattern, vn_mobile_fixed)
        modified = True
        print(f"  Fixed mobile VN button")

    if modified:
        file_path.write_text(content, encoding='utf-8')
        print(f"[OK] Fixed {file_path}")
    else:
        print(f"[SKIP] No button fixes needed for {file_path}")

def main():
    print("=" * 60)
    print("Fixing language button states in VN pages...")
    print("=" * 60)

    # Process VN root files
    vn_dir = BASE_DIR / 'vn'
    count = 0

    for html_file in vn_dir.glob('*.html'):
        if html_file.is_file():
            fix_buttons_in_file(html_file)
            count += 1

    # Process VN programs files
    vn_programs = vn_dir / 'programs'
    if vn_programs.exists():
        for html_file in vn_programs.glob('*.html'):
            if html_file.is_file():
                fix_buttons_in_file(html_file)
                count += 1

    print("\n" + "=" * 60)
    print(f"[SUCCESS] Fixed buttons in {count} Vietnamese pages!")
    print("=" * 60)
    print("\nNow only the VN button should be highlighted!")

if __name__ == '__main__':
    main()
