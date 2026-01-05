import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def check_mobile_nav(file_path, expected_lang):
    """Check if mobile navigation exists and has correct structure"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        issues = []

        # Check 1: Mobile menu exists
        if 'id="mobile-menu"' not in content:
            issues.append('Missing mobile menu (id="mobile-menu")')

        # Check 2: Mobile menu button exists
        if 'id="mobile-menu-button"' not in content:
            issues.append('Missing mobile menu button')

        # Check 3: Mobile programs toggle exists
        if 'id="mobile-programs-toggle"' not in content:
            issues.append('Missing mobile programs toggle')

        # Check 4: Check for correct language in links
        if expected_lang == 'vn':
            # Check for Vietnamese translations
            if 'Dự Án' not in content:
                issues.append('Missing Vietnamese "Dự Án" link')
            if 'Quy Trình' not in content:
                issues.append('Missing Vietnamese "Quy Trình" link')
            if 'Giá Cả' not in content:
                issues.append('Missing Vietnamese "Giá Cả" link')

        # Check 5: Mobile login button exists
        mobile_login = re.search(r'<a[^>]*login\.html[^>]*>.*?<svg.*?</svg>.*?</a>', content, re.DOTALL)
        if not mobile_login:
            issues.append('Missing mobile login button')

        return issues
    except Exception as e:
        return [f'Error reading file: {e}']

print('=== VERIFYING MOBILE NAVIGATION ===\n')

# VN pages to check
vn_pages = [
    ('vn/index.html', 'vn'),
    ('vn/online-courses.html', 'vn'),
    ('vn/student-projects.html', 'vn'),
    ('vn/how-it-works.html', 'vn'),
    ('vn/plans-and-faq.html', 'vn'),
    ('vn/free-trial.html', 'vn'),
]

# EN pages to check
en_pages = [
    ('index.html', 'en'),
    ('online-courses.html', 'en'),
    ('student-projects.html', 'en'),
    ('how-it-works.html', 'en'),
    ('plans-and-faq.html', 'en'),
    ('free-trial.html', 'en'),
]

all_good = True

print('--- VN PAGES ---')
for file_path, lang in vn_pages:
    if os.path.exists(file_path):
        issues = check_mobile_nav(file_path, lang)
        if issues:
            print(f'❌ {file_path}:')
            for issue in issues:
                print(f'   - {issue}')
            all_good = False
        else:
            print(f'✓ {file_path}')
    else:
        print(f'⚠ {file_path} (not found)')

print('\n--- EN PAGES ---')
for file_path, lang in en_pages:
    if os.path.exists(file_path):
        issues = check_mobile_nav(file_path, lang)
        if issues:
            print(f'❌ {file_path}:')
            for issue in issues:
                print(f'   - {issue}')
            all_good = False
        else:
            print(f'✓ {file_path}')
    else:
        print(f'⚠ {file_path} (not found)')

if all_good:
    print('\n✅ ALL MOBILE NAVIGATION LOOKS GOOD!')
else:
    print('\n⚠ SOME ISSUES FOUND - SEE ABOVE')
