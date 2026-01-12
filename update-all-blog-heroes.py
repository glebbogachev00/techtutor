import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Blog post configurations: (filename, hero_image, en_title, en_subtitle, vn_title, vn_subtitle)
blog_configs = [
    {
        'en_file': 'en/blog-tech-like-playtime.html',
        'vn_file': 'vn/blog-tech-like-playtime.html',
        'hero_image': 'blog_playtime.png',
        'en_title': 'How to Make Learning Tech Feel Like Playtime',
        'en_subtitle': "Transform tech education into an exciting adventure for your child",
        'vn_title': 'Làm Sao Để Học Công Nghệ Như Chơi',
        'vn_subtitle': 'Biến việc học công nghệ thành một cuộc phiêu lưu thú vị cho con bạn'
    },
    {
        'en_file': 'en/blog-project-based-learning.html',
        'vn_file': 'vn/blog-project-based-learning.html',
        'hero_image': 'blog_portfolio_2.png',
        'en_title': 'Why Project-Based Learning Works for Kids',
        'en_subtitle': 'Discover how hands-on projects turn learning into an engaging, real-world experience',
        'vn_title': 'Tại Sao Học Theo Dự Án Hiệu Quả Với Trẻ Em',
        'vn_subtitle': 'Khám phá cách các dự án thực hành biến việc học thành trải nghiệm thực tế hấp dẫn'
    },
    {
        'en_file': 'en/blog-spot-nurture-tech-skill.html',
        'vn_file': 'vn/blog-spot-nurture-tech-skill.html',
        'hero_image': 'blog_portfolio_1.png',
        'en_title': 'How to Spot and Nurture Tech Skills in Your Child',
        'en_subtitle': 'Learn to recognize early signs of tech interest and how to encourage their development',
        'vn_title': 'Cách Nhận Biết Và Nuôi Dưỡng Kỹ Năng Công Nghệ Ở Trẻ',
        'vn_subtitle': 'Học cách nhận biết dấu hiệu sớm của sở thích công nghệ và cách khuyến khích phát triển'
    }
]

def update_blog_hero(file_path, hero_image, title, subtitle):
    """Update a blog post with new hero section"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find and replace old article header section
        # Pattern: from </header> scripts to old article header
        old_header_pattern = r'(</header>\s*<script src="../js/site\.js" defer></script>\s*<script src="../js/app\.js" defer></script>\s*)<!-- Article Header -->.*?</header>\s*<div class="max-w-4xl mx-auto px-6 -mt-10">.*?</div>\s*<!-- Article Content -->'

        new_hero_section = f'''\\1
  <!-- Hero Section -->
  <section class="relative h-[500px] md:h-[600px] w-full overflow-hidden">
    <img src="../images/{hero_image}" alt="{title}" class="absolute inset-0 w-full h-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/70"></div>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">{title}</h1>
      <p class="text-xl md:text-2xl text-white/90 max-w-3xl mb-8">{subtitle}</p>
    </div>
  </section>

  <!-- Article Content -->'''

        updated_content = re.sub(old_header_pattern, new_hero_section, content, flags=re.DOTALL)

        if updated_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f'✓ Updated {file_path}')
            return True
        else:
            print(f'⚠ No changes needed for {file_path}')
            return False
    except Exception as e:
        print(f'✗ Error updating {file_path}: {e}')
        return False

# Update all blog posts
print('Updating blog post hero sections...\n')
for config in blog_configs:
    print(f"\nProcessing: {config['en_title']}")
    update_blog_hero(config['en_file'], config['hero_image'], config['en_title'], config['en_subtitle'])
    update_blog_hero(config['vn_file'], config['hero_image'], config['vn_title'], config['vn_subtitle'])

print('\n✅ All blog posts updated!')
