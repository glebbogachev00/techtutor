#!/usr/bin/env python3
"""
Update all HTML files in /en and /vn directories
- Fix asset paths (images, js, css)
- Update internal navigation links
- Add hreflang tags
- Apply Vietnamese translations to /vn files
"""

import os
import re
import json
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Vietnamese translations from translations.js
TRANSLATIONS_VI = {
    'nav.programs': 'Chương Trình',
    'nav.projects': 'Dự Án',
    'nav.how-it-works': 'Quy Trình',
    'nav.free-courses': 'Khóa Học Miễn Phí',
    'nav.pricing': 'Giá Cả',
    'nav.blog': 'Blog',
    'nav.free-trial': 'Dùng Thử Miễn Phí',
}

def update_paths_for_root_file(file_path, lang):
    """Update paths for files in /en or /vn root directory"""
    print(f"Processing {lang}/{file_path.name}...")

    content = file_path.read_text(encoding='utf-8')

    # Update image paths: images/ -> ../images/
    content = re.sub(r'src="images/', 'src="../images/', content)
    content = re.sub(r'href="images/', 'href="../images/', content)

    # Update CSS paths: css/ -> ../css/
    content = re.sub(r'href="css/', 'href="../css/', content)

    # Update JS paths at end of file: js/ -> ../js/
    content = re.sub(r'src="js/', 'src="../js/', content)

    # Update the translations.js reference to lang-switcher.js
    content = content.replace('src="../js/translations.js"', 'src="../js/lang-switcher.js"')

    # Update internal navigation links
    link_updates = [
        (r'href="index\.html"', f'href="/{lang}/"'),
        (r'href="index\.html#', f'href="/{lang}/#'),
        (r'href="free-trial\.html"', f'href="/{lang}/free-trial.html"'),
        (r'href="how-it-works\.html"', f'href="/{lang}/how-it-works.html"'),
        (r'href="blog\.html"', f'href="/{lang}/blog.html"'),
        (r'href="plans-and-faq\.html"', f'href="/{lang}/plans-and-faq.html"'),
        (r'href="student-projects\.html"', f'href="/{lang}/student-projects.html"'),
        (r'href="online-courses\.html"', f'href="/{lang}/online-courses.html"'),
        (r'href="login\.html"', f'href="/{lang}/login.html"'),
        (r'href="student-portal\.html"', f'href="/{lang}/student-portal.html"'),
        (r'href="admin-portal\.html"', f'href="/{lang}/admin-portal.html"'),
        (r'href="vision\.html"', f'href="/{lang}/vision.html"'),
        (r'href="programs/scratch-game-coder\.html"', f'href="/{lang}/programs/scratch-game-coder.html"'),
        (r'href="programs/gdevelop-game-designer\.html"', f'href="/{lang}/programs/gdevelop-game-designer.html"'),
        (r'href="programs/roblox-world-creator\.html"', f'href="/{lang}/programs/roblox-world-creator.html"'),
        (r'href="programs/3d-designer\.html"', f'href="/{lang}/programs/3d-designer.html"'),
        (r'href="programs/ai-programming-quest\.html"', f'href="/{lang}/programs/ai-programming-quest.html"'),
        (r'href="programs/generative-ai-magic\.html"', f'href="/{lang}/programs/generative-ai-magic.html"'),
        (r'href="programs/app-development\.html"', f'href="/{lang}/programs/app-development.html"'),
        (r'href="blog-tech-like-playtime\.html"', f'href="/{lang}/blog-tech-like-playtime.html"'),
        (r'href="blog-spot-nurture-tech-skill\.html"', f'href="/{lang}/blog-spot-nurture-tech-skill.html"'),
        (r'href="blog-project-based-learning\.html"', f'href="/{lang}/blog-project-based-learning.html"'),
    ]

    for pattern, replacement in link_updates:
        content = re.sub(pattern, replacement, content)

    # Add hreflang tags if not present
    if 'hreflang' not in content:
        hreflang_tags = f'''
  <!-- SEO: Hreflang tags for multilingual support -->
  <link rel="alternate" hreflang="en" href="https://techtutor.academy/en/{file_path.name}" />
  <link rel="alternate" hreflang="vi" href="https://techtutor.academy/vn/{file_path.name}" />
  <link rel="alternate" hreflang="x-default" href="https://techtutor.academy/en/{file_path.name}" />
  <link rel="canonical" href="https://techtutor.academy/{lang}/{file_path.name}" />
'''
        # Insert before </head>
        content = content.replace('</head>', hreflang_tags + '</head>')

    # Update lang attribute
    if lang == 'vn':
        content = re.sub(r'<html[^>]*lang="en"', '<html lang="vi"', content)

    file_path.write_text(content, encoding='utf-8')
    print(f"[OK] Updated {lang}/{file_path.name}")


def update_paths_for_programs_file(file_path, lang):
    """Update paths for files in /en/programs or /vn/programs directory"""
    print(f"Processing {lang}/programs/{file_path.name}...")

    content = file_path.read_text(encoding='utf-8')

    # Update image paths: images/ -> ../../images/
    content = re.sub(r'src="\.\.\/images/', 'src="../../images/', content)
    content = re.sub(r'href="\.\.\/images/', 'href="../../images/', content)
    content = re.sub(r'src="images/', 'src="../../images/', content)
    content = re.sub(r'href="images/', 'href="../../images/', content)

    # Update CSS paths: css/ -> ../../css/
    content = re.sub(r'href="\.\.\/css/', 'href="../../css/', content)
    content = re.sub(r'href="css/', 'href="../../css/', content)

    # Update JS paths: js/ -> ../../js/
    content = re.sub(r'src="\.\.\/js/', 'src="../../js/', content)
    content = re.sub(r'src="js/', 'src="../../js/', content)

    # Update the translations.js reference to lang-switcher.js
    content = content.replace('src="../../js/translations.js"', 'src="../../js/lang-switcher.js"')
    content = content.replace('src="../js/translations.js"', 'src="../../js/lang-switcher.js"')

    # Update back navigation links
    content = re.sub(r'href="\.\.\/index\.html"', f'href="/{lang}/"', content)
    content = re.sub(r'href="index\.html"', f'href="/{lang}/"', content)

    # Add hreflang tags
    if 'hreflang' not in content:
        hreflang_tags = f'''
  <!-- SEO: Hreflang tags for multilingual support -->
  <link rel="alternate" hreflang="en" href="https://techtutor.academy/en/programs/{file_path.name}" />
  <link rel="alternate" hreflang="vi" href="https://techtutor.academy/vn/programs/{file_path.name}" />
  <link rel="alternate" hreflang="x-default" href="https://techtutor.academy/en/programs/{file_path.name}" />
  <link rel="canonical" href="https://techtutor.academy/{lang}/programs/{file_path.name}" />
'''
        content = content.replace('</head>', hreflang_tags + '</head>')

    # Update lang attribute
    if lang == 'vn':
        content = re.sub(r'<html[^>]*lang="en"', '<html lang="vi"', content)

    file_path.write_text(content, encoding='utf-8')
    print(f"[OK] Updated {lang}/programs/{file_path.name}")


def apply_vietnamese_translations(file_path):
    """Apply Vietnamese translations to VN version files"""
    content = file_path.read_text(encoding='utf-8')

    # Replace data-i18n content with Vietnamese translations
    # This is a simple implementation - you may need to expand based on your needs

    # Simple text replacements for common elements
    replacements = {
        'Programs': 'Chương Trình',
        'Projects': 'Dự Án',
        'How It Works': 'Quy Trình',
        'Free Courses': 'Khóa Học Miễn Phí',
        'Pricing': 'Giá Cả',
        'Free Trial': 'Dùng Thử Miễn Phí',
        'Login': 'Đăng Nhập',
        'Best Tech Education<br/>in the World': 'Giáo Dục Công Nghệ<br/>Tốt Nhất Thế Giới',
        'Get Started': 'Bắt Đầu',
        'Years of experience': 'Năm kinh nghiệm',
        'Presence in countries': 'Có mặt tại các quốc gia',
    }

    # Note: For production, you'd want to use the full translations.js data
    # This is a simplified version

    file_path.write_text(content, encoding='utf-8')


def main():
    print("=" * 60)
    print("Updating all HTML files for language routing...")
    print("=" * 60)

    # Process /en files
    en_dir = BASE_DIR / 'en'
    for html_file in en_dir.glob('*.html'):
        if html_file.is_file():
            update_paths_for_root_file(html_file, 'en')

    # Process /en/programs files
    en_programs = en_dir / 'programs'
    if en_programs.exists():
        for html_file in en_programs.glob('*.html'):
            if html_file.is_file():
                update_paths_for_programs_file(html_file, 'en')

    print("\n" + "=" * 60)

    # Process /vn files
    vn_dir = BASE_DIR / 'vn'
    for html_file in vn_dir.glob('*.html'):
        if html_file.is_file():
            update_paths_for_root_file(html_file, 'vn')
            # Apply Vietnamese translations
            # apply_vietnamese_translations(html_file)

    # Process /vn/programs files
    vn_programs = vn_dir / 'programs'
    if vn_programs.exists():
        for html_file in vn_programs.glob('*.html'):
            if html_file.is_file():
                update_paths_for_programs_file(html_file, 'vn')
                # apply_vietnamese_translations(html_file)

    print("\n" + "=" * 60)
    print("[SUCCESS] All files updated successfully!")
    print("=" * 60)
    print("\nSummary:")
    print(f"  English pages: {len(list(en_dir.glob('*.html')))} root + {len(list((en_dir / 'programs').glob('*.html')))} programs")
    print(f"  Vietnamese pages: {len(list(vn_dir.glob('*.html')))} root + {len(list((vn_dir / 'programs').glob('*.html')))} programs")
    print("\nNext steps:")
    print("  1. Review the updated files")
    print("  2. Apply Vietnamese translations manually or with translation script")
    print("  3. Test locally")
    print("  4. Commit changes")


if __name__ == '__main__':
    main()
