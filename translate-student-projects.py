import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Read the VN student-projects.html file
with open('vn/student-projects.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Dictionary of all English -> Vietnamese translations
translations = {
    # Meta tags
    'Student Projects | TechTutor Academy': 'Dự Án Học Sinh | TechTutor Academy',
    'See what our students create! Browse project highlights from our Scratch, Roblox, AI, 3D Design, and App Development programs.': 'Xem những gì học sinh của chúng tôi tạo ra! Khám phá những dự án nổi bật từ các chương trình Scratch, Roblox, AI, Thiết Kế 3D và Phát Triển Ứng Dụng.',

    # Hero section - images alt text
    'Student learning': 'Học sinh đang học',
    'Student working': 'Học sinh đang làm việc',
    'Student coding': 'Học sinh đang lập trình',
    'Student project': 'Dự án học sinh',

    # Features section
    'Students collaborating on projects': 'Học sinh hợp tác trong dự án',

    # Project details
    'Storytelling with AI voice, music, and visuals.': 'Kể chuyện với giọng nói AI, âm nhạc và hình ảnh.',
    'Reaction-based obby with timers and custom scripting.': 'Trò chơi vượt chướng ngại vật dựa trên phản xạ với bộ đếm thời gian và kịch bản tùy chỉnh.',
    'Training custom classifiers with computer vision tools.': 'Huấn luyện bộ phân loại tùy chỉnh với công cụ thị giác máy tính.',
    'Prototyping a personal habit tracker with Thunkable.': 'Tạo nguyên mẫu ứng dụng theo dõi thói quen cá nhân với Thunkable.',
    'Interactive story coding fundamentals with Scratch blocks.': 'Cơ bản lập trình câu chuyện tương tác với khối Scratch.',

    # Video titles
    'Generative AI project': 'Dự án AI tạo sinh',
    'Roblox obstacle project': 'Dự án vượt chướng ngại vật Roblox',
    'AI classifier project': 'Dự án phân loại AI',
    'Paul\'s app prototype': 'Nguyên mẫu ứng dụng của Paul',
    'Scratch Discovery project': 'Dự án khám phá Scratch',

    # CTA section
    'Want Your Child to Create Projects Like These?': 'Muốn Con Bạn Tạo Ra Những Dự Án Như Thế Này?',
    'Book a free trial lesson and see what your child can build!': 'Đặt buổi học thử miễn phí và xem con bạn có thể xây dựng những gì!',
    'Book Free Trial Now': 'Đặt Buổi Học Thử Miễn Phí Ngay',

    # Footer sections
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
}

# Replace all English text with Vietnamese
for eng, viet in translations.items():
    content = content.replace(eng, viet)

# Write back the translated content
with open('vn/student-projects.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Translation completed for vn/student-projects.html')
print('Translated sections:')
print('- Page title and meta description')
print('- Hero section image alt text')
print('- Project focus descriptions (5 projects)')
print('- Video iframe titles')
print('- CTA section')
print('- Footer sections')
