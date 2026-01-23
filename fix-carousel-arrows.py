import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_carousel_arrows(filepath):
    """Move carousel navigation arrows outside image on mobile"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Update carousel container - allow overflow on mobile, hide on desktop
        container_pattern = r'(<div class="relative )overflow-hidden( rounded-xl shadow-2xl">)'
        container_replacement = r'\1overflow-visible md:overflow-hidden\2'
        content = re.sub(container_pattern, container_replacement, content)

        # Update Previous Button - use larger negative offset on mobile
        prev_button_pattern = r'(<button id="carouselPrev" class="absolute )-left-4 md:left-4( top-1/2)'
        prev_button_replacement = r'\1-left-12 md:left-4\2'
        content = re.sub(prev_button_pattern, prev_button_replacement, content)

        # Update Next Button - use larger negative offset on mobile
        next_button_pattern = r'(<button id="carouselNext" class="absolute )-right-4 md:right-4( top-1/2)'
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

    # Update both index.html and how-it-works.html in all regions
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
            result = fix_carousel_arrows(full_path)
            if result:
                updated_files.append(file_path)
                print(f'✓ Updated: {file_path}')
            else:
                print(f'  No changes: {file_path}')
        else:
            print(f'⚠️  File not found: {file_path}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')
    for f in updated_files:
        print(f'  - {f}')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
