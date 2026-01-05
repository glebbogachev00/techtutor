import os
import sys
import shutil

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print('=== RESTRUCTURING SITE: ROOT + VN ONLY ===\n')

# List of en/ pages to delete (keeping only index.html for redirect)
en_pages_to_delete = [
    'en/blog.html',
    'en/blog-project-based-learning.html',
    'en/blog-spot-nurture-tech-skill.html',
    'en/blog-tech-like-playtime.html',
    'en/free-trial.html',
    'en/how-it-works.html',
    'en/online-courses.html',
    'en/plans-and-faq.html',
    'en/student-projects.html',
    'en/programs/3d-designer.html',
    'en/programs/ai-programming-quest.html',
    'en/programs/app-development.html',
    'en/programs/gdevelop-game-designer.html',
    'en/programs/generative-ai-magic.html',
    'en/programs/roblox-world-creator.html',
    'en/programs/scratch-game-coder.html',
]

# Pages to keep in en/ (special pages)
# en/index.html - keep as redirect
# en/login.html, en/admin-portal.html, en/student-portal.html, en/vision.html - keep as special pages

deleted = 0
not_found = 0

print('Step 1: Deleting redundant en/ pages...\n')

for page in en_pages_to_delete:
    if os.path.exists(page):
        os.remove(page)
        deleted += 1
        print(f'  ✓ Deleted: {page}')
    else:
        not_found += 1
        print(f'  - Not found: {page}')

# Remove en/programs folder if empty
if os.path.exists('en/programs') and not os.listdir('en/programs'):
    os.rmdir('en/programs')
    print('\n  ✓ Removed empty en/programs/ folder')

print(f'\n✅ Deleted {deleted} redundant en/ pages')
if not_found > 0:
    print(f'⚠️  {not_found} pages were already deleted')

print('\n' + '=' * 60)
print('FINAL STRUCTURE:')
print('  ✓ Root pages (English)')
print('  ✓ vn/ pages (Vietnamese)')
print('  ✓ en/index.html (redirect)')
print('  ✓ en/login.html, en/admin-portal.html, etc. (special pages)')
print('=' * 60)
