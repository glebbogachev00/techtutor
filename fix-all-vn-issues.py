import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_course_page_js(file_path):
    """Fix VN course page JavaScript path"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix the site.js path
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

# Fix course page JavaScript
print('=== FIXING VN COURSE PAGE JAVASCRIPT ===\n')

if fix_course_page_js('vn/courses/generative-ai-course.html'):
    print('✓ Fixed site.js path: ../js/site.js → ../../js/site.js')
    print('  The lesson buttons should now work correctly!\n')
else:
    print('✗ Failed to fix course page JavaScript\n')

# Fix footer alignment across all VN pages
print('=== FIXING FOOTER ALIGNMENT ===\n')

vn_footer_files = [
    'vn/index.html',
    'vn/online-courses.html',
    'vn/courses/generative-ai-course.html',
]

success = 0
for file_path in vn_footer_files:
    print(f'Fixing {file_path}...')
    if fix_footer_alignment(file_path):
        success += 1
        print(f'  ✓ Footer hours formatted\n')
    else:
        print(f'  ✗ Failed\n')

print(f'✅ FOOTER ALIGNMENT FIXED ON {success}/{len(vn_footer_files)} PAGES!')
print('\nFooter now shows:')
print('  GIỜ MỞ CỬA')
print('  Thứ 2 - Thứ 6: 8:00 - 21:00')
print('  Thứ 7 - CN: 8:00 - 20:00')
