import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Read the VN blog.html file
with open('vn/blog.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Dictionary of all English -> Vietnamese translations
translations = {
    # Meta tags
    'Blog | TechTutor Academy': 'Blog | TechTutor Academy',
    'Read articles about tech education, programming tips for kids, and success stories from TechTutor students and families.': 'Đọc các bài viết về giáo dục công nghệ, mẹo lập trình cho trẻ em và câu chuyện thành công từ học viên và gia đình TechTutor.',

    # Hero section
    'TechTutor Blog': 'Blog TechTutor',
    'Insights, tips, and stories about tech education for kids. Learn how to support your child\'s coding journey.': 'Kiến thức, mẹo và câu chuyện về giáo dục công nghệ cho trẻ em. Học cách hỗ trợ hành trình lập trình của con bạn.',

    # Featured article
    'FEATURED': 'NỔI BẬT',
    'Discover how to transform tech education into an exciting adventure for your child. Learn the secrets to making coding and technology fun, engaging, and effective.': 'Khám phá cách biến giáo dục công nghệ thành một cuộc phiêu lưu thú vị cho con bạn. Tìm hiểu bí quyết làm cho lập trình và công nghệ trở nên vui vẻ, hấp dẫn và hiệu quả.',
    'Read Article': 'Đọc Bài Viết',
    'Kids coding': 'Trẻ em học lập trình',

    # Blog grid section
    'Latest Articles': 'Bài Viết Mới Nhất',

    # Blog post 1
    'Kids learning tech through play': 'Trẻ em học công nghệ qua chơi',
    'Transform tech education into an exciting adventure with these proven strategies for making learning fun and engaging.': 'Biến đổi giáo dục công nghệ thành một cuộc phiêu lưu thú vị với những chiến lược đã được chứng minh để học tập trở nên vui vẻ và hấp dẫn.',

    # Blog post 2
    'Nurturing child\'s tech talent': 'Nuôi dưỡng tài năng công nghệ của trẻ',
    'Learn how to identify your child\'s tech talents and support their development with expert guidance and practical tips.': 'Học cách nhận diện tài năng công nghệ của con bạn và hỗ trợ sự phát triển của chúng với hướng dẫn chuyên gia và mẹo thực tế.',

    # Blog post 3
    'Students collaborating on projects': 'Học sinh hợp tác trong dự án',
    'Unlocking Your Child\'s Potential With Project-Based Learning': 'Khai Phá Tiềm Năng Của Con Bạn Với Học Tập Dựa Trên Dự Án',
    'See why hands-on, project-first learning keeps kids engaged, confident, and ready for the future.': 'Xem lý do tại sao học tập thực hành, ưu tiên dự án giữ cho trẻ em hứng thú, tự tin và sẵn sàng cho tương lai.',

    # Read more links
    'Read more →': 'Đọc thêm →',

    # Newsletter CTA
    'Want More Tips & Updates?': 'Muốn Thêm Mẹo & Cập Nhật?',
    'Book a free trial and join our community of tech-savvy families!': 'Đặt buổi học thử miễn phí và tham gia cộng đồng các gia đình am hiểu công nghệ của chúng tôi!',
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
with open('vn/blog.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Translation completed for vn/blog.html')
print('Translated sections:')
print('- Page title and meta description')
print('- Hero section')
print('- Featured article section')
print('- Blog post cards (3 posts)')
print('- Newsletter CTA')
print('- Footer sections')
