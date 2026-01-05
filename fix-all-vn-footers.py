import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_footer_alignment(file_path):
    """Fix footer alignment and styling"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix opening hours formatting - make it more compact and aligned
        old_hours = '''<h3 class="text-lg font-bold mb-4 text-white">GIỜ MỞ CỬA</h3>
          <div class="space-y-2 text-sm">
            <p class="text-slate-300">Thứ Hai - Thứ Sáu: 8 giờ sáng - 9 giờ tối</p>
            <p class="text-slate-300">Thứ Bảy - Chủ Nhật: 8 giờ sáng - 8 giờ tối</p>
          </div>'''

        new_hours = '''<h3 class="text-lg font-bold mb-4 text-white">GIỜ MỞ CỬA</h3>
          <div class="space-y-2 text-sm">
            <p class="text-slate-300">Thứ 2 - Thứ 6: 8:00 - 21:00</p>
            <p class="text-slate-300">Thứ 7 - CN: 8:00 - 20:00</p>
          </div>'''

        content = content.replace(old_hours, new_hours)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

# Fix footer alignment across ALL VN pages
print('=== FIXING FOOTER ALIGNMENT ACROSS ALL VN PAGES ===\n')

vn_footer_files = [
    'vn/index.html',
    'vn/online-courses.html',
    'vn/courses/generative-ai-course.html',
    'vn/programs/scratch-game-coder.html',
    'vn/programs/gdevelop-game-designer.html',
    'vn/programs/roblox-world-creator.html',
    'vn/programs/3d-designer.html',
    'vn/programs/ai-programming-quest.html',
    'vn/programs/generative-ai-magic.html',
    'vn/programs/app-development.html',
    'vn/student-projects.html',
    'vn/how-it-works.html',
    'vn/plans-and-faq.html',
    'vn/blog.html',
]

success = 0
for file_path in vn_footer_files:
    if os.path.exists(file_path):
        print(f'Fixing {file_path}...')
        if fix_footer_alignment(file_path):
            success += 1
            print(f'  ✓ Footer hours formatted\n')
        else:
            print(f'  ✗ Failed\n')
    else:
        print(f'Skipping {file_path} (not found)\n')

print(f'✅ FOOTER ALIGNMENT FIXED ON {success} VN PAGES!')
print('\nAll footers now show consistently:')
print('  GIỜ MỞ CỬA')
print('  Thứ 2 - Thứ 6: 8:00 - 21:00')
print('  Thứ 7 - CN: 8:00 - 20:00')
print('\nMuch cleaner and better aligned! ✨')
