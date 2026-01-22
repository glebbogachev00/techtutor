import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_enhancements_script(filepath):
    """Add enhancements.js script tag to HTML files"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Check if script is already included
        if 'enhancements.js' in content:
            print(f'  Enhancement script already included in {filepath}')
            return False

        # Pattern: Find the closing </body> tag and add script before it
        pattern = r'(</body>)'

        if re.search(pattern, content):
            # Add the script tag before </body>
            replacement = r'  <script src="../js/enhancements.js" defer></script>\n\1'
            content = re.sub(pattern, replacement, content)
        else:
            print(f'  Could not find </body> tag in {filepath}')
            return False

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

    # Process all HTML files in regional directories
    for region in ['en', 'vn', 'in', 'us']:
        print(f'=== Processing {region.upper()} directory ===')
        region_dir = os.path.join(os.getcwd(), region)

        if os.path.exists(region_dir):
            for root, dirs, files in os.walk(region_dir):
                for file in files:
                    if file.endswith('.html'):
                        filepath = os.path.join(root, file)
                        result = add_enhancements_script(filepath)
                        if result:
                            updated_files.append(filepath)
                            print(f'✓ Added: {filepath}')
        else:
            print(f'⚠️  Directory not found: {region_dir}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
