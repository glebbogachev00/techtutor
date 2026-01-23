import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_horizontal_scroll(filepath):
    """Fix horizontal scrolling issue on mobile by adding overflow-x hidden to body"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Find the opening body tag and add overflow-x-hidden class
        body_pattern = r'(<body[^>]*class=")'
        body_replacement = r'\1overflow-x-hidden '

        # Check if body already has overflow-x-hidden
        if 'overflow-x-hidden' not in content:
            content = re.sub(body_pattern, body_replacement, content)

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
                        result = fix_horizontal_scroll(filepath)
                        if result:
                            updated_files.append(filepath)
                            print(f'✓ Fixed: {filepath}')
        else:
            print(f'⚠️  Directory not found: {region_dir}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
