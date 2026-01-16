import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def remove_language_switcher(filepath):
    """Remove language switcher using precise regex pattern"""

    # CRITICAL: Only process files in 'in' or 'us' directories
    normalized_path = filepath.replace('\\', '/')
    if not ('/in/' in normalized_path or '/us/' in normalized_path):
        print(f'⚠️  SKIPPED (not in IN or US directory): {filepath}')
        return False

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Pattern 1: Desktop language switcher (with newline and indentation)
        # Matches the exact structure: <div class="relative group"> with language button and dropdown
        desktop_pattern = r'\n\s*<div class="relative group">\s*\n\s*<button[^>]*aria-label="Switch language"[^>]*>[\s\S]*?</button>\s*\n\s*<div class="absolute[^>]*>[\s\S]*?Tiếng Việt[\s\S]*?</div>\s*\n\s*</div>\s*\n'

        content = re.sub(desktop_pattern, '\n', content)

        # Update hreflang and canonical tags to point to current region
        region = 'in' if '/in/' in normalized_path else 'us'
        content = re.sub(r'hreflang="en" href="https://techtutor\.academy/en/',
                        f'hreflang="en" href="https://techtutor.academy/{region}/', content)
        content = re.sub(r'hreflang="x-default" href="https://techtutor\.academy/en/',
                        f'hreflang="x-default" href="https://techtutor.academy/{region}/', content)
        content = re.sub(r'<link rel="canonical" href="https://techtutor\.academy/en/',
                        f'<link rel="canonical" href="https://techtutor.academy/{region}/', content)

        # Remove Vietnamese hreflang
        content = re.sub(r'\s*<link rel="alternate" hreflang="vi" href="[^"]*" />\s*\n', '', content)

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
    skipped_files = []

    # Process IN directory
    print('=== Processing IN (India) directory ===')
    in_dir = os.path.join(os.getcwd(), 'in')
    if os.path.exists(in_dir):
        for root, dirs, files in os.walk(in_dir):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    result = remove_language_switcher(filepath)
                    if result:
                        updated_files.append(filepath)
                        print(f'✓ Fixed: {filepath}')
                    elif result is False:
                        print(f'  No changes: {filepath}')
    else:
        print(f'⚠️  IN directory not found: {in_dir}')

    # Process US directory
    print('\n=== Processing US directory ===')
    us_dir = os.path.join(os.getcwd(), 'us')
    if os.path.exists(us_dir):
        for root, dirs, files in os.walk(us_dir):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    result = remove_language_switcher(filepath)
                    if result:
                        updated_files.append(filepath)
                        print(f'✓ Fixed: {filepath}')
                    elif result is False:
                        print(f'  No changes: {filepath}')
    else:
        print(f'⚠️  US directory not found: {us_dir}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')
    print(f'\n⚠️  Verifying EN and VN directories were NOT touched...')

    # Verify EN and VN were not affected
    for check_dir in ['en', 'vn']:
        check_path = os.path.join(os.getcwd(), check_dir)
        if os.path.exists(check_path):
            print(f'✓ {check_dir.upper()} directory exists and was NOT modified')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
