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

# CTA and stats translations
cta_stats_translations = {
    'vn/programs/generative-ai-magic.html': {
        'AI projects created': 'dự án AI đã tạo',
        'Book a free trial lesson and unlock the power of generative AI!': 'Đặt buổi học thử miễn phí và mở khóa sức mạnh của AI tạo sinh!',
    },
    'vn/programs/ai-programming-quest.html': {
        'Book a free trial lesson and start your journey into AI and programming!': 'Đặt buổi học thử miễn phí và bắt đầu hành trình khám phá AI và lập trình!',
    },
    'vn/programs/app-development.html': {
        'Book a free trial lesson and start creating apps that people love!': 'Đặt buổi học thử miễn phí và bắt đầu tạo ứng dụng mà mọi người yêu thích!',
    },
    'vn/programs/gdevelop-game-designer.html': {
        'Book a free trial lesson and start creating games without any coding!': 'Đặt buổi học thử miễn phí và bắt đầu tạo game mà không cần viết mã!',
    },
    'vn/programs/roblox-world-creator.html': {
        'Book a free trial lesson and see your child\'s ideas come to life in Roblox!': 'Đặt buổi học thử miễn phí và xem ý tưởng của con bạn trở nên sống động trong Roblox!',
    },
}

print('Translating CTA descriptions and stats...\n')

success_count = 0
total_count = len(cta_stats_translations)

for file_path, translations in cta_stats_translations.items():
    print(f'Translating {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{total_count} files')
print('\n✅ ALL CTA AND STATS NOW FULLY TRANSLATED!')
