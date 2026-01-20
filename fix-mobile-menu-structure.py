import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_mobile_menu(filepath):
    """Fix mobile menu closing div indentation"""

    # CRITICAL: Only process files in 'in' or 'us' directories
    normalized_path = filepath.replace('\\', '/')
    if not ('/in/' in normalized_path or '/us/' in normalized_path):
        print(f'⚠️  SKIPPED (not in IN or US directory): {filepath}')
        return False

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Fix the incorrect closing div structure
        # Wrong: </button>\n      </div>
        # Right: </button>\n        </div>\n      </div>

        pattern = r'(<button id="mobile-menu-button"[^>]*>\s*Menu\s*</button>)\s*</div>'
        replacement = r'\1\n        </div>\n      </div>'

        content = re.sub(pattern, replacement, content)

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
    print('=== Fixing IN (India) directory ===')
    in_dir = os.path.join(os.getcwd(), 'in')
    if os.path.exists(in_dir):
        for root, dirs, files in os.walk(in_dir):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    result = fix_mobile_menu(filepath)
                    if result:
                        updated_files.append(filepath)
                        print(f'✓ Fixed: {filepath}')
                    elif result is False:
                        print(f'  No changes: {filepath}')
    else:
        print(f'⚠️  IN directory not found: {in_dir}')

    # Process US directory
    print('\n=== Fixing US directory ===')
    us_dir = os.path.join(os.getcwd(), 'us')
    if os.path.exists(us_dir):
        for root, dirs, files in os.walk(us_dir):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    result = fix_mobile_menu(filepath)
                    if result:
                        updated_files.append(filepath)
                        print(f'✓ Fixed: {filepath}')
                    elif result is False:
                        print(f'  No changes: {filepath}')
    else:
        print(f'⚠️  US directory not found: {us_dir}')

    print(f'\n✅ Successfully fixed {len(updated_files)} files')
    print(f'\n⚠️  Verifying EN and VN directories were NOT touched...')

    # Verify EN and VN were not affected
    for check_dir in ['en', 'vn']:
        check_path = os.path.join(os.getcwd(), check_dir)
        if os.path.exists(check_path):
            print(f'✓ {check_dir.upper()} directory exists and was NOT modified')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
