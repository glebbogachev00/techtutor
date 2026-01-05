import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_mobile_navigation(file_path):
    """Remove language switcher from mobile menu - settings icon is already in header"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Remove the language switcher link from mobile menu
        # Pattern 1: EN version mobile menu language switcher
        mobile_lang_pattern_en = r'\s*<!-- Language Switcher -->\s*<a href="[^"]*vn/index\.html"[^>]*>.*?🇻🇳.*?Tiếng Việt.*?</a>\s*'
        content = re.sub(mobile_lang_pattern_en, '\n          ', content, flags=re.DOTALL)

        # Pattern 2: VN version mobile menu language switcher
        mobile_lang_pattern_vn = r'\s*<!-- Language Switcher -->\s*<a href="[^"]*en/index\.html"[^>]*>.*?🇬🇧.*?English.*?</a>\s*'
        content = re.sub(mobile_lang_pattern_vn, '\n          ', content, flags=re.DOTALL)

        # Also remove any standalone language switcher links without comment
        standalone_pattern_vn = r'<a href="[^"]*vn/index\.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition border border-slate-200">\s*<span class="text-2xl">🇻🇳</span>\s*<span class="font-medium text-slate-700">.*?Tiếng Việt.*?</span>\s*</a>\s*'
        content = re.sub(standalone_pattern_vn, '', content, flags=re.DOTALL)

        standalone_pattern_en = r'<a href="[^"]*en/index\.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition border border-slate-200">\s*<span class="text-2xl">🇬🇧</span>\s*<span class="font-medium text-slate-700">.*?English.*?</span>\s*</a>\s*'
        content = re.sub(standalone_pattern_en, '', content, flags=re.DOTALL)

        # Check if any changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== REMOVING LANGUAGE SWITCHER FROM MOBILE MENUS ===\n')

all_pages = [
    # Root level EN pages
    'blog-project-based-learning.html',
    'blog-spot-nurture-tech-skill.html',
    'blog-tech-like-playtime.html',
    'blog.html',
    'free-trial.html',
    'how-it-works.html',
    'online-courses.html',
    'plans-and-faq.html',
    'student-projects.html',
    'courses/generative-ai-course.html',
    # Root level program pages
    'programs/3d-designer.html',
    'programs/ai-programming-quest.html',
    'programs/app-development.html',
    'programs/gdevelop-game-designer.html',
    'programs/generative-ai-magic.html',
    'programs/roblox-world-creator.html',
    'programs/scratch-game-coder.html',
    # en/ folder pages
    'en/index.html',
    'en/blog-project-based-learning.html',
    'en/blog-spot-nurture-tech-skill.html',
    'en/blog-tech-like-playtime.html',
    'en/blog.html',
    'en/free-trial.html',
    'en/how-it-works.html',
    'en/online-courses.html',
    'en/plans-and-faq.html',
    'en/student-projects.html',
    # en/programs folder
    'en/programs/3d-designer.html',
    'en/programs/ai-programming-quest.html',
    'en/programs/app-development.html',
    'en/programs/gdevelop-game-designer.html',
    'en/programs/generative-ai-magic.html',
    'en/programs/roblox-world-creator.html',
    'en/programs/scratch-game-coder.html',
    # vn/ folder pages
    'vn/index.html',
    'vn/blog-project-based-learning.html',
    'vn/blog-spot-nurture-tech-skill.html',
    'vn/blog-tech-like-playtime.html',
    'vn/blog.html',
    'vn/free-trial.html',
    'vn/how-it-works.html',
    'vn/online-courses.html',
    'vn/plans-and-faq.html',
    'vn/student-projects.html',
    # vn/programs folder
    'vn/programs/3d-designer.html',
    'vn/programs/ai-programming-quest.html',
    'vn/programs/app-development.html',
    'vn/programs/gdevelop-game-designer.html',
    'vn/programs/generative-ai-magic.html',
    'vn/programs/roblox-world-creator.html',
    'vn/programs/scratch-game-coder.html',
]

success = 0
not_found = 0
no_change = 0

for page in all_pages:
    if os.path.exists(page):
        print(f'Checking {page}...')
        result = fix_mobile_navigation(page)
        if result:
            success += 1
            print(f'  ✓ Removed language switcher from mobile menu\n')
        else:
            no_change += 1
            print(f'  - No mobile language switcher found\n')
    else:
        not_found += 1

print('=' * 60)
print(f'✅ Updated {success} pages')
if no_change > 0:
    print(f'ℹ️  {no_change} pages had no mobile language switcher')
if not_found > 0:
    print(f'⚠️  {not_found} pages not found')
print('=' * 60)
