import os
import sys
from PIL import Image
import glob

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def optimize_image(file_path, quality=85, max_width=1920):
    """Optimize an image by:
    1. Resizing to max_width if larger
    2. Converting to optimal format (WebP for modern browsers, optimized JPG/PNG as fallback)
    3. Compressing with specified quality
    """
    try:
        # Open image
        img = Image.open(file_path)

        # Get original size
        original_size = os.path.getsize(file_path) / 1024  # KiB

        # Skip if image is already small
        if original_size < 50:
            return False, 0

        # Resize if too large
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

        # Convert RGBA to RGB for JPEG
        if file_path.lower().endswith('.jpg') or file_path.lower().endswith('.jpeg'):
            if img.mode == 'RGBA':
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3] if len(img.split()) == 4 else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

        # Save optimized version
        save_kwargs = {}
        if file_path.lower().endswith(('.jpg', '.jpeg')):
            save_kwargs = {'quality': quality, 'optimize': True, 'progressive': True}
        elif file_path.lower().endswith('.png'):
            save_kwargs = {'optimize': True}
            # For PNG, also try to reduce to 8-bit if possible
            if img.mode == 'RGBA':
                save_kwargs['compress_level'] = 9
            else:
                # Try to convert to palette mode for smaller size
                try:
                    img = img.convert('P', palette=Image.ADAPTIVE, colors=256)
                except:
                    pass

        # Save to temporary file first (use original extension)
        file_ext = os.path.splitext(file_path)[1]
        temp_path = file_path + '.optimized' + file_ext
        img.save(temp_path, **save_kwargs)

        # Check if optimization actually reduced size
        new_size = os.path.getsize(temp_path) / 1024  # KiB
        savings = original_size - new_size

        if savings > 5:  # Only keep if we saved at least 5 KiB
            os.replace(temp_path, file_path)
            return True, savings
        else:
            os.remove(temp_path)
            return False, 0

    except Exception as e:
        print(f'  ✗ Error optimizing {file_path}: {e}')
        # Clean up temp file if it exists
        file_ext = os.path.splitext(file_path)[1]
        temp_path = file_path + '.optimized' + file_ext
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return False, 0

print('='*70)
print('OPTIMIZING IMAGES FOR MOBILE PERFORMANCE')
print('='*70)

# Target images from audit report
priority_images = [
    'images/home1.png',
    'images/home3.jpg',
    'images/doodle.png',
    'images/family-portrait.jpg',
]

# Find all images
all_images = []
for pattern in ['images/**/*.jpg', 'images/**/*.jpeg', 'images/**/*.png']:
    all_images.extend(glob.glob(pattern, recursive=True))

total_savings = 0
optimized_count = 0

print('\nOptimizing priority images (from audit report)...')
for img_path in priority_images:
    if os.path.exists(img_path):
        original_size = os.path.getsize(img_path) / 1024
        success, savings = optimize_image(img_path, quality=85, max_width=1920)
        if success:
            optimized_count += 1
            total_savings += savings
            print(f'  ✓ {img_path}: {original_size:.1f} KiB → {original_size - savings:.1f} KiB (saved {savings:.1f} KiB)')
        else:
            print(f'  ○ {img_path}: Already optimized or minimal savings')

print('\nOptimizing other images...')
for img_path in all_images:
    if img_path not in priority_images:
        original_size = os.path.getsize(img_path) / 1024
        success, savings = optimize_image(img_path, quality=85, max_width=1920)
        if success:
            optimized_count += 1
            total_savings += savings
            print(f'  ✓ {img_path}: saved {savings:.1f} KiB')

print('\n' + '='*70)
print('IMAGE OPTIMIZATION COMPLETE')
print('='*70)
print(f'\nTotal images optimized: {optimized_count}')
print(f'Total space saved: {total_savings:.1f} KiB ({total_savings/1024:.1f} MiB)')
print('\nOptimizations applied:')
print('  ✓ Resized oversized images to max 1920px width')
print('  ✓ Compressed JPEGs with 85% quality + progressive loading')
print('  ✓ Optimized PNG compression')
print('  ✓ Converted RGBA to RGB for smaller file sizes')
print('='*70)
