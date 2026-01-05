import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_settings_icon_path(file_path):
    """Fix the language switcher path in settings icon based on file location"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Determine correct paths based on file location
        is_vn = file_path.startswith('vn/')

        # Determine depth
        if '/courses/' in file_path or '/programs/' in file_path:
            # Files in vn/courses/ or vn/programs/ or en/courses/ or en/programs/
            correct_path = '../../en/index.html' if is_vn else '../../vn/index.html'
        elif file_path.startswith('en/') or file_path.startswith('vn/'):
            # Files directly in en/ or vn/ folder
            correct_path = '../en/index.html' if is_vn else '../vn/index.html'
        elif file_path.startswith('courses/') or file_path.startswith('programs/'):
            # Root level courses/ or programs/ folders
            correct_path = '../en/index.html' if is_vn else '../vn/index.html'
        else:
            # Root level files
            correct_path = 'en/index.html' if is_vn else 'vn/index.html'

        # Fix desktop settings icon link
        # Pattern to find the settings icon dropdown link
        if is_vn:
            # For VN pages, fix any wrong EN links
            wrong_patterns = [
                r'(<a href=")[^"]*en/index\.html(" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">)',
            ]
            for pattern in wrong_patterns:
                content = re.sub(pattern, r'\1' + correct_path + r'\2', content)
        else:
            # For EN pages, fix any wrong VN links
            wrong_patterns = [
                r'(<a href=")[^"]*vn/index\.html(" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">)',
            ]
            for pattern in wrong_patterns:
                content = re.sub(pattern, r'\1' + correct_path + r'\2', content)

        # Check if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== FIXING SETTINGS ICON PATHS ===\n')

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
    'vn/courses/generative-ai-course.html',
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
no_change = 0
not_found = 0

for page in all_pages:
    if os.path.exists(page):
        result = fix_settings_icon_path(page)
        if result:
            success += 1
            print(f'✓ Fixed: {page}')
        else:
            no_change += 1
    else:
        not_found += 1

print('\n' + '=' * 60)
print(f'✅ Fixed {success} pages with incorrect paths')
if no_change > 0:
    print(f'ℹ️  {no_change} pages already had correct paths')
if not_found > 0:
    print(f'⚠️  {not_found} pages not found')
print('=' * 60)
