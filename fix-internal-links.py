import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_links_in_file(file_path, is_en=True):
    """Fix links in a file to point directly to en/ or vn/ versions"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Links that should point within the same language folder
        links_to_fix = [
            'blog.html',
            'blog-project-based-learning.html',
            'blog-spot-nurture-tech-skill.html',
            'blog-tech-like-playtime.html',
            'free-trial.html',
            'how-it-works.html',
            'online-courses.html',
            'plans-and-faq.html',
            'student-projects.html',
            'vision.html',
            'student-portal.html',
            'login.html',
        ]

        # Program links
        program_files = [
            '3d-designer.html',
            'ai-programming-quest.html',
            'app-development.html',
            'gdevelop-game-designer.html',
            'generative-ai-magic.html',
            'roblox-world-creator.html',
            'scratch-game-coder.html',
        ]

        # Fix regular page links - make them relative
        for link in links_to_fix:
            # href="../blog.html" or href="../../blog.html" → href="blog.html" (relative within folder)
            content = re.sub(
                rf'href="\.\./(?:\.\./)?{re.escape(link)}"',
                f'href="{link}"',
                content
            )
            content = re.sub(
                rf'href="(?:\.\./)?{re.escape(link)}"',
                f'href="{link}"',
                content
            )

        # Fix program links - should be programs/filename.html
        for prog in program_files:
            # href="../programs/..." or href="../../programs/..." → href="programs/..."
            content = re.sub(
                rf'href="\.\./(?:\.\./)?programs/{re.escape(prog)}"',
                f'href="programs/{prog}"',
                content
            )

        # Fix course links
        content = re.sub(
            r'href="\.\./(?:\.\./)?courses/generative-ai-course\.html"',
            'href="courses/generative-ai-course.html"',
            content
        )

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'✗ Error processing {file_path}: {e}')
        return False

print('='*70)
print('FIXING INTERNAL LINKS TO ELIMINATE REDIRECT CHAINS')
print('='*70)

fixed_count = 0

# Fix all EN pages
print('\nFixing EN pages...')
for file_path in glob.glob('en/**/*.html', recursive=True):
    if fix_links_in_file(file_path, is_en=True):
        fixed_count += 1
        print(f'✓ Fixed: {file_path}')

# Fix all VN pages
print('\nFixing VN pages...')
for file_path in glob.glob('vn/**/*.html', recursive=True):
    if fix_links_in_file(file_path, is_en=False):
        fixed_count += 1
        print(f'✓ Fixed: {file_path}')

print(f'\n✅ Fixed internal links in {fixed_count} files')
print('='*70)
print('\nThis eliminates redirect chains by ensuring:')
print('  • EN pages link directly to other EN pages')
print('  • VN pages link directly to other VN pages')
print('  • No links go through root redirect pages')
print('='*70)
