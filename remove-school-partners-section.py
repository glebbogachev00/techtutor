import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def remove_school_partners_section(filepath):
    """Remove the 'Join our community of school partners' CTA section"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Remove the entire CTA section including decorative elements
        # Pattern matches from <!-- CTA Section - Join Community --> to </section>
        pattern = r'\s*<!-- CTA Section - Join Community -->.*?</section>\s*'
        content = re.sub(pattern, '\n', content, flags=re.DOTALL)

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

    # Update all index.html files in all regions
    files_to_update = [
        'en/index.html',
        'vn/index.html',
        'in/index.html',
        'us/index.html'
    ]

    for file_path in files_to_update:
        full_path = os.path.join(os.getcwd(), file_path)
        if os.path.exists(full_path):
            print(f'Processing: {file_path}')
            result = remove_school_partners_section(full_path)
            if result:
                updated_files.append(file_path)
                print(f'✓ Removed section: {file_path}')
            else:
                print(f'  No changes: {file_path}')
        else:
            print(f'⚠️  File not found: {file_path}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
