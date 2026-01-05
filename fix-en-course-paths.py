import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_en_course_paths(file_path):
    """Fix paths in EN course file (moved from root courses/ to en/courses/)"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Fix asset paths: ../images/ -> ../../images/
        content = re.sub(r'href="\.\./images/', r'href="../../images/', content)
        content = re.sub(r'src="\.\./images/', r'src="../../images/', content)

        # Fix JS paths: ../js/ -> ../../js/
        content = re.sub(r'src="\.\./js/', r'src="../../js/', content)

        # Fix navigation paths
        # Programs links: ../programs/ -> ../../programs/ or just programs/
        content = re.sub(r'href="\.\./programs/', r'href="../../programs/', content)

        # Other page links: ../page.html -> ../../page.html
        content = re.sub(r'href="\.\./student-projects\.html"', r'href="../../student-projects.html"', content)
        content = re.sub(r'href="\.\./how-it-works\.html"', r'href="../../how-it-works.html"', content)
        content = re.sub(r'href="\.\./online-courses\.html"', r'href="../../online-courses.html"', content)
        content = re.sub(r'href="\.\./plans-and-faq\.html"', r'href="../../plans-and-faq.html"', content)
        content = re.sub(r'href="\.\./blog\.html"', r'href="../../blog.html"', content)
        content = re.sub(r'href="\.\./login\.html"', r'href="../../login.html"', content)
        content = re.sub(r'href="\.\./free-trial\.html"', r'href="../../free-trial.html"', content)
        content = re.sub(r'href="\.\./index\.html"', r'href="../../index.html"', content)
        content = re.sub(r'href="../"', r'href="../../"', content)

        # Fix language switcher - should point to VN version
        # Replace any link to root with link to VN course
        content = re.sub(
            r'<a href="\.\.\/index\.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">\s*<span class="text-2xl">🇻🇳</span>\s*<span class="text-sm font-medium text-slate-700">Tiếng Việt</span>',
            r'<a href="../../vn/courses/generative-ai-course.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">\n                  <span class="text-2xl">🇻🇳</span>\n                  <span class="text-sm font-medium text-slate-700">Tiếng Việt</span>',
            content
        )

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== FIXING EN COURSE PATHS ===\n')

file_path = 'en/courses/generative-ai-course.html'
if os.path.exists(file_path):
    result = fix_en_course_paths(file_path)
    if result:
        print(f'✓ Fixed paths in: {file_path}')
        print('✓ Updated asset references (images, JS)')
        print('✓ Updated navigation links')
        print('✓ Fixed language switcher to link to VN version')
    else:
        print(f'✗ No changes needed or failed')
else:
    print(f'✗ File not found: {file_path}')

print('\n' + '='*60)
