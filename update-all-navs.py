import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Define the directories to update
directories = [
    'en',
    'vn'
]

# English navigation update
en_desktop_old = '''              <div class="flex flex-col gap-1 text-sm">
                <a href="programs/scratch-game-coder.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Scratch Game Coder</a>
                <a href="programs/gdevelop-game-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">GDevelop Game Designer</a>
                <a href="programs/roblox-world-creator.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Roblox World Creator</a>
                <a href="programs/3d-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">3D Designer</a>
                <a href="programs/ai-programming-quest.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">AI & Programming Quest</a>
                <a href="programs/generative-ai-magic.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Generative AI Magic</a>
                <a href="programs/app-development.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">App Development</a>
              </div>'''

en_desktop_new = '''              <div class="flex flex-col gap-1 text-sm">
                <a href="programs/scratch-game-coder.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Scratch Game Coder</a>
                <a href="programs/gdevelop-game-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">GDevelop Game Designer</a>
                <a href="programs/roblox-world-creator.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Roblox World Creator</a>
                <a href="programs/3d-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">3D Designer</a>
                <a href="programs/ai-programming-quest.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">AI & Programming Quest</a>
                <a href="programs/generative-ai-magic.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Generative AI Magic</a>
                <a href="programs/app-development.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">App Development</a>
                <a href="programs/startup-foundations.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Startup Foundations</a>
              </div>'''

en_mobile_old = '''            <div id="mobile-programs-menu" class="mt-3 hidden flex flex-col gap-3 border-l-2 border-primary pl-4 text-sm">
              <a href="programs/scratch-game-coder.html" class="text-slate-700 hover:text-primary py-1">Scratch Game Coder</a>
              <a href="programs/gdevelop-game-designer.html" class="text-slate-700 hover:text-primary py-1">GDevelop Game Designer</a>
              <a href="programs/roblox-world-creator.html" class="text-slate-700 hover:text-primary py-1">Roblox World Creator</a>
              <a href="programs/3d-designer.html" class="text-slate-700 hover:text-primary py-1">3D Designer</a>
              <a href="programs/ai-programming-quest.html" class="text-slate-700 hover:text-primary py-1">AI & Programming Quest</a>
              <a href="programs/generative-ai-magic.html" class="text-slate-700 hover:text-primary py-1">Generative AI Magic</a>
              <a href="programs/app-development.html" class="text-slate-700 hover:text-primary py-1">App Development</a>
            </div>'''

en_mobile_new = '''            <div id="mobile-programs-menu" class="mt-3 hidden flex flex-col gap-3 border-l-2 border-primary pl-4 text-sm">
              <a href="programs/scratch-game-coder.html" class="text-slate-700 hover:text-primary py-1">Scratch Game Coder</a>
              <a href="programs/gdevelop-game-designer.html" class="text-slate-700 hover:text-primary py-1">GDevelop Game Designer</a>
              <a href="programs/roblox-world-creator.html" class="text-slate-700 hover:text-primary py-1">Roblox World Creator</a>
              <a href="programs/3d-designer.html" class="text-slate-700 hover:text-primary py-1">3D Designer</a>
              <a href="programs/ai-programming-quest.html" class="text-slate-700 hover:text-primary py-1">AI & Programming Quest</a>
              <a href="programs/generative-ai-magic.html" class="text-slate-700 hover:text-primary py-1">Generative AI Magic</a>
              <a href="programs/app-development.html" class="text-slate-700 hover:text-primary py-1">App Development</a>
              <a href="programs/startup-foundations.html" class="text-slate-700 hover:text-primary py-1">Startup Foundations</a>
            </div>'''

# Vietnamese navigation update
vn_desktop_old = '''              <div class="flex flex-col gap-1 text-sm">
                <a href="programs/scratch-game-coder.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Lập Trình Game Scratch</a>
                <a href="programs/gdevelop-game-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Thiết Kế Game GDevelop</a>
                <a href="programs/roblox-world-creator.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Sáng Tạo Thế Giới Roblox</a>
                <a href="programs/3d-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Thiết Kế 3D</a>
                <a href="programs/ai-programming-quest.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Khám Phá AI & Lập Trình</a>
                <a href="programs/generative-ai-magic.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Phép Thuật AI Tạo Sinh</a>
                <a href="programs/app-development.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Phát Triển Ứng Dụng</a>
              </div>'''

vn_desktop_new = '''              <div class="flex flex-col gap-1 text-sm">
                <a href="programs/scratch-game-coder.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Lập Trình Game Scratch</a>
                <a href="programs/gdevelop-game-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Thiết Kế Game GDevelop</a>
                <a href="programs/roblox-world-creator.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Sáng Tạo Thế Giới Roblox</a>
                <a href="programs/3d-designer.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Thiết Kế 3D</a>
                <a href="programs/ai-programming-quest.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Khám Phá AI & Lập Trình</a>
                <a href="programs/generative-ai-magic.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Phép Thuật AI Tạo Sinh</a>
                <a href="programs/app-development.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Phát Triển Ứng Dụng</a>
                <a href="programs/startup-foundations.html" class="px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100">Nền Tảng Khởi Nghiệp</a>
              </div>'''

vn_mobile_old = '''            <div id="mobile-programs-menu" class="mt-3 hidden flex flex-col gap-3 border-l-2 border-primary pl-4 text-sm">
              <a href="programs/scratch-game-coder.html" class="text-slate-700 hover:text-primary py-1">Lập Trình Game Scratch</a>
              <a href="programs/gdevelop-game-designer.html" class="text-slate-700 hover:text-primary py-1">Thiết Kế Game GDevelop</a>
              <a href="programs/roblox-world-creator.html" class="text-slate-700 hover:text-primary py-1">Sáng Tạo Thế Giới Roblox</a>
              <a href="programs/3d-designer.html" class="text-slate-700 hover:text-primary py-1">Thiết Kế 3D</a>
              <a href="programs/ai-programming-quest.html" class="text-slate-700 hover:text-primary py-1">Khám Phá AI & Lập Trình</a>
              <a href="programs/generative-ai-magic.html" class="text-slate-700 hover:text-primary py-1">Phép Thuật AI Tạo Sinh</a>
              <a href="programs/app-development.html" class="text-slate-700 hover:text-primary py-1">Phát Triển Ứng Dụng</a>
            </div>'''

vn_mobile_new = '''            <div id="mobile-programs-menu" class="mt-3 hidden flex flex-col gap-3 border-l-2 border-primary pl-4 text-sm">
              <a href="programs/scratch-game-coder.html" class="text-slate-700 hover:text-primary py-1">Lập Trình Game Scratch</a>
              <a href="programs/gdevelop-game-designer.html" class="text-slate-700 hover:text-primary py-1">Thiết Kế Game GDevelop</a>
              <a href="programs/roblox-world-creator.html" class="text-slate-700 hover:text-primary py-1">Sáng Tạo Thế Giới Roblox</a>
              <a href="programs/3d-designer.html" class="text-slate-700 hover:text-primary py-1">Thiết Kế 3D</a>
              <a href="programs/ai-programming-quest.html" class="text-slate-700 hover:text-primary py-1">Khám Phá AI & Lập Trình</a>
              <a href="programs/generative-ai-magic.html" class="text-slate-700 hover:text-primary py-1">Phép Thuật AI Tạo Sinh</a>
              <a href="programs/app-development.html" class="text-slate-700 hover:text-primary py-1">Phát Triển Ứng Dụng</a>
              <a href="programs/startup-foundations.html" class="text-slate-700 hover:text-primary py-1">Nền Tảng Khởi Nghiệp</a>
            </div>'''

def update_file(filepath, is_vietnamese=False):
    """Update navigation in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        updated = False

        if is_vietnamese:
            # Update Vietnamese navigation
            if vn_desktop_old in content:
                content = content.replace(vn_desktop_old, vn_desktop_new)
                updated = True
            if vn_mobile_old in content:
                content = content.replace(vn_mobile_old, vn_mobile_new)
                updated = True
        else:
            # Update English navigation
            if en_desktop_old in content:
                content = content.replace(en_desktop_old, en_desktop_new)
                updated = True
            if en_mobile_old in content:
                content = content.replace(en_mobile_old, en_mobile_new)
                updated = True

        if updated and content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error updating {filepath}: {e}')
        return False

def main():
    updated_files = []

    for lang in ['en', 'vn']:
        is_vietnamese = (lang == 'vn')
        lang_dir = lang

        # Update all HTML files in the directory and subdirectories
        for root, dirs, files in os.walk(lang_dir):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    if update_file(filepath, is_vietnamese):
                        updated_files.append(filepath)
                        print(f'✓ Updated: {filepath}')

    print(f'\n✅ Updated {len(updated_files)} files total')
    if updated_files:
        print('\nUpdated files:')
        for f in updated_files:
            print(f'  - {f}')

if __name__ == '__main__':
    main()
