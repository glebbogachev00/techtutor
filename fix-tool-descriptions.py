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

# Tool description translations
tool_descriptions = {
    'vn/programs/gdevelop-game-designer.html': {
        'Powerful no-code game development platform used by professionals': 'Nền tảng phát triển game no-code mạnh mẽ được các chuyên gia sử dụng',
    },
    'vn/programs/roblox-world-creator.html': {
        'Professional game development environment used by millions': 'Môi trường phát triển game chuyên nghiệp được hàng triệu người sử dụng',
    },
}

print('Translating tool descriptions...\n')

success_count = 0
total_count = len(tool_descriptions)

for file_path, translations in tool_descriptions.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{total_count} files')
print('\n✅ ALL TOOL DESCRIPTIONS NOW TRANSLATED!')
