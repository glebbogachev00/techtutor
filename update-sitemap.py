import os
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def get_all_html_files(directory):
    """Get all HTML files in a directory"""
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                # Get relative path from directory
                rel_path = os.path.relpath(os.path.join(root, file), directory)
                # Convert Windows path separators to forward slashes
                rel_path = rel_path.replace('\\', '/')
                html_files.append(rel_path)
    return sorted(html_files)

def create_sitemap():
    """Create sitemap.xml with all regional pages"""

    sitemap_header = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'''

    sitemap_footer = '''</urlset>
'''

    # Get HTML files from all directories
    en_files = get_all_html_files('en')
    vn_files = get_all_html_files('vn')
    in_files = get_all_html_files('in')
    us_files = get_all_html_files('us')

    sitemap_content = sitemap_header + '\n'

    # Add EN URLs
    for file in en_files:
        sitemap_content += f'''  <url>
    <loc>https://techtutor.academy/en/{file}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''

    # Add VN URLs
    for file in vn_files:
        sitemap_content += f'''  <url>
    <loc>https://techtutor.academy/vn/{file}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''

    # Add IN URLs
    for file in in_files:
        sitemap_content += f'''  <url>
    <loc>https://techtutor.academy/in/{file}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''

    # Add US URLs
    for file in us_files:
        sitemap_content += f'''  <url>
    <loc>https://techtutor.academy/us/{file}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''

    sitemap_content += sitemap_footer

    # Write sitemap
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)

    print(f'✅ Sitemap created with:')
    print(f'  - {len(en_files)} EN pages')
    print(f'  - {len(vn_files)} VN pages')
    print(f'  - {len(in_files)} IN pages')
    print(f'  - {len(us_files)} US pages')
    print(f'  Total: {len(en_files) + len(vn_files) + len(in_files) + len(us_files)} URLs')

if __name__ == '__main__':
    create_sitemap()
