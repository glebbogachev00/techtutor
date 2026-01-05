import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_file(file_path, translations):
    """Apply translations to a file"""
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

# Complete translations for each program page
programs_missing_translations = {
    'vn/programs/roblox-world-creator.html': {
        # Meta description
        'Learn Roblox Studio and Lua programming to create immersive 3D worlds. Perfect for kids aged 9-15 who want to build multiplayer games.': 'Học Roblox Studio và lập trình Lua để tạo thế giới 3D nhập vai. Hoàn hảo cho trẻ em từ 9-15 tuổi muốn xây dựng trò chơi nhiều người chơi.',

        # Hero section
        'Create 3D Worlds<br/>with <span style="color: #193b92;">Roblox</span>': 'Tạo Thế Giới 3D<br/>với <span style="color: #193b92;">Roblox</span>',
        'Build immersive 3D worlds and multiplayer games using Roblox Studio and Lua programming. Create experiences that millions of players can enjoy!': 'Xây dựng thế giới 3D nhập vai và trò chơi nhiều người chơi bằng Roblox Studio và lập trình Lua. Tạo trải nghiệm mà hàng triệu người chơi có thể tận hưởng!',

        # Curriculum section
        'With real-world projects to create and online classes that fit a busy routine': 'Với các dự án thực tế để tạo và các lớp học trực tuyến phù hợp với lịch bận rộn',
        'Design and build complete 3D games from scratch, including obstacle courses, adventure maps, and multiplayer experiences that players around the world can enjoy.': 'Thiết kế và xây dựng trò chơi 3D hoàn chỉnh từ đầu, bao gồm các đường đua vượt chướng ngại vật, bản đồ phiêu lưu và trải nghiệm nhiều người chơi mà người chơi trên khắp thế giới có thể tận hưởng.',
        'Learn scripting fundamentals with Lua to add interactivity, game mechanics, and custom behaviors. Master professional programming concepts through game development.': 'Học các nguyên tắc cơ bản về scripting với Lua để thêm tương tác, cơ chế trò chơi và hành vi tùy chỉnh. Làm chủ các khái niệm lập trình chuyên nghiệp thông qua phát triển trò chơi.',
        'Master Roblox Studio\'s building tools to create stunning 3D environments, terrain, and objects. Bring your imagination to life in three dimensions.': 'Làm chủ các công cụ xây dựng của Roblox Studio để tạo môi trường 3D, địa hình và đối tượng tuyệt đẹp. Biến trí tưởng tượng của bạn thành hiện thực trong không gian ba chiều.',
        'Learn how to publish your games to the Roblox platform and share them with millions of players worldwide. Turn your creativity into reality!': 'Học cách xuất bản trò chơi của bạn lên nền tảng Roblox và chia sẻ với hàng triệu người chơi trên toàn thế giới. Biến sự sáng tạo của bạn thành hiện thực!',
    },

    'vn/programs/3d-designer.html': {
        # Meta description
        'Master 3D modeling and animation with Blender. Perfect for kids aged 10-16 who want to create professional 3D art and animations.': 'Làm chủ mô hình hóa và hoạt hình 3D với Blender. Hoàn hảo cho trẻ em từ 10-16 tuổi muốn tạo nghệ thuật và hoạt hình 3D chuyên nghiệp.',

        # Hero section
        'Master 3D Design<br/>with <span style="color: #193b92;">Blender</span>': 'Làm Chủ Thiết Kế 3D<br/>với <span style="color: #193b92;">Blender</span>',
        'Learn professional 3D modeling, texturing, and animation using Blender—the same free tool used by major studios. Create stunning art for games, movies, and more!': 'Học mô hình hóa, tạo texture và hoạt hình 3D chuyên nghiệp bằng Blender—cùng công cụ miễn phí được sử dụng bởi các studio lớn. Tạo nghệ thuật tuyệt đẹp cho trò chơi, phim và nhiều hơn nữa!',

        # Curriculum section
        'With real-world projects to create and online classes that fit a busy routine': 'Với các dự án thực tế để tạo và các lớp học trực tuyến phù hợp với lịch bận rộn',
        'Learn polygon modeling to create characters, props, and environments. Master the fundamentals of 3D geometry and topology for professional results.': 'Học mô hình hóa đa giác để tạo nhân vật, đạo cụ và môi trường. Làm chủ các nguyên tắc cơ bản về hình học 3D và cấu trúc liên kết cho kết quả chuyên nghiệp.',
        'Apply realistic materials, textures, and colors to your 3D models. Learn UV mapping and shader techniques used in professional game and film production.': 'Áp dụng vật liệu, texture và màu sắc thực tế cho các mô hình 3D của bạn. Học ánh xạ UV và kỹ thuật shader được sử dụng trong sản xuất game và phim chuyên nghiệp.',
        'Bring your creations to life with keyframe animation. Create character movements, object interactions, and cinematic sequences that tell a story.': 'Làm cho sáng tạo của bạn sống động với hoạt hình khung hình chính. Tạo chuyển động nhân vật, tương tác đối tượng và chuỗi điện ảnh kể câu chuyện.',
        'Create photorealistic images and animations using Blender\'s powerful rendering engine. Learn lighting, camera angles, and post-processing for professional output.': 'Tạo hình ảnh và hoạt hình chân thực bằng công cụ kết xuất mạnh mẽ của Blender. Học ánh sáng, góc máy và hậu kỳ cho đầu ra chuyên nghiệp.',
    },

    'vn/programs/ai-programming-quest.html': {
        # Meta description
        'Learn Python programming and AI fundamentals. Perfect for kids aged 10-16 who want to build real applications with artificial intelligence.': 'Học lập trình Python và các nguyên tắc cơ bản về AI. Hoàn hảo cho trẻ em từ 10-16 tuổi muốn xây dựng ứng dụng thực với trí tuệ nhân tạo.',

        # Hero section
        'Code AI & Python<br/><span style="color: #193b92;">Applications</span>': 'Lập Trình AI & Python<br/><span style="color: #193b92;">Ứng Dụng</span>',
        'Write real Python code and build AI-powered applications. Create chatbots, recommendation systems, and machine learning projects that actually work!': 'Viết mã Python thực và xây dựng ứng dụng được hỗ trợ bởi AI. Tạo chatbot, hệ thống gợi ý và các dự án học máy thực sự hoạt động!',

        # Curriculum section
        'With real-world projects to create and online classes that fit a busy routine': 'Với các dự án thực tế để tạo và các lớp học trực tuyến phù hợp với lịch bận rộn',
        'Learn Python syntax, variables, loops, and functions. Build real programs from day one using the world\'s most popular programming language.': 'Học cú pháp Python, biến, vòng lặp và hàm. Xây dựng các chương trình thực từ ngày đầu tiên bằng ngôn ngữ lập trình phổ biến nhất thế giới.',
        'Understand how AI and machine learning work. Train simple models to recognize patterns, make predictions, and solve real-world problems.': 'Hiểu cách AI và học máy hoạt động. Huấn luyện các mô hình đơn giản để nhận dạng mẫu, đưa ra dự đoán và giải quyết các vấn đề thực tế.',
        'Build chatbots that understand natural language, recommendation engines like Netflix uses, and other AI applications you use every day.': 'Xây dựng chatbot hiểu ngôn ngữ tự nhiên, công cụ gợi ý như Netflix sử dụng và các ứng dụng AI khác mà bạn sử dụng hàng ngày.',
        'Work with real datasets to analyze information, create visualizations, and extract meaningful insights—skills used in data science careers.': 'Làm việc với các bộ dữ liệu thực để phân tích thông tin, tạo hình ảnh trực quan và trích xuất thông tin có ý nghĩa—kỹ năng được sử dụng trong sự nghiệp khoa học dữ liệu.',
    },

    'vn/programs/generative-ai-magic.html': {
        # Meta description
        'Explore generative AI tools and learn responsible AI usage. Perfect for kids aged 10-16 who want to create with ChatGPT, DALL-E, and more.': 'Khám phá các công cụ AI tạo sinh và học cách sử dụng AI có trách nhiệm. Hoàn hảo cho trẻ em từ 10-16 tuổi muốn sáng tạo với ChatGPT, DALL-E và nhiều hơn nữa.',

        # Hero section
        'Create with<br/><span style="color: #193b92;">AI Tools</span>': 'Sáng Tạo Với<br/><span style="color: #193b92;">Công Cụ AI</span>',
        'Master generative AI tools like ChatGPT, DALL-E, and Midjourney. Learn prompt engineering, AI ethics, and how to use AI responsibly and creatively!': 'Làm chủ các công cụ AI tạo sinh như ChatGPT, DALL-E và Midjourney. Học kỹ thuật prompt, đạo đức AI và cách sử dụng AI một cách có trách nhiệm và sáng tạo!',

        # Curriculum section
        'With real-world projects to create and online classes that fit a busy routine': 'Với các dự án thực tế để tạo và các lớp học trực tuyến phù hợp với lịch bận rộn',
        'Master the art of writing effective prompts to get the best results from AI. Learn techniques professionals use to create amazing content.': 'Làm chủ nghệ thuật viết các prompt hiệu quả để có kết quả tốt nhất từ AI. Học các kỹ thuật mà các chuyên gia sử dụng để tạo nội dung tuyệt vời.',
        'Create stunning images, art, and designs using DALL-E, Midjourney, and Stable Diffusion. Learn composition, style, and artistic direction.': 'Tạo hình ảnh, nghệ thuật và thiết kế tuyệt đẹp bằng DALL-E, Midjourney và Stable Diffusion. Học cách sắp xếp, phong cách và định hướng nghệ thuật.',
        'Use ChatGPT and other AI tools to write stories, scripts, articles, and creative content. Learn how to guide AI to match your voice and vision.': 'Sử dụng ChatGPT và các công cụ AI khác để viết câu chuyện, kịch bản, bài báo và nội dung sáng tạo. Học cách hướng dẫn AI để phù hợp với giọng điệu và tầm nhìn của bạn.',
        'Understand AI limitations, bias, privacy, and responsible usage. Learn to use AI as a tool while maintaining critical thinking and creativity.': 'Hiểu giới hạn của AI, thiên vị, quyền riêng tư và sử dụng có trách nhiệm. Học cách sử dụng AI như một công cụ trong khi duy trì tư duy phản biện và sự sáng tạo.',
    },

    'vn/programs/app-development.html': {
        # Meta description
        'Build real mobile and web applications with modern frameworks. Perfect for kids aged 12-16 who want to create apps they can publish and share.': 'Xây dựng ứng dụng di động và web thực với các framework hiện đại. Hoàn hảo cho trẻ em từ 12-16 tuổi muốn tạo ứng dụng mà họ có thể xuất bản và chia sẻ.',

        # Hero section
        'Build Real<br/><span style="color: #193b92;">Web & Mobile Apps</span>': 'Xây Dựng<br/><span style="color: #193b92;">Ứng Dụng Web & Di Động</span> Thực Tế',
        'Create professional apps that people can actually use! Learn HTML, CSS, JavaScript, and modern frameworks to build websites and mobile applications.': 'Tạo ứng dụng chuyên nghiệp mà mọi người thực sự có thể sử dụng! Học HTML, CSS, JavaScript và các framework hiện đại để xây dựng trang web và ứng dụng di động.',

        # Curriculum section
        'With real-world projects to create and online classes that fit a busy routine': 'Với các dự án thực tế để tạo và các lớp học trực tuyến phù hợp với lịch bận rộn',
        'Master HTML structure, CSS styling, and JavaScript interactivity. Build beautiful, responsive websites that work on all devices from scratch.': 'Làm chủ cấu trúc HTML, phong cách CSS và tương tác JavaScript. Xây dựng trang web đẹp, đáp ứng hoạt động trên mọi thiết bị từ đầu.',
        'Learn React, the most popular framework used by Facebook, Netflix, and Airbnb. Build modern, fast, and interactive user interfaces.': 'Học React, framework phổ biến nhất được sử dụng bởi Facebook, Netflix và Airbnb. Xây dựng giao diện người dùng hiện đại, nhanh chóng và tương tác.',
        'Create mobile apps that work on both iPhone and Android using React Native. Build one app that runs everywhere!': 'Tạo ứng dụng di động hoạt động trên cả iPhone và Android bằng React Native. Xây dựng một ứng dụng chạy ở khắp mọi nơi!',
        'Connect your apps to databases and APIs. Learn to store user data, handle authentication, and build full-stack applications.': 'Kết nối ứng dụng của bạn với cơ sở dữ liệu và API. Học cách lưu trữ dữ liệu người dùng, xử lý xác thực và xây dựng ứng dụng full-stack.',
    }
}

print('Completing missing translations for program pages...\n')

success_count = 0
total_count = len(programs_missing_translations)

for file_path, translations in programs_missing_translations.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{total_count} program pages fully translated')
