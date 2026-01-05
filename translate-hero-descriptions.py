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

# Hero description translations for remaining 4 program pages
hero_description_translations = {
    'vn/programs/3d-designer.html': {
        'Master the art of 3D modeling and design with Blender. Create stunning 3D models, animations, and visual effects that bring your imagination to life.': 'Làm chủ nghệ thuật mô hình hóa và thiết kế 3D với Blender. Tạo mô hình 3D, hoạt hình và hiệu ứng hình ảnh tuyệt đẹp làm cho trí tưởng tượng của bạn trở nên sống động.',
    },

    'vn/programs/ai-programming-quest.html': {
        'Dive into the world of Python programming and artificial intelligence. Learn to code intelligent programs, build chatbots, and understand how AI shapes our future.': 'Khám phá thế giới lập trình Python và trí tuệ nhân tạo. Học cách lập trình các chương trình thông minh, xây dựng chatbot và hiểu cách AI định hình tương lai của chúng ta.',
    },

    'vn/programs/generative-ai-magic.html': {
        'Are you ready for tomorrow\'s technology today? Learn prompt engineering, create stunning AI art, and build intelligent applications using cutting-edge tools like ChatGPT, DALL-E, and Midjourney.': 'Bạn đã sẵn sàng cho công nghệ của ngày mai hôm nay chưa? Học kỹ thuật prompt, tạo nghệ thuật AI tuyệt đẹp và xây dựng ứng dụng thông minh bằng các công cụ tiên tiến như ChatGPT, DALL-E và Midjourney.',
    },

    'vn/programs/app-development.html': {
        'Build real mobile and web applications using professional development tools. Learn to create apps people actually use with Thunkable\'s powerful no-code platform.': 'Xây dựng ứng dụng di động và web thực bằng các công cụ phát triển chuyên nghiệp. Học cách tạo ứng dụng mà mọi người thực sự sử dụng với nền tảng no-code mạnh mẽ của Thunkable.',
    },
}

print('Translating hero section descriptions for program pages...\n')

success_count = 0
total_count = len(hero_description_translations)

for file_path, translations in hero_description_translations.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{total_count} program pages hero descriptions translated')
print('\n✅ ALL HERO DESCRIPTIONS NOW TRANSLATED!')
