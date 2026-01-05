import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_mobile_menu(file_path):
    """Remove duplicate VN/EN text from mobile language switcher"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Pattern 1: Remove the standalone "VN" or "EN" text before language switcher
        # This appears as a separate text node in the mobile menu

        # Find and remove lines with just "VN" or "EN" near the language switcher
        content = re.sub(r'\s*<p[^>]*>\s*VN\s*</p>\s*(?=.*Chuyển sang)', '', content, flags=re.DOTALL)
        content = re.sub(r'\s*<p[^>]*>\s*EN\s*</p>\s*(?=.*Switch to)', '', content, flags=re.DOTALL)
        content = re.sub(r'\s*<span[^>]*>\s*VN\s*</span>\s*(?=.*Chuyển sang)', '', content, flags=re.DOTALL)
        content = re.sub(r'\s*<span[^>]*>\s*EN\s*</span>\s*(?=.*Switch to)', '', content, flags=re.DOTALL)

        # Also remove any stray text nodes
        content = re.sub(r'>\s*VN\s*<span class="text-2xl">🇻🇳</span>', '><span class="text-2xl">🇻🇳</span>', content)
        content = re.sub(r'>\s*EN\s*<span class="text-2xl">🇬🇧</span>', '><span class="text-2xl">🇬🇧</span>', content)

        # Remove VN/EN text that might be before the language switcher link
        content = re.sub(r'VN\s*(?=<a href[^>]*index\.html[^>]*class="flex items-center gap-3)', '', content)
        content = re.sub(r'EN\s*(?=<a href[^>]*index\.html[^>]*class="flex items-center gap-3)', '', content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== FIXING MOBILE LANGUAGE MENU ===\n')

all_pages = [
    # VN pages
    'vn/index.html',
    'vn/online-courses.html',
    'vn/student-projects.html',
    'vn/how-it-works.html',
    'vn/plans-and-faq.html',
    'vn/blog.html',
    'vn/free-trial.html',
    'vn/courses/generative-ai-course.html',
    'vn/blog-project-based-learning.html',
    'vn/blog-spot-nurture-tech-skill.html',
    'vn/blog-tech-like-playtime.html',
    'vn/programs/scratch-game-coder.html',
    'vn/programs/gdevelop-game-designer.html',
    'vn/programs/roblox-world-creator.html',
    'vn/programs/3d-designer.html',
    'vn/programs/ai-programming-quest.html',
    'vn/programs/generative-ai-magic.html',
    'vn/programs/app-development.html',
    # EN pages
    'en/index.html',
    'en/blog.html',
    'en/free-trial.html',
    'en/how-it-works.html',
    'en/online-courses.html',
    'en/plans-and-faq.html',
    'en/student-projects.html',
    'en/blog-project-based-learning.html',
    'en/blog-spot-nurture-tech-skill.html',
    'en/blog-tech-like-playtime.html',
    'en/programs/3d-designer.html',
    'en/programs/ai-programming-quest.html',
    'en/programs/app-development.html',
    'en/programs/gdevelop-game-designer.html',
    'en/programs/generative-ai-magic.html',
    'en/programs/roblox-world-creator.html',
    'en/programs/scratch-game-coder.html',
    # Root EN pages
    'blog.html',
    'free-trial.html',
    'how-it-works.html',
    'online-courses.html',
    'plans-and-faq.html',
    'student-projects.html',
    'blog-project-based-learning.html',
    'blog-spot-nurture-tech-skill.html',
    'blog-tech-like-playtime.html',
    'courses/generative-ai-course.html',
]

success = 0
for page in all_pages:
    if os.path.exists(page):
        if fix_mobile_menu(page):
            success += 1
            print(f'✓ {page}')

print(f'\n✅ Fixed {success} pages')
print('\nRemoved duplicate "VN"/"EN" text from mobile menus.')
