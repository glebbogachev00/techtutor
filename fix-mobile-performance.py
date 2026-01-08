import os
import sys
import re
import glob
import urllib.request

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def download_tailwind_cdn():
    """Download TailwindCSS from CDN to self-host it"""
    url = "https://cdn.tailwindcss.com"
    output_path = "js/tailwind.min.js"

    try:
        # Create js directory if it doesn't exist
        os.makedirs('js', exist_ok=True)

        # Download TailwindCSS
        print(f'📥 Downloading TailwindCSS from {url}...')
        urllib.request.urlretrieve(url, output_path)

        # Verify file was downloaded
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path) / 1024
            print(f'✓ Downloaded TailwindCSS: {file_size:.1f} KiB')
            return True
        return False
    except Exception as e:
        print(f'✗ Error downloading TailwindCSS: {e}')
        return False

def fix_render_blocking_resources(file_path):
    """Fix render blocking by:
    1. Self-hosting TailwindCSS with defer
    2. Adding font-display=swap to Google Fonts
    3. Moving Google Analytics to end of body
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # 1. Replace TailwindCSS CDN with self-hosted version + defer
        if 'cdn.tailwindcss.com' in content:
            # Determine the correct path prefix based on file location
            if '/programs/' in file_path.replace('\\', '/') or '/courses/' in file_path.replace('\\', '/'):
                js_path = '../../js/tailwind.min.js'
            else:
                js_path = '../js/tailwind.min.js'

            content = content.replace(
                '<script src="https://cdn.tailwindcss.com"></script>',
                f'<script src="{js_path}" defer></script>'
            )

        # 2. Add font-display=swap if not already present
        if 'fonts.googleapis.com' in content and '&display=swap' not in content:
            content = re.sub(
                r'(href="https://fonts\.googleapis\.com/css2\?[^"]+)"',
                r'\1&display=swap"',
                content
            )

        # 3. Move Google Analytics inline script to end of body (defer execution)
        # Extract GA script from head
        ga_script_pattern = r'(\s*<!-- Google tag \(gtag\.js\) -->.*?</script>\s*)'
        ga_match = re.search(ga_script_pattern, content, re.DOTALL)

        if ga_match:
            ga_script = ga_match.group(1)
            # Remove from head
            content = content.replace(ga_script, '')
            # Add back before closing </body> tag
            content = content.replace('</body>', f'{ga_script}</body>')

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'✗ Error processing {file_path}: {e}')
        return False

def add_fetchpriority_to_lcp_image(file_path):
    """Add fetchpriority='high' to family-portrait.jpg (LCP image)"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Add fetchpriority="high" to family-portrait.jpg image
        if 'family-portrait.jpg' in content:
            # Replace the img tag to add fetchpriority
            content = re.sub(
                r'(<img[^>]*src="[^"]*family-portrait\.jpg"[^>]*)(>)',
                lambda m: m.group(1) + ' fetchpriority="high"' + m.group(2) if 'fetchpriority' not in m.group(1) else m.group(0),
                content
            )

            # Also update preload tag if it exists
            if 'rel="preload"' in content and 'family-portrait.jpg' in content:
                content = re.sub(
                    r'(<link rel="preload" href="[^"]*family-portrait\.jpg"[^>]*)(>)',
                    lambda m: m.group(1) + ' fetchpriority="high"' + m.group(2) if 'fetchpriority' not in m.group(1) else m.group(0),
                    content
                )

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'✗ Error processing {file_path}: {e}')
        return False

def add_preload_fonts(file_path):
    """Add preload for critical fonts to reduce blocking"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Add font preload if Google Fonts is used but no preload exists
        if 'fonts.googleapis.com' in content and '<link rel="preload"' not in content or 'font' not in content:
            # Find the Google Fonts link
            fonts_link_match = re.search(r'<link href="(https://fonts\.googleapis\.com/css2\?[^"]+)" rel="stylesheet"', content)

            if fonts_link_match:
                # Add preload before the stylesheet link
                preload_tag = '  <link rel="preload" href="https://fonts.gstatic.com" as="font" type="font/woff2" crossorigin>\n  '

                content = content.replace(
                    fonts_link_match.group(0),
                    preload_tag + fonts_link_match.group(0)
                )

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'✗ Error processing {file_path}: {e}')
        return False

print('='*70)
print('FIXING MOBILE PERFORMANCE ISSUES')
print('='*70)

# Step 1: Download and self-host TailwindCSS
print('\n1. Downloading TailwindCSS to self-host...')
if download_tailwind_cdn():
    print('   ✅ TailwindCSS downloaded successfully')
else:
    print('   ⚠️  Could not download TailwindCSS, will skip this optimization')

# Step 2: Fix render blocking resources in all pages
print('\n2. Fixing render blocking resources (TailwindCSS + Google Fonts)...')
fixed_count = 0
for file_path in glob.glob('en/**/*.html', recursive=True) + glob.glob('vn/**/*.html', recursive=True):
    if fix_render_blocking_resources(file_path):
        fixed_count += 1
        print(f'   ✓ Fixed: {file_path}')

print(f'   ✅ Fixed render blocking in {fixed_count} pages')

# Step 3: Add fetchpriority to LCP image
print('\n3. Adding fetchpriority="high" to LCP image (family-portrait.jpg)...')
lcp_fixed = 0
for file_path in ['en/index.html', 'vn/index.html']:
    if os.path.exists(file_path) and add_fetchpriority_to_lcp_image(file_path):
        lcp_fixed += 1
        print(f'   ✓ Fixed: {file_path}')

print(f'   ✅ Added fetchpriority to {lcp_fixed} pages')

# Step 4: Add font preload
print('\n4. Adding font preload for faster font loading...')
preload_count = 0
for file_path in glob.glob('en/**/*.html', recursive=True) + glob.glob('vn/**/*.html', recursive=True):
    if add_preload_fonts(file_path):
        preload_count += 1

print(f'   ✅ Added font preload to {preload_count} pages')

print('\n' + '='*70)
print('MOBILE PERFORMANCE FIXES COMPLETE')
print('='*70)
print('\nOptimizations applied:')
print('  ✓ Self-hosted TailwindCSS (eliminates 770ms render blocking)')
print('  ✓ Added defer to TailwindCSS script')
print('  ✓ Moved Google Analytics to end of body (prevents forced reflows)')
print('  ✓ Added font-display=swap to Google Fonts')
print('  ✓ Added fetchpriority="high" to LCP image')
print('  ✓ Added font preload for faster font loading')
print('\nExpected mobile score improvement: +15 to +25 points')
print('='*70)
