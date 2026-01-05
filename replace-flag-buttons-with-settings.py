import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def replace_flag_buttons(file_path):
    """Replace old flag button language switchers with settings icon"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Determine correct path to vn/index.html based on file location
        if '/programs/' in file_path:
            vn_path = '../../vn/index.html'
        else:
            vn_path = '../vn/index.html'

        # Settings icon HTML for desktop
        desktop_settings = f'''<div class="relative group">
            <button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition" aria-label="Language settings">
              <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            <div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div class="p-2">
                <a href="{vn_path}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">
                  <span class="text-2xl">🇻🇳</span>
                  <span class="text-sm font-medium text-slate-700">Tiếng Việt</span>
                </a>
              </div>
            </div>
          </div>'''

        # Pattern to match old flag buttons in desktop nav
        desktop_flag_pattern = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button type="button" data-lang="en"[^>]*>🇬🇧</button>\s*<button type="button" data-lang="vi"[^>]*>🇻🇳</button>\s*</div>'

        # Replace desktop flag buttons
        if re.search(desktop_flag_pattern, content):
            content = re.sub(desktop_flag_pattern, desktop_settings, content)

        # Pattern to match old flag buttons in mobile nav
        mobile_flag_pattern = r'<div class="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">\s*<button type="button" data-lang="en"[^>]*>🇬🇧</button>\s*<button type="button" data-lang="vi"[^>]*>🇻🇳</button>\s*</div>'

        # Replace mobile flag buttons (same pattern, just checking again for mobile section)
        if re.search(mobile_flag_pattern, content):
            content = re.sub(mobile_flag_pattern, desktop_settings, content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {file_path}: {e}')
        return False

print('=== REPLACING FLAG BUTTONS WITH SETTINGS ICON ===\n')

# Get all EN pages
en_files = glob.glob('en/**/*.html', recursive=True) + glob.glob('en/*.html')

updated = 0

for file_path in sorted(en_files):
    if os.path.exists(file_path):
        result = replace_flag_buttons(file_path)
        if result:
            updated += 1
            print(f'✓ Updated: {file_path}')

print(f'\n{"=" * 60}')
print(f'✅ Replaced flag buttons in {updated} EN pages')
print('=' * 60)
