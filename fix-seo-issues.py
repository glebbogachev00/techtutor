import os
import sys
import re
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_robots_meta_to_redirects():
    """Add noindex meta tag to redirect pages to avoid indexing issues"""
    redirect_pages = glob.glob('*.html')
    redirect_pages = [f for f in redirect_pages if f != 'index.html']

    updated = 0
    for file_path in redirect_pages:
        if not os.path.exists(file_path):
            continue

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if already has noindex
            if 'noindex' in content:
                continue

            # Add noindex meta tag after charset
            content = re.sub(
                r'(<meta charset="UTF-8">)',
                r'\1\n  <meta name="robots" content="noindex, follow">',
                content
            )

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

            updated += 1
            print(f'✓ Added noindex to: {file_path}')

        except Exception as e:
            print(f'✗ Error processing {file_path}: {e}')

    return updated

def add_canonical_tags():
    """Add canonical tags to all EN and VN pages"""
    base_url = 'https://techtutor.academy'
    updated = 0

    # Process EN pages
    for root, dirs, files in os.walk('en'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file).replace('\\', '/')

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Check if already has canonical
                    if '<link rel="canonical"' in content:
                        continue

                    # Construct canonical URL
                    relative_path = file_path.replace('\\', '/')
                    canonical_url = f'{base_url}/{relative_path}'

                    # Add canonical tag in head
                    canonical_tag = f'  <link rel="canonical" href="{canonical_url}" />'

                    # Add after description meta tag or before closing </head>
                    if '<meta name="description"' in content:
                        content = re.sub(
                            r'(<meta name="description"[^>]*>)',
                            r'\1\n' + canonical_tag,
                            content,
                            count=1
                        )
                    else:
                        content = re.sub(
                            r'(</head>)',
                            canonical_tag + '\n\\1',
                            content,
                            count=1
                        )

                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)

                    updated += 1
                    print(f'✓ Added canonical to: {file_path}')

                except Exception as e:
                    print(f'✗ Error processing {file_path}: {e}')

    # Process VN pages
    for root, dirs, files in os.walk('vn'):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file).replace('\\', '/')

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Check if already has canonical
                    if '<link rel="canonical"' in content:
                        continue

                    # Construct canonical URL
                    relative_path = file_path.replace('\\', '/')
                    canonical_url = f'{base_url}/{relative_path}'

                    # Add canonical tag
                    canonical_tag = f'  <link rel="canonical" href="{canonical_url}" />'

                    if '<meta name="description"' in content:
                        content = re.sub(
                            r'(<meta name="description"[^>]*>)',
                            r'\1\n' + canonical_tag,
                            content,
                            count=1
                        )
                    else:
                        content = re.sub(
                            r'(</head>)',
                            canonical_tag + '\n\\1',
                            content,
                            count=1
                        )

                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)

                    updated += 1
                    print(f'✓ Added canonical to: {file_path}')

                except Exception as e:
                    print(f'✗ Error processing {file_path}: {e}')

    return updated

def fix_missing_meta_descriptions():
    """Ensure all pages have meta descriptions"""
    updated = 0

    default_descriptions = {
        'en': 'TechTutor Academy offers interactive tech courses for children and teens. Learn coding, AI, game development, and 3D design with expert instructors.',
        'vn': 'TechTutor Academy cung cấp các khóa học công nghệ tương tác cho trẻ em và thiếu niên. Học lập trình, AI, phát triển game và thiết kế 3D với giảng viên chuyên môn.'
    }

    for lang in ['en', 'vn']:
        for root, dirs, files in os.walk(lang):
            for file in files:
                if file.endswith('.html'):
                    file_path = os.path.join(root, file).replace('\\', '/')

                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()

                        # Check if has meta description
                        if '<meta name="description"' in content:
                            # Check if it's empty
                            if 'content=""' in content or 'content=\'\'' in content:
                                content = re.sub(
                                    r'<meta name="description" content="[^"]*"',
                                    f'<meta name="description" content="{default_descriptions[lang]}"',
                                    content
                                )

                                with open(file_path, 'w', encoding='utf-8') as f:
                                    f.write(content)

                                updated += 1
                                print(f'✓ Fixed empty description: {file_path}')
                        else:
                            # Add missing description
                            desc_tag = f'  <meta name="description" content="{default_descriptions[lang]}" />'
                            content = re.sub(
                                r'(<meta name="viewport"[^>]*>)',
                                r'\1\n' + desc_tag,
                                content,
                                count=1
                            )

                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(content)

                            updated += 1
                            print(f'✓ Added description to: {file_path}')

                    except Exception as e:
                        print(f'✗ Error processing {file_path}: {e}')

    return updated

print('='*70)
print('FIXING SEO ISSUES')
print('='*70)

print('\n1. Adding noindex to redirect pages...')
redirect_fixed = add_robots_meta_to_redirects()
print(f'   ✅ Fixed {redirect_fixed} redirect pages')

print('\n2. Adding canonical tags to all pages...')
canonical_added = add_canonical_tags()
print(f'   ✅ Added canonical tags to {canonical_added} pages')

print('\n3. Fixing missing/empty meta descriptions...')
descriptions_fixed = fix_missing_meta_descriptions()
print(f'   ✅ Fixed {descriptions_fixed} meta descriptions')

print('\n' + '='*70)
print('SEO FIXES COMPLETE')
print('='*70)
print(f'\nSummary:')
print(f'  • Redirect pages marked noindex: {redirect_fixed}')
print(f'  • Canonical tags added: {canonical_added}')
print(f'  • Meta descriptions fixed: {descriptions_fixed}')
print(f'\nThis should resolve:')
print(f'  ✓ Non-indexable pages issue')
print(f'  ✓ Redirect chain issues')
print(f'  ✓ 3XX status code issues')
print(f'  ✓ Metadata issues')
print('='*70)
