import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Common translations used across all program pages
common_translations = {
    # Meta and navigation (already exist, but included for completeness)
    'BEGINNER FRIENDLY': 'THÂN THIỆN VỚI NGƯỜI MỚI',
    'INTERMEDIATE': 'TRUNG CẤP',
    'ADVANCED': 'NÂNG CAO',

    # Common CTA and buttons
    'Get Started →': 'Bắt Đầu →',
    'Book Free Trial Now →': 'Đặt Buổi Học Thử Miễn Phí Ngay →',
    'Ready to Start Coding?': 'Sẵn Sàng Bắt Đầu Lập Trình?',

    # Common sections
    'What You\'ll Master': 'Những Gì Bạn Sẽ Làm Chủ',
    'Learn at your own pace': 'Học với tốc độ của riêng bạn',
    'Build Real Games': 'Xây Dựng Game Thực Tế',
    'Creative & Logical Thinking': 'Tư Duy Sáng Tạo & Lô Gic',
    'Join Global Community': 'Tham Gia Cộng Đồng Toàn Cầu',

    # Footer (already translated in common file, but included here)
    'CONTACT US!': 'LIÊN HỆ CHÚNG TÔI!',
    'Tel/WA/Zalo:': 'Tel/WA/Zalo:',
    'Email:': 'Email:',
    'OPENING HOURS': 'GIỜ MỞ CỬA',
    'Monday - Friday: 8am - 9pm': 'Thứ Hai - Thứ Sáu: 8 giờ sáng - 9 giờ tối',
    'Saturday - Sunday: 8am - 8pm': 'Thứ Bảy - Chủ Nhật: 8 giờ sáng - 8 giờ tối',
    'START LEARNING': 'BẮT ĐẦU HỌC',
    'Chương Trình': 'Chương Trình',
    'Dự Án': 'Dự Án',
    'Giá Cả': 'Giá Cả',
    'Blog': 'Blog',
    'Our Vision': 'Tầm Nhìn Của Chúng Tôi',
    'Free trial': 'Học Thử Miễn Phí',
    'CONNECT WITH US!': 'KẾT NỐI VỚI CHÚNG TÔI!',
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

# Specific translations for each program page
programs_translations = {
    'vn/programs/scratch-game-coder.html': {
        'Scratch Game Coder | TechTutor Academy': 'Lập Trình Game Scratch | TechTutor Academy',
        'Learn coding fundamentals through fun game creation with Scratch. Perfect for kids aged 6-10 who are just starting their programming journey.': 'Học các nguyên tắc cơ bản về lập trình thông qua tạo game vui nhộn với Scratch. Hoàn hảo cho trẻ em từ 6-10 tuổi mới bắt đầu hành trình lập trình.',
        'Master Game Creation<br/>with <span style="color: #193b92;">Scratch</span>': 'Làm Chủ Tạo Game<br/>với <span style="color: #193b92;">Scratch</span>',
        'Are you tired of your child just playing games? Transform them into creators! Learn programming fundamentals by building fun games, animations, and interactive stories with colorful blocks—no typing required.': 'Bạn có mệt mỏi khi con bạn chỉ chơi game? Biến chúng thành những người sáng tạo! Học các nguyên tắc cơ bản về lập trình bằng cách xây dựng các trò chơi vui nhộn, hoạt hình và câu chuyện tương tác với các khối màu sắc—không cần gõ lệnh.',
        'rating': 'đánh giá',
        'projects created': 'dự án đã tạo',
        'New Skills with <span style="color: #193b92;">Scratch</span>.<br/>\n          A Detailed Look at Our Curriculum': 'Kỹ Năng Mới Với <span style="color: #193b92;">Scratch</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học',
        'With real-world projects to create and online classes that fit a busy routine': 'Với các dự án thực tế để tạo và các lớp học trực tuyến phù hợp với lịch bận rộn',
        'Scratch teachers are everyday creatives and professionals who want to share their passion. Start with block-based coding and progress naturally to complex game mechanics.': 'Các giáo viên Scratch là những nhà sáng tạo và chuyên gia muốn chia sẻ niềm đam mê của họ. Bắt đầu với lập trình dựa trên khối và phát triển tự nhiên thành những cơ chế trò chơi phức tạp.',
        'Create maze adventures, catching games, platformers, and interactive stories. Every lesson builds toward a complete project your child can share with friends and family.': 'Tạo các trò chơi mê cung, trò chơi bắt, nền tảng và câu chuyện tương tác. Mỗi bài học xây dựng hướng tới một dự án hoàn chỉnh mà con bạn có thể chia sẻ với bạn bè và gia đình.',
        'Design unique characters, backgrounds, and animations while developing problem-solving skills. Learn to think like a programmer through visual coding.': 'Thiết kế các nhân vật, nền và hoạt hình độc đáo trong khi phát triển kỹ năng giải quyết vấn đề. Học cách suy nghĩ như một lập trình viên thông qua lập trình trực quan.',
        'Publish projects to the worldwide Scratch community with millions of creators. Play games made by kids around the world and get inspired by their creativity.': 'Xuất bản dự án cho cộng đồng Scratch trên toàn thế giới với hàng triệu nhà sáng tạo. Chơi các trò chơi được tạo bởi trẻ em trên khắp thế giới và lấy cảm hứng từ sự sáng tạo của họ.',
        'Scratch Platform': 'Nền Tảng Scratch',
        'MIT\'s visual programming language designed specifically for young learners': 'Ngôn ngữ lập trình trực quan của MIT được thiết kế đặc biệt cho những học viên trẻ',
        'Logic & Sequencing': 'Lô Gic & Sequencing',
        'Master loops, conditionals, variables, and algorithmic thinking': 'Làm chủ vòng lặp, điều kiện, biến và tư duy thuật toán',
        'Digital Art & Animation': 'Nghệ Thuật & Hoạt Hình Kỹ Thuật Số',
        'Create sprites, design backgrounds, and animate your characters': 'Tạo sprite, thiết kế nền và tạo hoạt hình cho các nhân vật của bạn',
        'Book a free trial lesson and watch your child create their first game!': 'Đặt lịch học thử miễn phí và xem con bạn tạo trò chơi đầu tiên của mình!',
    },

    'vn/programs/gdevelop-game-designer.html': {
        'GDevelop Game Designer | TechTutor Academy': 'Thiết Kế Game GDevelop | TechTutor Academy',
        'Design professional 2D games without coding using GDevelop\'s visual event system. Perfect for kids aged 8-15 who want to create polished games.': 'Thiết kế game 2D chuyên nghiệp không cần lập trình bằng hệ thống sự kiện trực quan của GDevelop. Hoàn hảo cho trẻ em từ 8-15 tuổi muốn tạo các trò chơi hoàn thiện.',
        'Create Professional Games<br/>with <span style="color: #193b92;">GDevelop</span>': 'Tạo Game Chuyên Nghiệp<br/>với <span style="color: #193b92;">GDevelop</span>',
        'Build stunning 2D games without writing a single line of code. Use GDevelop\'s powerful visual event system to create platformers, shooters, puzzles, and more—then publish to web, mobile, and desktop!': 'Xây dựng các trò chơi 2D tuyệt đẹp mà không cần viết một dòng mã nào. Sử dụng hệ thống sự kiện trực quan mạnh mẽ của GDevelop để tạo các trò chơi nền tảng, bắn súng, giải đố và nhiều hơn nữa—sau đó xuất bản lên web, di động và máy tính!',
    },

    'vn/programs/roblox-world-creator.html': {
        'Roblox World Creator | TechTutor Academy': 'Sáng Tạo Thế Giới Roblox | TechTutor Academy',
        'Create immersive 3D worlds and games in Roblox using Lua scripting. Perfect for kids aged 8-15 who want to build and monetize their own games.': 'Tạo thế giới và trò chơi 3D nhập vai trong Roblox bằng cách sử dụng Lua scripting. Hoàn hảo cho trẻ em từ 8-15 tuổi muốn xây dựng và kiếm tiền từ trò chơi của riêng mình.',
        'Build Your Own<br/><span style="color: #193b92;">Roblox</span> World': 'Xây Dựng Thế Giới<br/><span style="color: #193b92;">Roblox</span> Của Riêng Bạn',
        'Join millions of creators on Roblox! Learn to build 3D environments, script game mechanics with Lua, and publish your creations to players worldwide. Some students even earn Robux from their games!': 'Tham gia hàng triệu nhà sáng tạo trên Roblox! Học cách xây dựng môi trường 3D, lập trình cơ chế trò chơi với Lua và xuất bản sáng tạo của bạn cho người chơi trên toàn thế giới. Một số học sinh thậm chí còn kiếm được Robux từ trò chơi của họ!',
    },

    'vn/programs/3d-designer.html': {
        '3D Designer | TechTutor Academy': 'Thiết Kế 3D | TechTutor Academy',
        'Master 3D modeling and design with industry-standard tools like Blender. Perfect for kids aged 10-16 interested in game design, animation, and digital art.': 'Làm chủ mô hình hóa và thiết kế 3D với các công cụ tiêu chuẩn ngành như Blender. Hoàn hảo cho trẻ em từ 10-16 tuổi quan tâm đến thiết kế game, hoạt hình và nghệ thuật kỹ thuật số.',
        'Create Stunning<br/><span style="color: #193b92;">3D Art</span>': 'Tạo Nghệ Thuật<br/><span style="color: #193b92;">3D</span> Tuyệt Đẹp',
        'Learn professional 3D modeling, texturing, and rendering using Blender—the same free tool used by studios like Pixar and Netflix. Design characters, environments, and props for games and animations.': 'Học mô hình hóa 3D chuyên nghiệp, tạo texture và kết xuất bằng Blender—cùng công cụ miễn phí được sử dụng bởi các studio như Pixar và Netflix. Thiết kế các nhân vật, môi trường và đạo cụ cho trò chơi và hoạt hình.',
    },

    'vn/programs/ai-programming-quest.html': {
        'AI & Programming Quest | TechTutor Academy': 'Khám Phá AI & Lập Trình | TechTutor Academy',
        'Dive into real programming with Python and AI fundamentals. Perfect for kids aged 10-16 ready to write actual code and build intelligent applications.': 'Khám phá lập trình thực sự với Python và các nguyên tắc cơ bản về AI. Hoàn hảo cho trẻ em từ 10-16 tuổi sẵn sàng viết mã thực và xây dựng ứng dụng thông minh.',
        'Master Python &<br/><span style="color: #193b92;">AI Basics</span>': 'Làm Chủ Python &<br/><span style="color: #193b92;">Cơ Bản AI</span>',
        'Write real code in Python—the #1 programming language for AI, data science, and automation. Build chatbots, recommendation systems, and machine learning projects that actually work!': 'Viết mã thực trong Python—ngôn ngữ lập trình số 1 cho AI, khoa học dữ liệu và tự động hóa. Xây dựng chatbot, hệ thống gợi ý và các dự án học máy thực sự hoạt động!',
    },

    'vn/programs/generative-ai-magic.html': {
        'Generative AI Magic | TechTutor Academy': 'Phép Thuật AI Tạo Sinh | TechTutor Academy',
        'Explore the creative possibilities of generative AI tools like ChatGPT, DALL-E, and Midjourney. Perfect for kids aged 10-16 who want to use AI responsibly and creatively.': 'Khám phá khả năng sáng tạo của các công cụ AI tạo sinh như ChatGPT, DALL-E và Midjourney. Hoàn hảo cho trẻ em từ 10-16 tuổi muốn sử dụng AI một cách có trách nhiệm và sáng tạo.',
        'Create with<br/><span style="color: #193b92;">Generative AI</span>': 'Sáng Tạo Với<br/><span style="color: #193b92;">AI Tạo Sinh</span>',
        'Master the art of prompt engineering! Learn to create stunning images, stories, music, and videos using AI tools. Plus, understand AI ethics, bias, and how to use these tools responsibly.': 'Làm chủ nghệ thuật kỹ thuật prompt! Học cách tạo hình ảnh, câu chuyện, âm nhạc và video tuyệt đẹp bằng các công cụ AI. Ngoài ra, hiểu về đạo đức AI, thiên vị và cách sử dụng các công cụ này một cách có trách nhiệm.',
    },

    'vn/programs/app-development.html': {
        'App Development | TechTutor Academy': 'Phát Triển Ứng Dụng | TechTutor Academy',
        'Build real mobile and web applications using modern frameworks. Perfect for kids aged 12-16 ready to create apps they can publish and share.': 'Xây dựng ứng dụng di động và web thực bằng các framework hiện đại. Hoàn hảo cho trẻ em từ 12-16 tuổi sẵn sàng tạo ứng dụng mà chúng có thể xuất bản và chia sẻ.',
        'Build Real<br/><span style="color: #193b92;">Mobile Apps</span>': 'Xây Dựng<br/><span style="color: #193b92;">Ứng Dụng Di Động</span> Thực Tế',
        'Create professional mobile apps and websites that people can actually download and use! Learn modern web development with HTML, CSS, JavaScript, and frameworks like React Native.': 'Tạo ứng dụng di động và trang web chuyên nghiệp mà mọi người thực sự có thể tải xuống và sử dụng! Học phát triển web hiện đại với HTML, CSS, JavaScript và các framework như React Native.',
    }
}

# Translate all program files
print('Starting batch translation of VN program pages...\n')
success_count = 0
total_count = len(programs_translations)

for file_path, translations in programs_translations.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  Success')
    else:
        print(f'  Failed')

print(f'\nCompleted: {success_count}/{total_count} program pages translated successfully')
