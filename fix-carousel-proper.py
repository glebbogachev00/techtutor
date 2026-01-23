import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_carousel_proper(filepath):
    """Fix carousel arrows to be outside on mobile without horizontal scroll"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # 1. Revert container padding back to px-4 (remove the px-16 on mobile)
        container_pattern = r'(<div class="container mx-auto )px-16 md:px-4( max-w-4xl">)'
        container_replacement = r'\1px-4\2'
        content = re.sub(container_pattern, container_replacement, content)

        # 2. Make the carousel wrapper overflow-visible on mobile only
        # This allows arrows to extend outside without causing page-wide horizontal scroll
        carousel_wrapper_pattern = r'(<div class="relative )overflow-hidden( rounded-xl shadow-2xl">)'
        carousel_wrapper_replacement = r'\1overflow-visible md:overflow-hidden\2'
        content = re.sub(carousel_wrapper_pattern, carousel_wrapper_replacement, content)

        # 3. Wrap the entire carousel section in overflow-x-hidden to prevent horizontal scroll
        # Find the section tag and add overflow-x-hidden
        section_pattern = r'(<!-- Class Photos Carousel Section -->\s*<section class="mb-20 relative)"'
        section_replacement = r'\1 overflow-x-hidden"'
        content = re.sub(section_pattern, section_replacement, content)

        # If section doesn't have quotes after class value, try alternative pattern
        if content == original_content:
            section_pattern2 = r'(<!-- Class Photos Carousel Section -->\s*<section class="mb-20 relative)(")'
            section_replacement2 = r'\1 overflow-x-hidden\2'
            content = re.sub(section_pattern2, section_replacement2, content)

        # Keep arrows at -left-12 and -right-12 (already set)
        # No change needed for arrow positioning

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

    # Update index.html and how-it-works.html in all regions
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
            result = fix_carousel_proper(full_path)
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
