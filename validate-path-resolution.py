import os
import sys
import re
from pathlib import Path
from urllib.parse import urljoin

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def resolve_relative_path(current_file, href):
    """Resolve a relative path from current file location"""
    current_dir = os.path.dirname(current_file)
    resolved = os.path.normpath(os.path.join(current_dir, href))
    return resolved.replace('\\', '/')

def check_link_exists(file_path, href):
    """Check if the linked file actually exists"""
    # Skip external links, anchors, and mailto
    if href.startswith(('http', 'https', 'mailto:', 'tel:', '#')):
        return True, "external/anchor"

    # Resolve the path
    resolved = resolve_relative_path(file_path, href)

    # Check if file exists
    if os.path.exists(resolved):
        return True, resolved
    else:
        return False, resolved

def validate_all_links(file_path):
    """Validate all links in a file actually resolve to existing files"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        broken_links = []

        # Find all href links
        links = re.findall(r'href="([^"]+)"', content)

        for link in links:
            exists, resolved_path = check_link_exists(file_path, link)
            if not exists:
                broken_links.append((link, resolved_path))

        return broken_links

    except Exception as e:
        return [("ERROR", str(e))]

print('='*80)
print('PATH RESOLUTION VALIDATION')
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
files_with_broken = 0
total_broken = 0

for file_path in all_files:
    total_files += 1
    broken_links = validate_all_links(file_path)

    if broken_links:
        files_with_broken += 1
        total_broken += len(broken_links)
        print(f"\n❌ {file_path}")
        for link, resolved in broken_links[:5]:  # Show first 5
            print(f"   Broken: {link}")
            print(f"   Resolves to: {resolved}")
    else:
        print(f"✅ {file_path}")

print('\n' + '='*80)
print('SUMMARY')
print('='*80)
print(f"Total files checked: {total_files}")
print(f"Files with broken links: {files_with_broken}")
print(f"Total broken links: {total_broken}")

if files_with_broken == 0:
    print("\n🎉 ALL PATHS RESOLVE CORRECTLY! No broken links found.")
else:
    print(f"\n⚠️  Please fix {files_with_broken} files with broken links.")

print('='*80)
