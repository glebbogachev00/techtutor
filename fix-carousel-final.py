import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_carousel_final(filepath):
    """Fix carousel to have arrows outside on mobile without horizontal scroll"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # 1. Update the carousel container div to add padding on mobile
        # This creates space for the arrows without needing overflow-visible
        container_pattern = r'(<div class="container mx-auto )px-4( max-w-4xl">)'
        container_replacement = r'\1px-16 md:px-4\2'
        content = re.sub(container_pattern, container_replacement, content)

        # 2. Keep carousel overflow-hidden (no horizontal scroll)
        # (Already done, no change needed)

        # 3. Update arrow positioning to be outside on mobile using the padding space
        prev_button_pattern = r'(<button id="carouselPrev" class="absolute )left-2 md:left-4( top-1/2)'
        prev_button_replacement = r'\1-left-12 md:left-4\2'
        content = re.sub(prev_button_pattern, prev_button_replacement, content)

        next_button_pattern = r'(<button id="carouselNext" class="absolute )right-2 md:right-4( top-1/2)'
        next_button_replacement = r'\1-right-12 md:right-4\2'
        content = re.sub(next_button_pattern, next_button_replacement, content)

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

    # Update index.html and how-it-works.html in all regions (only files with carousels)
    files_to_update = [
        'en/index.html',
        'vn/index.html',
        'in/index.html',
        'us/index.html',
        'en/how-it-works.html',
        'vn/how-it-works.html',
        'in/how-it-works.html',
        'us/how-it-works.html'
    ]

    for file_path in files_to_update:
        full_path = os.path.join(os.getcwd(), file_path)
        if os.path.exists(full_path):
            print(f'Processing: {file_path}')
            result = fix_carousel_final(full_path)
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
