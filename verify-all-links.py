import os
import sys
import re
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def verify_links_in_file(file_path):
    """Verify all links in a file are using correct relative paths"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        issues = []

        # Check for absolute paths starting with /en/ or /vn/
        absolute_en = re.findall(r'href="/en/[^"]*"', content)
        if absolute_en:
            issues.append(f"  ❌ Found {len(absolute_en)} absolute /en/ paths: {absolute_en[:3]}")

        absolute_vn = re.findall(r'href="/vn/[^"]*"', content)
        if absolute_vn:
            issues.append(f"  ❌ Found {len(absolute_vn)} absolute /vn/ paths: {absolute_vn[:3]}")

        # Check for other problematic absolute paths (excluding external links and anchors)
        other_absolute = re.findall(r'href="/(?![#hfm])[^"]*"', content)
        # Filter out external links (http, https, ftp, mailto)
        other_absolute = [link for link in other_absolute if not any(x in link for x in ['http', 'https', 'ftp', 'mailto'])]
        if other_absolute:
            issues.append(f"  ⚠️  Found {len(other_absolute)} other absolute paths: {other_absolute[:3]}")

        # Check for invalid relative paths that go too deep
        invalid_relative = re.findall(r'href="\.\.\/\.\.\/\.\./[^"]*"', content)
        if invalid_relative:
            issues.append(f"  ❌ Found {len(invalid_relative)} paths with too many ../ : {invalid_relative[:3]}")

        return issues

    except Exception as e:
        return [f"  ❌ Error reading file: {e}"]

print('='*80)
print('COMPREHENSIVE LINK VERIFICATION')
print('='*80)

# Get all HTML files
all_files = []

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file).replace('\\', '/')
            # Only check en/ and vn/ folders
            if file_path.startswith('./en/') or file_path.startswith('./vn/'):
                all_files.append(file_path)

all_files.sort()

total_files = 0
files_with_issues = 0
total_issues = 0

for file_path in all_files:
    total_files += 1
    issues = verify_links_in_file(file_path)

    if issues:
        files_with_issues += 1
        total_issues += len(issues)
        print(f"\n📄 {file_path}")
        for issue in issues:
            print(issue)
    else:
        print(f"✅ {file_path}")

print('\n' + '='*80)
print('SUMMARY')
print('='*80)
print(f"Total files checked: {total_files}")
print(f"Files with issues: {files_with_issues}")
print(f"Total issues found: {total_issues}")

if files_with_issues == 0:
    print("\n🎉 ALL LINKS ARE CORRECT! No issues found.")
else:
    print(f"\n⚠️  Please review and fix {files_with_issues} files with issues.")

print('='*80)
