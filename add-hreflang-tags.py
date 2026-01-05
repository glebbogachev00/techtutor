import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_hreflang_to_page(file_path, is_vn=False):
    """Add proper hreflang tags for SEO"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if hreflang already exists
        if 'hreflang=' in content:
            # Remove old hreflang tags first
            content = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*" />\s*\n\s*', '', content)
            content = re.sub(r'<link rel="canonical" href="[^"]*" />\s*\n\s*', '', content)

        # Determine the page name
        page_name = os.path.basename(file_path)

        # Construct URLs
        if is_vn:
            vn_url = f'https://techtutor.academy/vn/{page_name}'
            en_url = f'https://techtutor.academy/{page_name}'
            canonical_url = vn_url
            lang = 'vi'
        else:
            en_url = f'https://techtutor.academy/{page_name}'
            vn_url = f'https://techtutor.academy/vn/{page_name}'
            canonical_url = en_url
            lang = 'en'

        # Special handling for nested pages (programs, courses)
        if '/programs/' in file_path:
            if is_vn:
                vn_url = f'https://techtutor.academy/vn/programs/{page_name}'
                en_url = f'https://techtutor.academy/programs/{page_name}'
                canonical_url = vn_url
            else:
                en_url = f'https://techtutor.academy/programs/{page_name}'
                vn_url = f'https://techtutor.academy/vn/programs/{page_name}'
                canonical_url = en_url
        elif '/courses/' in file_path:
            if is_vn:
                vn_url = f'https://techtutor.academy/vn/courses/{page_name}'
                en_url = f'https://techtutor.academy/courses/{page_name}'
                canonical_url = vn_url
            else:
                en_url = f'https://techtutor.academy/courses/{page_name}'
                vn_url = f'https://techtutor.academy/vn/courses/{page_name}'
                canonical_url = en_url

        # Hreflang tags
        hreflang_tags = f'''  <!-- SEO: Hreflang tags for multilingual support -->
  <link rel="alternate" hreflang="en" href="{en_url}" />
  <link rel="alternate" hreflang="vi" href="{vn_url}" />
  <link rel="alternate" hreflang="x-default" href="{en_url}" />
  <link rel="canonical" href="{canonical_url}" />
'''

        # Insert before </head>
        if '</head>' in content:
            content = content.replace('</head>', hreflang_tags + '</head>')

            # Update html lang attribute
            content = re.sub(r'<html[^>]*lang="[^"]*"', f'<html lang="{lang}"', content)
            if '<html' in content and 'lang=' not in content:
                content = re.sub(r'<html([^>]*)>', f'<html lang="{lang}"\\1>', content)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== ADDING HREFLANG TAGS FOR SEO ===\n')

# Get all root English pages
root_pages = glob.glob('*.html')
root_pages = [p for p in root_pages if p != 'index.html' and p not in ['login.html', 'admin-portal.html', 'student-portal.html', 'login-supabase.html', 'vision.html']]

# Add programs and courses
root_pages.extend(glob.glob('programs/*.html'))
root_pages.extend(glob.glob('courses/*.html'))

# Get all VN pages
vn_pages = glob.glob('vn/**/*.html', recursive=True) + glob.glob('vn/*.html')
vn_pages = [p for p in vn_pages if 'login.html' not in p and 'admin-portal.html' not in p and 'student-portal.html' not in p and 'vision.html' not in p]

updated = 0

print('Adding hreflang to ROOT (English) pages...\n')
for page in sorted(root_pages):
    if os.path.exists(page):
        result = add_hreflang_to_page(page, is_vn=False)
        if result:
            updated += 1
            print(f'  ✓ {page}')

print('\nAdding hreflang to VN (Vietnamese) pages...\n')
for page in sorted(vn_pages):
    if os.path.exists(page):
        result = add_hreflang_to_page(page, is_vn=True)
        if result:
            updated += 1
            print(f'  ✓ {page}')

print(f'\n{"=" * 60}')
print(f'✅ Added hreflang tags to {updated} pages for SEO')
print('=' * 60)
