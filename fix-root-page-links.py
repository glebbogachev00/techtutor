import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_links_in_root_pages(file_path):
    """Fix navigation links in root pages to point to other root pages (not en/)"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Fix all navigation links - remove en/ prefix
        replacements = {
            r'href="en/blog\.html"': 'href="blog.html"',
            r'href="en/blog-project-based-learning\.html"': 'href="blog-project-based-learning.html"',
            r'href="en/blog-spot-nurture-tech-skill\.html"': 'href="blog-spot-nurture-tech-skill.html"',
            r'href="en/blog-tech-like-playtime\.html"': 'href="blog-tech-like-playtime.html"',
            r'href="en/free-trial\.html"': 'href="free-trial.html"',
            r'href="en/how-it-works\.html"': 'href="how-it-works.html"',
            r'href="en/online-courses\.html"': 'href="online-courses.html"',
            r'href="en/plans-and-faq\.html"': 'href="plans-and-faq.html"',
            r'href="en/student-projects\.html"': 'href="student-projects.html"',
            r'href="en/index\.html"': 'href="index.html"',
            r'href="en/programs/': 'href="programs/',
            r'href="en/courses/': 'href="courses/',

            # Fix login/portal links (keep in en/)
            # These stay as-is
        }

        for pattern, replacement in replacements.items():
            content = re.sub(pattern, replacement, content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== FIXING NAVIGATION LINKS IN ROOT PAGES ===\n')

# Get all root pages
root_pages = glob.glob('*.html') + glob.glob('programs/*.html') + glob.glob('courses/*.html')

updated = 0
no_changes = 0

for page in sorted(root_pages):
    if os.path.exists(page):
        result = fix_links_in_root_pages(page)
        if result:
            updated += 1
            print(f'✓ Fixed: {page}')
        else:
            no_changes += 1

print(f'\n{"=" * 60}')
print(f'✅ Fixed {updated} root pages')
if no_changes > 0:
    print(f'ℹ️  {no_changes} pages had no links to fix')
print('=' * 60)
