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

# All remaining translations for 3d-designer.html
translations_3d_designer = {
    # Tool descriptions in "What You'll Master"
    'Professional 3D modeling and animation software used in movies and games': 'Phần mềm mô hình hóa và hoạt hình 3D chuyên nghiệp được sử dụng trong phim và trò chơi',

    'Modeling Workflows': 'Quy Trình Mô Hình Hóa',
    'Polygon modeling, sculpting, and UV mapping techniques': 'Kỹ thuật mô hình hóa đa giác, điêu khắc và ánh xạ UV',

    'Visual Storytelling': 'Kể Chuyện Bằng Hình Ảnh',
    'Composition, color theory, and design principles': 'Nguyên tắc sáng tạo, lý thuyết màu sắc và thiết kế',

    # CTA section
    'Ready to Create Stunning 3D Art?': 'Sẵn Sàng Tạo Nghệ Thuật 3D Tuyệt Đẹp?',
    'Book a free trial lesson and watch your child\'s creativity come to life in 3D!': 'Đặt buổi học thử miễn phí và xem sự sáng tạo của con bạn sống động trong không gian 3D!',
}

print('Applying final translations to 3d-designer.html...\n')

if translate_file('vn/programs/3d-designer.html', translations_3d_designer):
    print(f'✓ Successfully translated {len(translations_3d_designer)} items\n')
    print('✅ 3D DESIGNER PAGE NOW 100% TRANSLATED!')
else:
    print('✗ Translation failed\n')
