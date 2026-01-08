import os
import sys
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def standardize_redirect(file_path, target_path):
    """Convert any redirect page to standard noindex redirect format"""

    redirect_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url={target_path}">
  <link rel="canonical" href="https://techtutor.academy/{target_path}">
  <title>Redirecting...</title>
  <script>window.location.replace("{target_path}");</script>
</head>
<body>
  <p>Redirecting to <a href="{target_path}">{target_path}</a>...</p>
</body>
</html>
'''

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(redirect_content)

    print(f'✓ Standardized: {file_path} → {target_path}')

# Pages that need to be standardized
pages_to_fix = [
    ('free-trial.html', 'en/free-trial.html'),
    ('how-it-works.html', 'en/how-it-works.html'),
    ('online-courses.html', 'en/online-courses.html'),
    ('plans-and-faq.html', 'en/plans-and-faq.html'),
    ('student-projects.html', 'en/student-projects.html'),
    ('blog.html', 'en/blog.html'),
    ('blog-project-based-learning.html', 'en/blog-project-based-learning.html'),
    ('blog-spot-nurture-tech-skill.html', 'en/blog-spot-nurture-tech-skill.html'),
    ('blog-tech-like-playtime.html', 'en/blog-tech-like-playtime.html'),
]

print('='*70)
print('STANDARDIZING ALL ROOT REDIRECTS')
print('='*70)

fixed = 0
for root_file, target in pages_to_fix:
    if os.path.exists(root_file):
        standardize_redirect(root_file, target)
        fixed += 1

print(f'\n✅ Standardized {fixed} redirect pages')
print('='*70)
