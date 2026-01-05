import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Common translations used across all pages
common_translations = {
    # Footer sections (used in all pages)
    'CONTACT US!': 'LIÊN HỆ CHÚNG TÔI!',
    'Tel/WA/Zalo:': 'Tel/WA/Zalo:',
    'Email:': 'Email:',
    'OPENING HOURS': 'GIỜ MỞ CỬA',
    'Monday - Friday: 8am - 9pm': 'Thứ Hai - Thứ Sáu: 8 giờ sáng - 9 giờ tối',
    'Saturday - Sunday: 8am - 8pm': 'Thứ Bảy - Chủ Nhật: 8 giờ sáng - 8 giờ tối',
    'START LEARNING': 'BẮT ĐẦU HỌC',
    'Our Vision': 'Tầm Nhìn Của Chúng Tôi',
    'Free trial': 'Học Thử Miễn Phí',
    'CONNECT WITH US!': 'KẾT NỐI VỚI CHÚNG TÔI!',

    # Common CTA phrases
    'Book Free Trial': 'Đặt Buổi Học Thử Miễn Phí',
    'Book Free Trial Now': 'Đặt Buổi Học Thử Miễn Phí Ngay',
    'Start Your Journey': 'Bắt Đầu Hành Trình',
    'Get Started': 'Bắt Đầu',

    # Common navigation (already translated in most files)
    'Programs': 'Chương Trình',
    'Projects': 'Dự Án',
    'How It Works': 'Quy Trình',
    'Free Courses': 'Khóa Học Miễn Phí',
    'Pricing': 'Giá Cả',
    'Blog': 'Blog',
}

def translate_file(file_path, specific_translations):
    """Translate a file with common + specific translations"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Combine common and specific translations
        all_translations = {**common_translations, **specific_translations}

        # Apply all translations
        for eng, viet in all_translations.items():
            content = content.replace(eng, viet)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error translating {file_path}: {e}')
        return False

# List of files to translate with their specific translations
files_to_translate = {
    'vn/free-trial.html': {
        'Free Trial | TechTutor Academy': 'Học Thử Miễn Phí | TechTutor Academy',
        'Book your free trial lesson': 'Đặt buổi học thử miễn phí',
        'Try before you commit': 'Thử trước khi cam kết',
    },
    'vn/vision.html': {
        'Our Vision | TechTutor Academy': 'Tầm Nhìn Của Chúng Tôi | TechTutor Academy',
        'Vision': 'Tầm Nhìn',
    },
    'vn/login.html': {
        'Login | TechTutor Academy': 'Đăng Nhập | TechTutor Academy',
        'Student Login': 'Đăng Nhập Học Sinh',
        'Parent Login': 'Đăng Nhập Phụ Huynh',
    },
}

# Translate all files
print('Starting batch translation of VN files...\n')
success_count = 0
total_count = len(files_to_translate)

for file_path, translations in files_to_translate.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  Success')
    else:
        print(f'  Failed')

print(f'\nCompleted: {success_count}/{total_count} files translated successfully')
