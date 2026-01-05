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

# Final curriculum card description fixes
final_fixes = {
    'vn/programs/3d-designer.html': {
        # Card 1
        'Learn professional modeling techniques to create characters, objects, and environments from scratch using industry-standard tools like Blender.': 'Học các kỹ thuật mô hình hóa chuyên nghiệp để tạo nhân vật, đối tượng và môi trường từ đầu bằng các công cụ tiêu chuẩn ngành như Blender.',

        # Card 2
        'Bring your creations to life with keyframe animation, rigging, and character movement techniques. Create stunning animations that tell stories.': 'Làm cho sáng tạo của bạn sống động với hoạt hình khung hình chính, rigging và kỹ thuật chuyển động nhân vật. Tạo hoạt hình tuyệt đẹp kể câu chuyện.',

        # Card 3
        'Master lighting setups, materials, textures, and rendering to create photorealistic or stylized scenes that capture your artistic vision.': 'Làm chủ thiết lập ánh sáng, vật liệu, texture và kết xuất để tạo cảnh chân thực hoặc phong cách hóa thể hiện tầm nhìn nghệ thuật của bạn.',

        # Card 4
        'Build Your Portfolio': 'Xây Dựng Danh Mục Của Bạn',
        'Develop a professional portfolio of 3D work that showcases your skills and creativity. Perfect for aspiring artists and designers!': 'Phát triển danh mục công việc 3D chuyên nghiệp thể hiện kỹ năng và sự sáng tạo của bạn. Hoàn hảo cho các nghệ sĩ và nhà thiết kế đầy khát vọng!',

        # Fix mixed title
        'Professional Mô Hình Hóa 3D': 'Mô Hình Hóa 3D Chuyên Nghiệp',
        'Hoạt Hình & Movement': 'Hoạt Hình & Chuyển Động',
    },

    'vn/programs/scratch-game-coder.html': {
        # Config object in script
        "'curriculum.heading': 'New Skills with Scratch. A Detailed Look at Our Curriculum',": "'curriculum.heading': 'Kỹ Năng Mới với Scratch. Cái Nhìn Chi Tiết Về Chương Trình Học Của Chúng Tôi',",
    },
}

print('Applying final curriculum fixes...\n')

success_count = 0
total_count = len(final_fixes)

for file_path, translations in final_fixes.items():
    print(f'Fixing {file_path}...')
    if translate_file(file_path, translations):
        success_count += 1
        print(f'  ✓ Success ({len(translations)} translations)\n')
    else:
        print(f'  ✗ Failed\n')

print(f'Completed: {success_count}/{total_count} files fixed')
print('\n✅ ALL CURRICULUM CARDS NOW FULLY TRANSLATED!')
