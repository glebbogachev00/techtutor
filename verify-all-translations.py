import os
import sys
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def check_english_content(file_path):
    """Check for any remaining English content in a Vietnamese file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        issues = []

        # Common English phrases that shouldn't be in VN pages
        english_patterns = [
            # Section headings
            r'A Detailed Look at Our Curriculum',
            r'What You\'ll Master',
            r'Ready to Start',
            r'Get Started',

            # Common words in curriculum
            r'<h[1-6][^>]*>.*?(Build|Create|Master|Learn|Design|Code|Develop)(?!.*?(Xây|Tạo|Chủ|Học|Thiết|Lập|Phát)).*?</h[1-6]>',

            # Card titles - specific ones
            r'Complete Game Creation',
            r'Lua Scripting Mastery',
            r'3D Building & Design',
            r'Publishing & Sharing',
            r'3D Modeling',
            r'Texturing & Materials',
            r'Animation',
            r'Rendering',
            r'Python Programming',
            r'Machine Learning Basics',
            r'AI Applications',
            r'Data Analysis',
            r'Web Development Fundamentals',
            r'React & Modern Frameworks',
            r'Mobile App Development',
            r'Backend & Databases',

            # Tools section
            r'Roblox Studio',
            r'Lua Programming',
            r'3D Game Design',
            r'Blender Software',
            r'Modeling Techniques',
            r'Material & Lighting',
            r'Python Language',
            r'AI & ML Concepts',
            r'Real Applications',
            r'ChatGPT & LLMs',
            r'AI Image Generation',
            r'API Integration',
            r'HTML, CSS, JavaScript',
            r'React Framework',
            r'Full-Stack Skills',
        ]

        line_number = 0
        for line_num, line in enumerate(content.split('\n'), 1):
            # Skip comments, script tags, and meta tags
            if '<!--' in line or '<script' in line or '<meta' in line or 'data-i18n' in line:
                continue

            for pattern in english_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    # Make sure it's not followed by Vietnamese translation
                    if not re.search(r'(Xây|Tạo|Chủ|Học|Thiết|Lập|Phát|Kỹ|Thuật|Dụng|Liệu)', line):
                        issues.append(f"Line {line_num}: {line.strip()[:100]}")

        return issues
    except Exception as e:
        return [f"Error reading file: {e}"]

# Check all VN program pages
program_pages = [
    'vn/programs/scratch-game-coder.html',
    'vn/programs/gdevelop-game-designer.html',
    'vn/programs/roblox-world-creator.html',
    'vn/programs/3d-designer.html',
    'vn/programs/ai-programming-quest.html',
    'vn/programs/generative-ai-magic.html',
    'vn/programs/app-development.html',
]

print('=== COMPREHENSIVE TRANSLATION VERIFICATION ===\n')
print('Checking all Vietnamese program pages for English content...\n')

total_issues = 0

for page in program_pages:
    print(f'Checking {page}...')
    issues = check_english_content(page)

    if issues:
        print(f'  ❌ Found {len(issues)} potential issues:')
        for issue in issues[:5]:  # Show first 5 issues
            print(f'     {issue}')
        if len(issues) > 5:
            print(f'     ... and {len(issues) - 5} more')
        total_issues += len(issues)
    else:
        print(f'  ✅ No English content found')
    print()

if total_issues == 0:
    print('✅ ALL PAGES VERIFIED - No English content detected!')
else:
    print(f'⚠️  Total potential issues found: {total_issues}')
    print('These need to be reviewed and translated.')
