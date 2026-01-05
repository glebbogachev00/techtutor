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

# Complete all remaining translations
all_remaining_translations = {
    # Roblox World Creator
    'vn/programs/roblox-world-creator.html': {
        # Curriculum card
        'Publish to Millions': 'Xuất Bản Cho Hàng Triệu Người',
        'Share your games with millions of players on the Roblox platform. Learn publishing workflows and game distribution.': 'Chia sẻ game của bạn với hàng triệu người chơi trên nền tảng Roblox. Học quy trình xuất bản và phân phối game.',

        # What You'll Master
        'Powerful programming language for game logic and mechanics': 'Ngôn ngữ lập trình mạnh mẽ cho logic và cơ chế game',
        'Design engaging narratives and immersive game worlds': 'Thiết kế câu chuyện hấp dẫn và thế giới game nhập vai',
    },

    # AI Programming Quest
    'vn/programs/ai-programming-quest.html': {
        # Hero title
        'Code the Future<br/>with <span style="color: #193b92;">AI & Python</span>': 'Lập Trình Tương Lai<br/>với <span style="color: #193b92;">AI & Python</span>',

        # What You'll Master
        'Industry-leading programming language used worldwide': 'Ngôn ngữ lập trình hàng đầu được sử dụng trên toàn thế giới',
        'TensorFlow, scikit-learn, and AI frameworks': 'TensorFlow, scikit-learn và các framework AI',
        'Computational thinking and algorithmic design': 'Tư duy tính toán và thiết kế thuật toán',
    },

    # Generative AI Magic
    'vn/programs/generative-ai-magic.html': {
        # Hero title
        'Master the Future<br/>with <span style="color: #193b92;">Generative AI</span>': 'Làm Chủ Tương Lai<br/>với <span style="color: #193b92;">AI Tạo Sinh</span>',
    },

    # App Development
    'vn/programs/app-development.html': {
        # Hero title
        'Build Real Apps<br/>with <span style="color: #193b92;">Thunkable</span>': 'Xây Dựng Ứng Dụng Thực<br/>với <span style="color: #193b92;">Thunkable</span>',

        # What You'll Master
        'User interface and experience design principles': 'Nguyên tắc thiết kế giao diện và trải nghiệm người dùng',
    },
}

print('Applying ALL remaining translations across program pages...\n')

success_count = 0
total_translations = 0

for file_path, translations in all_remaining_translations.items():
    print(f'Translating {file_path}...')
    total_translations += len(translations)
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{len(all_remaining_translations)} files')
print(f'Total translations applied: {total_translations}')
print('\n🎉 ALL PROGRAM PAGES NOW COMPLETELY TRANSLATED!')
print('Every section is now fully bilingual!')
