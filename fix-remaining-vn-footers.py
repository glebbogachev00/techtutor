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

        if old_hours in content:
            content = content.replace(old_hours, new_hours)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        else:
            return False
    except Exception as e:
        print(f'Error fixing {file_path}: {e}')
        return False

# Check all VN pages for footer issues
print('=== FIXING REMAINING VN PAGE FOOTERS ===\n')

vn_pages = [
    'vn/free-trial.html',
    'vn/login.html',
]

success = 0
for file_path in vn_pages:
    if os.path.exists(file_path):
        print(f'Checking {file_path}...')
        if fix_footer_alignment(file_path):
            success += 1
            print(f'  ✓ Footer fixed\n')
        else:
            print(f'  - Footer already correct or not found\n')
    else:
        print(f'Skipping {file_path} (not found)\n')

print(f'✅ CHECKED {len(vn_pages)} ADDITIONAL PAGES!')
if success > 0:
    print(f'Fixed {success} page(s) with old footer format.')
else:
    print('All pages already have correct footer format.')
