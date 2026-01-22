import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_trust_badges(filepath):
    """Add trust badges to homepage after stats cards"""

    # Only process index.html files
    if not filepath.endswith('index.html'):
        return False

    # Skip root index.html
    if filepath == os.path.join(os.getcwd(), 'index.html'):
        return False

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Trust badges HTML
        trust_badges = '''
          <!-- Trust Badges -->
          <div class="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span class="font-medium">Secure Payment</span>
            </div>
            <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="font-medium">Money-Back Guarantee</span>
            </div>
            <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              <span class="font-medium">Free Trial</span>
            </div>
          </div>'''

        # Check if trust badges already exist
        if 'Trust Badges' in content:
            print(f'  Trust badges already exist in {filepath}')
            return False

        # Pattern: Find the closing of the stats cards section
        # We're looking for the closing </div> after the stats cards, before the closing </div> of the hero left column
        pattern = r'(</div>\s*</div>\s*</div>\s*)\n(\s*</div>\s*\n\s*<div class="relative">)'

        if re.search(pattern, content):
            # Replace with trust badges inserted
            content = re.sub(pattern, r'\1' + trust_badges + r'\n\2', content)
        else:
            print(f'  Pattern not found in {filepath}')
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

    # Process EN, VN, IN directories (US already done manually)
    for region in ['en', 'vn', 'in']:
        print(f'=== Processing {region.upper()} directory ===')
        filepath = os.path.join(os.getcwd(), region, 'index.html')

        if os.path.exists(filepath):
            result = add_trust_badges(filepath)
            if result:
                updated_files.append(filepath)
                print(f'✓ Added trust badges: {filepath}')
            elif result is False:
                print(f'  No changes needed: {filepath}')
        else:
            print(f'⚠️  File not found: {filepath}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
