import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_file(file_path, translations):
    """Translate remaining English content in program pages"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Apply all translations
        for eng, viet in translations.items():
            content = content.replace(eng, viet)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error translating {file_path}: {e}')
        return False

# Complete translations for all program pages - remaining English content
programs_complete_translations = {
    'vn/programs/gdevelop-game-designer.html': {
        'Master Game Design<br/>with <span style="color: #193b92;">GDevelop</span>': 'Làm Chủ Thiết Kế Game<br/>với <span style="color: #193b92;">GDevelop</span>',
        'Design and publish your own 2D games without writing code! Use GDevelop\'s intuitive visual programming to create platformers, puzzle games, and more.': 'Thiết kế và xuất bản trò chơi 2D của riêng bạn mà không cần viết mã! Sử dụng lập trình trực quan trực quan của GDevelop để tạo các trò chơi platformer, trò chơi giải đố và nhiều hơn nữa.',
        'New Skills with <span style="color: #193b92;">GDevelop</span>.<br/>\n          A Detailed Look at Our Curriculum': 'Kỹ Năng Mới Với <span style="color: #193b92;">GDevelop</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học',
        'With real-world projects to create and online classes that fit a busy routine': 'Với các dự án thực tế để tạo và các lớp học trực tuyến phù hợp với lịch bận rộn',
        'Visual Programming': 'Lập Trình Trực Quan',
        'Learn game logic using drag-and-drop events and actions—no typing code required! Build complex game mechanics through intuitive visual programming.': 'Học logic game bằng cách kéo và thả sự kiện và hành động—không cần gõ mã! Xây dựng cơ chế game phức tạp thông qua lập trình trực quan trực quan.',
        'Professional Publishing': 'Xuất Bản Chuyên Nghiệp',
        'Export your games to Windows, Mac, Linux, iOS, Android, and web browsers. Share your creations with millions of players worldwide!': 'Xuất game của bạn sang Windows, Mac, Linux, iOS, Android và trình duyệt web. Chia sẻ sáng tạo của bạn với hàng triệu người chơi trên toàn thế giới!',
        'Game Design Thinking': 'Tư Duy Thiết Kế Game',
        'Learn to design engaging levels, balance difficulty, and create compelling player experiences through iterative design.': 'Học cách thiết kế các cấp độ hấp dẫn, cân bằng độ khó và tạo trải nghiệm người chơi hấp dẫn thông qua thiết kế lặp đi lặp lại.',
        'Multi-Platform Development': 'Phát Triển Đa Nền Tảng',
        'Build once, publish everywhere! Create games that work seamlessly across desktop, mobile, and web platforms.': 'Xây dựng một lần, xuất bản mọi nơi! Tạo các trò chơi hoạt động liền mạch trên các nền tảng máy tính để bàn, di động và web.',
        'GDevelop Engine': 'Công Cụ GDevelop',
        'Master the powerful open-source game engine trusted by thousands of indie developers': 'Làm chủ công cụ game mã nguồn mở mạnh mẽ được hàng nghìn nhà phát triển indie tin tưởng',
        'Event-Based Logic': 'Logic Dựa Trên Sự Kiện',
        'Design game behavior with intuitive conditions and actions': 'Thiết kế hành vi game với các điều kiện và hành động trực quan',
        'Asset Management': 'Quản Lý Tài Nguyên',
        'Import and organize sprites, sounds, and animations for your games': 'Nhập và tổ chức sprite, âm thanh và hoạt hình cho game của bạn',
    },

    'vn/programs/roblox-world-creator.html': {
        'Build Amazing<br/><span style="color: #193b92;">Roblox</span> Worlds': 'Xây Dựng Thế Giới<br/><span style="color: #193b92;">Roblox</span> Tuyệt Vời',
        'Create immersive 3D games and worlds in Roblox! Learn Lua scripting, build engaging experiences, and even earn Robux from your creations.': 'Tạo game và thế giới 3D nhập vai trong Roblox! Học Lua scripting, xây dựng trải nghiệm hấp dẫn và thậm chí kiếm Robux từ sáng tạo của bạn.',
        'New Skills with <span style="color: #193b92;">Roblox</span>.<br/>\n          A Detailed Look at Our Curriculum': 'Kỹ Năng Mới Với <span style="color: #193b92;">Roblox</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học',
        '3D World Building': 'Xây Dựng Thế Giới 3D',
        'Master Roblox Studio\'s terrain tools, parts, and models to construct detailed 3D environments, from obstacle courses to entire cities.': 'Làm chủ các công cụ địa hình, bộ phận và mô hình của Roblox Studio để xây dựng môi trường 3D chi tiết, từ các khóa học chướng ngại vật đến toàn bộ thành phố.',
        'Lua Programming': 'Lập Trình Lua',
        'Learn real coding with Lua! Write scripts to add game mechanics, player interactions, leaderboards, and in-game purchases.': 'Học lập trình thực với Lua! Viết script để thêm cơ chế game, tương tác người chơi, bảng xếp hạng và mua hàng trong game.',
        'Monetization Skills': 'Kỹ Năng Kiếm Tiền',
        'Discover how to earn Robux through game passes, developer products, and engaging gameplay that keeps players coming back.': 'Khám phá cách kiếm Robux thông qua game pass, sản phẩm nhà phát triển và lối chơi hấp dẫn khiến người chơi quay lại.',
        'Community Publishing': 'Xuất Bản Cộng Đồng',
        'Publish your games to millions of Roblox players worldwide. Learn marketing strategies to grow your player base and earn revenue.': 'Xuất bản game của bạn cho hàng triệu người chơi Roblox trên toàn thế giới. Học chiến lược tiếp thị để phát triển cơ sở người chơi và kiếm doanh thu.',
        'Roblox Studio': 'Roblox Studio',
        'Professional 3D development platform used by top Roblox creators': 'Nền tảng phát triển 3D chuyên nghiệp được sử dụng bởi các nhà sáng tạo Roblox hàng đầu',
        'Lua Scripting': 'Lua Scripting',
        'Write real code to bring your games to life with advanced mechanics': 'Viết mã thực để mang game của bạn đến cuộc sống với cơ chế nâng cao',
        'Game Monetization': 'Kiếm Tiền Từ Game',
        'Learn to earn Robux and turn your passion into potential income': 'Học cách kiếm Robux và biến niềm đam mê của bạn thành thu nhập tiềm năng',
    },

    'vn/programs/3d-designer.html': {
        'Master Professional<br/><span style="color: #193b92;">3D Design</span>': 'Làm Chủ<br/><span style="color: #193b92;">Thiết Kế 3D</span> Chuyên Nghiệp',
        'Learn industry-standard 3D modeling with Blender! Create stunning characters, environments, and assets for games, films, and digital art.': 'Học mô hình hóa 3D tiêu chuẩn ngành với Blender! Tạo các nhân vật, môi trường và tài sản tuyệt đẹp cho game, phim và nghệ thuật kỹ thuật số.',
        'New Skills with <span style="color: #193b92;">3D Design</span>.<br/>\n          A Detailed Look at Our Curriculum': 'Kỹ Năng Mới Với <span style="color: #193b92;">Thiết Kế 3D</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học',
        '3D Modeling': 'Mô Hình Hóa 3D',
        'Master mesh modeling, sculpting, and topology to create detailed 3D models for games and animation.': 'Làm chủ mô hình lưới, điêu khắc và cấu trúc liên kết để tạo mô hình 3D chi tiết cho game và hoạt hình.',
        'Texturing & Materials': 'Texture & Vật Liệu',
        'Learn UV unwrapping, material creation, and procedural texturing to bring your models to life with realistic surfaces.': 'Học cách mở UV, tạo vật liệu và tạo texture theo thủ tục để mang mô hình của bạn đến cuộc sống với các bề mặt thực tế.',
        'Lighting & Rendering': 'Ánh Sáng & Kết Xuất',
        'Master lighting techniques and render settings to create stunning final images and animations of your work.': 'Làm chủ các kỹ thuật chiếu sáng và cài đặt kết xuất để tạo hình ảnh cuối cùng và hoạt hình tuyệt đẹp cho công việc của bạn.',
        'Animation Basics': 'Cơ Bản Hoạt Hình',
        'Learn keyframe animation, rigging, and basic character animation to make your creations move and come alive.': 'Học hoạt hình keyframe, rigging và hoạt hình nhân vật cơ bản để làm cho sáng tạo của bạn di chuyển và sống động.',
        'Blender Software': 'Phần Mềm Blender',
        'Industry-standard free 3D software used by professionals at Pixar and Netflix': 'Phần mềm 3D miễn phí tiêu chuẩn ngành được sử dụng bởi các chuyên gia tại Pixar và Netflix',
        'Digital Sculpting': 'Điêu Khắc Kỹ Thuật Số',
        'Create organic models and detailed characters with sculpting tools': 'Tạo các mô hình hữu cơ và nhân vật chi tiết với các công cụ điêu khắc',
        'PBR Materials': 'Vật Liệu PBR',
        'Design photorealistic materials using physically-based rendering': 'Thiết kế vật liệu photorealistic bằng cách sử dụng kết xuất dựa trên vật lý',
    },

    'vn/programs/ai-programming-quest.html': {
        'Code Real<br/><span style="color: #193b92;">AI & Python</span>': 'Lập Trình<br/><span style="color: #193b92;">AI & Python</span> Thực Tế',
        'Write professional code in Python and build intelligent applications! Learn AI fundamentals, data analysis, and automation—skills that power the future.': 'Viết mã chuyên nghiệp trong Python và xây dựng ứng dụng thông minh! Học các nguyên tắc cơ bản về AI, phân tích dữ liệu và tự động hóa—kỹ năng thúc đẩy tương lai.',
        'New Skills with <span style="color: #193b92;">Python & AI</span>.<br/>\n          A Detailed Look at Our Curriculum': 'Kỹ Năng Mới Với <span style="color: #193b92;">Python & AI</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học',
        'Python Programming': 'Lập Trình Python',
        'Learn Python from scratch! Master variables, loops, functions, and object-oriented programming—the foundation for all AI development.': 'Học Python từ đầu! Làm chủ biến, vòng lặp, hàm và lập trình hướng đối tượng—nền tảng cho tất cả phát triển AI.',
        'Machine Learning Basics': 'Cơ Bản Học Máy',
        'Build your first AI models! Train neural networks, create chatbots, and understand how machines learn from data.': 'Xây dựng mô hình AI đầu tiên của bạn! Huấn luyện mạng thần kinh, tạo chatbot và hiểu cách máy học từ dữ liệu.',
        'Data Analysis': 'Phân Tích Dữ Liệu',
        'Work with real datasets using pandas and NumPy. Visualize data, find patterns, and make data-driven decisions.': 'Làm việc với các bộ dữ liệu thực bằng pandas và NumPy. Hình dung dữ liệu, tìm mẫu và đưa ra quyết định dựa trên dữ liệu.',
        'Automation Projects': 'Dự Án Tự Động Hóa',
        'Build practical tools that solve real problems—from web scrapers to automated task schedulers and smart assistants.': 'Xây dựng các công cụ thực tế giải quyết vấn đề thực tế—từ web scraper đến bộ lập lịch tác vụ tự động và trợ lý thông minh.',
        'Python Language': 'Ngôn Ngữ Python',
        'The #1 programming language for AI, data science, and automation': 'Ngôn ngữ lập trình số 1 cho AI, khoa học dữ liệu và tự động hóa',
        'TensorFlow/PyTorch': 'TensorFlow/PyTorch',
        'Build and train neural networks with industry-standard AI frameworks': 'Xây dựng và huấn luyện mạng thần kinh với các framework AI tiêu chuẩn ngành',
        'Data Science Tools': 'Công Cụ Khoa Học Dữ Liệu',
        'Master pandas, NumPy, and matplotlib for data analysis and visualization': 'Làm chủ pandas, NumPy và matplotlib để phân tích và hình dung dữ liệu',
    },

    'vn/programs/generative-ai-magic.html': {
        'Unlock<br/><span style="color: #193b92;">Generative AI</span>': 'Mở Khóa<br/><span style="color: #193b92;">AI Tạo Sinh</span>',
        'Master the AI tools shaping our future! Learn to use ChatGPT, DALL-E, Midjourney, and more—while understanding ethics, bias, and responsible AI use.': 'Làm chủ các công cụ AI định hình tương lai của chúng ta! Học cách sử dụng ChatGPT, DALL-E, Midjourney và nhiều hơn nữa—trong khi hiểu về đạo đức, thiên vị và sử dụng AI có trách nhiệm.',
        'New Skills with <span style="color: #193b92;">AI Tools</span>.<br/>\n          A Detailed Look at Our Curriculum': 'Kỹ Năng Mới Với <span style="color: #193b92;">Công Cụ AI</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học',
        'Prompt Engineering': 'Kỹ Thuật Prompt',
        'Master the art of writing effective prompts to get exactly what you want from AI tools. Learn advanced techniques for text, image, and video generation.': 'Làm chủ nghệ thuật viết prompt hiệu quả để có được chính xác những gì bạn muốn từ các công cụ AI. Học các kỹ thuật nâng cao để tạo văn bản, hình ảnh và video.',
        'AI Image Creation': 'Tạo Hình Ảnh AI',
        'Create stunning artwork with DALL-E, Midjourney, and Stable Diffusion. Learn composition, style control, and how to iterate toward your vision.': 'Tạo tác phẩm nghệ thuật tuyệt đẹp với DALL-E, Midjourney và Stable Diffusion. Học cách sáng tác, kiểm soát phong cách và cách lặp lại hướng tới tầm nhìn của bạn.',
        'AI Ethics & Responsibility': 'Đạo Đức & Trách Nhiệm AI',
        'Understand bias, copyright, deepfakes, and the societal impact of AI. Learn to use these tools ethically and responsibly.': 'Hiểu về thiên vị, bản quyền, deepfake và tác động xã hội của AI. Học cách sử dụng các công cụ này một cách có đạo đức và trách nhiệm.',
        'Creative Workflows': 'Quy Trình Sáng Tạo',
        'Build complete projects combining multiple AI tools. Create marketing campaigns, stories, games, and multimedia experiences.': 'Xây dựng các dự án hoàn chỉnh kết hợp nhiều công cụ AI. Tạo các chiến dịch tiếp thị, câu chuyện, trò chơi và trải nghiệm đa phương tiện.',
        'ChatGPT & Claude': 'ChatGPT & Claude',
        'Master AI chatbots for writing, research, and problem-solving': 'Làm chủ chatbot AI để viết, nghiên cứu và giải quyết vấn đề',
        'DALL-E & Midjourney': 'DALL-E & Midjourney',
        'Create professional images and artwork with AI image generators': 'Tạo hình ảnh và tác phẩm nghệ thuật chuyên nghiệp với các công cụ tạo hình ảnh AI',
        'AI Ethics': 'Đạo Đức AI',
        'Understand responsible AI use, bias detection, and digital citizenship': 'Hiểu về sử dụng AI có trách nhiệm, phát hiện thiên vị và công dân kỹ thuật số',
    },

    'vn/programs/app-development.html': {
        'Build Real<br/><span style="color: #193b92;">Mobile Apps</span>': 'Xây Dựng<br/><span style="color: #193b92;">Ứng Dụng Di Động</span> Thực Tế',
        'Create professional apps people can download and use! Learn modern web development with HTML, CSS, JavaScript, and React Native to build for iOS and Android.': 'Tạo ứng dụng chuyên nghiệp mà mọi người có thể tải xuống và sử dụng! Học phát triển web hiện đại với HTML, CSS, JavaScript và React Native để xây dựng cho iOS và Android.',
        'New Skills with <span style="color: #193b92;">App Development</span>.<br/>\n          A Detailed Look at Our Curriculum': 'Kỹ Năng Mới Với <span style="color: #193b92;">Phát Triển Ứng Dụng</span>.<br/>\n          Cái Nhìn Chi Tiết Về Chương Trình Học',
        'Web Development Fundamentals': 'Cơ Bản Phát Triển Web',
        'Master HTML, CSS, and JavaScript—the building blocks of all modern apps and websites. Create responsive, beautiful interfaces.': 'Làm chủ HTML, CSS và JavaScript—các khối xây dựng của tất cả các ứng dụng và trang web hiện đại. Tạo giao diện đáp ứng, đẹp mắt.',
        'React & Modern Frameworks': 'React & Framework Hiện Đại',
        'Learn React, the most popular framework for building user interfaces. Understand components, state management, and hooks.': 'Học React, framework phổ biến nhất để xây dựng giao diện người dùng. Hiểu về các thành phần, quản lý trạng thái và hook.',
        'Mobile App Development': 'Phát Triển Ứng Dụng Di Động',
        'Build real mobile apps with React Native! Write once, run on both iOS and Android. Publish to app stores and reach millions.': 'Xây dựng ứng dụng di động thực với React Native! Viết một lần, chạy trên cả iOS và Android. Xuất bản lên cửa hàng ứng dụng và tiếp cận hàng triệu người.',
        'Backend & Databases': 'Backend & Cơ Sở Dữ Liệu',
        'Connect your apps to servers and databases. Learn Firebase, APIs, authentication, and cloud storage for full-stack development.': 'Kết nối ứng dụng của bạn với máy chủ và cơ sở dữ liệu. Học Firebase, API, xác thực và lưu trữ đám mây để phát triển full-stack.',
        'HTML/CSS/JavaScript': 'HTML/CSS/JavaScript',
        'Core web technologies that power every modern website and app': 'Các công nghệ web cốt lõi cung cấp năng lượng cho mọi trang web và ứng dụng hiện đại',
        'React & React Native': 'React & React Native',
        'Build web and mobile apps with the most popular JavaScript framework': 'Xây dựng ứng dụng web và di động với framework JavaScript phổ biến nhất',
        'Firebase & APIs': 'Firebase & API',
        'Connect to cloud services, databases, and third-party APIs': 'Kết nối với dịch vụ đám mây, cơ sở dữ liệu và API của bên thứ ba',
    },
}

# Translate all program files
print('Completing translations for VN program pages...\n')
success_count = 0
total_count = len(programs_complete_translations)

for file_path, translations in programs_complete_translations.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  Success - {len(translations)} translations applied')
    else:
        print(f'  Failed')

print(f'\nCompleted: {success_count}/{total_count} program pages fully translated')
