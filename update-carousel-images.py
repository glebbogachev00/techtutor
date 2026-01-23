import os
import re
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def update_carousel_images(filepath):
    """Replace MS Paint screenshots with new student images in carousel"""

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Remove slides with Screenshot 2025-12-10 183226.png and Screenshot 2025-12-10 183418.png
        # These appear to be the MS Paint ones based on the pattern

        # Pattern to match entire slide divs
        # Remove Slide 8 (Screenshot 2025-12-10 183226.png)
        pattern1 = r'<!-- Slide 8 -->.*?<div class="carousel-slide min-w-full flex items-center justify-center">.*?<img[^>]*src="../images/students/Screenshot 2025-12-10 183226\.png"[^>]*>.*?</div>\s*'
        content = re.sub(pattern1, '', content, flags=re.DOTALL)

        # Remove Slide 9 (Screenshot 2025-12-10 183418.png)
        pattern2 = r'<!-- Slide 9 -->.*?<div class="carousel-slide min-w-full flex items-center justify-center">.*?<img[^>]*src="../images/students/Screenshot 2025-12-10 183418\.png"[^>]*>.*?</div>\s*'
        content = re.sub(pattern2, '', content, flags=re.DOTALL)

        # Now add the new slides after Slide 7
        # Find Slide 7 and insert after it
        slide7_pattern = r'(<!-- Slide 7 -->.*?</div>\s*)'

        new_slides = '''<!-- Slide 8 - Bao Thy -->
          <div class="carousel-slide min-w-full flex items-center justify-center">
            <img width="1200" height="800" loading="lazy" src="../images/students/baothy1.png" alt="Student creative work - Bao Thy" class="w-full h-auto">
          </div>
          <!-- Slide 9 - Duc 1 -->
          <div class="carousel-slide min-w-full flex items-center justify-center">
            <img width="1200" height="800" loading="lazy" src="../images/students/duc1.png" alt="Student creative work - Duc" class="w-full h-auto">
          </div>
          <!-- Slide 10 - Duc 2 -->
          <div class="carousel-slide min-w-full flex items-center justify-center">
            <img width="1200" height="800" loading="lazy" src="../images/students/duc2.png" alt="Student creative work - Duc" class="w-full h-auto">
          </div>
          '''

        content = re.sub(slide7_pattern, r'\1' + new_slides, content, flags=re.DOTALL)

        # Update the old slide numbers (10-18 become 11-19)
        # This is to account for replacing 2 slides with 3 slides
        content = re.sub(r'<!-- Slide 10 -->', '<!-- Slide 11 -->', content)
        content = re.sub(r'alt="Class photo 10"', 'alt="Class photo 11"', content)

        content = re.sub(r'<!-- Slide 11 -->', '<!-- Slide 12 -->', content)
        content = re.sub(r'alt="Class photo 11"', 'alt="Class photo 12"', content)

        content = re.sub(r'<!-- Slide 13 -->', '<!-- Slide 13 -->', content)  # Keep 13 as 13
        content = re.sub(r'<!-- Slide 14 -->', '<!-- Slide 14 -->', content)
        content = re.sub(r'<!-- Slide 15 -->', '<!-- Slide 15 -->', content)
        content = re.sub(r'<!-- Slide 16 -->', '<!-- Slide 16 -->', content)
        content = re.sub(r'<!-- Slide 17 -->', '<!-- Slide 17 -->', content)
        content = re.sub(r'<!-- Slide 18 -->', '<!-- Slide 18 -->', content)

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

    # Update both index.html and how-it-works.html in all regions
    files_to_update = [
        'en/index.html',
        'vn/index.html',
        'in/index.html',
        'us/index.html',
        'en/how-it-works.html',
        'vn/how-it-works.html',
        'in/how-it-works.html',
        'us/how-it-works.html'
    ]

    for file_path in files_to_update:
        full_path = os.path.join(os.getcwd(), file_path)
        if os.path.exists(full_path):
            print(f'Processing: {file_path}')
            result = update_carousel_images(full_path)
            if result:
                updated_files.append(file_path)
                print(f'✓ Updated: {file_path}')
            else:
                print(f'  No changes: {file_path}')
        else:
            print(f'⚠️  File not found: {file_path}')

    print(f'\n✅ Successfully updated {len(updated_files)} files')
    for f in updated_files:
        print(f'  - {f}')

if __name__ == '__main__':
    os.chdir('c:/Users/Manthan/.vscode/techtutor')
    main()
