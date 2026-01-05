import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_lang_persistence_script(file_path):
    """Add script to save language selection to localStorage"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if script already exists
        if 'tt-lang-manual' in content and 'localStorage.setItem' in content:
            return False  # Already has the script

        # Add script before </body> tag
        lang_script = '''
  <!-- Language selection persistence -->
  <script>
    // When user manually switches language, save their preference
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

        # Replace </body> with script + </body>
        content = content.replace('</body>', lang_script)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== ADDING LANGUAGE PERSISTENCE TO ALL PAGES ===\n')

all_pages = [
    # VN pages
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
    # EN pages
    'en/index.html',
    'online-courses.html',
    'student-projects.html',
    'how-it-works.html',
    'plans-and-faq.html',
    'blog.html',
    'free-trial.html',
]

success = 0
skipped = 0

for page in all_pages:
    if os.path.exists(page):
        if add_lang_persistence_script(page):
            print(f'✓ {page}')
            success += 1
        else:
            print(f'- {page} (already has script)')
            skipped += 1
    else:
        print(f'⚠ {page} (not found)')

print(f'\n✅ Added persistence script to {success} pages')
if skipped > 0:
    print(f'⏭ Skipped {skipped} pages (already configured)')

print('\n' + '=' * 60)
print('LANGUAGE PERSISTENCE COMPLETE!')
print('=' * 60)
print('\nHow it works:')
print('  1. User from Vietnam → Automatically sees VN version')
print('  2. User clicks settings icon → Switches to EN homepage')
print('  3. Selection saved in localStorage')
print('  4. Next visit → Remembers their manual choice')
print('  5. Clears on browser cache clear')
