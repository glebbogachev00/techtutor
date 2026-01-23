import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_how_it_works_carousel(filepath):
    """Add overflow-x-hidden to carousel container in how-it-works pages"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Add overflow-x-hidden to the carousel gallery container
        pattern = r'(<!-- Class Photos Gallery -->\s*<div class="container mx-auto px-4 max-w-4xl mb-12)(")'
        replacement = r'\1 overflow-x-hidden\2'
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

    # Update how-it-works.html in all regions (EN already done manually)
    files_to_update = [
        'vn/how-it-works.html',
        'in/how-it-works.html',
        'us/how-it-works.html'
    ]

    for file_path in files_to_update:
        full_path = os.path.join(os.getcwd(), file_path)
        if os.path.exists(full_path):
            print(f'Processing: {file_path}')
            result = fix_how_it_works_carousel(full_path)
            if result:
                updated_files.append(file_path)
                print(f'✓ Fixed: {file_path}')
            else:
                print(f'  No changes: {file_path}')
        else:
            print(f'⚠️  File not found: {file_path}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
