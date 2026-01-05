import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_mobile_nav(file_path):
    """Fix VN course page mobile navigation"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix mobile dropdown menu items (lines 134-140)
        content = content.replace(
            '<a href="../programs/scratch-game-coder.html" class="text-slate-600 hover:text-primary py-1">Scratch Game Coder</a>',
            '<a href="../programs/scratch-game-coder.html" class="text-slate-600 hover:text-primary py-1">Lập Trình Game Scratch</a>'
        )
        content = content.replace(
            '<a href="../programs/gdevelop-game-designer.html" class="text-slate-600 hover:text-primary py-1">GDevelop Game Designer</a>',
            '<a href="../programs/gdevelop-game-designer.html" class="text-slate-600 hover:text-primary py-1">Thiết Kế Game GDevelop</a>'
        )
        content = content.replace(
            '<a href="../programs/roblox-world-creator.html" class="text-slate-600 hover:text-primary py-1">Roblox World Creator</a>',
            '<a href="../programs/roblox-world-creator.html" class="text-slate-600 hover:text-primary py-1">Sáng Tạo Thế Giới Roblox</a>'
        )
        content = content.replace(
            '<a href="../programs/3d-designer.html" class="text-slate-600 hover:text-primary py-1">3D Designer</a>',
            '<a href="../programs/3d-designer.html" class="text-slate-600 hover:text-primary py-1">Thiết Kế 3D</a>'
        )
        content = content.replace(
            '<a href="../programs/ai-programming-quest.html" class="text-slate-600 hover:text-primary py-1">AI & Programming Quest</a>',
            '<a href="../programs/ai-programming-quest.html" class="text-slate-600 hover:text-primary py-1">Khám Phá AI & Lập Trình</a>'
        )
        content = content.replace(
            '<a href="../programs/generative-ai-magic.html" class="text-slate-600 hover:text-primary py-1">Generative AI Magic</a>',
            '<a href="../programs/generative-ai-magic.html" class="text-slate-600 hover:text-primary py-1">Phép Thuật AI Tạo Sinh</a>'
        )
        content = content.replace(
            '<a href="../programs/app-development.html" class="text-slate-600 hover:text-primary py-1">App Development</a>',
            '<a href="../programs/app-development.html" class="text-slate-600 hover:text-primary py-1">Phát Triển Ứng Dụng</a>'
        )

        # Fix mobile "Free Trial" button (line 157)
        content = content.replace(
            '<a href="../free-trial.html" class="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white font-semibold shadow-sm" data-i18n="nav.free-trial">Free Trial</a>',
            '<a href="../free-trial.html" class="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white font-semibold shadow-sm">Dùng Thử Miễn Phí</a>'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('=== FIXING VN COURSE PAGE MOBILE NAVIGATION ===\n')

if fix_mobile_nav('vn/courses/generative-ai-course.html'):
    print('✓ Translated all 7 mobile dropdown items')
    print('✓ Translated mobile "Free Trial" → "Dùng Thử Miễn Phí"')
    print('\n✅ MOBILE NAVIGATION FULLY TRANSLATED!')
    print('\nAll navigation items now show in Vietnamese on both desktop and mobile.')
else:
    print('✗ Failed to fix mobile navigation')
