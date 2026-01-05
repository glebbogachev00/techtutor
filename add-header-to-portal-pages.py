import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_minimal_header(file_path):
    """Add minimal header with logo and settings icon to portal pages"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if already has header
        if '<header' in content:
            print(f'  - Already has header, skipping')
            return False

        # Determine if VN or EN
        is_vn = file_path.startswith('vn/')
        target_home = '../en/index.html' if is_vn else '../vn/index.html'
        target_flag = '🇬🇧' if is_vn else '🇻🇳'
        target_label = 'English' if is_vn else 'Tiếng Việt'

        # Minimal header HTML
        minimal_header = f'''<body>
  <!-- Minimal Header with Language Switcher -->
  <header class="absolute top-0 left-0 right-0 z-50 py-4 px-6">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <a href="index.html" class="text-2xl font-black tracking-tight flex items-center gap-1" aria-label="TechTutor home">
        <span class="text-white">Tech</span><span class="text-teal-300">Tutor</span>
      </a>

      <div class="relative group">
        <button class="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition" aria-label="Language settings">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
        <div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
          <div class="p-2">
            <a href="{target_home}" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">
              <span class="text-2xl">{target_flag}</span>
              <span class="text-sm font-medium text-slate-700">{target_label}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>

  <body>'''

        # Replace <body> tag with header
        content = re.sub(r'<body>', minimal_header, content, count=1)

        # Add language persistence script before </body>
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
        print(f'Error processing {file_path}: {e}')
        return False

print('=== ADDING MINIMAL HEADER TO PORTAL PAGES ===\n')

portal_pages = [
    'en/login.html',
    'en/admin-portal.html',
    'en/student-portal.html',
    'vn/login.html',
    'vn/admin-portal.html',
    'vn/student-portal.html',
]

success = 0

for page in portal_pages:
    if os.path.exists(page):
        print(f'Processing {page}...')
        result = add_minimal_header(page)
        if result:
            success += 1
            print(f'  ✓ Added minimal header\n')
    else:
        print(f'  ✗ File not found\n')

print('=' * 60)
print(f'✅ Added minimal header to {success} portal pages')
print('=' * 60)
