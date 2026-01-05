import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_course_page(file_path):
    """Fix VN course page issues"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix 1: Correct the site.js path
        content = content.replace(
            '<script src="../js/site.js" defer></script>',
            '<script src="../../js/site.js" defer></script>'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('Fixing VN course page JavaScript path...\n')

if fix_course_page('vn/courses/generative-ai-course.html'):
    print('✓ Fixed site.js path: ../js/site.js → ../../js/site.js')
    print('\n✅ VN COURSE PAGE FIXED!')
    print('\nThe lesson buttons should now work correctly.')
    print('Click "Xem Bài Học" → lesson content appears ✓')
else:
    print('✗ Failed to fix course page')
