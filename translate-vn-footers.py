import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_footer(file_path):
    """Translate footer to Vietnamese"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Footer translations
        content = content.replace('OPENING HOURS', 'GIỜ MỞ CỬA')
        content = content.replace('Monday - Friday: 8am - 9pm', 'Thứ Hai - Thứ Sáu: 8 giờ sáng - 9 giờ tối')
        content = content.replace('Saturday - Sunday: 8am - 8pm', 'Thứ Bảy - Chủ Nhật: 8 giờ sáng - 8 giờ tối')
        content = content.replace('START LEARNING', 'BẮT ĐẦU HỌC')
        content = content.replace('Our Vision', 'Tầm Nhìn Của Chúng Tôi')
        content = content.replace('CONNECT WITH US!', 'KẾT NỐI VỚI CHÚNG TÔI!')
        content = content.replace('CONTACT US!', 'LIÊN HỆ CHÚNG TÔI!')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error translating {file_path}: {e}')
        return False

# List of VN files to update
vn_files = [
    'vn/index.html',
    'vn/online-courses.html',
    'vn/courses/generative-ai-course.html',
]

print('Translating footers across all VN pages...\n')

success_count = 0
for file_path in vn_files:
    print(f'Translating {file_path}...')
    if translate_footer(file_path):
        success_count += 1
        print(f'  ✓ Footer translated\n')
    else:
        print(f'  ✗ Failed\n')

print(f'✅ {success_count}/{len(vn_files)} VN PAGES HAVE CONSISTENT VIETNAMESE FOOTERS!')
