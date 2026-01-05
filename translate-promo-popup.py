import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_promo_popup(file_path):
    """Translate promo popup to Vietnamese"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        translations = {
            'LIMITED TIME OFFER': 'ƯU ĐÃI CÓ THỜI HẠN',
            'Get Up to 20% Off Today!': 'Giảm Giá Lên Đến 20% Hôm Nay!',
            'Book your free trial now and get up to 20% off your first course bundle': 'Đặt buổi học thử miễn phí ngay và nhận giảm giá lên đến 20% cho gói khóa học đầu tiên của bạn',
            'placeholder="Parent Name"': 'placeholder="Tên Phụ Huynh"',
            'placeholder="Child Name"': 'placeholder="Tên Con"',
            'placeholder="Email"': 'placeholder="Email"',
            'placeholder="Phone (Zalo/WhatsApp)"': 'placeholder="Số Điện Thoại (Zalo/WhatsApp)"',
            'placeholder="Child Age"': 'placeholder="Tuổi Con"',
            '>Claim 20% Discount<': '>Nhận Giảm Giá 20%<',
        }

        for en_text, vn_text in translations.items():
            content = content.replace(en_text, vn_text)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== TRANSLATING PROMO POPUP ===\n')

if os.path.exists('vn/index.html'):
    print('Translating vn/index.html...')
    if translate_promo_popup('vn/index.html'):
        print('  ✓ Translated promo popup\n')
else:
    print('  ✗ File not found\n')

print('✅ Promo popup translated!')
