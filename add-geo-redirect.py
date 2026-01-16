import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

GEO_REDIRECT_SCRIPT = '  <script src="../js/geo-redirect.js" defer></script>\n</head>'

def add_geo_redirect(filepath):
    """Add geo-redirect script to EN pages"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if script is already added
        if 'geo-redirect.js' in content:
            return False

        # Add script before closing </head> tag
        content = content.replace('</head>', GEO_REDIRECT_SCRIPT)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    except Exception as e:
        print(f'Error processing {filepath}: {e}')
        return False

def main():
    updated_files = []

    # Process EN directory only
    print('Adding geo-redirect script to EN pages...')
    for root, dirs, files in os.walk('en'):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                if add_geo_redirect(filepath):
                    updated_files.append(filepath)
                    print(f'✓ Added geo-redirect: {filepath}')

    print(f'\n✅ Updated {len(updated_files)} files')

if __name__ == '__main__':
    main()
