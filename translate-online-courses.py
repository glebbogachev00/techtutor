import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Read the VN online-courses.html file
with open('vn/online-courses.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Dictionary of all English -> Vietnamese translations
translations = {
    # Meta tags
    'Free Online Courses | TechTutor Academy': 'Khóa Học Trực Tuyến Miễn Phí | TechTutor Academy',
    'Start TechTutor Academy\'s free online courses instantly. Watch lesson videos and explore tracks like Generative AI Foundations, Scratch Story Studio, and Roblox Speedbuild.': 'Bắt đầu các khóa học trực tuyến miễn phí của TechTutor Academy ngay lập tức. Xem video bài giảng và khám phá các lộ trình như Nền Tảng AI Tạo Sinh, Phòng Kể Chuyện Scratch và Xây Dựng Nhanh Roblox.',

    # Hero section
    'Self-paced micro-courses': 'Khóa học nhỏ tự định tốc độ',
    'Free Tech Courses You Can Start Now': 'Khóa Học Công Nghệ Miễn Phí Bạn Có Thể Bắt Đầu Ngay',
    'Stream short TechTutor lessons and follow guided activities. No enrollment forms—hit play and learn.': 'Xem các bài học ngắn của TechTutor và làm theo các hoạt động hướng dẫn. Không cần đăng ký—chỉ cần bấm phát và học.',
    'self-paced tracks': 'lộ trình tự định tốc độ',
    'minute sprints': 'phút học tập',
    'Free online courses': 'Khóa học trực tuyến miễn phí',
    'Watch anywhere | Track progress | Earn badges': 'Xem mọi nơi | Theo dõi tiến độ | Nhận huy hiệu',

    # Course cards - AI course
    'Students exploring AI': 'Học sinh khám phá AI',
    'AI creativity lab': 'Phòng thí nghiệm sáng tạo AI',
    'Generative AI Foundations': 'Nền Tảng AI Tạo Sinh',
    'Duration: 30 mins': 'Thời lượng: 30 phút',
    '3 lessons': '3 bài học',
    'Build an AI studio notebook, document safe-use rules, and ship a mini showcase page.': 'Xây dựng sổ ghi chú phòng AI, ghi lại quy tắc sử dụng an toàn và tạo trang trưng bày nhỏ.',
    'What you\'ll learn:': 'Bạn sẽ học được:',
    'Compare text vs. image vs. audio models with hands-on prompts.': 'So sánh các mô hình văn bản, hình ảnh và âm thanh với các yêu cầu thực hành.',
    'Use structured templates to iterate ideas before publishing.': 'Sử dụng các mẫu có cấu trúc để phát triển ý tưởng trước khi xuất bản.',
    'Write a responsible AI manifesto reviewed by TechTutor mentors.': 'Viết tuyên ngôn AI có trách nhiệm được đánh giá bởi người hướng dẫn TechTutor.',
    'Enroll now': 'Đăng ký ngay',

    # Scratch course
    'Scratch Story Studio': 'Phòng Kể Chuyện Scratch',
    'Creative storytelling': 'Kể chuyện sáng tạo',
    'Design animated scenes, trigger events with broadcasts, and narrate with music.': 'Thiết kế cảnh hoạt hình, kích hoạt sự kiện với thông điệp phát sóng và kể chuyện với âm nhạc.',
    'Storyboard plot twists using the printable planner.': 'Lập bảng phân cảnh các tình tiết bất ngờ bằng công cụ lập kế hoạch có thể in.',
    'Practice loops, sounds, and broadcast messages.': 'Thực hành vòng lặp, âm thanh và thông điệp phát sóng.',
    'Publish a remixable Scratch project link.': 'Xuất bản liên kết dự án Scratch có thể remix.',
    'Coming soon': 'Sắp ra mắt',

    # Roblox course
    'Roblox Speedbuild Challenge': 'Thử Thách Xây Dựng Nhanh Roblox',
    '3D build sprint': 'Xây dựng 3D nhanh',
    'Shape a mini obby with terrain tools, scripted traps, and camera polish.': 'Tạo hình obby nhỏ với công cụ địa hình, bẫy được lập trình và đánh bóng camera.',
    'Follow the build checklist to map obstacles quickly.': 'Làm theo danh sách kiểm tra xây dựng để lập bản đồ chướng ngại vật nhanh chóng.',
    'Drop in Lua snippets for timers and checkpoints.': 'Thêm đoạn mã Lua cho bộ đếm thời gian và điểm kiểm tra.',
    'Playtest with physics tips to smooth the run.': 'Thử nghiệm với các mẹo vật lý để làm mượt lối chơi.',

    # CTA section
    'Loved the free course?': 'Thích khóa học miễn phí?',
    'Book a free lesson now and let our mentors personalize the next pathway for your learner.': 'Đặt buổi học miễn phí ngay bây giờ và để người hướng dẫn của chúng tôi cá nhân hóa lộ trình tiếp theo cho người học của bạn.',
    'Book a Free Lesson Now →': 'Đặt Buổi Học Miễn Phí Ngay →',

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
with open('vn/online-courses.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Translation completed for vn/online-courses.html')
print('Translated sections:')
print('- Page title and meta description')
print('- Hero section with stats')
print('- AI Foundations course card')
print('- Scratch Story Studio course card')
print('- Roblox Speedbuild course card')
print('- CTA section')
print('- Footer sections')
