import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Read the template (existing blog post with correct header/footer)
with open('en/blog-tech-like-playtime.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Extract header (from <body> to first <main> tag)
header_match = re.search(r'(<body.*?>.*?<main)', template, re.DOTALL)
correct_header = header_match.group(1) if header_match else None

# Extract footer (from <footer> to </body>)
footer_match = re.search(r'(<footer.*?</body>)', template, re.DOTALL)
correct_footer = footer_match.group(1) if footer_match else None

# Read EN blog post
with open('en/blog-build-tech-portfolio.html', 'r', encoding='utf-8') as f:
    en_content = f.read()

# Extract just the main content area (between <main> and <footer>)
en_main_match = re.search(r'(<main.*?</main>)', en_content, re.DOTALL)
en_main_content = en_main_match.group(1) if en_main_match else None

if correct_header and correct_footer and en_main_content:
    # Build new EN content with correct header/footer
    new_en_content = en_content.split('<body')[0] + correct_header + '\n' + en_main_content + '\n\n  ' + correct_footer

    # Update language switcher link in header for EN version
    new_en_content = new_en_content.replace('blog-tech-like-playtime.html', 'blog-build-tech-portfolio.html')

    # Write updated EN file
    with open('en/blog-build-tech-portfolio.html', 'w', encoding='utf-8') as f:
        f.write(new_en_content)
    print('✓ Updated EN blog header/footer')

# Read VN template
with open('vn/blog-tech-like-playtime.html', 'r', encoding='utf-8') as f:
    vn_template = f.read()

# Extract VN header/footer
vn_header_match = re.search(r'(<body.*?>.*?<main)', vn_template, re.DOTALL)
vn_correct_header = vn_header_match.group(1) if vn_header_match else None

vn_footer_match = re.search(r'(<footer.*?</body>)', vn_template, re.DOTALL)
vn_correct_footer = vn_footer_match.group(1) if vn_footer_match else None

# Read VN blog post
with open('vn/blog-build-tech-portfolio.html', 'r', encoding='utf-8') as f:
    vn_content = f.read()

# Extract VN main content
vn_main_match = re.search(r'(<main.*?</main>)', vn_content, re.DOTALL)
vn_main_content = vn_main_match.group(1) if vn_main_match else None

if vn_correct_header and vn_correct_footer and vn_main_content:
    # Build new VN content
    new_vn_content = vn_content.split('<body')[0] + vn_correct_header + '\n' + vn_main_content + '\n\n  ' + vn_correct_footer

    # Update language switcher link
    new_vn_content = new_vn_content.replace('blog-tech-like-playtime.html', 'blog-build-tech-portfolio.html')

    # Write updated VN file
    with open('vn/blog-build-tech-portfolio.html', 'w', encoding='utf-8') as f:
        f.write(new_vn_content)
    print('✓ Updated VN blog header/footer')

print('\n✅ Blog headers and footers updated to match website design')
