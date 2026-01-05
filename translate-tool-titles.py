import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_file(file_path, translations):
    """Apply translations to a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Apply all translations
        for eng, viet in translations.items():
            content = content.replace(eng, viet)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error translating {file_path}: {e}')
        return False

# Tool title translations
tool_title_translations = {
    'vn/programs/roblox-world-creator.html': {
        'Lua Scripting': 'Lập Trình Lua',
        'Creative Storytelling': 'Kể Chuyện Sáng Tạo',
    },
}

print('Translating tool titles...\n')

for file_path, translations in tool_title_translations.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print('✅ ALL TOOL TITLES NOW TRANSLATED!')
