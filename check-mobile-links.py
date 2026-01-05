import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def check_mobile_links(file_path, base_path):
    """Check if mobile navigation links are correct"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        issues = []

        # Extract mobile menu section
        mobile_menu_match = re.search(r'<div id="mobile-menu"[^>]*>(.*?)</div>\s*</div>\s*</header>', content, re.DOTALL)

        if not mobile_menu_match:
            return ['Mobile menu not found']

        mobile_menu = mobile_menu_match.group(1)

        # Find all href links in mobile menu
        links = re.findall(r'href="([^"]+)"', mobile_menu)

        for link in links:
            # Skip external links, anchors, and login/free-trial
            if link.startswith('http') or link.startswith('#') or 'login.html' in link or 'free-trial.html' in link:
                continue

            # Construct full path
            if link.startswith('../'):
                # Going up one level
                full_path = os.path.normpath(os.path.join(os.path.dirname(file_path), link))
            else:
                full_path = os.path.normpath(os.path.join(base_path, link))

            if not os.path.exists(full_path):
                issues.append(f'Broken link: {link} -> {full_path}')

        return issues
    except Exception as e:
        return [f'Error: {e}']

print('=== CHECKING MOBILE NAVIGATION LINKS ===\n')

vn_pages = [
    'vn/index.html',
    'vn/online-courses.html',
    'vn/student-projects.html',
    'vn/how-it-works.html',
    'vn/plans-and-faq.html',
    'vn/courses/generative-ai-course.html',
]

en_pages = [
    'en/index.html',
    'online-courses.html',
    'student-projects.html',
    'how-it-works.html',
    'plans-and-faq.html',
]

all_good = True

print('--- VN PAGES ---')
for file_path in vn_pages:
    if os.path.exists(file_path):
        issues = check_mobile_links(file_path, 'vn')
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
for file_path in en_pages:
    if os.path.exists(file_path):
        issues = check_mobile_links(file_path, '')
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
    print('\n✅ ALL MOBILE LINKS ARE VALID!')
else:
    print('\n⚠ SOME BROKEN LINKS FOUND - SEE ABOVE')
