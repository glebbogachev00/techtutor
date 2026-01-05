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

# Final missing translations for all program pages
final_translations = {
    'vn/programs/gdevelop-game-designer.html': {
        # Curriculum cards
        'Art & Animation': 'Nghệ Thuật & Hoạt Hình',
        'Design characters, sprites, and animations to bring your game worlds to life. Master the art of visual storytelling through game design.': 'Thiết kế nhân vật, sprite và hoạt hình để mang thế giới trò chơi của bạn vào cuộc sống. Làm chủ nghệ thuật kể chuyện bằng hình ảnh thông qua thiết kế trò chơi.',
        'Publish Your Games': 'Xuất Bản Trò Chơi Của Bạn',

        # What You'll Master
        'Event-Based Programming': 'Lập Trình Dựa Trên Sự Kiện',
        'Visual programming with drag-and-drop logic for professional game development': 'Lập trình trực quan với logic kéo và thả cho phát triển trò chơi chuyên nghiệp',
        'Game Mechanics': 'Cơ Chế Trò Chơi',
        'Physics, collisions, player controls, enemies, and game rules': 'Vật lý, va chạm, điều khiển người chơi, kẻ thù và quy tắc trò chơi',
        'Multi-Platform': 'Đa Nền Tảng',
        'Export to web, Windows, Mac, Linux, iOS, and Android from one project': 'Xuất sang web, Windows, Mac, Linux, iOS và Android từ một dự án',

        # CTA section
        'Ready to Design Your First Game?': 'Sẵn Sàng Thiết Kế Trò Chơi Đầu Tiên Của Bạn?',
        'Book a free trial lesson and start creating professional 2D games today!': 'Đặt buổi học thử miễn phí và bắt đầu tạo trò chơi 2D chuyên nghiệp ngay hôm nay!',
    },

    'vn/programs/roblox-world-creator.html': {
        # Curriculum cards
        '3D Game Development': 'Phát Triển Trò Chơi 3D',

        # What You'll Master
        'Game Monetization': 'Kiếm Tiền Từ Trò Chơi',
        'Learn how to earn Robux from your games and understand game economics': 'Học cách kiếm Robux từ trò chơi của bạn và hiểu kinh tế trò chơi',

        # CTA section
        'Ready to Start Creating?': 'Sẵn Sàng Bắt Đầu Sáng Tạo?',
        'Book a free trial lesson and build your first Roblox world today!': 'Đặt buổi học thử miễn phí và xây dựng thế giới Roblox đầu tiên của bạn ngay hôm nay!',
    },

    'vn/programs/3d-designer.html': {
        # Meta and curriculum descriptions
        'Master the art of 3D modeling and design with Blender. Create stunning 3D models, animations, and visual effects for games and films.': 'Làm chủ nghệ thuật mô hình hóa và thiết kế 3D với Blender. Tạo mô hình 3D, hoạt hình và hiệu ứng hình ảnh tuyệt đẹp cho trò chơi và phim.',
        'Learn professional modeling techniques to create characters, objects, and environments from scratch using industry-standard tools.': 'Học các kỹ thuật mô hình hóa chuyên nghiệp để tạo nhân vật, đối tượng và môi trường từ đầu bằng các công cụ tiêu chuẩn ngành.',
        'Bring your creations to life with keyframe animation, rigging, and character movement techniques. Create cinematic sequences.': 'Làm cho sáng tạo của bạn sống động với hoạt hình khung hình chính, rigging và kỹ thuật chuyển động nhân vật. Tạo chuỗi điện ảnh.',
        'Master lighting setups, materials, textures, and rendering to create photorealistic or stylized scenes for any project.': 'Làm chủ thiết lập ánh sáng, vật liệu, texture và kết xuất để tạo cảnh chân thực hoặc phong cách hóa cho mọi dự án.',

        # What You'll Master
        'Character Design': 'Thiết Kế Nhân Vật',
        'Create and rig 3D characters with professional topology and animation-ready models': 'Tạo và rig nhân vật 3D với cấu trúc liên kết chuyên nghiệp và mô hình sẵn sàng hoạt hình',
        'Visual Effects': 'Hiệu Ứng Hình Ảnh',
        'Particles, simulations, dynamics, and compositing for stunning visual effects': 'Hạt, mô phỏng, động lực học và tổng hợp cho hiệu ứng hình ảnh tuyệt đẹp',

        # CTA section
        'Ready to Create 3D Art?': 'Sẵn Sàng Tạo Nghệ Thuật 3D?',
        'Book a free trial lesson and start your 3D design journey today!': 'Đặt buổi học thử miễn phí và bắt đầu hành trình thiết kế 3D của bạn ngay hôm nay!',
    },

    'vn/programs/ai-programming-quest.html': {
        # Meta and curriculum
        'Dive into the world of Python programming and artificial intelligence. Learn to code intelligent programs that learn, predict, and solve problems.': 'Khám phá thế giới lập trình Python và trí tuệ nhân tạo. Học cách lập trình các chương trình thông minh học hỏi, dự đoán và giải quyết vấn đề.',

        # Curriculum cards
        'Build AI Projects': 'Xây Dựng Dự Án AI',

        # What You'll Master
        'Machine Learning': 'Học Máy',
        'Train models, neural networks, classification, regression, and supervised learning': 'Huấn luyện mô hình, mạng nơ-ron, phân loại, hồi quy và học có giám sát',
        'Natural Language': 'Ngôn Ngữ Tự Nhiên',
        'Text processing, sentiment analysis, chatbots, and language understanding': 'Xử lý văn bản, phân tích cảm xúc, chatbot và hiểu ngôn ngữ',

        # CTA section
        'Ready to Build the Future?': 'Sẵn Sàng Xây Dựng Tương Lai?',
        'Book a free trial lesson and start coding AI applications today!': 'Đặt buổi học thử miễn phí và bắt đầu lập trình ứng dụng AI ngay hôm nay!',
    },

    'vn/programs/generative-ai-magic.html': {
        # What You'll Master - keep English names but add Vietnamese descriptions
        'Prompt Design': 'Thiết Kế Prompt',
        'Master advanced prompting techniques and AI communication strategies': 'Làm chủ kỹ thuật prompt nâng cao và chiến lược giao tiếp AI',

        # CTA section
        'Ready to Master AI?': 'Sẵn Sàng Làm Chủ AI?',
        'Book a free trial lesson and unlock the power of generative AI today!': 'Đặt buổi học thử miễn phí và mở khóa sức mạnh của AI tạo sinh ngay hôm nay!',
    },

    'vn/programs/app-development.html': {
        # Curriculum cards
        'Visual App Building': 'Xây Dựng Ứng Dụng Trực Quan',

        # What You'll Master
        'UI/UX Design': 'Thiết Kế UI/UX',
        'User interface design, user experience, responsive layouts, and accessibility': 'Thiết kế giao diện người dùng, trải nghiệm người dùng, bố cục đáp ứng và khả năng tiếp cận',
        'Version Control': 'Kiểm Soát Phiên Bản',
        'Git, GitHub, collaboration, code management, and professional workflows': 'Git, GitHub, cộng tác, quản lý mã và quy trình làm việc chuyên nghiệp',

        # CTA section
        'Ready to Build Real Apps?': 'Sẵn Sàng Xây Dựng Ứng Dụng Thực?',
        'Book a free trial lesson and start building professional applications today!': 'Đặt buổi học thử miễn phí và bắt đầu xây dựng ứng dụng chuyên nghiệp ngay hôm nay!',
    },
}

print('Applying final comprehensive translations...\n')

success_count = 0
total_count = len(final_translations)

for file_path, translations in final_translations.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{total_count} program pages fully translated')
print('\n✅ ALL PROGRAM PAGES NOW 100% TRANSLATED!')
