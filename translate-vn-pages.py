import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_vn_index(file_path):
    """Translate VN homepage meta tags"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Translate title
        content = re.sub(
            r'<title>TechTutor Academy — Best Tech Education in the World</title>',
            r'<title>TechTutor Academy — Giáo Dục Công Nghệ Tốt Nhất Thế Giới</title>',
            content
        )

        # Translate meta description
        content = re.sub(
            r'<meta name="description" content="TechTutor Academy offers interactive tech courses for children and teens in STEAM, coding, AI, and game development\. Personalized learning with flexible scheduling and bilingual support in English and Vietnamese\." />',
            r'<meta name="description" content="TechTutor Academy cung cấp các khóa học công nghệ tương tác cho trẻ em và thiếu niên về STEAM, lập trình, AI và phát triển game. Học tập cá nhân hóa với lịch học linh hoạt và hỗ trợ song ngữ Tiếng Anh và Tiếng Việt." />',
            content
        )

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error: {e}')
        return False

def translate_vn_vision(file_path):
    """Translate VN vision page content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Hero section
        content = re.sub(
            r'<h1 class="text-4xl font-bold text-white mb-4">Empowering the Next Generation</h1>',
            r'<h1 class="text-4xl font-bold text-white mb-4">Trao Quyền Cho Thế Hệ Tiếp Theo</h1>',
            content
        )

        content = re.sub(
            r'<p class="text-lg text-white/90">Building tomorrow\'s innovators through project-based tech education\.</p>',
            r'<p class="text-lg text-white/90">Xây dựng những nhà đổi mới của ngày mai thông qua giáo dục công nghệ dựa trên dự án.</p>',
            content
        )

        # Mission section
        content = re.sub(r'<h2 class="section-title mb-4">Our Mission</h2>', r'<h2 class="section-title mb-4">Sứ Mệnh Của Chúng Tôi</h2>', content)

        content = re.sub(
            r'TechTutor Academy empowers children and teenagers with essential technology skills through personalized, project-based learning\. We believe every child deserves access to quality tech education that prepares them for the digital future\.',
            r'TechTutor Academy trao quyền cho trẻ em và thiếu niên với các kỹ năng công nghệ thiết yếu thông qua học tập cá nhân hóa dựa trên dự án. Chúng tôi tin rằng mọi trẻ em đều xứng đáng được tiếp cận giáo dục công nghệ chất lượng chuẩn bị cho tương lai kỹ thuật số.',
            content
        )

        # Cards section
        content = re.sub(r'<h3 class="text-xl font-bold text-ink mb-3">Personalized Learning</h3>', r'<h3 class="text-xl font-bold text-ink mb-3">Học Tập Cá Nhân Hóa</h3>', content)
        content = re.sub(r'Every student learns at their own pace with individualized attention from expert instructors\.', r'Mỗi học viên học theo tốc độ riêng với sự quan tâm cá nhân từ giảng viên chuyên môn.', content)

        content = re.sub(r'<h3 class="text-xl font-bold text-ink mb-3">Project-Based</h3>', r'<h3 class="text-xl font-bold text-ink mb-3">Dựa Trên Dự Án</h3>', content)
        content = re.sub(r'Students build real projects they\'re proud of, not just follow tutorials or watch videos\.', r'Học viên xây dựng các dự án thực tế mà các em tự hào, không chỉ theo dõi hướng dẫn hoặc xem video.', content)

        content = re.sub(r'<h3 class="text-xl font-bold text-ink mb-3">Global Access</h3>', r'<h3 class="text-xl font-bold text-ink mb-3">Truy Cập Toàn Cầu</h3>', content)
        content = re.sub(r'Online lessons make quality tech education available to families anywhere in the world\.', r'Các bài học trực tuyến mang đến giáo dục công nghệ chất lượng cho các gia đình ở bất kỳ đâu trên thế giới.', content)

        # Our Story section
        content = re.sub(r'<h2 class="text-3xl font-bold text-ink mb-6">Our Story</h2>', r'<h2 class="text-3xl font-bold text-ink mb-6">Câu Chuyện Của Chúng Tôi</h2>', content)

        content = re.sub(
            r'TechTutor was founded with a simple observation: traditional education wasn\'t keeping up with the rapid pace of technology\. Kids were more interested in creating games than playing them, building apps than downloading them, and understanding AI rather than just using it\.',
            r'TechTutor được thành lập với một quan sát đơn giản: giáo dục truyền thống không theo kịp tốc độ phát triển nhanh chóng của công nghệ. Trẻ em quan tâm nhiều hơn đến việc tạo ra game hơn là chơi chúng, xây dựng ứng dụng hơn là tải xuống, và hiểu về AI thay vì chỉ sử dụng nó.',
            content
        )

        content = re.sub(
            r'We started by teaching small groups of students in Ho Chi Minh City, Vietnam\. What began as a passion project quickly grew as word spread about our hands-on, project-based approach\. Parents loved that their kids were genuinely excited about learning, and students loved that they were building real projects they could share with friends and family\.',
            r'Chúng tôi bắt đầu bằng cách dạy các nhóm nhỏ học sinh tại Thành phố Hồ Chí Minh, Việt Nam. Điều bắt đầu như một dự án đam mê đã nhanh chóng phát triển khi thông tin lan truyền về phương pháp thực hành, dựa trên dự án của chúng tôi. Phụ huynh yêu thích việc con em họ thực sự hào hứng với việc học, và học sinh yêu thích việc xây dựng các dự án thực tế mà họ có thể chia sẻ với bạn bè và gia đình.',
            content
        )

        content = re.sub(
            r'Today, we serve students across multiple countries, offering programs in Roblox development, 3D design, AI programming, app development, and more\. Our retention rate of 80-90% speaks to the quality of our teaching and the engagement of our students\.',
            r'Ngày nay, chúng tôi phục vụ học sinh trên nhiều quốc gia, cung cấp các chương trình về phát triển Roblox, thiết kế 3D, lập trình AI, phát triển ứng dụng và nhiều hơn nữa. Tỷ lệ giữ chân 80-90% của chúng tôi thể hiện chất lượng giảng dạy và sự tham gia của học sinh.',
            content
        )

        # Values section
        content = re.sub(r'<h2 class="section-title mb-12 text-center">Our Values</h2>', r'<h2 class="section-title mb-12 text-center">Giá Trị Của Chúng Tôi</h2>', content)

        content = re.sub(r'<h3 class="text-2xl font-bold text-primary mb-3">🎓 Excellence in Teaching</h3>', r'<h3 class="text-2xl font-bold text-primary mb-3">🎓 Xuất Sắc Trong Giảng Dạy</h3>', content)
        content = re.sub(r'All our instructors have 3\+ years of experience teaching tech to kids\. We invest heavily in teacher training and curriculum development\.', r'Tất cả giảng viên của chúng tôi có hơn 3 năm kinh nghiệm dạy công nghệ cho trẻ em. Chúng tôi đầu tư mạnh vào đào tạo giáo viên và phát triển chương trình giảng dạy.', content)

        content = re.sub(r'<h3 class="text-2xl font-bold text-primary mb-3">💡 Learning by Doing</h3>', r'<h3 class="text-2xl font-bold text-primary mb-3">💡 Học Bằng Thực Hành</h3>', content)
        content = re.sub(r'We believe the best way to learn is by building\. Every course ends with a tangible project students can showcase\.', r'Chúng tôi tin rằng cách học tốt nhất là bằng cách xây dựng. Mỗi khóa học kết thúc với một dự án cụ thể mà học sinh có thể trưng bày.', content)

        content = re.sub(r'<h3 class="text-2xl font-bold text-primary mb-3">🤝 Partnership with Parents</h3>', r'<h3 class="text-2xl font-bold text-primary mb-3">🤝 Hợp Tác Với Phụ Huynh</h3>', content)
        content = re.sub(r'We provide detailed progress reports after every lesson and work closely with families to support each child\'s learning journey\.', r'Chúng tôi cung cấp báo cáo tiến độ chi tiết sau mỗi buổi học và làm việc chặt chẽ với các gia đình để hỗ trợ hành trình học tập của mỗi trẻ.', content)

        content = re.sub(r'<h3 class="text-2xl font-bold text-primary mb-3">🌟 Making Tech Fun</h3>', r'<h3 class="text-2xl font-bold text-primary mb-3">🌟 Làm Cho Công Nghệ Thú Vị</h3>', content)
        content = re.sub(r'Learning should be enjoyable\. We use gamification, creative projects, and engaging activities to keep students motivated\.', r'Học tập nên thú vị. Chúng tôi sử dụng gamification, các dự án sáng tạo và hoạt động hấp dẫn để giữ động lực cho học sinh.', content)

        content = re.sub(r'<h3 class="text-2xl font-bold text-primary mb-3">📈 Continuous Improvement</h3>', r'<h3 class="text-2xl font-bold text-primary mb-3">📈 Cải Tiến Liên Tục</h3>', content)
        content = re.sub(r'We constantly update our curriculum to teach the latest technologies and respond to student feedback\.', r'Chúng tôi liên tục cập nhật chương trình giảng dạy để dạy các công nghệ mới nhất và phản hồi từ học sinh.', content)

        content = re.sub(r'<h3 class="text-2xl font-bold text-primary mb-3">🌈 Inclusive Education</h3>', r'<h3 class="text-2xl font-bold text-primary mb-3">🌈 Giáo Dục Hòa Nhập</h3>', content)
        content = re.sub(r'We welcome students of all backgrounds and learning styles\. Our bilingual instruction serves both local and international families\.', r'Chúng tôi chào đón học sinh từ mọi nền tảng và phong cách học tập. Giảng dạy song ngữ của chúng tôi phục vụ cả gia đình địa phương và quốc tế.', content)

        # Impact section
        content = re.sub(r'<h2 class="text-3xl font-bold text-white mb-8">Our Impact</h2>', r'<h2 class="text-3xl font-bold text-white mb-8">Tác Động Của Chúng Tôi</h2>', content)
        content = re.sub(r'<div class="text-white/80">Students Taught</div>', r'<div class="text-white/80">Học Sinh Đã Dạy</div>', content)
        content = re.sub(r'<div class="text-white/80">Retention Rate</div>', r'<div class="text-white/80">Tỷ Lệ Giữ Chân</div>', content)
        content = re.sub(r'<div class="text-white/80">Programs Offered</div>', r'<div class="text-white/80">Chương Trình Cung Cấp</div>', content)
        content = re.sub(r'<div class="text-white/80">Years Experience</div>', r'<div class="text-white/80">Năm Kinh Nghiệm</div>', content)

        # CTA section
        content = re.sub(r'<h2 class="text-3xl font-bold text-white mb-4">Ready to Start Learning\?</h2>', r'<h2 class="text-3xl font-bold text-white mb-4">Sẵn Sàng Bắt Đầu Học?</h2>', content)
        content = re.sub(r'<p class="text-lg text-white/90 mb-8">Join hundreds of students building their tech skills and creating amazing projects\.</p>', r'<p class="text-lg text-white/90 mb-8">Tham gia cùng hàng trăm học sinh xây dựng kỹ năng công nghệ và tạo ra các dự án tuyệt vời.</p>', content)
        content = re.sub(r'<a href="\.\./free-trial\.html" class="btn-secondary">Start Your Free Trial</a>', r'<a href="../free-trial.html" class="btn-secondary">Bắt Đầu Dùng Thử Miễn Phí</a>', content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== TRANSLATING VN PAGES ===\n')

# Translate VN homepage
if os.path.exists('vn/index.html'):
    result = translate_vn_index('vn/index.html')
    if result:
        print('✓ Translated VN homepage meta tags')
    else:
        print('✓ VN homepage already translated or no changes')

# Translate VN vision page
if os.path.exists('vn/vision.html'):
    result = translate_vn_vision('vn/vision.html')
    if result:
        print('✓ Translated VN vision page content')
    else:
        print('✓ VN vision page already translated or no changes')

print('\n' + '='*60)
print('✅ VN pages translation complete')
print('='*60)
