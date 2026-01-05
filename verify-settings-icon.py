import os
import sys
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def check_settings_icon(file_path):
    """Check if page has settings icon"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        has_settings_icon = 'Language settings' in content
        has_old_flag_buttons = 'data-lang="en"' in content or 'data-lang="vn"' in content
        has_lang_switcher_js = 'lang-switcher.js' in content

        return {
            'has_settings_icon': has_settings_icon,
            'has_old_flags': has_old_flag_buttons,
            'has_old_script': has_lang_switcher_js
        }
    except Exception as e:
        return None

print('=== VERIFYING SETTINGS ICON ACROSS ALL PAGES ===\n')

# Get all HTML files
en_files = glob.glob('en/**/*.html', recursive=True) + glob.glob('en/*.html')
vn_files = glob.glob('vn/**/*.html', recursive=True) + glob.glob('vn/*.html')
root_files = glob.glob('programs/*.html') + glob.glob('courses/*.html')

all_files = en_files + vn_files + root_files

issues_found = []
pages_checked = 0

for file_path in sorted(all_files):
    result = check_settings_icon(file_path)
    if result:
        pages_checked += 1
        issues = []

        if not result['has_settings_icon']:
            issues.append('MISSING settings icon')
        if result['has_old_flags']:
            issues.append('Has OLD flag buttons')
        if result['has_old_script']:
            issues.append('Has lang-switcher.js')

        if issues:
            issues_found.append(f'{file_path}: {", ".join(issues)}')

print(f'Checked {pages_checked} pages\n')

if issues_found:
    print('⚠️  ISSUES FOUND:\n')
    for issue in issues_found:
        print(f'  ✗ {issue}')
else:
    print('✅ All pages have settings icon and no old components!')

print(f'\nTotal issues: {len(issues_found)}')
