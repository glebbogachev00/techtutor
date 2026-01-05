import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def remove_lang_switcher_script(file_path):
    """Remove the old lang-switcher.js script reference"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Remove the lang-switcher.js script tag
        patterns = [
            r'<script src="\.\.\/js\/lang-switcher\.js" defer><\/script>\s*',
            r'<script src="\.\.\/\.\.\/js\/lang-switcher\.js" defer><\/script>\s*',
            r'<script src="js\/lang-switcher\.js" defer><\/script>\s*',
        ]

        for pattern in patterns:
            content = re.sub(pattern, '', content)

        # Check if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== REMOVING OLD LANG-SWITCHER.JS SCRIPT ===\n')

pages_to_update = [
    'en/blog.html',
    'en/blog-project-based-learning.html',
    'en/blog-spot-nurture-tech-skill.html',
    'en/blog-tech-like-playtime.html',
    'en/free-trial.html',
    'en/how-it-works.html',
    'en/index.html',
    'en/online-courses.html',
    'en/plans-and-faq.html',
    'en/student-projects.html',
    'vn/blog.html',
    'vn/blog-project-based-learning.html',
    'vn/blog-spot-nurture-tech-skill.html',
    'vn/blog-tech-like-playtime.html',
    'vn/free-trial.html',
    'vn/how-it-works.html',
    'vn/index.html',
    'vn/online-courses.html',
    'vn/plans-and-faq.html',
    'vn/student-projects.html',
    'en/programs/3d-designer.html',
    'en/programs/ai-programming-quest.html',
    'en/programs/app-development.html',
    'en/programs/gdevelop-game-designer.html',
    'en/programs/generative-ai-magic.html',
    'vn/programs/3d-designer.html',
    'vn/programs/ai-programming-quest.html',
    'vn/programs/app-development.html',
    'vn/programs/gdevelop-game-designer.html',
    'vn/programs/generative-ai-magic.html',
    'vn/programs/scratch-game-coder.html',
]

success = 0
no_change = 0

for page in pages_to_update:
    if os.path.exists(page):
        result = remove_lang_switcher_script(page)
        if result:
            success += 1
            print(f'✓ Removed from: {page}')
        else:
            no_change += 1

print('\n' + '=' * 60)
print(f'✅ Removed lang-switcher.js from {success} pages')
if no_change > 0:
    print(f'ℹ️  {no_change} pages didn\'t have the script')
print('=' * 60)
