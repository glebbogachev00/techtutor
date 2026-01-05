import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Read the VN free-trial.html file
with open('vn/free-trial.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Dictionary of all English -> Vietnamese translations
translations = {
    # Meta tags
    'Free Trial | TechTutor Academy': 'Học Thử Miễn Phí | TechTutor Academy',
    'Book a free trial lesson with TechTutor. No credit card required. Experience our teaching style and see if it\'s the right fit for your child.': 'Đặt buổi học thử miễn phí với TechTutor. Không cần thẻ tín dụng. Trải nghiệm phong cách giảng dạy của chúng tôi và xem liệu nó có phù hợp với con bạn không.',

    # Hero section
    'Book a Free Trial,<br/>Learn, and Grow<br/>Together!': 'Đặt Lịch Học Thử Miễn Phí,<br/>Học Hỏi và Phát Triển<br/>Cùng Nhau!',
    'Experience TechTutor with a completely free 60-minute trial lesson. No credit card required.': 'Trải nghiệm TechTutor với buổi học thử 60 phút hoàn toàn miễn phí. Không cần thẻ tín dụng.',

    # Features section
    '60-Minute Lesson': 'Buổi Học 60 Phút',
    'Experience a full 60 minutes of personalized instruction with one of our expert tutors. See our teaching style firsthand.': 'Trải nghiệm 60 phút giảng dạy cá nhân hóa đầy đủ với một trong những gia sư chuyên nghiệp của chúng tôi. Tận mắt chứng kiến phong cách giảng dạy của chúng tôi.',
    'Giáo Viên Chuyên Môn': 'Giáo Viên Chuyên Môn',
    'Learn from passionate educators with real-world experience in coding, AI, and tech education.': 'Học từ những nhà giáo dục đam mê với kinh nghiệm thực tế trong lập trình, AI và giáo dục công nghệ.',
    'No Commitment': 'Không Cam Kết',
    'Completely free trial with no credit card required. No pressure, no obligation to continue.': 'Học thử hoàn toàn miễn phí không cần thẻ tín dụng. Không áp lực, không bắt buộc phải tiếp tục.',
    'Personalized Assessment': 'Đánh Giá Cá Nhân Hóa',
    'We\'ll evaluate your child\'s skills and interests to recommend the perfect program for their journey.': 'Chúng tôi sẽ đánh giá kỹ năng và sở thích của con bạn để đề xuất chương trình hoàn hảo cho hành trình của chúng.',

    # Form section
    'Fill Out the Form Below': 'Điền Vào Biểu Mẫu Bên Dưới',
    'We\'ll contact you within 24 hours to schedule your free trial lesson at a time that works for you.': 'Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để sắp xếp buổi học thử miễn phí vào thời gian phù hợp với bạn.',
    'Enter your name': 'Nhập tên của bạn',
    'Enter your child\'s name': 'Nhập tên con bạn',
    'Enter age': 'Nhập tuổi',
    'Book My Free Trial Lesson →': 'Đặt Buổi Học Thử Miễn Phí →',
    'We\'ll respond within 24 hours to schedule your lesson': 'Chúng tôi sẽ phản hồi trong vòng 24 giờ để sắp xếp buổi học của bạn',

    # What happens next section
    'What Happens Next?': 'Điều Gì Xảy Ra Tiếp Theo?',
    'We Contact You': 'Chúng Tôi Liên Hệ Với Bạn',
    'Our team will reach out within 24 hours to discuss your child\'s interests and schedule a convenient time for the trial lesson.': 'Đội ngũ của chúng tôi sẽ liên hệ trong vòng 24 giờ để thảo luận về sở thích của con bạn và sắp xếp thời gian thuận tiện cho buổi học thử.',
    'Attend Your Trial': 'Tham Dự Buổi Học Thử',
    'Your child attends a full 60-minute lesson online. They\'ll work on a small project and experience our teaching style firsthand.': 'Con bạn tham dự buổi học trực tuyến 60 phút đầy đủ. Chúng sẽ làm việc trên một dự án nhỏ và trải nghiệm trực tiếp phong cách giảng dạy của chúng tôi.',
    'Decide If It\'s Right': 'Quyết Định Nếu Phù Hợp',
    'After the trial, we\'ll provide a personalized learning plan. You can enroll if it\'s a good fit—no pressure!': 'Sau buổi học thử, chúng tôi sẽ cung cấp kế hoạch học tập cá nhân hóa. Bạn có thể đăng ký nếu phù hợp—không áp lực!',

    # Testimonials section
    'What Parents Say After Their Trial': 'Phụ Huynh Nói Gì Sau Buổi Học Thử',
    '"The free trial was amazing! My son was engaged the entire time and couldn\'t stop talking about what he learned. We signed up for the full course immediately."': '"Buổi học thử miễn phí thật tuyệt vời! Con trai tôi tập trung suốt buổi học và không ngừng nói về những gì nó đã học được. Chúng tôi đã đăng ký khóa học đầy đủ ngay lập tức."',
    '— Nguyễn Thị Lan, Parent of Bảo Minh (10)': '— Nguyễn Thị Lan, Phụ huynh của Bảo Minh (10)',
    '"I wasn\'t sure if online lessons would work, but the trial convinced me. The instructor was patient, knowledgeable, and made coding fun for my daughter."': '"Tôi không chắc liệu các buổi học trực tuyến có hiệu quả không, nhưng buổi học thử đã thuyết phục tôi. Giáo viên kiên nhẫn, hiểu biết và làm cho việc lập trình trở nên thú vị cho con gái tôi."',
    '— Trần Văn Hùng, Parent of Gia Hân (12)': '— Trần Văn Hùng, Phụ huynh của Gia Hân (12)',

    # Footer
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
    '© 2025 TechTutor Academy. Bảo lưu mọi quyền.': '© 2025 TechTutor Academy. Bảo lưu mọi quyền.',
    'Hỗ trợ song ngữ Tiếng Anh / Tiếng Việt': 'Hỗ trợ song ngữ Tiếng Anh / Tiếng Việt',
}

# Replace all English text with Vietnamese
for eng, viet in translations.items():
    content = content.replace(eng, viet)

# Write back the translated content
with open('vn/free-trial.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Translation completed for vn/free-trial.html')
print('Translated sections:')
print('- Page title and meta description')
print('- Hero section')
print('- Features section (4 items)')
print('- Form labels and placeholders')
print('- What Happens Next section (3 steps)')
print('- Testimonials section (2 testimonials)')
print('- Footer sections')
