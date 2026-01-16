import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Language switcher patterns to remove (desktop and mobile versions)
LANG_SWITCHER_DESKTOP = '''          <div class="relative group">
            <button class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary hover:bg-primary hover:bg-opacity-10 transition" aria-label="Switch language">
              <span class="text-xl">🇬🇧</span>
            </button>
            <div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div class="p-2">
                <a href="../vn/index.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">
                  <span class="text-2xl">🇻🇳</span>
                  <span class="text-sm font-medium text-slate-700">Tiếng Việt</span>
                </a>
              </div>
            </div>
          </div>

          '''

LANG_SWITCHER_MOBILE = '''          <div class="relative group">
            <button class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary hover:bg-primary hover:bg-opacity-10 transition" aria-label="Switch language">
              <span class="text-xl">🇬🇧</span>
            </button>
            <div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl opacity-0 invisible translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div class="p-2">
                <a href="../vn/index.html" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition">
                  <span class="text-2xl">🇻🇳</span>
                  <span class="text-sm font-medium text-slate-700">Tiếng Việt</span>
                </a>
              </div>
            </div>
          </div>
          '''

def remove_language_switcher(filepath):
    """Remove language switcher from file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Remove both desktop and mobile language switchers
        content = content.replace(LANG_SWITCHER_DESKTOP, '          ')
        content = content.replace(LANG_SWITCHER_MOBILE, '          ')

        # Update hreflang and canonical tags to point to current region
        region = 'in' if '/in/' in filepath or '\\in\\' in filepath else 'us'
        content = re.sub(r'hreflang="en" href="https://techtutor\.academy/en/',
                        f'hreflang="en" href="https://techtutor.academy/{region}/', content)
        content = re.sub(r'hreflang="x-default" href="https://techtutor\.academy/en/',
                        f'hreflang="x-default" href="https://techtutor.academy/{region}/', content)
        content = re.sub(r'<link rel="canonical" href="https://techtutor\.academy/en/',
                        f'<link rel="canonical" href="https://techtutor.academy/{region}/', content)

        # Remove Vietnamese hreflang
        content = re.sub(r'  <link rel="alternate" hreflang="vi" href="[^"]*" />\n', '', content)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'Error processing {filepath}: {e}')
        return False

def update_pricing_in(filepath):
    """Update pricing for India (INR)"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Private pricing
        content = re.sub(r'<span class="font-bold text-ink">5\.6M VND / ~\$225</span>',
                        '<span class="font-bold text-ink">₹19,999</span>', content)
        content = re.sub(r'<span class="font-bold text-ink">10\.7M VND / ~\$428</span>',
                        '<span class="font-bold text-ink">₹35,999</span>', content)
        content = re.sub(r'<span class="font-bold text-ink">15M VND / ~\$608</span>',
                        '<span class="font-bold text-ink">₹49,999</span>', content)

        # Small group pricing
        content = re.sub(r'<span class="font-bold text-ink">3\.2M VND / ~\$128</span>',
                        '<span class="font-bold text-ink">₹11,999</span>', content)
        content = re.sub(r'<span class="font-bold text-ink">6\.1M VND / ~\$244</span>',
                        '<span class="font-bold text-ink">₹21,999</span>', content)
        content = re.sub(r'<span class="font-bold text-ink">8\.4M VND / ~\$346</span>',
                        '<span class="font-bold text-ink">₹29,999</span>', content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    except Exception as e:
        print(f'Error updating pricing for {filepath}: {e}')
        return False

def update_pricing_us(filepath):
    """Update pricing for US (USD)"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Private pricing
        content = re.sub(r'<span class="font-bold text-ink">5\.6M VND / ~\$225</span>',
                        '<span class="font-bold text-ink">$299</span>', content)
        content = re.sub(r'<span class="font-bold text-ink">10\.7M VND / ~\$428</span>',
                        '<span class="font-bold text-ink">$569</span>', content)
        content = re.sub(r'<span class="font-bold text-ink">15M VND / ~\$608</span>',
                        '<span class="font-bold text-ink">$799</span>', content)

        # Small group pricing
        content = re.sub(r'<span class="font-bold text-ink">3\.2M VND / ~\$128</span>',
                        '<span class="font-bold text-ink">$179</span>', content)
        content = re.sub(r'<span class="font-bold text-ink">6\.1M VND / ~\$244</span>',
                        '<span class="font-bold text-ink">$339</span>', content)
        content = re.sub(r'<span class="font-bold text-ink">8\.4M VND / ~\$346</span>',
                        '<span class="font-bold text-ink">$479</span>', content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    except Exception as e:
        print(f'Error updating pricing for {filepath}: {e}')
        return False

def main():
    updated_files = []

    # Process IN directory
    print('Processing IN (India) directory...')
    for root, dirs, files in os.walk('in'):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)

                # Remove language switcher
                if remove_language_switcher(filepath):
                    updated_files.append(filepath)
                    print(f'✓ Removed language switcher: {filepath}')

                # Update pricing if it's the plans page
                if 'plans-and-faq.html' in file:
                    if update_pricing_in(filepath):
                        print(f'✓ Updated pricing (INR): {filepath}')

    # Process US directory
    print('\nProcessing US directory...')
    for root, dirs, files in os.walk('us'):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)

                # Remove language switcher
                if remove_language_switcher(filepath):
                    updated_files.append(filepath)
                    print(f'✓ Removed language switcher: {filepath}')

                # Update pricing if it's the plans page
                if 'plans-and-faq.html' in file:
                    if update_pricing_us(filepath):
                        print(f'✓ Updated pricing (USD): {filepath}')

    print(f'\n✅ Processed {len(updated_files)} files total')

if __name__ == '__main__':
    main()
