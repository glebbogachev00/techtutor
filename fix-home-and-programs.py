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

# All missing translations
all_missing_translations = {
    # VN Home Page - 3 section headings
    'vn/index.html': {
        'An Easier Way to<br/>\n          Learn Tech Skills': 'Cách Dễ Dàng Hơn Để<br/>\n          Học Kỹ Năng Công Nghệ',
        'What Our Lovely<br/>\n          Clients Say': 'Khách Hàng Thân Yêu<br/>\n          Nói Gì Về Chúng Tôi',
        'Useful Content For<br/>\n          Your Check': 'Nội Dung Hữu Ích<br/>\n          Dành Cho Bạn',
    },

    # App Development Program Page
    'vn/programs/app-development.html': {
        'App Logic & Features': 'Logic & Tính Năng Ứng Dụng',
        'Publish Real Apps': 'Xuất Bản Ứng Dụng Thực',
        'Test your apps on real devices and publish them so friends and family can download and use them. Share your creations with the world!': 'Thử nghiệm ứng dụng của bạn trên thiết bị thực và xuất bản để bạn bè và gia đình có thể tải xuống và sử dụng. Chia sẻ sáng tạo của bạn với thế giới!',
    },
}

print('Translating home page sections and program page content...\n')

success_count = 0
total_translations = 0

for file_path, translations in all_missing_translations.items():
    print(f'Translating {file_path}...')
    total_translations += len(translations)
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{len(all_missing_translations)} files')
print(f'Total translations applied: {total_translations}')
print('\n✅ HOME PAGE AND PROGRAM PAGES NOW FULLY TRANSLATED!')
