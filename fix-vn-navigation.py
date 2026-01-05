import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_navigation_links(file_path, fixes):
    """Fix navigation links in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Apply all fixes
        for old_link, new_link in fixes.items():
            content = content.replace(old_link, new_link)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

# Fix VN program pages - they should use ../index.html to go to vn/index.html
vn_program_fixes = {
    'href="../index.html"': 'href="../index.html"',  # This is actually correct for vn/programs/ to vn/
    'href="../student-projects.html"': 'href="../student-projects.html"',
    'href="../how-it-works.html"': 'href="../how-it-works.html"',
    'href="../online-courses.html"': 'href="../online-courses.html"',
    'href="../plans-and-faq.html"': 'href="../plans-and-faq.html"',
    'href="../blog.html"': 'href="../blog.html"',
    'href="../login.html"': 'href="../login.html"',
    'href="../free-trial.html"': 'href="../free-trial.html"',
    'href="../vision.html"': 'href="../vision.html"',
}

# Fix online-courses.html - it uses ../programs/ which is wrong, should be programs/
online_courses_fixes = {
    'href="../programs/scratch-game-coder.html"': 'href="programs/scratch-game-coder.html"',
    'href="../programs/gdevelop-game-designer.html"': 'href="programs/gdevelop-game-designer.html"',
    'href="../programs/roblox-world-creator.html"': 'href="programs/roblox-world-creator.html"',
    'href="../programs/3d-designer.html"': 'href="programs/3d-designer.html"',
    'href="../programs/ai-programming-quest.html"': 'href="programs/ai-programming-quest.html"',
    'href="../programs/generative-ai-magic.html"': 'href="programs/generative-ai-magic.html"',
    'href="../programs/app-development.html"': 'href="programs/app-development.html"',
    'href="../index.html"': 'href="index.html"',
    'href="../student-projects.html"': 'href="student-projects.html"',
    'href="../how-it-works.html"': 'href="how-it-works.html"',
    'href="../online-courses.html"': 'href="online-courses.html"',
    'href="../plans-and-faq.html"': 'href="plans-and-faq.html"',
    'href="../blog.html"': 'href="blog.html"',
    'href="../login.html"': 'href="login.html"',
    'href="../free-trial.html"': 'href="free-trial.html"',
    'href="../vision.html"': 'href="vision.html"',
}

print('Fixing VN navigation links...\n')

# Fix online-courses.html
print('Fixing vn/online-courses.html...')
if fix_navigation_links('vn/online-courses.html', online_courses_fixes):
    print('  Success')
else:
    print('  Failed')

print('\nAll VN navigation links have been fixed!')
print('\nSummary:')
print('- VN program pages already use correct relative paths (../)')
print('- VN online-courses.html fixed to use correct relative paths')
