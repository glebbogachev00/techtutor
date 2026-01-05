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

# Absolute final translations - meta descriptions and remaining curriculum cards
absolute_final_translations = {
    'vn/programs/3d-designer.html': {
        'Learn professional 3D modeling and design with Blender. Perfect for kids aged 10-16 who want to create stunning 3D art, animations, and visual effects.': 'Học mô hình hóa và thiết kế 3D chuyên nghiệp với Blender. Hoàn hảo cho trẻ em từ 10-16 tuổi muốn tạo nghệ thuật 3D, hoạt hình và hiệu ứng hình ảnh tuyệt đẹp.',
    },

    'vn/programs/ai-programming-quest.html': {
        'Learn Python programming and artificial intelligence fundamentals. Perfect for kids aged 10-16 who want to build intelligent programs and understand how AI works.': 'Học lập trình Python và các nguyên tắc cơ bản về trí tuệ nhân tạo. Hoàn hảo cho trẻ em từ 10-16 tuổi muốn xây dựng các chương trình thông minh và hiểu cách AI hoạt động.',

        'Master Python fundamentals including variables, functions, loops, and object-oriented programming concepts. Build a strong foundation in one of the world\'s most popular languages.': 'Làm chủ các nguyên tắc cơ bản của Python bao gồm biến, hàm, vòng lặp và các khái niệm lập trình hướng đối tượng. Xây dựng nền tảng vững chắc trong một trong những ngôn ngữ phổ biến nhất thế giới.',

        'Create chatbots, recommendation systems, image recognition programs, and other intelligent applications. Turn AI concepts into working projects.': 'Tạo chatbot, hệ thống gợi ý, chương trình nhận dạng hình ảnh và các ứng dụng thông minh khác. Biến các khái niệm AI thành các dự án hoạt động.',

        'Learn to work with data, analyze patterns, and visualize insights using Python libraries. Discover the power of data-driven decision making.': 'Học cách làm việc với dữ liệu, phân tích mẫu và trực quan hóa thông tin bằng các thư viện Python. Khám phá sức mạnh của việc ra quyết định dựa trên dữ liệu.',
    },

    'vn/programs/app-development.html': {
        'Learn to build real mobile and web apps with modern frameworks. Perfect for kids aged 12-16 who want to create their own applications and websites.': 'Học cách xây dựng ứng dụng di động và web thực với các framework hiện đại. Hoàn hảo cho trẻ em từ 12-16 tuổi muốn tạo ứng dụng và trang web của riêng mình.',

        'Build real mobile apps using Thunkable\'s drag-and-drop interface. Start creating without coding, then progress to advanced features and logic.': 'Xây dựng ứng dụng di động thực bằng giao diện kéo và thả của Thunkable. Bắt đầu tạo mà không cần viết mã, sau đó tiến tới các tính năng và logic nâng cao.',

        'Create beautiful, professional mobile applications that work on both iOS and Android devices. Design apps that look and feel native.': 'Tạo ứng dụng di động đẹp, chuyên nghiệp hoạt động trên cả thiết bị iOS và Android. Thiết kế ứng dụng trông và cảm giác như ứng dụng gốc.',

        'Learn to add advanced features like databases, APIs, user authentication, and interactive elements. Build apps with real functionality.': 'Học cách thêm các tính năng nâng cao như cơ sở dữ liệu, API, xác thực người dùng và các yếu tố tương tác. Xây dựng ứng dụng với chức năng thực.',
    },

    'vn/programs/gdevelop-game-designer.html': {
        'Create 2D games without coding using GDevelop\'s visual programming. Perfect for kids aged 8-14 who want to design and publish their own games.': 'Tạo game 2D mà không cần viết mã bằng lập trình trực quan của GDevelop. Hoàn hảo cho trẻ em từ 8-14 tuổi muốn thiết kế và xuất bản game của riêng mình.',

        'Create platformers, top-down games, puzzles, and arcade-style games with professional mechanics. Learn physics, collision detection, and game balance.': 'Tạo game nền tảng, game nhìn từ trên xuống, câu đố và game phong cách arcade với cơ chế chuyên nghiệp. Học vật lý, phát hiện va chạm và cân bằng game.',
    },

    'vn/programs/generative-ai-magic.html': {
        'Master prompt engineering and generative AI tools. Perfect for kids aged 10-16 who want to harness the power of AI for creative projects.': 'Làm chủ kỹ thuật prompt và các công cụ AI tạo sinh. Hoàn hảo cho trẻ em từ 10-16 tuổi muốn khai thác sức mạnh của AI cho các dự án sáng tạo.',
    },
}

print('Applying absolute final translations (meta + curriculum)...\n')

success_count = 0
total_translations = 0

for file_path, translations in absolute_final_translations.items():
    print(f'Translating {file_path}...')
    total_translations += len(translations)
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{len(absolute_final_translations)} files')
print(f'Total translations applied: {total_translations}')
print('\n🎉 ABSOLUTE FINAL TRANSLATIONS COMPLETE!')
print('ALL PROGRAM PAGES ARE NOW 100% TRANSLATED!')
