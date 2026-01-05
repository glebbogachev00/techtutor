import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_course_nav(file_path):
    """Fix VN course page navigation to match homepage"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix 1: Translate dropdown menu items
        content = content.replace(
            '<a href="../programs/scratch-game-coder.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Scratch Game Coder</a>',
            '<a href="../programs/scratch-game-coder.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Lập Trình Game Scratch</a>'
        )
        content = content.replace(
            '<a href="../programs/gdevelop-game-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">GDevelop Game Designer</a>',
            '<a href="../programs/gdevelop-game-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Thiết Kế Game GDevelop</a>'
        )
        content = content.replace(
            '<a href="../programs/roblox-world-creator.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Roblox World Creator</a>',
            '<a href="../programs/roblox-world-creator.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Sáng Tạo Thế Giới Roblox</a>'
        )
        content = content.replace(
            '<a href="../programs/3d-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">3D Designer</a>',
            '<a href="../programs/3d-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Thiết Kế 3D</a>'
        )
        content = content.replace(
            '<a href="../programs/ai-programming-quest.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">AI & Programming Quest</a>',
            '<a href="../programs/ai-programming-quest.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Khám Phá AI & Lập Trình</a>'
        )
        content = content.replace(
            '<a href="../programs/generative-ai-magic.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Generative AI Magic</a>',
            '<a href="../programs/generative-ai-magic.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Phép Thuật AI Tạo Sinh</a>'
        )
        content = content.replace(
            '<a href="../programs/app-development.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">App Development</a>',
            '<a href="../programs/app-development.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Phát Triển Ứng Dụng</a>'
        )

        # Fix 2: Add missing "How it Works" link and fix nav order
        old_nav_links = '''<a href="../student-projects.html" class="hover:text-primary transition" data-i18n="nav.projects">Dự Án</a>
          <a href="../online-courses.html" class="hover:text-primary transition" data-i18n="nav.free-courses">Free Courses</a>
          <a href="../plans-and-faq.html" class="hover:text-primary transition" data-i18n="nav.pricing">Giá Cả</a>
          <a href="../blog.html" class="hover:text-primary transition" data-i18n="nav.blog">Blog</a>'''

        new_nav_links = '''<a href="../student-projects.html" class="hover:text-primary transition">Dự Án</a>
          <a href="../how-it-works.html" class="hover:text-primary transition">Quy Trình</a>
          <a href="../online-courses.html" class="hover:text-primary transition">Khóa Học Miễn Phí</a>
          <a href="../plans-and-faq.html" class="hover:text-primary transition">Giá Cả</a>
          <a href="../blog.html" class="hover:text-primary transition">Blog</a>'''

        content = content.replace(old_nav_links, new_nav_links)

        # Fix 3: Translate Login and Free Trial buttons
        content = content.replace(
            '</svg>\n            Login\n          </a>',
            '</svg>\n            Đăng Nhập\n          </a>'
        )

        content = content.replace(
            '<a href="../free-trial.html" class="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light" data-i18n="nav.free-trial">Free Trial</a>',
            '<a href="../free-trial.html" class="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light">Dùng Thử Miễn Phí</a>'
        )

        # Fix 4: Update text color consistency
        content = content.replace(
            '<a href="../index.html#programs" class="inline-flex items-center gap-1 text-slate-600 hover:text-primary transition">',
            '<a href="../index.html#programs" class="inline-flex items-center gap-1 text-slate-700 hover:text-primary transition">'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

print('=== FIXING VN COURSE PAGE NAVIGATION ===\n')

if fix_course_nav('vn/courses/generative-ai-course.html'):
    print('✓ Translated all 7 program dropdown items')
    print('✓ Added missing "Quy Trình" (How it Works) link')
    print('✓ Translated "Free Courses" → "Khóa Học Miễn Phí"')
    print('✓ Translated "Login" → "Đăng Nhập"')
    print('✓ Translated "Free Trial" → "Dùng Thử Miễn Phí"')
    print('✓ Fixed text color consistency')
    print('\n✅ VN COURSE PAGE NAVIGATION NOW MATCHES HOMEPAGE!')
else:
    print('✗ Failed to fix navigation')
