import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def add_facebook_group_text(filepath):
    """Add Facebook group text to trial section"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # For VN version - add Vietnamese text
        if 'vn/' in filepath:
            pattern = r'(Chỉ trong 90 phút: nhận tư vấn miễn phí, chi tiết và lộ trình học tập từ giảng viên\. )(?!Được tham gia)(Chia sẻ thông tin)'
            replacement = r'\1Được tham gia nhóm Facebook độc quyền của chúng tôi. \2'
            content = re.sub(pattern, replacement, content)

        # For IN version - add English text
        elif 'in/' in filepath:
            pattern = r'(In just 90 minutes: receive a free, in-depth consultation and roadmap from our instructor\. )(?!Get access)(Share your details)'
            replacement = r'\1Get access to our exclusive Facebook group. \2'
            content = re.sub(pattern, replacement, content)

        # For US version - add English text
        elif 'us/' in filepath:
            pattern = r'(In just 90 minutes: receive a free, in-depth consultation and roadmap from our instructor\. )(?!Get access)(Share your details)'
            replacement = r'\1Get access to our exclusive Facebook group. \2'
            content = re.sub(pattern, replacement, content)

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

    # Update index.html in VN, IN, US (EN already done manually)
    files_to_update = [
        'vn/index.html',
        'in/index.html',
        'us/index.html'
    ]

    for file_path in files_to_update:
        full_path = os.path.join(os.getcwd(), file_path)
        if os.path.exists(full_path):
            print(f'Processing: {file_path}')
            result = add_facebook_group_text(full_path)
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
