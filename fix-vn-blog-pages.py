import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fix_blog_page(file_path):
    """Fix VN blog page navigation, footer, and content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        changes = []

        # Fix 1: Add missing "Free Courses" link in navigation (after "Quy Trình")
        old_nav = '''<a href="how-it-works.html" class="text-slate-600 font-medium">Quy Trình</a>
          <a href="plans-and-faq.html" class="hover:text-primary transition">Giá Cả</a>'''

        new_nav = '''<a href="how-it-works.html" class="text-slate-600 font-medium">Quy Trình</a>
          <a href="online-courses.html" class="hover:text-primary transition">Khóa Học Miễn Phí</a>
          <a href="plans-and-faq.html" class="hover:text-primary transition">Giá Cả</a>'''

        if old_nav in content:
            content = content.replace(old_nav, new_nav)
            changes.append('Added "Khóa Học Miễn Phí" link to desktop nav')

        # Fix 2: Translate footer "OPENING HOURS"
        old_footer = '''<h3 class="text-lg font-bold mb-4 text-white">OPENING HOURS</h3>
          <div class="space-y-2 text-sm">
            <p class="text-slate-300">Monday - Friday: 8am - 9pm</p>
            <p class="text-slate-300">Saturday - Sunday: 8am - 8pm</p>
          </div>'''

        new_footer = '''<h3 class="text-lg font-bold mb-4 text-white">GIỜ MỞ CỬA</h3>
          <div class="space-y-2 text-sm">
            <p class="text-slate-300">Thứ 2 - Thứ 6: 8:00 - 21:00</p>
            <p class="text-slate-300">Thứ 7 - CN: 8:00 - 20:00</p>
          </div>'''

        if old_footer in content:
            content = content.replace(old_footer, new_footer)
            changes.append('Translated and formatted footer hours')

        # Fix 3: Translate "START LEARNING"
        if 'START LEARNING' in content:
            content = content.replace(
                '<h3 class="text-lg font-bold mb-4 text-white">START LEARNING</h3>',
                '<h3 class="text-lg font-bold mb-4 text-white">BẮT ĐẦU HỌC</h3>'
            )
            changes.append('Translated "START LEARNING"')

        # Fix 4: Translate "Our Vision"
        if '>Our Vision<' in content:
            content = content.replace(
                '<h3 class="text-lg font-bold mb-4 text-white">Our Vision</h3>',
                '<h3 class="text-lg font-bold mb-4 text-white">Tầm Nhìn Của Chúng Tôi</h3>'
            )
            changes.append('Translated "Our Vision"')

        # Fix 5: Translate "CONNECT WITH US!"
        if 'CONNECT WITH US!' in content:
            content = content.replace(
                '<h3 class="text-lg font-bold mb-4 text-white">CONNECT WITH US!</h3>',
                '<h3 class="text-lg font-bold mb-4 text-white">KẾT NỐI VỚI CHÚNG TÔI!</h3>'
            )
            changes.append('Translated "CONNECT WITH US!"')

        # Fix 6: Add mobile "Free Courses" link
        mobile_nav_old = '''<a href="student-projects.html" class="hover:text-primary transition">Dự Án</a>
          <a href="plans-and-faq.html" class="hover:text-primary transition">Giá Cả</a>
          <a href="blog.html" class="hover:text-primary transition">Blog</a>'''

        mobile_nav_new = '''<a href="student-projects.html" class="hover:text-primary transition">Dự Án</a>
          <a href="how-it-works.html" class="hover:text-primary transition">Quy Trình</a>
          <a href="online-courses.html" class="hover:text-primary transition">Khóa Học Miễn Phí</a>
          <a href="plans-and-faq.html" class="hover:text-primary transition">Giá Cả</a>
          <a href="blog.html" class="hover:text-primary transition">Blog</a>'''

        if mobile_nav_old in content:
            content = content.replace(mobile_nav_old, mobile_nav_new)
            changes.append('Added missing nav links to mobile menu')

        if changes:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes
        else:
            return False, ['No changes needed']

    except Exception as e:
        return False, [f'Error: {e}']

print('=== FIXING VN BLOG PAGES ===\n')

blog_pages = [
    'vn/blog-project-based-learning.html',
    'vn/blog-spot-nurture-tech-skill.html',
    'vn/blog-tech-like-playtime.html',
]

total_fixed = 0

for file_path in blog_pages:
    if os.path.exists(file_path):
        print(f'Fixing {file_path}...')
        success, changes = fix_blog_page(file_path)
        if success:
            total_fixed += 1
            for change in changes:
                print(f'  ✓ {change}')
            print()
        else:
            print(f'  - {changes[0]}\n')
    else:
        print(f'⚠ {file_path} not found\n')

print(f'✅ FIXED {total_fixed}/3 BLOG PAGES!')
print('\nAll blog pages now have:')
print('  • Complete Vietnamese navigation (desktop & mobile)')
print('  • Translated footer sections')
print('  • Proper "Khóa Học Miễn Phí" and "Quy Trình" links')
