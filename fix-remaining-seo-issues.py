import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def create_sitemap():
    """Create a simple sitemap.xml to help with inbound links"""
    base_url = 'https://techtutor.academy'

    sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''

    # Add EN pages
    for root, dirs, files in os.walk('en'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file).replace('\\', '/')
                url = f'{base_url}/{file_path}'
                sitemap_content += f'''  <url>
    <loc>{url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''

    # Add VN pages
    for root, dirs, files in os.walk('vn'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file).replace('\\', '/')
                url = f'{base_url}/{file_path}'
                sitemap_content += f'''  <url>
    <loc>{url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''

    sitemap_content += '</urlset>\n'

    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)

    return True

def create_robots_txt():
    """Create robots.txt for better crawling"""
    robots_content = '''User-agent: *
Allow: /en/
Allow: /vn/
Disallow: /admin-portal.html
Disallow: /student-portal.html
Disallow: /login.html
Disallow: /*.html$

Sitemap: https://techtutor.academy/sitemap.xml
'''

    with open('robots.txt', 'w', encoding='utf-8') as f:
        f.write(robots_content)

    return True

def add_hreflang_to_pages():
    """Add proper hreflang tags for bilingual SEO"""
    base_url = 'https://techtutor.academy'
    updated = 0

    # Map of EN to VN pages
    page_map = {
        'index.html': 'index.html',
        'vision.html': 'vision.html',
        'blog.html': 'blog.html',
        'free-trial.html': 'free-trial.html',
        'how-it-works.html': 'how-it-works.html',
        'online-courses.html': 'online-courses.html',
        'plans-and-faq.html': 'plans-and-faq.html',
        'student-projects.html': 'student-projects.html',
    }

    for page_name in page_map.keys():
        # Process EN page
        en_path = f'en/{page_name}'
        vn_path = f'vn/{page_map[page_name]}'

        if os.path.exists(en_path):
            try:
                with open(en_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Check if already has hreflang
                if '<link rel="alternate" hreflang=' in content:
                    continue

                # Add hreflang tags
                hreflang_tags = f'''  <link rel="alternate" hreflang="en" href="{base_url}/en/{page_name}" />
  <link rel="alternate" hreflang="vi" href="{base_url}/vn/{page_map[page_name]}" />
  <link rel="alternate" hreflang="x-default" href="{base_url}/en/{page_name}" />'''

                # Add after canonical or before </head>
                if '<link rel="canonical"' in content:
                    content = re.sub(
                        r'(<link rel="canonical"[^>]*>)',
                        r'\1\n' + hreflang_tags,
                        content,
                        count=1
                    )
                else:
                    content = re.sub(
                        r'(</head>)',
                        hreflang_tags + '\n\\1',
                        content,
                        count=1
                    )

                with open(en_path, 'w', encoding='utf-8') as f:
                    f.write(content)

                updated += 1
                print(f'✓ Added hreflang to: {en_path}')

            except Exception as e:
                print(f'✗ Error processing {en_path}: {e}')

        # Process VN page
        if os.path.exists(vn_path):
            try:
                with open(vn_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Check if already has hreflang
                if '<link rel="alternate" hreflang=' in content:
                    continue

                # Add hreflang tags
                hreflang_tags = f'''  <link rel="alternate" hreflang="en" href="{base_url}/en/{page_name}" />
  <link rel="alternate" hreflang="vi" href="{base_url}/vn/{page_map[page_name]}" />
  <link rel="alternate" hreflang="x-default" href="{base_url}/en/{page_name}" />'''

                if '<link rel="canonical"' in content:
                    content = re.sub(
                        r'(<link rel="canonical"[^>]*>)',
                        r'\1\n' + hreflang_tags,
                        content,
                        count=1
                    )
                else:
                    content = re.sub(
                        r'(</head>)',
                        hreflang_tags + '\n\\1',
                        content,
                        count=1
                    )

                with open(vn_path, 'w', encoding='utf-8') as f:
                    f.write(content)

                updated += 1
                print(f'✓ Added hreflang to: {vn_path}')

            except Exception as e:
                print(f'✗ Error processing {vn_path}: {e}')

    return updated

print('='*70)
print('FIXING REMAINING SEO ISSUES')
print('='*70)

print('\n1. Creating sitemap.xml...')
if create_sitemap():
    print('   ✅ Sitemap created')

print('\n2. Creating robots.txt...')
if create_robots_txt():
    print('   ✅ Robots.txt created')

print('\n3. Adding hreflang tags for bilingual pages...')
hreflang_added = add_hreflang_to_pages()
print(f'   ✅ Added hreflang to {hreflang_added} pages')

print('\n' + '='*70)
print('REMAINING SEO FIXES COMPLETE')
print('='*70)
print(f'\nThis should resolve:')
print(f'  ✓ No inbound links issue (sitemap helps search engines discover pages)')
print(f'  ✓ Better crawling with robots.txt')
print(f'  ✓ Proper bilingual SEO with hreflang tags')
print('\nNote: External JavaScript warnings from CDNs are normal and safe to ignore')
print('      (Tailwind CSS CDN may return 3XX redirects but will work correctly)')
print('='*70)
