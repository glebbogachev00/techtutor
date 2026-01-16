import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Blog configurations for Vietnamese versions
blog_configs = [
    {
        'file': 'vn/blog-tech-like-playtime.html',
        'title': 'Làm Sao Để Học Công Nghệ Như Chơi',
        'description': 'Biến việc học công nghệ thành một cuộc phiêu lưu thú vị cho con bạn. Khám phá các chiến lược đã được chứng minh để làm cho lập trình và công nghệ trở nên thú vị, hấp dẫn và tự nhiên động lực cho trẻ em.',
        'keywords': 'giáo dục công nghệ cho trẻ em, lập trình vui cho trẻ, học tập theo trò chơi, giáo dục STEM, làm cho lập trình thú vị, công nghệ cho trẻ em',
        'image': 'blog_playtime.png',
        'date': '2026-01-10',
        'tags': ['Giáo Dục Công Nghệ', 'Học Tập Gamified', 'Lập Trình Trẻ Em']
    },
    {
        'file': 'vn/blog-project-based-learning.html',
        'title': 'Tại Sao Học Theo Dự Án Hiệu Quả Với Trẻ Em',
        'description': 'Khám phá cách các dự án thực hành biến việc học thành một trải nghiệm thực tế hấp dẫn. Tìm hiểu tại sao học tập dựa trên dự án hiệu quả hơn các phương pháp truyền thống để dạy trẻ em kỹ năng công nghệ.',
        'keywords': 'học tập dựa trên dự án, học tập thực hành, học tập trải nghiệm, dự án STEM, dự án lập trình cho trẻ em, học bằng thực hành',
        'image': 'blog_portfolio_2.png',
        'date': '2026-01-10',
        'tags': ['Học Tập Dựa Trên Dự Án', 'Giáo Dục Thực Hành', 'Dự Án STEM']
    },
    {
        'file': 'vn/blog-spot-nurture-tech-skill.html',
        'title': 'Cách Nhận Biết Và Nuôi Dưỡng Kỹ Năng Công Nghệ Ở Trẻ',
        'description': 'Học cách nhận biết dấu hiệu sớm của sự quan tâm công nghệ và cách khuyến khích phát triển của chúng. Khám phá các chỉ báo chính rằng con bạn có năng khiếu tự nhiên về công nghệ và lập trình.',
        'keywords': 'xác định tài năng công nghệ, nuôi dưỡng kỹ năng công nghệ, năng khiếu công nghệ của trẻ em, dấu hiệu sớm của sự quan tâm lập trình, phát triển tài năng STEM',
        'image': 'blog_portfolio_1.png',
        'date': '2026-01-10',
        'tags': ['Phát Triển Tài Năng', 'Kỹ Năng Công Nghệ', 'Nuôi Dạy Con']
    },
    {
        'file': 'vn/blog-build-tech-portfolio.html',
        'title': 'Cách Xây Dựng Hồ Sơ Công Nghệ Trước Trung Học',
        'description': 'Tìm hiểu cách xây dựng một hồ sơ công nghệ ấn tượng trước trung học. Khám phá ý tưởng dự án, nền tảng, và tại sao bắt đầu sớm mang lại lợi thế cạnh tranh cho học sinh trong việc tuyển sinh đại học.',
        'keywords': 'hồ sơ công nghệ cho trẻ em, hồ sơ công nghệ học sinh, hồ sơ lập trình cho trẻ em, dự án công nghệ trung học, GitHub cho học sinh, hồ sơ công nghệ tuyển sinh đại học',
        'image': 'blog_portfolio_1.png',
        'date': '2026-01-13',
        'tags': ['Hồ Sơ Công Nghệ', 'Lập Trình Trẻ Em', 'Giáo Dục STEM']
    }
]

def add_seo_to_blog(config):
    file_path = config['file']

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if SEO already exists
        if 'application/ld+json' in content:
            print(f'⚠ {file_path} already has SEO tags, skipping...')
            return False

        # Find the basic meta tags section
        pattern = r'(<meta name="description" content="[^"]*" />)'

        seo_tags = f'''<meta name="description" content="{config['description']}" />
  <meta name="keywords" content="{config['keywords']}" />
  <meta name="author" content="TechTutor Academy" />

  <!-- SEO: Hreflang tags for multilingual support -->
  <link rel="alternate" hreflang="vi" href="https://techtutor.academy/{config['file']}" />
  <link rel="alternate" hreflang="en" href="https://techtutor.academy/{config['file'].replace('vn/', 'en/')}" />
  <link rel="alternate" hreflang="x-default" href="https://techtutor.academy/{config['file'].replace('vn/', 'en/')}" />
  <link rel="canonical" href="https://techtutor.academy/{config['file']}" />'''

        # Replace description tag with enhanced meta tags
        content = re.sub(pattern, seo_tags, content)

        # Find the icon link and add Open Graph tags after it
        icon_pattern = r'(<link rel="icon" type="image/png" href="[^"]*" />)'

        og_tags = f'''\\1

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://techtutor.academy/{config['file']}" />
  <meta property="og:title" content="{config['title']}" />
  <meta property="og:description" content="{config['description']}" />
  <meta property="og:image" content="https://techtutor.academy/images/{config['image']}" />
  <meta property="og:site_name" content="TechTutor Academy" />
  <meta property="article:published_time" content="{config['date']}T00:00:00+00:00" />
  <meta property="article:author" content="TechTutor Academy" />
  <meta property="article:section" content="Education" />''' + ''.join([f'\n  <meta property="article:tag" content="{tag}" />' for tag in config['tags']]) + f'''

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://techtutor.academy/{config['file']}" />
  <meta name="twitter:title" content="{config['title']}" />
  <meta name="twitter:description" content="{config['description']}" />
  <meta name="twitter:image" content="https://techtutor.academy/images/{config['image']}" />

  <!-- JSON-LD Structured Data for Google -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{config['title']}",
    "description": "{config['description']}",
    "image": "https://techtutor.academy/images/{config['image']}",
    "author": {{
      "@type": "Organization",
      "name": "TechTutor Academy",
      "url": "https://techtutor.academy"
    }},
    "publisher": {{
      "@type": "Organization",
      "name": "TechTutor Academy",
      "logo": {{
        "@type": "ImageObject",
        "url": "https://techtutor.academy/images/robot-rocket.png"
      }}
    }},
    "datePublished": "{config['date']}",
    "dateModified": "{config['date']}",
    "mainEntityOfPage": {{
      "@type": "WebPage",
      "@id": "https://techtutor.academy/{config['file']}"
    }},
    "articleSection": "Education",
    "keywords": {config['keywords'].split(', ')},
    "inLanguage": "vi",
    "isAccessibleForFree": "true"
  }}
  </script>'''

        content = re.sub(icon_pattern, og_tags, content)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f'✓ Added SEO tags to {file_path}')
        return True

    except Exception as e:
        print(f'✗ Error processing {file_path}: {e}')
        return False

# Process all blog posts
print('Adding SEO optimization to Vietnamese blog posts...\n')
success_count = 0

for config in blog_configs:
    if add_seo_to_blog(config):
        success_count += 1

print(f'\n✅ Successfully added SEO to {success_count} Vietnamese blog posts!')
