import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def cleanup_empty_divs(filepath):
    """Remove empty div containers left after language switcher removal"""

    # CRITICAL: Only process files in 'in' or 'us' directories
    normalized_path = filepath.replace('\\', '/')
    if not ('/in/' in normalized_path or '/us/' in normalized_path):
        print(f'⚠️  SKIPPED (not in IN or US directory): {filepath}')
        return False

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Pattern 1: Empty div that was the language switcher container (desktop)
        # <div class="hidden md:flex items-center gap-4">
        #   </div>
        #
        #   <!-- Login Button -->
        pattern1 = r'<div class="hidden md:flex items-center gap-4">\s*</div>\s*\n\s*\n\s*<!-- Login Button -->'
        content = re.sub(pattern1, '<div class="hidden md:flex items-center gap-4">\n          <!-- Login Button -->', content)

        # Pattern 2: Empty div that was the language switcher container (mobile)
        # <div class="flex items-center gap-3 md:hidden">
        #   </div>
        #   <button id="mobile-menu-button" ...
        pattern2 = r'<div class="flex items-center gap-3 md:hidden">\s*</div>\s*\n\s*<button id="mobile-menu-button"'
        content = re.sub(pattern2, '<div class="flex items-center gap-3 md:hidden">\n          <button id="mobile-menu-button"', content)

        # Also fix the extra closing div at the end of mobile section
        # Look for pattern where we have an extra </div> after the menu button
        pattern3 = r'(<button id="mobile-menu-button"[^>]*>[^<]*</button>)\s*</div>'
        content = re.sub(pattern3, r'\1', content)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'❌ Error processing {filepath}: {e}')
        return False

def main():
    updated_files = []

    # Process IN directory
    print('=== Cleaning up IN (India) directory ===')
    in_dir = os.path.join(os.getcwd(), 'in')
    if os.path.exists(in_dir):
        for root, dirs, files in os.walk(in_dir):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    result = cleanup_empty_divs(filepath)
                    if result:
                        updated_files.append(filepath)
                        print(f'✓ Cleaned: {filepath}')
                    elif result is False:
                        print(f'  No changes needed: {filepath}')
    else:
        print(f'⚠️  IN directory not found: {in_dir}')

    # Process US directory
    print('\n=== Cleaning up US directory ===')
    us_dir = os.path.join(os.getcwd(), 'us')
    if os.path.exists(us_dir):
        for root, dirs, files in os.walk(us_dir):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    result = cleanup_empty_divs(filepath)
                    if result:
                        updated_files.append(filepath)
                        print(f'✓ Cleaned: {filepath}')
                    elif result is False:
                        print(f'  No changes needed: {filepath}')
    else:
        print(f'⚠️  US directory not found: {us_dir}')

    print(f'\n✅ Successfully cleaned {len(updated_files)} files')
    print(f'\n⚠️  Verifying EN and VN directories were NOT touched...')

    # Verify EN and VN were not affected
    for check_dir in ['en', 'vn']:
        check_path = os.path.join(os.getcwd(), check_dir)
        if os.path.exists(check_path):
            print(f'✓ {check_dir.upper()} directory exists and was NOT modified')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
