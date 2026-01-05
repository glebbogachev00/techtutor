import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def check_font_in_file(file_path):
    """Check what font configuration a file uses"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for Inter font import
        has_inter_import = 'fonts.googleapis.com/css2?family=Inter' in content

        # Check for font-family in style or tailwind config
        has_inter_config = "fontFamily: { sans: ['Inter'" in content or "font-family: 'Inter'" in content

        # Check body style
        has_body_font = re.search(r'body\s*\{[^}]*font-family:\s*["\']Inter["\']', content)

        return {
            'has_import': has_inter_import,
            'has_config': has_inter_config,
            'has_body': has_body_font is not None,
            'path': file_path
        }
    except Exception as e:
        return {'error': str(e), 'path': file_path}

# Check all HTML files in en/ and vn/ folders
print('Checking font configuration across all pages...\n')

issues = []

# Get all HTML files
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            # Only check en/ and vn/ folders
            if '/en/' in file_path.replace('\\', '/') or '/vn/' in file_path.replace('\\', '/'):
                result = check_font_in_file(file_path)

                if 'error' not in result:
                    if not (result['has_import'] and result['has_config']):
                        issues.append(result)
                        print(f"❌ {result['path']}")
                        print(f"   Import: {result['has_import']}, Config: {result['has_config']}, Body: {result['has_body']}")
                else:
                    print(f"⚠️  Error checking {result['path']}: {result['error']}")

if not issues:
    print('✅ All pages have consistent Inter font configuration!')
else:
    print(f'\n⚠️  Found {len(issues)} pages with font issues that need fixing')
