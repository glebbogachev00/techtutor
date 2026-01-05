import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def update_page_with_new_switcher(file_path, is_vn=False):
    """Replace old language switcher with new settings icon approach"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Determine the base path for links
        if 'vn/' in file_path:
            home_link = 'index.html'
            other_lang_home = '../en/index.html'
        else:
            home_link = 'index.html'
            other_lang_home = '../vn/index.html'

        # Remove old desktop language switcher (the flag buttons)
        # Pattern 1: VN version
        old_switcher_vn = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button[^>]*data-lang="en"[^>]*>🇬🇧</button>\s*<button[^>]*data-lang="vn"[^>]*>🇻🇳</button>\s*</div>\s*'

        # Pattern 2: EN version
        old_switcher_en = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button[^>]*data-lang="en"[^>]*>🇬🇧</button>\s*<button[^>]*data-lang="en"[^>]*>🇻🇳</button>\s*</div>\s*'

        # New desktop settings icon
        new_desktop_switcher = f'''<div class="relative group">
            <button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition" aria-label="Language settings">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            <div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div class="p-2">
                <a href="{'../en/index.html' if is_vn else '../vn/index.html'}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">
                  <span class="text-2xl">{'🇬🇧' if is_vn else '🇻🇳'}</span>
                  <span class="text-sm font-medium text-slate-700">{'English' if is_vn else 'Tiếng Việt'}</span>
                </a>
              </div>
            </div>
          </div>
          '''

        # Replace old switcher with new one
        content = re.sub(old_switcher_vn, new_desktop_switcher, content)
        content = re.sub(old_switcher_en, new_desktop_switcher, content)

        # Remove old mobile language switcher (inside mobile menu)
        old_mobile_switcher = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button[^>]*data-lang[^>]*>🇬🇧</button>\s*<button[^>]*data-lang[^>]*>🇻🇳</button>\s*</div>\s*'
        content = re.sub(old_mobile_switcher, '', content)

        # Add language switcher inside mobile menu (before login button)
        mobile_lang_link = f'''
          <!-- Language Switcher -->
          <a href="{'../en/index.html' if is_vn else '../vn/index.html'}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition border border-slate-200">
            <span class="text-2xl">{'🇬🇧' if is_vn else '🇻🇳'}</span>
            <span class="font-medium text-slate-700">{'Switch to English' if is_vn else 'Chuyển sang Tiếng Việt'}</span>
          </a>

          '''

        # Insert before mobile login button
        mobile_login_pattern = r'(<!-- Mobile Login Button -->)'
        content = re.sub(mobile_login_pattern, mobile_lang_link + r'\1', content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error updating {file_path}: {e}')
        return False

# Update all VN pages
print('=== UPDATING VN PAGES WITH NEW LANGUAGE SWITCHER ===\n')

vn_pages = [
    'vn/index.html',
    'vn/online-courses.html',
    'vn/student-projects.html',
    'vn/how-it-works.html',
    'vn/plans-and-faq.html',
    'vn/blog.html',
    'vn/free-trial.html',
    'vn/courses/generative-ai-course.html',
    'vn/blog-project-based-learning.html',
    'vn/blog-spot-nurture-tech-skill.html',
    'vn/blog-tech-like-playtime.html',
]

vn_success = 0
for page in vn_pages:
    if os.path.exists(page):
        print(f'Updating {page}...')
        if update_page_with_new_switcher(page, is_vn=True):
            vn_success += 1
            print(f'  ✓ Updated\n')
        else:
            print(f'  ✗ Failed\n')

print(f'✅ Updated {vn_success}/{len(vn_pages)} VN pages\n')

# Update all EN pages
print('=== UPDATING EN PAGES WITH NEW LANGUAGE SWITCHER ===\n')

en_pages = [
    'en/index.html',
    'online-courses.html',
    'student-projects.html',
    'how-it-works.html',
    'plans-and-faq.html',
    'blog.html',
    'free-trial.html',
]

en_success = 0
for page in en_pages:
    if os.path.exists(page):
        print(f'Updating {page}...')
        if update_page_with_new_switcher(page, is_vn=False):
            en_success += 1
            print(f'  ✓ Updated\n')
        else:
            print(f'  ✗ Failed\n')

print(f'✅ Updated {en_success}/{len(en_pages)} EN pages\n')

print('=' * 60)
print('LANGUAGE SWITCHER UPDATE COMPLETE!')
print('=' * 60)
print('\nChanges made:')
print('  • Removed old flag button switchers')
print('  • Added settings icon to desktop navigation')
print('  • Added language option inside mobile menu')
print('  • Links redirect to homepage of other language')
