import os
from PIL import Image
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Images from Lighthouse report that need optimization
images_to_optimize = [
    {
        'path': 'images/home1.png',
        'current_size': '734.7 KiB',
        'display_dimensions': (288, 232),  # Actual displayed size
        'original_dimensions': (1200, 966)  # Current dimensions
    },
    {
        'path': 'images/home3.jpg',
        'current_size': '173.7 KiB',
        'display_dimensions': (288, 232),
        'original_dimensions': (1200, 1024)
    }
]

total_saved = 0

for img_info in images_to_optimize:
    file_path = img_info['path']

    if not os.path.exists(file_path):
        print(f'⚠ File not found: {file_path}')
        continue

    # Get original file size
    original_size = os.path.getsize(file_path)

    # Open and optimize image
    img = Image.open(file_path)

    # Resize to 2x the display dimensions for retina displays
    display_w, display_h = img_info['display_dimensions']
    new_size = (display_w * 2, display_h * 2)  # 576x464 for retina

    # Resize image
    img_resized = img.resize(new_size, Image.Resampling.LANCZOS)

    # Save with optimization
    if file_path.endswith('.png'):
        img_resized.save(file_path, 'PNG', optimize=True, quality=85)
    elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
        img_resized.save(file_path, 'JPEG', optimize=True, quality=85)

    # Get new file size
    new_size_bytes = os.path.getsize(file_path)
    saved = original_size - new_size_bytes
    total_saved += saved

    print(f'✓ Optimized {file_path}')
    print(f'  Original: {original_size / 1024:.1f} KiB → New: {new_size_bytes / 1024:.1f} KiB')
    print(f'  Saved: {saved / 1024:.1f} KiB')
    print()

print(f'✅ Total saved: {total_saved / 1024:.1f} KiB ({total_saved / (1024 * 1024):.2f} MiB)')
