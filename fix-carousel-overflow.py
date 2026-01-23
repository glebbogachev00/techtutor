import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_carousel_overflow(filepath):
    """Fix carousel overflow by removing body overflow-x-hidden and updating carousel container"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # 1. Remove overflow-x-hidden from body tag
        body_pattern = r'(<body[^>]*class=")overflow-x-hidden '
        body_replacement = r'\1'
        content = re.sub(body_pattern, body_replacement, content)

        # 2. Update carousel container to hide overflow properly
        # Find the carousel container div and update it
        carousel_container_pattern = r'(<div class="relative )overflow-visible md:overflow-hidden( rounded-xl shadow-2xl">)'
        carousel_container_replacement = r'\1overflow-hidden\2'
        content = re.sub(carousel_container_pattern, carousel_container_replacement, content)

        # 3. Change arrow positioning back to inside but at edges (no negative offset)
        # This keeps them visible and clickable without causing horizontal scroll
        prev_button_pattern = r'(<button id="carouselPrev" class="absolute )-left-12 md:left-4( top-1/2)'
        prev_button_replacement = r'\1left-2 md:left-4\2'
        content = re.sub(prev_button_pattern, prev_button_replacement, content)

        next_button_pattern = r'(<button id="carouselNext" class="absolute )-right-12 md:right-4( top-1/2)'
        next_button_replacement = r'\1right-2 md:right-4\2'
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

    # Update all HTML files in all regions
    regions = ['en', 'vn', 'in', 'us']

    for region in regions:
        print(f'=== Processing {region.upper()} directory ===')
        region_dir = os.path.join(os.getcwd(), region)

        if os.path.exists(region_dir):
            for root, dirs, files in os.walk(region_dir):
                for file in files:
                    if file.endswith('.html'):
                        filepath = os.path.join(root, file)
                        result = fix_carousel_overflow(filepath)
                        if result:
                            updated_files.append(filepath)
                            print(f'✓ Fixed: {filepath}')
        else:
            print(f'⚠️  Directory not found: {region_dir}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
