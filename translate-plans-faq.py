import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Read the VN plans-and-faq.html file
with open('vn/plans-and-faq.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Dictionary of all English -> Vietnamese translations
translations = {
    # Meta tags
    'Plans & FAQ | TechTutor Academy': 'Gói & Câu Hỏi Thường Gặp | TechTutor Academy',
    'Learn about TechTutor\'s pricing plans and get answers to frequently asked questions about our programs, lessons, and enrollment process.': 'Tìm hiểu về các gói giá của TechTutor và nhận câu trả lời cho các câu hỏi thường gặp về chương trình, bài học và quy trình đăng ký của chúng tôi.',

    # Hero section
    'Plans & Pricing': 'Gói & Giá Cả',
    'Flexible pricing for private or group lessons. Choose the plan that works best for your family.': 'Giá linh hoạt cho bài học riêng tư hoặc nhóm. Chọn gói phù hợp nhất cho gia đình bạn.',

    # Pricing section
    '2 courses (16 lessons)': '2 khóa học (16 buổi)',
    '3 courses (24 lessons)': '3 khóa học (24 buổi)',
    'Best for:': 'Tốt nhất cho:',
    'Students who want personalized attention and a custom learning pace.': 'Học sinh muốn được chú ý cá nhân và tốc độ học tập tùy chỉnh.',
    'Students who enjoy collaborative learning and want more affordable pricing.': 'Học sinh thích học tập hợp tác và muốn giá cả phải chăng hơn.',

    # What's Included section
    'What\'s Included': 'Những Gì Được Bao Gồm',
    '60-90 Min Lessons': 'Buổi Học 60-90 Phút',
    'Focused, project-based learning sessions': 'Buổi học tập trung vào dự án',
    '6+ years experience with Bachelor\'s degrees in CS, IT, or Software Engineering': 'Kinh nghiệm 6+ năm với bằng Cử nhân về Khoa học Máy tính, CNTT hoặc Kỹ thuật Phần mềm',
    'Progress Reports': 'Báo Cáo Tiến Độ',
    'Detailed feedback after every lesson': 'Phản hồi chi tiết sau mỗi buổi học',
    'Certificate': 'Chứng Chỉ',
    'Course completion certificate for portfolio': 'Chứng chỉ hoàn thành khóa học cho hồ sơ',
    'Flexible Scheduling': 'Lịch Học Linh Hoạt',
    'Book lessons at times that work for you': 'Đặt buổi học vào thời gian phù hợp với bạn',
    'All Materials Included': 'Tất Cả Tài Liệu Được Bao Gồm',
    'Software, tools, and project resources': 'Phần mềm, công cụ và tài nguyên dự án',

    # FAQ section
    'Frequently Asked Questions': 'Câu Hỏi Thường Gặp',
    'What age groups do you teach?': 'Bạn dạy nhóm tuổi nào?',
    'We teach students aged 6-16. Our programs are designed for different skill levels: Scratch (ages 6-10), Roblox and GDevelop (ages 8-15), 3D Design and AI & Programming (ages 10-16), and App Development (ages 12-16).': 'Chúng tôi dạy học sinh từ 6-16 tuổi. Các chương trình của chúng tôi được thiết kế cho các cấp độ kỹ năng khác nhau: Scratch (6-10 tuổi), Roblox và GDevelop (8-15 tuổi), Thiết Kế 3D và AI & Lập Trình (10-16 tuổi), và Phát Triển Ứng Dụng (12-16 tuổi).',

    'Do students need prior coding experience?': 'Học sinh có cần kinh nghiệm lập trình trước đó không?',
    'No prior experience is needed! We have beginner-friendly programs like Scratch and GDevelop that start from the basics. For students with some experience, we offer more advanced programs like App Development and AI & Programming.': 'Không cần kinh nghiệm trước đó! Chúng tôi có các chương trình thân thiện với người mới bắt đầu như Scratch và GDevelop bắt đầu từ cơ bản. Đối với học sinh có kinh nghiệm, chúng tôi cung cấp các chương trình nâng cao hơn như Phát Triển Ứng Dụng và AI & Lập Trình.',

    'How long is each lesson?': 'Mỗi buổi học kéo dài bao lâu?',
    'Each lesson is 60-90 minutes of focused, hands-on learning. One course consists of 8 lessons, which students typically complete over 8 weeks with one lesson per week.': 'Mỗi buổi học là 60-90 phút học tập tập trung, thực hành. Một khóa học gồm 8 buổi học, mà học sinh thường hoàn thành trong 8 tuần với một buổi học mỗi tuần.',

    'Are lessons live or pre-recorded?': 'Buổi học là trực tiếp hay được ghi sẵn?',
    'All our lessons are live and interactive via video call. Students work directly with their instructor in real-time, getting immediate feedback and personalized guidance.': 'Tất cả các buổi học của chúng tôi đều trực tiếp và tương tác qua cuộc gọi video. Học sinh làm việc trực tiếp với giáo viên của họ theo thời gian thực, nhận phản hồi ngay lập tức và hướng dẫn cá nhân hóa.',

    'What equipment does my child need?': 'Con tôi cần thiết bị gì?',
    'Students need a computer (Windows, Mac, or Chromebook) with a stable internet connection, webcam, and microphone. All software and tools are free and we\'ll help you get set up during the first lesson.': 'Học sinh cần máy tính (Windows, Mac hoặc Chromebook) với kết nối internet ổn định, webcam và microphone. Tất cả phần mềm và công cụ đều miễn phí và chúng tôi sẽ giúp bạn cài đặt trong buổi học đầu tiên.',

    'Can I get a refund if my child doesn\'t like the program?': 'Tôi có thể được hoàn tiền nếu con tôi không thích chương trình không?',
    'We offer a free trial lesson so families can try before committing. If you\'re not satisfied after the first paid lesson, we\'ll provide a full refund, no questions asked.': 'Chúng tôi cung cấp buổi học thử miễn phí để các gia đình có thể thử trước khi cam kết. Nếu bạn không hài lòng sau buổi học trả phí đầu tiên, chúng tôi sẽ hoàn lại toàn bộ tiền, không hỏi gì cả.',

    'How do I schedule lessons?': 'Làm thế nào để tôi lên lịch buổi học?',
    'After enrollment, we\'ll work with you to find a regular weekly time slot that fits your schedule. Lessons can be rescheduled with 24 hours notice if needed.': 'Sau khi đăng ký, chúng tôi sẽ làm việc với bạn để tìm khung giờ hàng tuần thường xuyên phù hợp với lịch trình của bạn. Buổi học có thể được lên lịch lại với thông báo trước 24 giờ nếu cần.',

    'What if my child misses a lesson?': 'Nếu con tôi bỏ lỡ buổi học thì sao?',
    'If you notify us at least 24 hours in advance, we can reschedule the lesson at no charge. Lessons cancelled with less than 24 hours notice will be forfeited.': 'Nếu bạn thông báo cho chúng tôi ít nhất 24 giờ trước, chúng tôi có thể lên lịch lại buổi học mà không tính phí. Các buổi học bị hủy với thông báo dưới 24 giờ sẽ bị mất.',

    'Do you teach in English or Vietnamese?': 'Bạn dạy bằng tiếng Anh hay tiếng Việt?',
    'We offer bilingual instruction in both English and Vietnamese. Our instructors can teach in either language or switch between both based on the student\'s preference and comfort level.': 'Chúng tôi cung cấp giảng dạy song ngữ bằng cả tiếng Anh và tiếng Việt. Giáo viên của chúng tôi có thể dạy bằng một trong hai ngôn ngữ hoặc chuyển đổi giữa cả hai dựa trên sở thích và mức độ thoải mái của học sinh.',

    'How do I get started?': 'Làm thế nào để bắt đầu?',
    'Simply book a free trial lesson! We\'ll assess your child\'s interests and skill level, recommend the best program, and let them experience a full lesson before you commit to any payment.': 'Chỉ cần đặt buổi học thử miễn phí! Chúng tôi sẽ đánh giá sở thích và trình độ kỹ năng của con bạn, đề xuất chương trình tốt nhất và cho chúng trải nghiệm một buổi học đầy đủ trước khi bạn cam kết thanh toán.',

    # CTA section
    'Still Have Questions?': 'Vẫn Còn Câu Hỏi?',
    'Book a free trial lesson and we\'ll answer all your questions!': 'Đặt buổi học thử miễn phí và chúng tôi sẽ trả lời tất cả câu hỏi của bạn!',
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
with open('vn/plans-and-faq.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Translation completed for vn/plans-and-faq.html')
print('Translated sections:')
print('- Page title and meta description')
print('- Hero section')
print('- Pricing cards (Private & Group)')
print('- What\'s Included section (6 items)')
print('- FAQ section (10 questions)')
print('- CTA section')
print('- Footer sections')
