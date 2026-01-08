import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_file(file_path):
    """Fix only the problematic ../../ links that go to root instead of parent folder"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Only fix links in FOOTER and MOBILE MENU that incorrectly use ../../
        # These should use ../ to stay within en/ or vn/ folder

        # Fix: href="../../page.html" → href="../page.html"
        # (but only for pages that should stay in language folder)
        pages_to_fix = [
            'blog.html',
            'blog-project-based-learning.html',
            'blog-spot-nurture-tech-skill.html',
            'blog-tech-like-playtime.html',
            'free-trial.html',
            'student-projects.html',
            'vision.html',
            'plans-and-faq.html',
            'how-it-works.html',
            'online-courses.html',
        ]

        for page in pages_to_fix:
            # Replace ../../page.html with ../page.html
            content = content.replace(f'href="../../{page}"', f'href="../{page}"')

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'✓ Fixed: {file_path}')
            return True
        return False

    except Exception as e:
        print(f'✗ Error: {file_path}: {e}')
        return False

print('='*70)
print('FIXING REDIRECT CHAINS (CAREFUL APPROACH)')
print('='*70)

fixed = 0

# Check EN course page
if os.path.exists('en/courses/generative-ai-course.html'):
    if fix_file('en/courses/generative-ai-course.html'):
        fixed += 1

# Check VN course page
if os.path.exists('vn/courses/generative-ai-course.html'):
    if fix_file('vn/courses/generative-ai-course.html'):
        fixed += 1

print(f'\n✅ Fixed {fixed} files')
print('='*70)
print('\nWhat was fixed:')
print('  • href="../../blog.html" → href="../blog.html"')
print('  • href="../../free-trial.html" → href="../free-trial.html"')
print('  • etc.')
print('\nThis keeps links within en/ or vn/ folders instead of going to root.')
print('='*70)
