import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def verify_footer(file_path):
    """Verify footer has correct format"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for new format
        if 'Thứ 2 - Thứ 6: 8:00 - 21:00' in content:
            return True, 'Correct (new format)'
        elif 'Thứ Hai - Thứ Sáu: 8 giờ sáng - 9 giờ tối' in content:
            return False, 'Old format found'
        elif 'GIỜ MỞ CỬA' in content:
            return None, 'Footer exists but format unclear'
        else:
            return None, 'No footer found'
    except Exception as e:
        return None, f'Error: {e}'

def verify_mobile_nav(file_path):
    """Verify mobile navigation exists"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        has_mobile = 'id="mobile-menu"' in content
        has_button = 'id="mobile-menu-button"' in content

        return has_mobile and has_button
    except:
        return None

print('=' * 60)
print('FINAL VERIFICATION REPORT')
print('=' * 60)

# VN Pages
vn_pages = [
    'vn/index.html',
    'vn/online-courses.html',
    'vn/student-projects.html',
    'vn/how-it-works.html',
    'vn/plans-and-faq.html',
    'vn/blog.html',
    'vn/free-trial.html',
    'vn/courses/generative-ai-course.html',
    'vn/programs/scratch-game-coder.html',
    'vn/programs/gdevelop-game-designer.html',
    'vn/programs/roblox-world-creator.html',
    'vn/programs/3d-designer.html',
    'vn/programs/ai-programming-quest.html',
    'vn/programs/generative-ai-magic.html',
    'vn/programs/app-development.html',
]

print('\n📋 VN PAGES FOOTER STATUS:')
print('-' * 60)

footer_ok = 0
footer_issues = 0

for page in vn_pages:
    if os.path.exists(page):
        result, msg = verify_footer(page)
        if result == True:
            print(f'✅ {page:<50} {msg}')
            footer_ok += 1
        elif result == False:
            print(f'❌ {page:<50} {msg}')
            footer_issues += 1
        else:
            print(f'⚠️  {page:<50} {msg}')
    else:
        print(f'⚠️  {page:<50} File not found')

print(f'\nFooter Summary: {footer_ok} correct, {footer_issues} issues')

print('\n📱 VN PAGES MOBILE NAVIGATION STATUS:')
print('-' * 60)

mobile_ok = 0
mobile_issues = 0

for page in vn_pages:
    if os.path.exists(page):
        has_mobile = verify_mobile_nav(page)
        if has_mobile:
            print(f'✅ {page}')
            mobile_ok += 1
        elif has_mobile == False:
            print(f'❌ {page} - Missing mobile navigation')
            mobile_issues += 1
        else:
            print(f'⚠️  {page} - Could not verify')

print(f'\nMobile Nav Summary: {mobile_ok} correct, {mobile_issues} issues')

print('\n' + '=' * 60)
if footer_issues == 0 and mobile_issues == 0:
    print('🎉 ALL CHECKS PASSED!')
else:
    print(f'⚠️  Found {footer_issues} footer issues and {mobile_issues} mobile nav issues')
print('=' * 60)
