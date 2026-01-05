import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_file(file_path, replacements):
    """Fix a file with multiple replacements"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Apply all replacements
        for old, new in replacements.items():
            content = content.replace(old, new)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('Fixing all navigation and image issues...\n')

# Fix 1: EN online-courses.html - course link should use ../courses/
print('1. Fixing EN online-courses.html course link...')
en_online_courses_fixes = {
    'href="courses/generative-ai-course.html"': 'href="../courses/generative-ai-course.html"'
}
if fix_file('en/online-courses.html', en_online_courses_fixes):
    print('   ✓ EN course link fixed\n')
else:
    print('   ✗ Failed\n')

# Fix 2: VN course page - images should use ../../images/ (two levels up)
print('2. Fixing VN course page image paths...')
vn_course_image_fixes = {
    'src="../images/': 'src="../../images/',
    'href="../images/': 'href="../../images/'
}
if fix_file('vn/courses/generative-ai-course.html', vn_course_image_fixes):
    print('   ✓ VN course images fixed\n')
else:
    print('   ✗ Failed\n')

# Fix 3: Check if plans-and-faq.html exists in VN folder
print('3. Checking VN plans-and-faq.html...')
if os.path.exists('vn/plans-and-faq.html'):
    print('   ✓ VN FAQ page exists\n')
else:
    print('   ✗ VN FAQ page does not exist - needs to be created\n')
    if os.path.exists('plans-and-faq.html'):
        print('   → Root FAQ page exists, will need translation\n')
    elif os.path.exists('en/plans-and-faq.html'):
        print('   → EN FAQ page exists, will need translation\n')

print('All fixes completed!')
