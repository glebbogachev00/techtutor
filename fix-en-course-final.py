import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_en_course_final(file_path):
    """Fix EN course page to be English-only and fix language switcher"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Fix language switcher links from ../vn/index.html to ../../vn/courses/generative-ai-course.html
        content = re.sub(
            r'<a href="\.\./vn/index\.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">',
            r'<a href="../../vn/courses/generative-ai-course.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">',
            content
        )

        # Remove the entire bilingual translation system and force English
        # Find and replace the translations section
        translations_pattern = r'// Translations\s+window\.pageTranslations = \{[^}]+\{[^}]+\}[^}]+\{[^}]+\}\s*\};'
        content = re.sub(translations_pattern, '// No translations needed - English only page', content, flags=re.DOTALL)

        # Remove the language switching function and initialization
        lang_switch_pattern = r'// Language switching.*?// Mobile menu toggle - handled by js/site\.js'
        content = re.sub(lang_switch_pattern, '// Mobile menu toggle - handled by js/site.js', content, flags=re.DOTALL)

        # Remove data-i18n attributes since we're not using translations
        content = re.sub(r' data-i18n="[^"]*"', '', content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== FIXING EN COURSE TO BE ENGLISH-ONLY ===\n')

file_path = 'en/courses/generative-ai-course.html'
if os.path.exists(file_path):
    result = fix_en_course_final(file_path)
    if result:
        print(f'✓ Fixed: {file_path}')
        print('✓ Removed bilingual translation system')
        print('✓ Fixed language switcher to point to VN course')
        print('✓ Removed data-i18n attributes')
        print('✓ Page now displays in English only')
    else:
        print(f'✗ No changes needed or failed')
else:
    print(f'✗ File not found: {file_path}')

print('\n' + '='*60)
