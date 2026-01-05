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

# Curriculum section translations for all program pages
curriculum_translations = {
    'vn/programs/roblox-world-creator.html': {
        # Section heading
        'A Detailed Look at Our Curriculum': 'Cái Nhìn Chi Tiết Về Chương Trình Học Của Chúng Tôi',
        'With real-world AI projects and online classes that fit a busy routine': 'Với các dự án AI thực tế và các lớp học trực tuyến phù hợp với lịch bận rộn',

        # Card titles and descriptions
        'Complete Game Creation': 'Tạo Trò Chơi Hoàn Chỉnh',
        'Lua Scripting Mastery': 'Làm Chủ Scripting Lua',
        '3D Building & Design': 'Xây Dựng & Thiết Kế 3D',
        'Publishing & Sharing': 'Xuất Bản & Chia Sẻ',

        # What You'll Master section
        'Roblox Studio': 'Roblox Studio',
        'Professional 3D game development environment used by millions of creators worldwide': 'Môi trường phát triển trò chơi 3D chuyên nghiệp được hàng triệu nhà sáng tạo trên toàn thế giới sử dụng',
        'Lua Programming': 'Lập Trình Lua',
        'Game scripting language for creating interactive mechanics and custom gameplay': 'Ngôn ngữ scripting trò chơi để tạo cơ chế tương tác và lối chơi tùy chỉnh',
        '3D Game Design': 'Thiết Kế Trò Chơi 3D',
        'Build immersive environments, terrain, models, and multiplayer experiences': 'Xây dựng môi trường nhập vai, địa hình, mô hình và trải nghiệm nhiều người chơi',
    },

    'vn/programs/3d-designer.html': {
        # Section heading
        'A Detailed Look at Our Curriculum': 'Cái Nhìn Chi Tiết Về Chương Trình Học Của Chúng Tôi',

        # Card titles
        '3D Modeling': 'Mô Hình Hóa 3D',
        'Texturing & Materials': 'Texture & Vật Liệu',
        'Animation': 'Hoạt Hình',
        'Rendering': 'Kết Xuất',

        # What You'll Master section
        'Blender Software': 'Phần Mềm Blender',
        'Industry-standard 3D creation suite used by Pixar, Netflix, and major studios': 'Bộ công cụ tạo 3D tiêu chuẩn ngành được sử dụng bởi Pixar, Netflix và các studio lớn',
        'Modeling Techniques': 'Kỹ Thuật Mô Hình Hóa',
        'Polygon modeling, sculpting, and creating characters, props, and environments': 'Mô hình hóa đa giác, điêu khắc và tạo nhân vật, đạo cụ và môi trường',
        'Material & Lighting': 'Vật Liệu & Ánh Sáng',
        'Professional texturing, shading, and lighting for photorealistic renders': 'Tạo texture, tô bóng và chiếu sáng chuyên nghiệp cho kết xuất chân thực',
    },

    'vn/programs/ai-programming-quest.html': {
        # Section heading
        'A Detailed Look at Our Curriculum': 'Cái Nhìn Chi Tiết Về Chương Trình Học Của Chúng Tôi',

        # Card titles
        'Python Programming': 'Lập Trình Python',
        'Machine Learning Basics': 'Cơ Bản Học Máy',
        'AI Applications': 'Ứng Dụng AI',
        'Data Analysis': 'Phân Tích Dữ Liệu',

        # What You'll Master section
        'Python Language': 'Ngôn Ngữ Python',
        'The #1 programming language for AI, data science, and automation': 'Ngôn ngữ lập trình số 1 cho AI, khoa học dữ liệu và tự động hóa',
        'AI & ML Concepts': 'Khái Niệm AI & ML',
        'Neural networks, training models, pattern recognition, and predictions': 'Mạng nơ-ron, huấn luyện mô hình, nhận dạng mẫu và dự đoán',
        'Real Applications': 'Ứng Dụng Thực Tế',
        'Build chatbots, recommendation systems, and data-driven projects': 'Xây dựng chatbot, hệ thống gợi ý và các dự án dựa trên dữ liệu',
    },

    'vn/programs/generative-ai-magic.html': {
        # Section heading
        'A Detailed Look at Our Curriculum': 'Cái Nhìn Chi Tiết Về Chương Trình Học Của Chúng Tôi',

        # Card titles
        'Master Prompt Engineering': 'Làm Chủ Kỹ Thuật Prompt',
        'Learn to communicate effectively with AI tools. Master the art of crafting prompts that generate exactly what you envision, whether it\'s text, images, or code.': 'Học cách giao tiếp hiệu quả với các công cụ AI. Làm chủ nghệ thuật tạo prompt để tạo ra chính xác những gì bạn hình dung, dù đó là văn bản, hình ảnh hay mã.',

        'Create Stunning AI Art': 'Tạo Nghệ Thuật AI Tuyệt Đẹp',
        'Use DALL-E, Midjourney, and Stable Diffusion to create professional artwork, designs, and visual content. Turn your imagination into reality with AI.': 'Sử dụng DALL-E, Midjourney và Stable Diffusion để tạo tác phẩm nghệ thuật, thiết kế và nội dung trực quan chuyên nghiệp. Biến trí tưởng tượng của bạn thành hiện thực với AI.',

        'Build AI-Powered Apps': 'Xây Dựng Ứng Dụng Được Hỗ Trợ Bởi AI',
        'Create applications that use AI APIs for text generation, image creation, and intelligent automation. Build real projects that solve real problems.': 'Tạo ứng dụng sử dụng API AI để tạo văn bản, tạo hình ảnh và tự động hóa thông minh. Xây dựng các dự án thực giải quyết các vấn đề thực.',

        'Responsible AI Use': 'Sử Dụng AI Có Trách Nhiệm',
        'Understand AI ethics, limitations, and best practices. Learn to use AI responsibly and creatively in real-world scenarios for the future job market.': 'Hiểu đạo đức AI, giới hạn và thực hành tốt nhất. Học cách sử dụng AI một cách có trách nhiệm và sáng tạo trong các tình huống thực tế cho thị trường việc làm tương lai.',

        # What You'll Master section
        'ChatGPT & LLMs': 'ChatGPT & LLMs',
        'Large language models, conversational AI, and advanced prompting techniques': 'Mô hình ngôn ngữ lớn, AI đàm thoại và kỹ thuật prompt nâng cao',

        'AI Image Generation': 'Tạo Hình Ảnh AI',
        'DALL-E, Midjourney, Stable Diffusion, and professional AI art workflows': 'DALL-E, Midjourney, Stable Diffusion và quy trình nghệ thuật AI chuyên nghiệp',

        'API Integration': 'Tích Hợp API',
        'Build apps powered by AI services and integrate multiple AI tools': 'Xây dựng ứng dụng được hỗ trợ bởi các dịch vụ AI và tích hợp nhiều công cụ AI',
    },

    'vn/programs/app-development.html': {
        # Section heading
        'A Detailed Look at Our Curriculum': 'Cái Nhìn Chi Tiết Về Chương Trình Học Của Chúng Tôi',

        # Card titles
        'Web Development Fundamentals': 'Cơ Bản Phát Triển Web',
        'React & Modern Frameworks': 'React & Framework Hiện Đại',
        'Mobile App Development': 'Phát Triển Ứng Dụng Di Động',
        'Backend & Databases': 'Backend & Cơ Sở Dữ Liệu',

        # What You'll Master section
        'HTML, CSS, JavaScript': 'HTML, CSS, JavaScript',
        'Core web technologies to build beautiful, responsive, and interactive websites': 'Công nghệ web cốt lõi để xây dựng trang web đẹp, đáp ứng và tương tác',
        'React Framework': 'Framework React',
        'Modern component-based development used by Facebook, Instagram, and Netflix': 'Phát triển dựa trên thành phần hiện đại được sử dụng bởi Facebook, Instagram và Netflix',
        'Full-Stack Skills': 'Kỹ Năng Full-Stack',
        'Frontend, backend, databases, APIs, and deployment for complete applications': 'Frontend, backend, cơ sở dữ liệu, API và triển khai cho các ứng dụng hoàn chỉnh',
    },
}

print('Translating curriculum sections for all program pages...\n')

success_count = 0
total_count = len(curriculum_translations)

for file_path, translations in curriculum_translations.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{total_count} program pages curriculum sections translated')
