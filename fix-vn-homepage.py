import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_homepage(file_path):
    """Fix VN homepage issues"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix 1: Language switcher - swap GB and VN active states
        content = content.replace(
            '<button type="button" data-lang="en" aria-pressed="true" class="inline-flex h-9 w-11 items-center justify-center rounded-full bg-primary text-white text-sm">🇬🇧</button>\n            <button type="button" data-lang="vn" aria-pressed="false" class="inline-flex h-9 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇻🇳</button>',
            '<button type="button" data-lang="en" aria-pressed="false" class="inline-flex h-9 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 text-sm">🇬🇧</button>\n            <button type="button" data-lang="vn" aria-pressed="true" class="inline-flex h-9 w-11 items-center justify-center rounded-full bg-primary text-white text-sm">🇻🇳</button>'
        )

        # Fix 2: Translate blog title
        content = content.replace(
            '<h3 class="text-lg font-bold text-ink mt-3 mb-2">Unlocking Your Child\'s Potential With Project-Based Learning</h3>',
            '<h3 class="text-lg font-bold text-ink mt-3 mb-2">Mở Khóa Tiềm Năng Của Con Với Học Tập Dựa Trên Dự Án</h3>'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('Fixing VN homepage issues...\n')

if fix_homepage('vn/index.html'):
    print('✓ Language switcher fixed (VN now active)')
    print('✓ Blog title translated')
    print('\n✅ VN HOMEPAGE FIXED!')
else:
    print('✗ Failed to fix homepage')
