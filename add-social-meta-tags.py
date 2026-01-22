import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_social_meta_tags(filepath):
    """Add Open Graph and Twitter Card meta tags to HTML files"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Check if tags already exist
        if 'og:title' in content or 'twitter:card' in content:
            print(f'  Social meta tags already exist in {filepath}')
            return False

        # Determine region
        normalized_path = filepath.replace('\\', '/')
        region = ''
        for r in ['en', 'vn', 'in', 'us']:
            if f'/{r}/' in normalized_path:
                region = r
                break

        if not region:
            print(f'  Could not determine region for {filepath}')
            return False

        # Build the meta tags
        meta_tags = f'''
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://techtutor.academy/{region}/" />
  <meta property="og:title" content="TechTutor Academy — Best Tech Education in the World" />
  <meta property="og:description" content="TechTutor Academy offers interactive tech courses for children and teens in STEAM, coding, AI, and game development. Personalized learning with flexible scheduling." />
  <meta property="og:image" content="https://techtutor.academy/images/family-portrait.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://techtutor.academy/{region}/" />
  <meta name="twitter:title" content="TechTutor Academy — Best Tech Education in the World" />
  <meta name="twitter:description" content="Interactive tech courses for children and teens. From coding to AI, we provide personalized learning experiences." />
  <meta name="twitter:image" content="https://techtutor.academy/images/family-portrait.jpg" />
'''

        # Find the position after the existing meta tags but before closing </head>
        # Look for the last meta tag before the link tags
        pattern = r'(<meta name="description"[^>]*>)'

        if re.search(pattern, content):
            content = re.sub(pattern, r'\1' + meta_tags, content)
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

    # Process all regional index.html files
    for region in ['en', 'vn', 'in', 'us']:
        print(f'=== Processing {region.upper()} directory ===')
        filepath = os.path.join(os.getcwd(), region, 'index.html')

        if os.path.exists(filepath):
            result = add_social_meta_tags(filepath)
            if result:
                updated_files.append(filepath)
                print(f'✓ Added social meta tags: {filepath}')
            elif result is False:
                print(f'  No changes needed: {filepath}')
        else:
            print(f'⚠️  File not found: {filepath}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
