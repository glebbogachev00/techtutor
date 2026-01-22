import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_no_credit_card_badge(filepath):
    """Add 'No Credit Card Required' badge to trust badges section"""

    # Only process index.html files
    if not filepath.endswith('index.html'):
        return False

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Check if badge already exists
        if 'No Credit Card Required' in content:
            print(f'  Badge already exists in {filepath}')
            return False

        # Pattern: Find the Free Trial badge and add No Credit Card badge after it
        pattern = r'(<div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">\s*<svg class="w-5 h-5 text-orange-500"[^>]*>.*?</svg>\s*<span class="font-medium">Free Trial</span>\s*</div>)\s*(</div>)'

        new_badge = r'''\1
            <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              <span class="font-medium">No Credit Card Required</span>
            </div>
          \2'''

        content = re.sub(pattern, new_badge, content, flags=re.DOTALL)

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

    # Process EN, VN, US directories (IN already done manually)
    for region in ['en', 'vn', 'us']:
        print(f'=== Processing {region.upper()} directory ===')
        filepath = os.path.join(os.getcwd(), region, 'index.html')

        if os.path.exists(filepath):
            result = add_no_credit_card_badge(filepath)
            if result:
                updated_files.append(filepath)
                print(f'✓ Added badge: {filepath}')
            elif result is False:
                print(f'  No changes needed: {filepath}')
        else:
            print(f'⚠️  File not found: {filepath}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
