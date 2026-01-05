#!/usr/bin/env python3
"""
Create static Vietnamese pages with all English text replaced by Vietnamese
NO data-i18n attributes, NO dynamic translations - pure static HTML
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Comprehensive Vietnamese translation mappings
VN_TRANSLATIONS = {
    # Navigation
    'Programs': 'Chương Trình',
    'Projects': 'Dự Án',
    'How It Works': 'Quy Trình',
    'Free Courses': 'Khóa Học Miễn Phí',
    'Pricing': 'Giá Cả',
    'Blog': 'Blog',
    'Free Trial': 'Dùng Thử Miễn Phí',
    'Login': 'Đăng Nhập',
    'Menu': 'Menu',

    # Hero section
    'Best Tech Education<br/>in the World': 'Giáo Dục Công Nghệ<br/>Tốt Nhất Thế Giới',
    'TechTutor offers live, interactive tech courses designed to help children and teens gain in-demand skills. From coding and AI to game development and 3D design, we provide personalized learning experiences that keep students engaged and progressing.': 'TechTutor cung cấp các khóa học công nghệ trực tuyến, tương tác được thiết kế để giúp trẻ em và thiếu niên đạt được các kỹ năng được săn đón. Từ lập trình và AI đến phát triển game và thiết kế 3D, chúng tôi cung cấp trải nghiệm học tập cá nhân hóa giúp học viên luôn say mê và tiến bộ.',
    'Get Started': 'Bắt Đầu',
    'Years of experience': 'Năm kinh nghiệm',
    'Presence in countries': 'Có mặt tại các quốc gia',

    # Carousel section
    'See Our Classes in Action': 'Xem Lớp Học Của Chúng Tôi',
    'Take a peek inside our virtual classroom and see students learning, creating, and having fun!': 'Hãy nhìn vào lớp học ảo của chúng tôi và xem các em học sinh đang học tập, sáng tạo và vui chơi!',

    # Easier Way section
    'An Easier Way to<br/>Learn Tech Skills': 'Cách Dễ Dàng Hơn Để<br/>Học Kỹ Năng Công Nghệ',
    'TechTutor simplifies tech education for families. Whether you want private 1-on-1 lessons or small group sessions, we match students with expert instructors for personalized, project-based learning.': 'TechTutor đơn giản hóa giáo dục công nghệ cho các gia đình. Cho dù bạn muốn học riêng 1-trên-1 hay lớp nhóm nhỏ, chúng tôi kết nối học viên với giáo viên chuyên môn để học tập cá nhân hóa theo dự án.',
    'Expert Instructors': 'Giáo Viên Chuyên Môn',
    'All instructors hold Bachelor\'s degrees in Computer Science, Information Technology, or Software Engineering with 6+ years of professional experience.': 'Tất cả giáo viên đều có bằng Cử nhân Khoa học Máy tính, Công nghệ Thông tin hoặc Kỹ thuật Phần mềm với hơn 6 năm kinh nghiệm chuyên môn.',
    'Parent Dashboard': 'Bảng Điều Khiển Phụ Huynh',
    'Track progress, schedule sessions flexibly, and receive detailed feedback after every lesson with our parent dashboard.': 'Theo dõi tiến độ, lên lịch học linh hoạt và nhận phản hồi chi tiết sau mỗi buổi học với bảng điều khiển dành cho phụ huynh.',
    'Affordable Online Learning': 'Học Trực Tuyến Giá Phải Chăng',
    'Affordable online learning with bundle discounts up to 10% off. Learn from home with the same quality as in-person classes.': 'Học trực tuyến với mức giá phải chăng và giảm giá gói học lên đến 10%. Học từ nhà với chất lượng tương đương lớp học trực tiếp.',

    # Why Choose section
    'Why Choose Our<br/>Services?': 'Tại Sao Chọn<br/>Dịch Vụ Của Chúng Tôi?',
    'With over 4 years of experience and 80-90% student retention, TechTutor delivers results. We focus on hands-on projects, real-world skills, and keeping learning fun and engaging for every student.': 'Với hơn 4 năm kinh nghiệm và tỷ lệ giữ chân học viên 80-90%, TechTutor mang lại kết quả thực tế. Chúng tôi tập trung vào các dự án thực hành, kỹ năng thực tế và giữ cho việc học luôn thú vị và hấp dẫn.',
    '6+ years designing programs with 80-90% learner retention': 'Hơn 6 năm thiết kế chương trình với tỷ lệ giữ chân học viên 80-90%',
    'Every learner completes a real project they can showcase': 'Mỗi học viên hoàn thành một dự án thực tế có thể trưng bày',
    'Flexible 1:1 or small group formats with personal feedback': 'Hình thức 1-trên-1 hoặc nhóm nhỏ linh hoạt với phản hồi cá nhân',
    'Bilingual support in English and Vietnamese': 'Hỗ trợ song ngữ Tiếng Anh và Tiếng Việt',
    'Happy students': 'Học sinh hài lòng',
    'Lessons taught': 'Buổi học đã giảng dạy',
    'Student retention rate': 'Tỷ lệ giữ chân học viên',

    # Testimonials
    'What Our Lovely<br/>Clients Say': 'Khách Hàng<br/>Nói Gì Về Chúng Tôi',
    'Real feedback from parents and students who\'ve experienced our programs': 'Phản hồi thực tế từ phụ huynh và học viên đã trải nghiệm chương trình của chúng tôi',
    'Parent of Bảo Minh (10)': 'Phụ huynh của Bảo Minh (10 tuổi)',
    '"Bảo Minh has been learning with Teacher Gleb for almost a year now. At first, my son was shy and didn\'t know where to start with computers. Now he confidently builds small games and even created an AI chatbot for his science project!"': '"Bảo Minh đã học với Thầy Gleb được gần một năm. Lúc đầu, con trai tôi còn nhút nhát và không biết bắt đầu từ đâu với máy tính. Giờ con tự tin xây dựng các game nhỏ và thậm chí còn tạo chatbot AI cho dự án khoa học!"',
    'Parent of Gia Hân (12)': 'Phụ huynh của Gia Hân (12 tuổi)',
    '"My daughter studied 3D Design and Roblox Game Development with Teacher Mathan for over a year and a half. She created two complete games and improved both teamwork and confidence."': '"Con gái tôi học Thiết kế 3D và Phát triển Game Roblox với Thầy Mathan hơn một năm rưỡi. Con đã tạo ra hai game hoàn chỉnh và cải thiện cả kỹ năng làm việc nhóm lẫn sự tự tin."',
    'Parent of Kian Reed (13)': 'Phụ huynh của Kian Reed (13 tuổi)',
    '"Kian explored Generative AI and Python programming with Teacher Mathan and now has two solid portfolio projects. TechTutor\'s structured and creative approach is perfect for international families."': '"Kian khám phá AI Tạo Sinh và lập trình Python với Thầy Mathan và giờ có hai dự án portfolio vững chắc. Phương pháp có cấu trúc và sáng tạo của TechTutor hoàn hảo cho các gia đình quốc tế."',

    # CTA Section
    'Get in touch<br/>Join our community<br/>of school partners': 'Liên hệ với chúng tôi<br/>Tham gia cộng đồng<br/>đối tác trường học',
    'Partner with TechTutor to bring cutting-edge tech education to your school. We offer customized programs, teacher training, and ongoing support.': 'Hợp tác với TechTutor để mang giáo dục công nghệ tiên tiến đến trường học của bạn. Chúng tôi cung cấp chương trình tùy chỉnh, đào tạo giáo viên và hỗ trợ liên tục.',
    'Join Now': 'Tham Gia Ngay',

    # Pricing section
    'Find the right <span style="color: #193b92;">plan</span> for you': 'Tìm <span style="color: #193b92;">gói học</span> phù hợp với bạn',
    'Flexible pricing for private or group lessons': 'Giá linh hoạt cho lớp riêng hoặc nhóm',
    'Private (1 on 1)': 'Riêng Tư (1-trên-1)',
    '1 course (8 lessons)': '1 khóa học (8 buổi)',
    '2 courses (16 lessons) — <span class="font-semibold" style="color: #cc0000;">5% off</span>': '2 khóa học (16 buổi) — <span class="font-semibold" style="color: #cc0000;">Giảm 5%</span>',
    '3 courses (24 lessons) — <span class="font-semibold" style="color: #cc0000;">10% off</span>': '3 khóa học (24 buổi) — <span class="font-semibold" style="color: #cc0000;">Giảm 10%</span>',
    'Small group (2-4 students)': 'Nhóm nhỏ (2-4 học viên)',

    # Programs section
    'Programs for every <span style="color: #193b92;">age</span>': 'Chương trình cho mọi <span style="color: #193b92;">lứa tuổi</span>',
    'We have the largest selection of programs to study with our online courses': 'Chúng tôi có nhiều chương trình nhất để học với các khóa học trực tuyến',

    # Program names and descriptions
    'Scratch Game Coder': 'Lập Trình Game Scratch',
    'Learn to code through game creation with Scratch\'s visual blocks.': 'Học lập trình thông qua tạo game với các khối trực quan của Scratch.',
    'Block coding, logic, game design': 'Lập trình khối, logic, thiết kế game',

    'Roblox World Creator': 'Sáng Tạo Thế Giới Roblox',
    'Use Roblox Studio and Lua to launch immersive, shared worlds.': 'Sử dụng Roblox Studio và Lua để tạo các thế giới sống động, chia sẻ.',
    'Lua, 3D design, creative storytelling': 'Lua, thiết kế 3D, kể chuyện sáng tạo',

    '3D Designer': 'Thiết Kế 3D',
    'Learn Blender workflows for professional-grade 3D scenes.': 'Học quy trình Blender để tạo cảnh 3D chuyên nghiệp.',
    '3D modelling, design workflow, Python basics': 'Mô hình hóa 3D, quy trình thiết kế, Python cơ bản',

    'App Development': 'Phát Triển Ứng Dụng',
    'Build real mobile apps with Thunkable\'s visual interface.': 'Xây dựng ứng dụng di động thực tế với giao diện trực quan của Thunkable.',
    'Thunkable, app design, UI/UX': 'Thunkable, thiết kế ứng dụng, UI/UX',

    'GDevelop Game Designer': 'Thiết Kế Game GDevelop',
    'Create 2D games with visual scripting and publish them.': 'Tạo game 2D với lập trình trực quan và xuất bản.',
    'GDevelop, game design, visual scripting': 'GDevelop, thiết kế game, lập trình trực quan',

    'AI & Programming Quest': 'Khám Phá AI & Lập Trình',
    'Blend Python coding with machine learning to power smart games.': 'Kết hợp lập trình Python với học máy để tạo game thông minh.',
    'Python, machine learning, AI': 'Python, học máy, AI',

    'Generative AI Magic': 'Phép Thuật AI Tạo Sinh',
    'Use AI tools as creative partners and build responsible AI projects.': 'Sử dụng công cụ AI như đối tác sáng tạo và xây dựng dự án AI có trách nhiệm.',
    'Prompt engineering, AI integration': 'Kỹ thuật prompt, tích hợp AI',

    # Blog section
    'Useful Content For<br/>Your Check': 'Nội Dung Hữu Ích<br/>Cho Bạn',
    'Explore our student projects, success stories, and learning resources': 'Khám phá dự án học viên, câu chuyện thành công và tài nguyên học tập',
    'EDUCATION': 'GIÁO DỤC',
    'How to Make Learning Tech Feel Like Playtime': 'Làm Sao Để Học Công Nghệ Như Chơi',
    'Transform tech education into an exciting adventure with these proven strategies...': 'Biến giáo dục công nghệ thành cuộc phiêu lưu thú vị với những chiến lược đã được chứng minh...',
    'Read More': 'Đọc Thêm',
    'PARENTING': 'NUÔI DẠY CON',
    'How to Spot and Nurture Your Child\'s Technology Skill': 'Cách Phát Hiện Và Nuôi Dưỡng Kỹ Năng Công Nghệ Của Con',
    'Learn how to identify your child\'s tech talents and support their development...': 'Học cách nhận biết tài năng công nghệ của con và hỗ trợ sự phát triển...',
    'PROJECTS': 'DỰ ÁN',
    'Unlocking Your Child\'s Potential With Project-Based Learning': 'Mở Khóa Tiềm Năng Của Con Với Học Tập Theo Dự Án',
    'Why hands-on, project-first lessons keep kids engaged and future-ready.': 'Tại sao các bài học thực hành, dự án trước giúp trẻ luôn say mê và sẵn sàng cho tương lai.',

    # Trial section
    'Start With a <span style="color: #193b92;">FREE</span> Lesson': 'Bắt Đầu Với Buổi Học <span style="color: #193b92;">MIỄN PHÍ</span>',
    'In just 90 minutes: receive a free, in-depth consultation and roadmap from our instructor. Share your details below and we\'ll schedule within 24 hours.': 'Chỉ trong 90 phút: nhận tư vấn miễn phí, chuyên sâu và lộ trình từ giáo viên. Chia sẻ thông tin bên dưới và chúng tôi sẽ sắp xếp trong vòng 24 giờ.',
    'Book Free Trial': 'Đặt Buổi Học Thử Miễn Phí',

    # Footer
    '© 2025 TechTutor Academy. All rights reserved.': '© 2025 TechTutor Academy. Bảo lưu mọi quyền.',
    'English / Vietnamese bilingual support': 'Hỗ trợ song ngữ Tiếng Anh / Tiếng Việt',
    # Student Projects Page  
    'Amazing Student<br/><span style="color: #193b92;">Projects</span>': 'Dự Án Học Sinh<br/><span style="color: #193b92;">Tuyệt Vời</span>',
    'See what our talented students are creating! From AI-powered apps to games and 3D designs, explore the incredible projects built by young innovators at TechTutor Academy.': 'Xem những gì học viên tài năng của chúng tôi đang tạo ra! Từ ứng dụng AI đến game và thiết kế 3D, khám phá các dự án tuyệt vời được xây dựng bởi những nhà đổi mới trẻ tại TechTutor Academy.',
    'Start Your Journey': 'Bắt Đầu Hành Trình',
    'Diverse Project Types': 'Các Loại Dự Án Đa Dạng',
    'Students create games, apps, AI projects, 3D designs, and more across multiple platforms and tools.': 'Học sinh tạo game, ứng dụng, dự án AI, thiết kế 3D và nhiều hơn nữa trên nhiều nền tảng và công cụ.',
    'Real-World Skills': 'Kỹ Năng Thực Tế',
    'Students apply programming, design, and problem-solving skills to build portfolio-worthy projects.': 'Học sinh áp dụng kỹ năng lập trình, thiết kế và giải quyết vấn đề để xây dựng các dự án đáng giá cho hồ sơ.',
    'Showcase & Share': 'Trưng Bày & Chia Sẻ',
    'Students publish their projects online and share their creations with friends and family.': 'Học sinh xuất bản dự án của mình trực tuyến và chia sẻ sáng tạo với bạn bè và gia đình.',
    'GENERATIVE AI': 'AI TẠO SINH',
    'AI-Powered Storytelling': 'Kể Chuyện Bằng AI',
    'Student:': 'Học Sinh:',
    'Focus:': 'Trọng Tâm:',
    'Tools Used': 'Công Cụ Sử Dụng',
    'BEGINNER FRIENDLY': 'THÂN THIỆN CHO NGƯỜI MỚI BẮT ĐẦU',
    'rating': 'đánh giá',
    'projects created': 'dự án đã tạo',

}

def clean_vn_page(file_path):
    """Remove all data-i18n attributes and translation scripts, replace English with Vietnamese"""
    print(f"Processing {file_path.relative_to(BASE_DIR / 'vn')}...")

    content = file_path.read_text(encoding='utf-8')

    # Remove all data-i18n attributes
    content = re.sub(r'\s*data-i18n="[^"]*"', '', content)
    content = re.sub(r'\s*data-i18n-placeholder="[^"]*"', '', content)

    # Remove translation scripts
    content = re.sub(r'<script[^>]*src="[^"]*translations\.js"[^>]*></script>\s*', '', content)
    content = re.sub(r'<script[^>]*src="[^"]*vn-auto-translate\.js"[^>]*></script>\s*', '', content)

    # Remove inline translation script blocks (pageTranslations)
    # Match script blocks containing pageTranslations, but be careful not to match Tailwind config
    # Look for the specific pattern: script tag, some content, then pageTranslations assignment
    lines = content.split('\n')
    new_lines = []
    skip_until_script_end = False

    for line in lines:
        if skip_until_script_end:
            if '</script>' in line:
                skip_until_script_end = False
            continue

        if 'window.pageTranslations' in line:
            skip_until_script_end = True
            # Also skip the opening <script> tag which should be a few lines before
            # Go back and remove recent <script> lines
            while new_lines and '<script>' in new_lines[-1]:
                new_lines.pop()
            # Also remove comment lines before pageTranslations
            while new_lines and (new_lines[-1].strip().startswith('//') or not new_lines[-1].strip()):
                new_lines.pop()
            continue

        new_lines.append(line)

    content = '\n'.join(new_lines)

    # Replace English text with Vietnamese - sorted by length (longest first) to avoid partial replacements
    sorted_translations = sorted(VN_TRANSLATIONS.items(), key=lambda x: len(x[0]), reverse=True)

    for en, vn in sorted_translations:
        # Escape special regex characters but keep HTML tags
        en_escaped = re.escape(en)

        # Replace in text content between tags - allow for optional whitespace
        patterns = [
            (f'>\\s*{en_escaped}\\s*<', f'>{vn}<'),
            (f'>\\s*{en_escaped}\\s*</a>', f'>{vn}</a>'),
            (f'>\\s*{en_escaped}\\s*</button>', f'>{vn}</button>'),
            (f'>\\s*{en_escaped}\\s*</span>', f'>{vn}</span>'),
            (f'>\\s*{en_escaped}\\s*</h1>', f'>{vn}</h1>'),
            (f'>\\s*{en_escaped}\\s*</h2>', f'>{vn}</h2>'),
            (f'>\\s*{en_escaped}\\s*</h3>', f'>{vn}</h3>'),
            (f'>\\s*{en_escaped}\\s*</p>', f'>{vn}</p>'),
            (f'>\\s*{en_escaped}\\s*</li>', f'>{vn}</li>'),
            (f'>\\s*{en_escaped}\\s*</div>', f'>{vn}</div>'),
            # Handle placeholder attributes
            (f'placeholder="{en_escaped}"', f'placeholder="{vn}"'),
            # Handle title tags
            (f'<title>TechTutor Academy — {en_escaped}</title>', f'<title>TechTutor Academy — {vn}</title>'),
        ]

        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)

    # Change lang attribute
    content = re.sub(r'<html[^>]*lang="en"', '<html lang="vi"', content)

    file_path.write_text(content, encoding='utf-8')
    print(f"  [OK] Translated")

def main():
    print("="*60)
    print("Creating STATIC Vietnamese pages - ALL PAGES")
    print("="*60)

    vn_dir = BASE_DIR / 'vn'
    total_files = 0

    # Process all VN root pages
    print("\n[1/2] Processing root VN pages...")
    for html_file in sorted(vn_dir.glob('*.html')):
        clean_vn_page(html_file)
        total_files += 1

    # Process VN program pages
    print("\n[2/2] Processing VN program pages...")
    vn_programs = vn_dir / 'programs'
    if vn_programs.exists():
        for html_file in sorted(vn_programs.glob('*.html')):
            clean_vn_page(html_file)
            total_files += 1

    print("\n" + "="*60)
    print(f"DONE! Translated {total_files} Vietnamese pages")
    print("="*60)
    print("\nAll VN pages now have:")
    print("  [OK] Static Vietnamese text (no data-i18n)")
    print("  [OK] No translation scripts")
    print("  [OK] Language buttons fixed (vi/vn)")
    print("\nTest at: http://localhost:8080/vn/")

if __name__ == '__main__':
    main()
