import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def update_promo_button(filepath):
    """Update sticky promo button to offer free course"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Update button text from "Up to 20% off" to "Get a FREE Course"
        button_pattern = r'(<div class="text-\[11px\] leading-tight md:text-sm md:whitespace-nowrap">)\s*Up to<br class="md:hidden"/>\s*20% off'
        button_replacement = r'\1\n            Get a FREE<br class="md:hidden"/>\n            Course'
        content = re.sub(button_pattern, button_replacement, content)

        # Update popup heading
        heading_pattern = r'(<h2 class="text-2xl md:text-3xl font-black mb-3 text-primary">)\s*Get Up to 20% Off Today!'
        heading_replacement = r'\1\n            Unlock a FREE Course Today!'
        content = re.sub(heading_pattern, heading_replacement, content)

        # Update popup description
        desc_pattern = r'(<p class="text-gray-700 text-sm md:text-base">)\s*Book your free trial now and get up to 20% off your first course bundle'
        desc_replacement = r'\1\n            Register your email and get instant access to a free course'
        content = re.sub(desc_pattern, desc_replacement, content)

        # Remove all form fields except email and update the form
        form_pattern = r'(<form id="promoTrialForm"[^>]*>.*?)<div>.*?<label for="promo-parent-name".*?</div>.*?<div>.*?<label for="promo-child-name".*?</div>.*?(<div>.*?<label for="promo-email".*?</div>).*?<div>.*?<label for="promo-phone".*?</div>.*?<div>.*?<label for="promo-child-age".*?</div>(.*?<input type="text" name="_gotcha".*?<input type="hidden" name="_subject" value=").*?(" />.*?<input type="hidden" name="source_page".*?<input type="hidden" name=")promo_code(" value=").*?(" />.*?<button type="submit"[^>]*>).*?(</button>)'

        form_replacement = r'\1\2\3New Free Course Registration\4\5type\6Free Course\7\8Get My Free Course\9\n          <p class="text-center text-xs md:text-sm text-gray-600">✅ No credit card required</p>'

        content = re.sub(form_pattern, form_replacement, content, flags=re.DOTALL)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f'❌ Error processing {filepath}: {e}')
        return False

def main():
    updated_files = []

    # Update VN, IN, US (EN already done manually)
    files_to_update = [
        'vn/index.html',
        'in/index.html',
        'us/index.html'
    ]

    for file_path in files_to_update:
        full_path = os.path.join(os.getcwd(), file_path)
        if os.path.exists(full_path):
            print(f'Processing: {file_path}')
            result = update_promo_button(full_path)
            if result:
                updated_files.append(file_path)
                print(f'✓ Updated: {file_path}')
            else:
                print(f'  No changes: {file_path}')
        else:
            print(f'⚠️  File not found: {file_path}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
