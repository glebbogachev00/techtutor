import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_course_to_english(file_path):
    """Translate the generative AI course page to English"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Change lang attribute
        content = re.sub(r'<html lang="vi"', r'<html lang="en"', content)

        # Translate title and meta description
        content = re.sub(
            r'<title>Nền Tảng AI Tạo Sinh \| TechTutor Academy</title>',
            r'<title>Generative AI Foundations | TechTutor Academy</title>',
            content
        )
        content = re.sub(
            r'<meta name="description" content="Khóa học tương tác về Nền Tảng AI Tạo Sinh với video bài học, mô tả và câu đố\." />',
            r'<meta name="description" content="Interactive course on Generative AI Foundations with lesson videos, descriptions and quizzes." />',
            content
        )

        # Fix language switcher - change to link to VN version
        content = re.sub(
            r'<a href="\.\.\/\.\.\/en/index\.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">\s*<span class="text-2xl">🇬🇧</span>\s*<span class="text-sm font-medium text-slate-700">English</span>',
            r'<a href="../../vn/courses/generative-ai-course.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">\n                  <span class="text-2xl">🇻🇳</span>\n                  <span class="text-sm font-medium text-slate-700">Tiếng Việt</span>',
            content
        )

        # Fix navigation links - change from ../login.html to ../../login.html
        content = re.sub(r'href="\.\./login\.html"', r'href="../../login.html"', content)
        content = re.sub(r'href="\.\./free-trial\.html"', r'href="../../free-trial.html"', content)

        # Translate navigation and content
        translations = {
            'Đăng Nhập': 'Login',
            'Dùng Thử Miễn Phí': 'Free Trial',
            'Khóa Học': 'Courses',
            'Nền Tảng AI Tạo Sinh': 'Generative AI Foundations',
            'Khám phá thế giới AI tạo sinh qua các bài học tương tác với video hướng dẫn chi tiết, mô tả và câu đố kiểm tra kiến thức\.': 'Explore the world of generative AI through interactive lessons with detailed video guides, descriptions and knowledge quizzes.',
            'Bắt Đầu Học': 'Start Learning',
            'Giới Thiệu Khóa Học': 'Course Introduction',
            'Khóa học này giúp bạn hiểu về các khái niệm cơ bản và ứng dụng của AI tạo sinh trong đời sống và công việc\.': 'This course helps you understand the basic concepts and applications of generative AI in life and work.',
            'Bạn Sẽ Học Được Gì': 'What You Will Learn',
            'Hiểu về AI tạo sinh là gì và cách hoạt động': 'Understand what generative AI is and how it works',
            'Khám phá các công cụ AI tạo sinh phổ biến': 'Discover popular generative AI tools',
            'Ứng dụng AI vào các tình huống thực tế': 'Apply AI to real-world situations',
            'Phát triển tư duy sáng tạo với AI': 'Develop creative thinking with AI',
            'Các Bài Học': 'Lessons',
            'Bài ': 'Lesson ',
            'Giới Thiệu Về AI Tạo Sinh': 'Introduction to Generative AI',
            'Tìm hiểu AI tạo sinh là gì, cách hoạt động và vai trò trong cuộc sống\.': 'Learn what generative AI is, how it works and its role in life.',
            'Các Công Cụ AI Tạo Sinh Phổ Biến': 'Popular Generative AI Tools',
            'Khám phá các công cụ như ChatGPT, DALL-E, và Midjourney\.': 'Discover tools like ChatGPT, DALL-E, and Midjourney.',
            'Ứng Dụng AI Trong Học Tập': 'AI Applications in Learning',
            'Học cách sử dụng AI để hỗ trợ học tập hiệu quả hơn\.': 'Learn how to use AI to support more effective learning.',
            'Tạo Nội Dung Với AI': 'Creating Content With AI',
            'Thực hành tạo văn bản, hình ảnh và nội dung sáng tạo khác\.': 'Practice creating text, images and other creative content.',
            'Xem Bài Học': 'View Lesson',
            'Đăng Ký Ngay': 'Enroll Now',
            'Sẵn Sàng Bắt Đầu Hành Trình Với AI?': 'Ready to Start Your AI Journey?',
            'Tham gia khóa học để khám phá sức mạnh của AI tạo sinh và phát triển kỹ năng tương lai\.': 'Join the course to discover the power of generative AI and develop future skills.',
            'Liên Hệ': 'Contact',
            'Về Chúng Tôi': 'About Us',
            'Chương Trình': 'Programs',
            'Dự Án': 'Projects',
            'Blog': 'Blog',
            'Hỗ Trợ': 'Support',
            'Câu Hỏi Thường Gặp': 'FAQ',
            'Chính Sách Bảo Mật': 'Privacy Policy',
            'Điều Khoản Dịch Vụ': 'Terms of Service',
        }

        for vn, en in translations.items():
            content = re.sub(vn, en, content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True

    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== TRANSLATING EN COURSE PAGE ===\n')

file_path = 'en/courses/generative-ai-course.html'
if os.path.exists(file_path):
    result = translate_course_to_english(file_path)
    if result:
        print(f'✓ Translated: {file_path}')
        print('✓ Fixed language switcher to link to VN version')
        print('✓ Fixed navigation links')
    else:
        print(f'✗ Failed to translate')
else:
    print(f'✗ File not found: {file_path}')

print('\n' + '='*60)
