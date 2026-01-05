import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def create_redirect_page(filename):
    """Create a simple redirect page from root to en/"""

    redirect_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting... | TechTutor Academy</title>
  <link rel="icon" type="image/png" href="images/robot-rocket.png">
  <link rel="canonical" href="https://techtutor.academy/en/{filename}" />

  <!-- Immediate redirect -->
  <script>
    window.location.replace('en/{filename}');
  </script>

  <meta http-equiv="refresh" content="0; url=en/{filename}">
</head>
<body>
  <p>Redirecting to <a href="en/{filename}">English version</a>...</p>
</body>
</html>
'''
    return redirect_html

print('=== CONVERTING ROOT PAGES TO REDIRECTS ===\n')

# Pages to convert to redirects (keep content in en/ folder)
pages_to_redirect = [
    'blog.html',
    'blog-project-based-learning.html',
    'blog-spot-nurture-tech-skill.html',
    'blog-tech-like-playtime.html',
    'free-trial.html',
    'how-it-works.html',
    'online-courses.html',
    'plans-and-faq.html',
    'student-projects.html',
]

converted = 0

for page in pages_to_redirect:
    if os.path.exists(page):
        with open(page, 'w', encoding='utf-8') as f:
            f.write(create_redirect_page(page))
        converted += 1
        print(f'✓ Converted {page} to redirect')

print(f'\n{"=" * 60}')
print(f'✅ Converted {converted} root pages to redirects')
print('Root pages now redirect to en/ folder')
print('=' * 60)
