import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Blog configurations
blog_configs = [
    {
        'file': 'en/blog-tech-like-playtime.html',
        'title': 'How to Make Learning Tech Feel Like Playtime',
        'description': 'Transform tech education into an exciting adventure for your child. Discover proven strategies to make coding and technology fun, engaging, and naturally motivating for kids.',
        'keywords': 'tech education for kids, fun coding for children, gamified learning, STEM education, make coding fun, technology for kids',
        'image': 'blog_playtime.png',
        'date': '2026-01-10',
        'tags': ['Tech Education', 'Gamified Learning', 'Kids Coding']
    },
    {
        'file': 'en/blog-project-based-learning.html',
        'title': 'Why Project-Based Learning Works for Kids',
        'description': 'Discover how hands-on projects turn learning into an engaging, real-world experience. Learn why project-based learning is more effective than traditional methods for teaching kids tech skills.',
        'keywords': 'project-based learning, hands-on learning, experiential learning, STEM projects, coding projects for kids, learn by doing',
        'image': 'blog_portfolio_2.png',
        'date': '2026-01-10',
        'tags': ['Project-Based Learning', 'Hands-On Education', 'STEM Projects']
    },
    {
        'file': 'en/blog-spot-nurture-tech-skill.html',
        'title': 'How to Spot and Nurture Tech Skills in Your Child',
        'description': 'Learn to recognize early signs of tech interest and how to encourage their development. Discover the key indicators that your child has natural aptitude for technology and coding.',
        'keywords': 'identify tech talent, nurture tech skills, kids tech aptitude, early signs of coding interest, STEM talent development',
        'image': 'blog_portfolio_1.png',
        'date': '2026-01-10',
        'tags': ['Talent Development', 'Tech Skills', 'Parenting']
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
  <meta name="author" content="TechTutor Academy" />'''

        # Replace description tag with enhanced meta tags
        content = re.sub(pattern, seo_tags, content)

        # Find canonical link and add Open Graph tags after it
        canonical_pattern = r'(<link rel="canonical" href="https://techtutor\.academy/en/[^"]*" />)'

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
    "inLanguage": "en",
    "isAccessibleForFree": "true"
  }}
  </script>'''

        content = re.sub(canonical_pattern, og_tags, content)

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f'✓ Added SEO tags to {file_path}')
        return True

    except Exception as e:
        print(f'✗ Error processing {file_path}: {e}')
        return False

# Process all blog posts
print('Adding SEO optimization to blog posts...\n')
success_count = 0

for config in blog_configs:
    if add_seo_to_blog(config):
        success_count += 1

print(f'\n✅ Successfully added SEO to {success_count} blog posts!')
