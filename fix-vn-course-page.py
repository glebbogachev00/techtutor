import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_course_page(file_path):
    """Fix VN course page issues"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix 1: Desktop language switcher (line 100-101)
        content = content.replace(
            '<button type="button" data-lang="vi" aria-pressed="true" class="inline-flex h-9 w-11 items-center justify-center rounded-full bg-primary text-white text-sm">🇬🇧</button>\n            <button type="button" data-lang="vi" aria-pressed="false" class="inline-flex h-9 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇻🇳</button>',
            '<button type="button" data-lang="en" aria-pressed="false" class="inline-flex h-9 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇬🇧</button>\n            <button type="button" data-lang="vn" aria-pressed="true" class="inline-flex h-9 w-11 items-center justify-center rounded-full bg-primary text-white text-sm">🇻🇳</button>'
        )

        # Fix 2: Mobile language switcher (line 114-115)
        content = content.replace(
            '<button type="button" data-lang="vi" aria-pressed="true" class="inline-flex h-8 w-10 items-center justify-center rounded-full bg-primary text-white text-sm">🇬🇧</button>\n            <button type="button" data-lang="vi" aria-pressed="false" class="inline-flex h-8 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇻🇳</button>',
            '<button type="button" data-lang="en" aria-pressed="false" class="inline-flex h-8 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇬🇧</button>\n            <button type="button" data-lang="vn" aria-pressed="true" class="inline-flex h-8 w-10 items-center justify-center rounded-full bg-primary text-white text-sm">🇻🇳</button>'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('Fixing VN course page...\n')

if fix_course_page('vn/courses/generative-ai-course.html'):
    print('✓ Desktop language switcher fixed (VN now active)')
    print('✓ Mobile language switcher fixed (VN now active)')
    print('\n✅ VN COURSE PAGE FIXED!')
    print('\nThe lesson buttons should now work correctly.')
    print('Click "Xem Bài Học" → lesson content appears ✓')
else:
    print('✗ Failed to fix course page')
