import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_links_in_vn_pages(file_path):
    """Update links in VN pages to point to root pages instead of en/"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Determine the correct path prefix based on file location
        if '/programs/' in file_path or '/courses/' in file_path:
            # vn/programs/ or vn/courses/ → need ../../ to reach root
            prefix = '../../'
        else:
            # vn/ → need ../ to reach root
            prefix = '../'

        # Map of en/ links to root links
        link_replacements = {
            # Settings icon link (already fixed, but double-check)
            r'href="\.\.\/en\/index\.html"': f'href="{prefix}index.html"',
            r'href="\.\.\/\.\.\/en\/index\.html"': f'href="{prefix}index.html"',

            # Navigation links from vn/ pages
            r'href="\.\.\/en\/blog\.html"': f'href="{prefix}blog.html"',
            r'href="\.\.\/en\/blog-project-based-learning\.html"': f'href="{prefix}blog-project-based-learning.html"',
            r'href="\.\.\/en\/blog-spot-nurture-tech-skill\.html"': f'href="{prefix}blog-spot-nurture-tech-skill.html"',
            r'href="\.\.\/en\/blog-tech-like-playtime\.html"': f'href="{prefix}blog-tech-like-playtime.html"',
            r'href="\.\.\/en\/free-trial\.html"': f'href="{prefix}free-trial.html"',
            r'href="\.\.\/en\/how-it-works\.html"': f'href="{prefix}how-it-works.html"',
            r'href="\.\.\/en\/online-courses\.html"': f'href="{prefix}online-courses.html"',
            r'href="\.\.\/en\/plans-and-faq\.html"': f'href="{prefix}plans-and-faq.html"',
            r'href="\.\.\/en\/student-projects\.html"': f'href="{prefix}student-projects.html"',

            # Program links
            r'href="\.\.\/en\/programs\/': f'href="{prefix}programs/',
            r'href="\.\.\/\.\.\/en\/programs\/': f'href="{prefix}programs/',
        }

        changes_made = False
        for pattern, replacement in link_replacements.items():
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                changes_made = True

        if changes_made:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== FIXING LINKS IN VN PAGES ===\n')

# Get all VN HTML files
vn_files = glob.glob('vn/**/*.html', recursive=True) + glob.glob('vn/*.html')

updated = 0
no_changes = 0

for file_path in sorted(vn_files):
    result = fix_links_in_vn_pages(file_path)
    if result:
        updated += 1
        print(f'✓ Updated: {file_path}')
    else:
        no_changes += 1

print(f'\n{"=" * 60}')
print(f'✅ Updated {updated} VN pages with correct links to root')
if no_changes > 0:
    print(f'ℹ️  {no_changes} pages had no en/ links to fix')
print('=' * 60)
