import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_file(source_file, target_file, translations):
    """Translate a file by copying and replacing text"""
    try:
        with open(source_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Apply all translations
        for eng, viet in translations.items():
            content = content.replace(eng, viet)

        # Write to target file
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error translating {source_file}: {e}')
        return False

# Comprehensive translations for Generative AI course page
course_translations = {
    # Language attribute
    'lang="en"': 'lang="vi"',

    # Meta tags
    'Generative AI Foundation | TechTutor Academy': 'Nền Tảng AI Tạo Sinh | TechTutor Academy',
    'Interactive course on Generative AI Foundation with video lessons, descriptions, and quizzes.': 'Khóa học tương tác về Nền Tảng AI Tạo Sinh với video bài học, mô tả và câu đố.',

    # Navigation (paths need updating to relative from vn/)
    'href="../index.html"': 'href="../index.html"',
    'href="../programs/': 'href="../programs/',
    'href="../student-projects.html"': 'href="../student-projects.html"',
    'href="../online-courses.html"': 'href="../online-courses.html"',
    'href="../plans-and-faq.html"': 'href="../plans-and-faq.html"',
    'href="../blog.html"': 'href="../blog.html"',
    'href="../login.html"': 'href="../login.html"',
    'href="../free-trial.html"': 'href="../free-trial.html"',
    'href="../vision.html"': 'href="../vision.html"',

    # Hero section
    'Interactive Course': 'Khóa Học Tương Tác',
    'Generative AI<br/>Foundation': 'Nền Tảng<br/>AI Tạo Sinh',
    'Master the fundamentals of generative AI through interactive lessons, videos, and hands-on quizzes. Learn at your own pace with expert guidance.': 'Làm chủ các nguyên tắc cơ bản về AI tạo sinh thông qua các bài học tương tác, video và câu đố thực hành. Học với tốc độ của riêng bạn với sự hướng dẫn chuyên nghiệp.',
    'rating': 'đánh giá',
    'lessons': 'bài học',

    # Progress bar
    'Your Progress': 'Tiến Độ Của Bạn',
    'Complete': 'Hoàn Thành',

    # Lessons section
    '3 Interactive Lessons': '3 Bài Học Tương Tác',

    # Lesson 1
    'Lesson 1': 'Bài Học 1',
    'Introduction to Generative AI': 'Giới Thiệu về AI Tạo Sinh',
    'Discover what generative AI is and how it\'s transforming the world. Learn the core concepts behind models like ChatGPT and DALL-E.': 'Khám phá AI tạo sinh là gì và cách nó đang thay đổi thế giới. Học các khái niệm cốt lõi đằng sau các mô hình như ChatGPT và DALL-E.',
    'Topics covered:': 'Chủ đề được đề cập:',
    '✓ What is generative AI?': '✓ AI tạo sinh là gì?',
    '✓ How neural networks work': '✓ Mạng nơ-ron hoạt động như thế nào',
    '✓ Real-world applications': '✓ Ứng dụng thực tế',
    '✓ AI ethics & responsible use': '✓ Đạo đức AI & sử dụng có trách nhiệm',
    '⏱ 8 minutes': '⏱ 8 phút',
    'View Lesson': 'Xem Bài Học',

    # Lesson 2
    'Lesson 2': 'Bài Học 2',
    'Video & Image Creation': 'Tạo Video & Hình Ảnh',
    'Create stunning images and videos using Grok, Meta AI, and Google Nano Banana. Learn prompting techniques for different media types.': 'Tạo hình ảnh và video tuyệt đẹp bằng Grok, Meta AI và Google Nano Banana. Học kỹ thuật prompt cho các loại phương tiện khác nhau.',
    '✓ Image creation & prompting': '✓ Tạo hình ảnh & prompting',
    '✓ Video generation techniques': '✓ Kỹ thuật tạo video',
    '✓ Animation & effects': '✓ Hoạt hình & hiệu ứng',
    '✓ Download & export': '✓ Tải xuống & xuất',

    # Lesson 3
    'Lesson 3': 'Bài Học 3',
    'AI-Powered Web Games': 'Trò Chơi Web Được Hỗ Trợ Bởi AI',
    'Build simple web games using Claude, Grok, and Gemini. Test different AI models and add features to make games challenging.': 'Xây dựng trò chơi web đơn giản bằng Claude, Grok và Gemini. Thử nghiệm các mô hình AI khác nhau và thêm tính năng để làm trò chơi thách thức hơn.',
    '✓ Compare Claude, Grok, Gemini': '✓ So sánh Claude, Grok, Gemini',
    '✓ Game logic & structure': '✓ Logic & cấu trúc trò chơi',
    '✓ Add advanced features': '✓ Thêm tính năng nâng cao',
    '✓ Increase difficulty & engagement': '✓ Tăng độ khó & sự tương tác',
    '⏱ 9 minutes': '⏱ 9 phút',

    # Lesson content pages
    '← Back to Lessons': '← Quay Lại Bài Học',
    'Video Duration:': 'Thời lượng video:',
    'Lesson Summary': 'Tóm Tắt Bài Học',

    # Lesson 1 content
    'What is Generative AI?': 'AI Tạo Sinh là gì?',
    'Generative AI is technology that creates new content based on patterns it has learned. It can generate text, images, code, stories, and more based on user instructions (prompts).': 'AI tạo sinh là công nghệ tạo ra nội dung mới dựa trên các mẫu mà nó đã học. Nó có thể tạo ra văn bản, hình ảnh, mã, câu chuyện và nhiều hơn nữa dựa trên hướng dẫn của người dùng (prompts).',

    'Main Platforms Covered:': 'Các Nền Tảng Chính Được Đề Cập:',
    'Excellent for text generation and Q&A': 'Xuất sắc cho tạo văn bản và Q&A',
    'Great for detailed answers with examples': 'Tuyệt vời cho câu trả lời chi tiết với ví dụ',
    'Provides very detailed responses': 'Cung cấp câu trả lời rất chi tiết',
    'Another capable AI platform': 'Một nền tảng AI có năng lực khác',
    'All platforms accomplish similar tasks but have different strengths and features.': 'Tất cả các nền tảng hoàn thành các nhiệm vụ tương tự nhưng có những điểm mạnh và tính năng khác nhau.',

    'Effective Prompting Techniques:': 'Kỹ Thuật Prompting Hiệu Quả:',
    '<strong>Be Specific</strong> - Clearly state what you want': '<strong>Cụ Thể</strong> - Nói rõ những gì bạn muốn',
    '<strong>Give Context</strong> - Provide background information when relevant': '<strong>Cung Cấp Ngữ Cảnh</strong> - Cung cấp thông tin nền khi có liên quan',
    '<strong>Set Constraints</strong> - Specify length, format, or style (e.g., "under 100 words," "make it funny")': '<strong>Đặt Ràng Buộc</strong> - Chỉ định độ dài, định dạng hoặc phong cách (ví dụ: "dưới 100 từ", "làm cho nó hài hước")',
    '<strong>Iterate</strong> - Ask follow-up questions to refine results': '<strong>Lặp Lại</strong> - Đặt câu hỏi tiếp theo để tinh chỉnh kết quả',
    '<strong>Add Instructions</strong> - Request summaries, simplifications, or reformatting': '<strong>Thêm Hướng Dẫn</strong> - Yêu cầu tóm tắt, đơn giản hóa hoặc định dạng lại',

    'Key Skills to Learn:': 'Các Kỹ Năng Chính Cần Học:',
    'How to ask better questions to get better results': 'Cách đặt câu hỏi tốt hơn để có kết quả tốt hơn',
    'Understanding AI limitations on free versions': 'Hiểu giới hạn của AI trên các phiên bản miễn phí',
    'Switching between different AIs when hitting limits': 'Chuyển đổi giữa các AI khác nhau khi đạt giới hạn',
    'Using AI for learning, storytelling, code generation, translation, and more': 'Sử dụng AI để học tập, kể chuyện, tạo mã, dịch thuật và nhiều hơn nữa',

    'AI Capabilities Demonstrated:': 'Khả Năng AI Được Trình Bày:',
    'Text generation and Q&A': 'Tạo văn bản và Q&A',
    'Story creation with learning points': 'Tạo câu chuyện với điểm học tập',
    'Code generation (like GitHub Copilot)': 'Tạo mã (như GitHub Copilot)',
    'Image generation': 'Tạo hình ảnh',
    'Translation between languages': 'Dịch giữa các ngôn ngữ',

    'By the end of this lesson, you understand the fundamentals of generative AI and are ready to explore how to use these tools effectively!': 'Vào cuối bài học này, bạn hiểu các nguyên tắc cơ bản về AI tạo sinh và sẵn sàng khám phá cách sử dụng các công cụ này một cách hiệu quả!',

    # Lesson 2 content
    'Best Tools for Generating Images and Videos:': 'Công Cụ Tốt Nhất Để Tạo Hình Ảnh Và Video:',
    'The best free tools for creating images and videos with AI are Grok, Meta AI, and Google Gemini. These tools allow you to generate high-quality visual content without hitting usage limits quickly.': 'Các công cụ miễn phí tốt nhất để tạo hình ảnh và video với AI là Grok, Meta AI và Google Gemini. Các công cụ này cho phép bạn tạo nội dung trực quan chất lượng cao mà không nhanh chóng đạt đến giới hạn sử dụng.',

    'Key AI Platforms:': 'Các Nền Tảng AI Chính:',
    'Provides multiple image options, supports animation, offers cartoon and realistic styles': 'Cung cấp nhiều tùy chọn hình ảnh, hỗ trợ hoạt hình, cung cấp phong cách phim hoạt hình và thực tế',
    'Facebook\'s generative AI for images and videos, includes animation and music features': 'AI tạo sinh của Facebook cho hình ảnh và video, bao gồm tính năng hoạt hình và âm nhạc',
    'Uses Nano Banana model for creating images, great for posters and specific content': 'Sử dụng mô hình Nano Banana để tạo hình ảnh, tuyệt vời cho poster và nội dung cụ thể',

    'Image and Video Creation Features:': 'Tính Năng Tạo Hình Ảnh Và Video:',
    'Aspect ratio and sizing selection': 'Chọn tỷ lệ khung hình và kích thước',
    'Style customization (cartoon, realistic, poster style)': 'Tùy chỉnh phong cách (phim hoạt hình, thực tế, phong cách poster)',
    'Animation features to create 5+ second videos': 'Tính năng hoạt hình để tạo video 5+ giây',
    'Music and sound effects integration': 'Tích hợp âm nhạc và hiệu ứng âm thanh',
    'Custom animation descriptions and editing': 'Mô tả và chỉnh sửa hoạt hình tùy chỉnh',
    'Download and export options': 'Tùy chọn tải xuống và xuất',

    'Effective Prompting for Visual Content:': 'Prompting Hiệu Quả Cho Nội Dung Trực Quan:',
    'Be specific about the subject and style you want (e.g., "cartoon style robot")': 'Cụ thể về chủ đề và phong cách bạn muốn (ví dụ: "robot phong cách phim hoạt hình")',
    'Describe actions and animations (e.g., "robot floating and waving")': 'Mô tả hành động và hoạt hình (ví dụ: "robot bay và vẫy tay")',
    'Iterate and refine prompts if you don\'t like initial results': 'Lặp lại và tinh chỉnh prompts nếu bạn không thích kết quả ban đầu',
    'Use multiple iterations to achieve your desired output': 'Sử dụng nhiều lần lặp để đạt được đầu ra mong muốn',
    'Specify context (e.g., "poster for school," "5-second video")': 'Chỉ định ngữ cảnh (ví dụ: "poster cho trường học", "video 5 giây")',

    'Practical Examples:': 'Ví Dụ Thực Tế:',
    'Creating robot spaceship images in different styles': 'Tạo hình ảnh tàu vũ trụ robot theo nhiều phong cách khác nhau',
    'Animating static images into short videos': 'Tạo hoạt hình từ hình ảnh tĩnh thành video ngắn',
    'Generating school project posters about topics like Mars': 'Tạo poster dự án học tập về các chủ đề như Sao Hỏa',
    'Refining animations by removing or adding elements': 'Tinh chỉnh hoạt hình bằng cách loại bỏ hoặc thêm các yếu tố',

    'By the end of this lesson, you can create professional-quality images and animated videos using free AI tools with effective prompting techniques!': 'Vào cuối bài học này, bạn có thể tạo hình ảnh và video hoạt hình chất lượng chuyên nghiệp bằng các công cụ AI miễn phí với kỹ thuật prompting hiệu quả!',

    # Lesson 3 content
    'Creating Web Games with AI:': 'Tạo Trò Chơi Web Với AI:',
    'Learn how to build simple 2D web games using three powerful AI models: Grok, Gemini, and Claude. By giving all three the same prompt, you can compare results and choose the best output for your game.': 'Học cách xây dựng trò chơi web 2D đơn giản bằng ba mô hình AI mạnh mẽ: Grok, Gemini và Claude. Bằng cách đưa cho cả ba cùng một prompt, bạn có thể so sánh kết quả và chọn đầu ra tốt nhất cho trò chơi của bạn.',

    'Web Game Technologies:': 'Công Nghệ Trò Chơi Web:',
    '<strong>HTML:</strong> Structure and layout of the game': '<strong>HTML:</strong> Cấu trúc và bố cục của trò chơi',
    '<strong>CSS:</strong> Styling and visual appearance': '<strong>CSS:</strong> Phong cách và giao diện trực quan',
    '<strong>JavaScript:</strong> Game logic and interactivity': '<strong>JavaScript:</strong> Logic trò chơi và tương tác',
    'These are standard web technologies that work across browsers and devices.': 'Đây là các công nghệ web tiêu chuẩn hoạt động trên các trình duyệt và thiết bị.',

    'The Three AI Platforms for Game Development:': 'Ba Nền Tảng AI Cho Phát Triển Trò Chơi:',
    '<strong>Grok:</strong> Fast code generation, good for creative game features': '<strong>Grok:</strong> Tạo mã nhanh, tốt cho các tính năng trò chơi sáng tạo',
    '<strong>Gemini:</strong> Strong at code generation and optimization': '<strong>Gemini:</strong> Mạnh về tạo mã và tối ưu hóa',
    '<strong>Claude:</strong> Excellent for complex logic and detailed game mechanics': '<strong>Claude:</strong> Xuất sắc cho logic phức tạp và cơ chế trò chơi chi tiết',
    'All have free limits, so switching between them is practical when one hits a limit.': 'Tất cả đều có giới hạn miễn phí, vì vậy chuyển đổi giữa chúng là thực tế khi một cái đạt giới hạn.',

    'Game Development Workflow:': 'Quy Trình Phát Triển Trò Chơi:',
    'Give AI the same prompt across different tools to compare results': 'Đưa cho AI cùng một prompt trên các công cụ khác nhau để so sánh kết quả',
    'Use canvas preview to test the game immediately': 'Sử dụng bản xem trước canvas để kiểm tra trò chơi ngay lập tức',
    'Iterate on prompts to fix errors and bugs': 'Lặp lại prompts để sửa lỗi và bug',
    'Add game features (enemies, obstacles, difficulty levels)': 'Thêm tính năng trò chơi (kẻ thù, chướng ngại vật, mức độ khó)',
    'Adjust difficulty to make games more balanced': 'Điều chỉnh độ khó để làm cho trò chơi cân bằng hơn',
    'Request combining multiple files into one playable file': 'Yêu cầu kết hợp nhiều tệp thành một tệp có thể chơi',

    'Game Example: Snake Game:': 'Ví Dụ Trò Chơi: Trò Chơi Rắn:',
    'Classic game concept that works well for learning': 'Khái niệm trò chơi cổ điển hoạt động tốt cho việc học',
    'Can add enemy snakes that compete with player': 'Có thể thêm rắn kẻ thù cạnh tranh với người chơi',
    'Difficulty adjustable through prompt refinement': 'Độ khó có thể điều chỉnh thông qua tinh chỉnh prompt',
    'All three AI tools can successfully create their own versions': 'Cả ba công cụ AI đều có thể tạo thành công các phiên bản riêng của chúng',

    'Sharing and Publishing Your Games:': 'Chia Sẻ Và Xuất Bản Trò Chơi Của Bạn:',
    'Copy shareable links to send games to friends': 'Sao chép liên kết có thể chia sẻ để gửi trò chơi cho bạn bè',
    'Publish games to get permanent links': 'Xuất bản trò chơi để có liên kết vĩnh viễn',
    'Download games to save locally': 'Tải xuống trò chơi để lưu cục bộ',

    'By the end of this lesson, you can create and share playable web games using AI, compare different AI tools, and iterate to improve gameplay!': 'Vào cuối bài học này, bạn có thể tạo và chia sẻ trò chơi web có thể chơi bằng AI, so sánh các công cụ AI khác nhau và lặp lại để cải thiện lối chơi!',

    # Quiz section
    'Lesson Quiz': 'Câu Đố Bài Học',
    'Submit Quiz': 'Nộp Câu Đố',
    'Skip to Next Lesson': 'Bỏ Qua Sang Bài Học Tiếp Theo',
    'Complete Course': 'Hoàn Thành Khóa Học',

    # Quiz questions - Lesson 1
    '1. Name three different generative AI platforms mentioned in the lesson.': '1. Kể tên ba nền tảng AI tạo sinh khác nhau được đề cập trong bài học.',
    'Scratch, Roblox, GDevelop': 'Scratch, Roblox, GDevelop',
    'ChatGPT, Claude, Gemini': 'ChatGPT, Claude, Gemini',
    'Photoshop, Figma, Adobe XD': 'Photoshop, Figma, Adobe XD',
    'Google, Facebook, Twitter': 'Google, Facebook, Twitter',

    '2. What is the main benefit of being specific when writing prompts to AI?': '2. Lợi ích chính của việc cụ thể khi viết prompts cho AI là gì?',
    'It makes the AI work faster': 'Nó làm cho AI hoạt động nhanh hơn',
    'You get better, more accurate results': 'Bạn có được kết quả tốt hơn, chính xác hơn',
    'It costs less to use': 'Nó tốn ít chi phí hơn để sử dụng',
    'It\'s not necessary, AI understands everything': 'Nó không cần thiết, AI hiểu mọi thứ',

    '3. True or False: All generative AI platforms have unlimited usage on free versions.': '3. Đúng hay Sai: Tất cả các nền tảng AI tạo sinh đều có sử dụng không giới hạn trên các phiên bản miễn phí.',
    'True - They all offer unlimited free access': 'Đúng - Tất cả đều cung cấp truy cập miễn phí không giới hạn',
    'False - Free versions have limitations': 'Sai - Các phiên bản miễn phí có giới hạn',
    'Only ChatGPT has free access': 'Chỉ ChatGPT có truy cập miễn phí',
    'It depends on your location': 'Nó phụ thuộc vào vị trí của bạn',

    # Quiz questions - Lesson 2
    '1. Which tools are the best for creating images and videos with AI for free?': '1. Các công cụ nào là tốt nhất để tạo hình ảnh và video với AI miễn phí?',
    'Grok, Meta AI, and Google Gemini': 'Grok, Meta AI và Google Gemini',
    'Adobe Photoshop and Premiere Pro': 'Adobe Photoshop và Premiere Pro',

    '2. What should you do if you don\'t like the initial generated image or video?': '2. Bạn nên làm gì nếu bạn không thích hình ảnh hoặc video được tạo ban đầu?',
    'Give up and start with a different topic': 'Bỏ cuộc và bắt đầu với một chủ đề khác',
    'Iterate and refine your prompt with more specific details': 'Lặp lại và tinh chỉnh prompt của bạn với các chi tiết cụ thể hơn',
    'Download it immediately before it disappears': 'Tải xuống ngay lập tức trước khi nó biến mất',
    'Switch to a different AI tool without changing your prompt': 'Chuyển sang một công cụ AI khác mà không thay đổi prompt của bạn',

    '3. Which of these platforms includes animation and music features?': '3. Nền tảng nào trong số này bao gồm tính năng hoạt hình và âm nhạc?',
    'Only Google Gemini': 'Chỉ Google Gemini',
    'Meta AI and Grok': 'Meta AI và Grok',
    'Only Grok': 'Chỉ Grok',
    'ChatGPT and Claude': 'ChatGPT và Claude',

    # Quiz questions - Lesson 3
    '1. What are the three web technologies used to create browser-based games?': '1. Ba công nghệ web nào được sử dụng để tạo trò chơi trên trình duyệt?',
    'Python, Java, and C++': 'Python, Java và C++',
    'HTML, CSS, and JavaScript': 'HTML, CSS và JavaScript',
    'React, Vue, and Angular': 'React, Vue và Angular',
    'Scratch, Roblox Studio, Unreal Engine': 'Scratch, Roblox Studio, Unreal Engine',

    '2. When developing a game using AI, what is a good strategy if you don\'t like the initial result?': '2. Khi phát triển trò chơi bằng AI, chiến lược nào là tốt nếu bạn không thích kết quả ban đầu?',
    'Start a completely new game': 'Bắt đầu một trò chơi hoàn toàn mới',
    'Iterate and refine your prompt with more specific details and fixes': 'Lặp lại và tinh chỉnh prompt của bạn với các chi tiết và sửa chữa cụ thể hơn',
    'Give up on AI game development': 'Bỏ cuộc phát triển trò chơi AI',
    'Use a different programming language': 'Sử dụng một ngôn ngữ lập trình khác',

    '3. What are benefits of comparing the same prompt across multiple AI models?': '3. Lợi ích của việc so sánh cùng một prompt trên nhiều mô hình AI là gì?',
    'It takes less time to create a game': 'Mất ít thời gian hơn để tạo trò chơi',
    'You can choose the best result and switch between tools when hitting limits': 'Bạn có thể chọn kết quả tốt nhất và chuyển đổi giữa các công cụ khi đạt giới hạn',
    'Each model costs less money': 'Mỗi mô hình tốn ít tiền hơn',
    'It combines all results automatically': 'Nó kết hợp tất cả kết quả tự động',

    # Footer
    'CONTACT US!': 'LIÊN HỆ CHÚNG TÔI!',
    'Tel/WA/Zalo:': 'Tel/WA/Zalo:',
    'Email:': 'Email:',
    'OPENING HOURS': 'GIỜ MỞ CỬA',
    'Monday - Friday: 8am - 9pm': 'Thứ Hai - Thứ Sáu: 8 giờ sáng - 9 giờ tối',
    'Saturday - Sunday: 8am - 8pm': 'Thứ Bảy - Chủ Nhật: 8 giờ sáng - 8 giờ tối',
    'START LEARNING': 'BẮT ĐẦU HỌC',
    'Programs': 'Chương Trình',
    'Projects': 'Dự Án',
    'Pricing': 'Giá Cả',
    'Blog': 'Blog',
    'Our Vision': 'Tầm Nhìn Của Chúng Tôi',
    'Free trial': 'Học Thử Miễn Phí',
    'CONNECT WITH US!': 'KẾT NỐI VỚI CHÚNG TÔI!',

    # JavaScript translations
    "'nav.programs': 'Programs',": "'nav.programs': 'Chương Trình',",
    "'nav.projects': 'Projects',": "'nav.projects': 'Dự Án',",
    "'nav.free-courses': 'Free Courses',": "'nav.free-courses': 'Khóa Học Miễn Phí',",
    "'nav.pricing': 'Pricing',": "'nav.pricing': 'Giá Cả',",
    "'nav.blog': 'Blog',": "'nav.blog': 'Blog',",
    "'nav.free-trial': 'Free Trial',": "'nav.free-trial': 'Dùng Thử Miễn Phí',",
    "'footer.copyright': '© 2025 TechTutor Academy. All rights reserved.',": "'footer.copyright': '© 2025 TechTutor Academy. Bảo lưu mọi quyền.',",
    "'footer.bilingual': 'English / Vietnamese bilingual support'": "'footer.bilingual': 'Hỗ trợ song ngữ Tiếng Anh / Tiếng Việt'",

    # JavaScript messages
    'Please answer all questions before submitting!': 'Vui lòng trả lời tất cả các câu hỏi trước khi nộp!',
    'Great job! You scored': 'Làm tốt lắm! Bạn đã ghi được',
    '% on this quiz!': '% trong bài kiểm tra này!',
    "You've completed Lesson": 'Bạn đã hoàn thành Bài Học',
    'You scored': 'Bạn đã ghi được',
    '%. You need at least 70% to complete this lesson. Please review and try again!': '%. Bạn cần ít nhất 70% để hoàn thành bài học này. Vui lòng xem lại và thử lại!',
    'Congratulations! You have completed the entire Generative AI Magic course!': 'Chúc mừng! Bạn đã hoàn thành toàn bộ khóa học Phép Thuật AI Tạo Sinh!',
    'You are now ready to apply these skills to real projects.': 'Bây giờ bạn đã sẵn sàng áp dụng các kỹ năng này vào các dự án thực tế.',
    'Please complete all lessons and their quizzes first!': 'Vui lòng hoàn thành tất cả các bài học và bài kiểm tra của chúng trước!',
}

# Translate the file
print('Creating Vietnamese version of Generative AI course page...\n')

source = 'courses/generative-ai-course.html'
target = 'vn/courses/generative-ai-course.html'

print(f'Translating {source} to {target}...')
if translate_file(source, target, course_translations):
    print('  Success!')
    print(f'\nVietnamese course page created at: {target}')
else:
    print('  Failed!')

print('\nTranslation completed!')
