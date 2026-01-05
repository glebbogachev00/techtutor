import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def update_page_with_settings_icon(file_path):
    """Replace old language switcher with new settings icon approach"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Determine if this is VN or EN page
        is_vn = file_path.startswith('vn/')

        # Determine correct path based on file location
        if file_path.startswith('en/') or file_path.startswith('vn/'):
            # Files directly in en/ or vn/ folder
            vn_home = '../vn/index.html'
            en_home = '../en/index.html'
        else:
            # Root level files
            vn_home = 'vn/index.html'
            en_home = 'en/index.html'

        # Remove old desktop language switcher (flag buttons)
        old_desktop_pattern = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button[^>]*data-lang="en"[^>]*>🇬🇧</button>\s*<button[^>]*data-lang="vn"[^>]*>🇻🇳</button>\s*</div>\s*'

        # New desktop settings icon
        target_lang_home = en_home if is_vn else vn_home
        target_flag = '🇬🇧' if is_vn else '🇻🇳'
        target_label = 'English' if is_vn else 'Tiếng Việt'

        new_desktop_switcher = f'''<div class="relative group">
            <button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition" aria-label="Language settings">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            <div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div class="p-2">
                <a href="{target_lang_home}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">
                  <span class="text-2xl">{target_flag}</span>
                  <span class="text-sm font-medium text-slate-700">{target_label}</span>
                </a>
              </div>
            </div>
          </div>
          '''

        content = re.sub(old_desktop_pattern, new_desktop_switcher, content)

        # Remove old mobile language switcher (flag buttons in mobile section)
        old_mobile_pattern = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button[^>]*data-lang="en"[^>]*>🇬🇧</button>\s*<button[^>]*data-lang="vn"[^>]*>🇻🇳</button>\s*</div>\s*'
        content = re.sub(old_mobile_pattern, '', content)

        # Add persistence script if not present
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

        # Check if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== UPDATING ALL MISSING PAGES WITH SETTINGS ICON ===\n')

pages_to_update = [
    'en/admin-portal.html',
    'en/login.html',
    'en/student-portal.html',
    'en/vision.html',
    'vn/admin-portal.html',
    'vn/login.html',
    'vn/student-portal.html',
    'vn/vision.html',
]

success = 0
no_change = 0
not_found = 0

for page in pages_to_update:
    if os.path.exists(page):
        print(f'Updating {page}...')
        result = update_page_with_settings_icon(page)
        if result:
            success += 1
            print(f'  ✓ Updated with settings icon\n')
        else:
            no_change += 1
            print(f'  - No changes needed\n')
    else:
        not_found += 1
        print(f'  ✗ File not found\n')

print('=' * 60)
print(f'✅ Updated {success} pages with settings icon')
if no_change > 0:
    print(f'ℹ️  {no_change} pages already had settings icon')
if not_found > 0:
    print(f'⚠️  {not_found} pages not found')
print('=' * 60)
