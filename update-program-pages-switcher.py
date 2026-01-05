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

        # Remove old desktop language switcher
        old_switcher_pattern = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button[^>]*data-lang[^>]*>🇬🇧</button>\s*<button[^>]*data-lang[^>]*>🇻🇳</button>\s*</div>\s*'

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
                <a href="{'../../en/index.html' if is_vn else '../../vn/index.html'}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">
                  <span class="text-2xl">{'🇬🇧' if is_vn else '🇻🇳'}</span>
                  <span class="text-sm font-medium text-slate-700">{'English' if is_vn else 'Tiếng Việt'}</span>
                </a>
              </div>
            </div>
          </div>
          '''

        content = re.sub(old_switcher_pattern, new_desktop_switcher, content)

        # Remove old mobile switcher
        content = re.sub(old_switcher_pattern, '', content)

        # Add mobile language switcher
        mobile_lang_link = f'''
          <!-- Language Switcher -->
          <a href="{'../../en/index.html' if is_vn else '../../vn/index.html'}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition border border-slate-200">
            <span class="text-2xl">{'🇬🇧' if is_vn else '🇻🇳'}</span>
            <span class="font-medium text-slate-700">{'Switch to English' if is_vn else 'Chuyển sang Tiếng Việt'}</span>
          </a>

          '''

        mobile_login_pattern = r'(<!-- Mobile Login Button -->)'
        content = re.sub(mobile_login_pattern, mobile_lang_link + r'\1', content)

        # Add persistence script if not present
        if 'tt-lang-manual' not in content or 'localStorage.setItem' not in content:
            lang_script = '''
  <!-- Language selection persistence -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const langSwitchers = document.querySelectorAll('a[href*="/index.html"]');
      langSwitchers.forEach(link => {
        if (link.href.includes('/en/index.html') || link.href.includes('/vn/index.html')) {
          link.addEventListener('click', function(e) {
            const isEnglish = this.href.includes('/en/');
            const lang = isEnglish ? 'en' : 'vn';
            localStorage.setItem('tt-lang-manual', lang);
          });
        }
      });
    });
  </script>
</body>'''
            content = content.replace('</body>', lang_script)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== UPDATING PROGRAM PAGES ===\n')

vn_program_pages = [
    'vn/programs/scratch-game-coder.html',
    'vn/programs/gdevelop-game-designer.html',
    'vn/programs/roblox-world-creator.html',
    'vn/programs/3d-designer.html',
    'vn/programs/ai-programming-quest.html',
    'vn/programs/generative-ai-magic.html',
    'vn/programs/app-development.html',
]

success = 0
for page in vn_program_pages:
    if os.path.exists(page):
        print(f'Updating {page}...')
        if update_page_with_new_switcher(page, is_vn=True):
            success += 1
            print(f'  ✓ Updated\n')
        else:
            print(f'  ✗ Failed\n')

print(f'✅ Updated {success}/{len(vn_program_pages)} program pages!')
