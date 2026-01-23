import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def highlight_facebook_group(filepath):
    """Make Facebook group text bold and highlighted"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # For VN version
        if 'vn/' in filepath:
            pattern = r'(Được tham gia nhóm Facebook độc quyền của chúng tôi\.)'
            replacement = r'<strong class="text-primary">\1</strong>'
            content = re.sub(pattern, replacement, content)

        # For IN and US versions (English)
        else:
            pattern = r'(Get access to our exclusive Facebook group\.)'
            replacement = r'<strong class="text-primary">\1</strong>'
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

    # Update VN, IN, US (EN already done manually)
    files_to_update = [
        'vn/index.html',
        'in/index.html',
        'us/index.html'
    ]

    for file_path in files_to_update:
        full_path = os.path.join(os.getcwd(), file_path)
        if os.path.exists(full_path):
            print(f'Processing: {file_path}')
            result = highlight_facebook_group(full_path)
            if result:
                updated_files.append(file_path)
                print(f'✓ Updated: {file_path}')
            else:
                print(f'  No changes: {file_path}')
        else:
            print(f'⚠️  File not found: {file_path}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
