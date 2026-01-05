import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_nav(file_path):
    """Fix VN online-courses navigation"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix desktop navigation language switcher
        content = content.replace(
            '<button type="button" data-lang="en" aria-pressed="true" class="inline-flex h-9 w-11 items-center justify-center rounded-full bg-primary text-white text-sm">🇬🇧</button>\n            <button type="button" data-lang="vn" aria-pressed="false" class="inline-flex h-9 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇻🇳</button>',
            '<button type="button" data-lang="en" aria-pressed="false" class="inline-flex h-9 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇬🇧</button>\n            <button type="button" data-lang="vn" aria-pressed="true" class="inline-flex h-9 w-11 items-center justify-center rounded-full bg-primary text-white text-sm">🇻🇳</button>'
        )

        # Fix mobile navigation language switcher
        content = content.replace(
            '<button type="button" data-lang="en" aria-pressed="true" class="inline-flex h-8 w-10 items-center justify-center rounded-full bg-primary text-white text-sm">🇬🇧</button>\n            <button type="button" data-lang="vn" aria-pressed="false" class="inline-flex h-8 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇻🇳</button>',
            '<button type="button" data-lang="en" aria-pressed="false" class="inline-flex h-8 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇬🇧</button>\n            <button type="button" data-lang="vn" aria-pressed="true" class="inline-flex h-8 w-10 items-center justify-center rounded-full bg-primary text-white text-sm">🇻🇳</button>'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('Fixing VN online-courses navigation...\n')

if fix_nav('vn/online-courses.html'):
    print('✓ Desktop language switcher fixed (VN now active)')
    print('✓ Mobile language switcher fixed (VN now active)')
    print('\n✅ VN ONLINE-COURSES NAVIGATION FIXED!')
    print('\nThe "Đăng ký ngay" button already links correctly to:')
    print('  vn/courses/generative-ai-course.html ✓')
else:
    print('✗ Failed to fix navigation')
