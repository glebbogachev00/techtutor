import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def remove_language_switcher(filepath):
    """Remove language switcher using regex to match any variation"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Use regex to find and remove the entire language switcher div
        # Pattern matches: <div class="relative group"> with flag icon and Vietnamese link
        pattern = r'          <div class="relative group">\s*<button[^>]*aria-label="Switch language"[^>]*>.*?🇬🇧.*?</button>\s*<div class="absolute[^>]*>.*?🇻🇳.*?Tiếng Việt.*?</div>\s*</div>\s*\n'

        # Remove all occurrences (desktop and mobile)
        content = re.sub(pattern, '', content, flags=re.DOTALL)

        # Also remove standalone switcher patterns
        pattern2 = r'\s*<div class="relative group">\s*<button[^>]*>.*?🇬🇧.*?</button>.*?🇻🇳.*?Tiếng Việt.*?</div>\s*</div>'
        content = re.sub(pattern2, '', content, flags=re.DOTALL)

        # Update hreflang and canonical tags to point to current region
        region = 'in' if '/in/' in filepath or '\\in\\' in filepath else 'us'
        content = re.sub(r'hreflang="en" href="https://techtutor\.academy/en/',
                        f'hreflang="en" href="https://techtutor.academy/{region}/', content)
        content = re.sub(r'hreflang="x-default" href="https://techtutor\.academy/en/',
                        f'hreflang="x-default" href="https://techtutor.academy/{region}/', content)
        content = re.sub(r'<link rel="canonical" href="https://techtutor\.academy/en/',
                        f'<link rel="canonical" href="https://techtutor.academy/{region}/', content)

        # Remove Vietnamese hreflang
        content = re.sub(r'  <link rel="alternate" hreflang="vi" href="[^"]*" />\n', '', content)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {filepath}: {e}')
        return False

def main():
    updated_files = []

    # Process IN directory
    print('Fixing language switcher in IN (India) directory...')
    for root, dirs, files in os.walk('in'):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                if remove_language_switcher(filepath):
                    updated_files.append(filepath)
                    print(f'✓ Fixed: {filepath}')

    # Process US directory
    print('\nFixing language switcher in US directory...')
    for root, dirs, files in os.walk('us'):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                if remove_language_switcher(filepath):
                    updated_files.append(filepath)
                    print(f'✓ Fixed: {filepath}')

    print(f'\n✅ Fixed {len(updated_files)} files')

if __name__ == '__main__':
    main()
