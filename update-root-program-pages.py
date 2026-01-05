import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def update_page(file_path):
    """Add settings icon to root program pages"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove old flag button switcher
        old_switcher_pattern = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button[^>]*data-lang[^>]*>🇬🇧</button>\s*<button[^>]*data-lang[^>]*>🇻🇳</button>\s*</div>\s*'

        # New desktop settings icon
        new_desktop_switcher = '''<div class="relative group">
            <button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition" aria-label="Language settings">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            <div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div class="p-2">
                <a href="../vn/index.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">
                  <span class="text-2xl">🇻🇳</span>
                  <span class="text-sm font-medium text-slate-700">Tiếng Việt</span>
                </a>
              </div>
            </div>
          </div>
          '''

        content = re.sub(old_switcher_pattern, new_desktop_switcher, content)

        # Add mobile switcher
        if 'id="mobile-menu"' in content and '<!-- Mobile Login Button -->' in content:
            mobile_lang_link = '''
          <!-- Language Switcher -->
          <a href="../vn/index.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition border border-slate-200">
            <span class="text-2xl">🇻🇳</span>
            <span class="font-medium text-slate-700">Chuyển sang Tiếng Việt</span>
          </a>

          '''
            mobile_login_pattern = r'(<!-- Mobile Login Button -->)'
            content = re.sub(mobile_login_pattern, mobile_lang_link + r'\1', content, count=1)

        # Add persistence script
        if 'tt-lang-manual' not in content:
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

print('=== UPDATING ROOT PROGRAM PAGES ===\n')

root_program_pages = [
    'programs/3d-designer.html',
    'programs/ai-programming-quest.html',
    'programs/app-development.html',
    'programs/gdevelop-game-designer.html',
    'programs/generative-ai-magic.html',
    'programs/roblox-world-creator.html',
    'programs/scratch-game-coder.html',
]

success = 0
for page in root_program_pages:
    if os.path.exists(page):
        print(f'Updating {page}...')
        if update_page(page):
            success += 1
            print(f'  ✓ Updated\n')

print(f'✅ Updated {success}/7 root program pages!')
