import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_file(file_path, specific_translations):
    """Translate a file with specific translations"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Apply all translations
        for eng, viet in specific_translations.items():
            content = content.replace(eng, viet)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error translating {file_path}: {e}')
        return False

# Vision page translations
vision_translations = {
    'Our Vision | TechTutor Academy': 'Tầm Nhìn Của Chúng Tôi | TechTutor Academy',
    'Learn about TechTutor\'s mission to empower the next generation with essential tech skills through personalized, project-based education.': 'Tìm hiểu về sứ mệnh của TechTutor trong việc trao quyền cho thế hệ tiếp theo với các kỹ năng công nghệ thiết yếu thông qua giáo dục cá nhân hóa dựa trên dự án.',
    'Our Vision': 'Tầm Nhìn Của Chúng Tôi',
    'Empowering the next generation': 'Trao quyền cho thế hệ tiếp theo',
    'At TechTutor Academy, we believe every child deserves the opportunity to become a creator, not just a consumer of technology.': 'Tại TechTutor Academy, chúng tôi tin rằng mỗi đứa trẻ đều xứng đáng có cơ hội trở thành người sáng tạo, không chỉ là người tiêu dùng công nghệ.',
    'We envision a future where students from all backgrounds can confidently build, code, and innovate—transforming their ideas into reality through hands-on, project-based learning.': 'Chúng tôi hình dung một tương lai nơi học sinh từ mọi hoàn cảnh có thể tự tin xây dựng, lập trình và đổi mới—biến ý tưởng của họ thành hiện thực thông qua học tập thực hành dựa trên dự án.',
    'Our mission is simple: inspire curiosity, nurture creativity, and equip young minds with the skills they need to thrive in an increasingly digital world.': 'Sứ mệnh của chúng tôi đơn giản: truyền cảm hứng cho sự tò mò, nuôi dưỡng sự sáng tạo và trang bị cho tâm trí trẻ những kỹ năng họ cần để phát triển trong một thế giới ngày càng kỹ thuật số.',
    'Why We Do This': 'Tại Sao Chúng Tôi Làm Điều Này',
    'Technology is shaping every industry, yet many children lack access to quality tech education. Traditional classrooms often teach theory without practice, leaving students unprepared for real-world challenges.': 'Công nghệ đang định hình mọi ngành công nghiệp, nhưng nhiều trẻ em thiếu quyền truy cập vào giáo dục công nghệ chất lượng. Các lớp học truyền thống thường dạy lý thuyết mà không có thực hành, khiến học sinh không sẵn sàng cho những thách thức thực tế.',
    'We\'re here to change that.': 'Chúng tôi ở đây để thay đổi điều đó.',
    'Through live, interactive lessons and real project-based learning, we give students the hands-on experience they need to truly understand technology—not just memorize it.': 'Thông qua các bài học trực tiếp, tương tác và học tập dựa trên dự án thực tế, chúng tôi cung cấp cho học sinh kinh nghiệm thực hành mà họ cần để thực sự hiểu công nghệ—không chỉ ghi nhớ nó.',
    'What We Believe': 'Điều Chúng Tôi Tin Tưởng',
    'Learning should be fun, engaging, and relevant': 'Học tập nên vui vẻ, hấp dẫn và có liên quan',
    'Students learn best when building real projects they care about—games, apps, animations, and websites.': 'Học sinh học tốt nhất khi xây dựng các dự án thực mà họ quan tâm—trò chơi, ứng dụng, hoạt hình và trang web.',
    'Every student deserves personalized attention': 'Mỗi học sinh xứng đáng nhận được sự chú ý cá nhân',
    'We keep class sizes small and instruction 1-on-1 or in small groups, so every child gets the support they need.': 'Chúng tôi giữ quy mô lớp học nhỏ và giảng dạy 1-trên-1 hoặc theo nhóm nhỏ, để mỗi đứa trẻ nhận được sự hỗ trợ mà chúng cần.',
    'Technology should be accessible to everyone': 'Công nghệ nên dễ tiếp cận với mọi người',
    'We offer flexible pricing, bilingual instruction (English/Vietnamese), and free trial lessons to ensure tech education is within reach for all families.': 'Chúng tôi cung cấp giá linh hoạt, giảng dạy song ngữ (Tiếng Anh/Tiếng Việt) và các buổi học thử miễn phí để đảm bảo giáo dục công nghệ trong tầm với của tất cả các gia đình.',
    'Join Us': 'Tham Gia Với Chúng Tôi',
    'Ready to help your child become a creator?': 'Sẵn sàng giúp con bạn trở thành người sáng tạo?',
    'Book a free trial lesson today and see how TechTutor can unlock your child\'s potential.': 'Đặt buổi học thử miễn phí hôm nay và xem TechTutor có thể mở khóa tiềm năng của con bạn như thế nào.',
    'Book Free Trial': 'Đặt Buổi Học Thử Miễn Phí',
    'CONTACT US!': 'LIÊN HỆ CHÚNG TÔI!',
    'Tel/WA/Zalo:': 'Tel/WA/Zalo:',
    'Email:': 'Email:',
    'OPENING HOURS': 'GIỜ MỞ CỬA',
    'Monday - Friday: 8am - 9pm': 'Thứ Hai - Thứ Sáu: 8 giờ sáng - 9 giờ tối',
    'Saturday - Sunday: 8am - 8pm': 'Thứ Bảy - Chủ Nhật: 8 giờ sáng - 8 giờ tối',
    'START LEARNING': 'BẮT ĐẦU HỌC',
    'Free trial': 'Học Thử Miễn Phí',
    'CONNECT WITH US!': 'KẾT NỐI VỚI CHÚNG TÔI!',
}

# Login page translations
login_translations = {
    'Login - TechTutor Academy': 'Đăng Nhập - TechTutor Academy',
    'Sign in to your account': 'Đăng nhập vào tài khoản của bạn',
    'Email': 'Email',
    'Enter your email': 'Nhập email của bạn',
    'Password': 'Mật Khẩu',
    'Enter your password': 'Nhập mật khẩu của bạn',
    'Show password': 'Hiển thị mật khẩu',
    'Hide password': 'Ẩn mật khẩu',
    'Remember me': 'Ghi nhớ đăng nhập',
    'Forgot password?': 'Quên mật khẩu?',
    'Sign In': 'Đăng Nhập',
    'Signing in...': 'Đang đăng nhập...',
    'Don\'t have an account?': 'Chưa có tài khoản?',
    'Contact us to get started': 'Liên hệ với chúng tôi để bắt đầu',
    'Student Portal': 'Cổng Học Sinh',
    'Parent Dashboard': 'Bảng Điều Khiển Phụ Huynh',
    'Choose your portal': 'Chọn cổng của bạn',
    'Access your lessons, projects, and progress': 'Truy cập bài học, dự án và tiến độ của bạn',
    'View your child\'s progress and schedule': 'Xem tiến độ và lịch trình của con bạn',
}

# Translate both files
print('Starting translation of vision and login pages...\n')

print('Translating vn/vision.html...')
if translate_file('vn/vision.html', vision_translations):
    print('  Success')
else:
    print('  Failed')

print('Translating vn/login.html...')
if translate_file('vn/login.html', login_translations):
    print('  Success')
else:
    print('  Failed')

print('\nTranslation completed for vision and login pages')
