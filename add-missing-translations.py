#!/usr/bin/env python3
"""
Add data-i18n attributes to commonly missing elements in VN pages
This will enable translation for sections that are currently in English
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Common text replacements to add data-i18n attributes
REPLACEMENTS = [
    # Navigation and buttons
    (r'>Login</a>', ' data-i18n="nav.login">Login</a>'),
    (r'>Menu</button>', ' data-i18n="nav.menu">Menu</button>'),

    # "How It Works" page specific
    (r'>Live on Zoom</h3>', ' data-i18n="how.live.title">Live on Zoom</h3>'),
    (r'>Flexible Schedule</h3>', ' data-i18n="how.schedule.title">Flexible Schedule</h3>'),
    (r'>Face-to-face interaction with instructors through live video sessions\. No pre-recorded videos\.</p>',
     ' data-i18n="how.live.description">Face-to-face interaction with instructors through live video sessions. No pre-recorded videos.</p>'),
    (r'>Classes 1-5 times per week\. We recommend 2-3 sessions weekly for optimal learning progress\.</p>',
     ' data-i18n="how.schedule.description">Classes 1-5 times per week. We recommend 2-3 sessions weekly for optimal learning progress.</p>'),

    # Common sections
    (r'>See Our Classes in Action</h2>', ' data-i18n="carousel.title">See Our Classes in Action</h2>'),
    (r'>Diverse Project Types</h3>', ' data-i18n="projects.diverse.title">Diverse Project Types</h3>'),
    (r'>Real-World Skills</h3>', ' data-i18n="projects.skills.title">Real-World Skills</h3>'),
    (r'>Showcase & Share</h3>', ' data-i18n="projects.showcase.title">Showcase & Share</h3>'),

    # Project descriptions
    (r'>Students create games, apps, AI projects, 3D designs, and more across multiple platforms and tools\.</p>',
     ' data-i18n="projects.diverse.description">Students create games, apps, AI projects, 3D designs, and more across multiple platforms and tools.</p>'),
    (r'>Students apply programming, design, and problem-solving skills to build portfolio-worthy projects\.</p>',
     ' data-i18n="projects.skills.description">Students apply programming, design, and problem-solving skills to build portfolio-worthy projects.</p>'),
    (r'>Students publish their projects online and share their creations with friends and family\.</p>',
     ' data-i18n="projects.showcase.description">Students publish their projects online and share their creations with friends and family.</p>'),

    # Online courses page
    (r'>Python Programming</h3>', ' data-i18n="courses.python.title">Python Programming</h3>'),
    (r'>AI Fundamentals</h3>', ' data-i18n="courses.ai.title">AI Fundamentals</h3>'),
    (r'>Build AI Projects</h3>', ' data-i18n="courses.ai.build.title">Build AI Projects</h3>'),
    (r'>Data Science Basics</h3>', ' data-i18n="courses.data.title">Data Science Basics</h3>'),

    # AI-Powered Storytelling section
    (r'>GENERATIVE AI</span>', ' data-i18n="projects.genai.tag">GENERATIVE AI</span>'),
    (r'>AI-Powered Storytelling</h2>', ' data-i18n="projects.genai.title">AI-Powered Storytelling</h2>'),
    (r'>Student:</span>', ' data-i18n="projects.student">Student:</span>'),
    (r'>Focus:</span>', ' data-i18n="projects.focus">Focus:</span>'),
    (r'>Tools Used</h3>', ' data-i18n="projects.tools">Tools Used</h3>'),

    # Program pages - common elements
    (r'>Scratch Game Coder</a>', ' data-i18n="programs.scratch.title">Scratch Game Coder</a>'),
    (r'>GDevelop Game Designer</a>', ' data-i18n="programs.gdevelop.title">GDevelop Game Designer</a>'),
    (r'>Roblox World Creator</a>', ' data-i18n="programs.roblox.title">Roblox World Creator</a>'),
    (r'>3D Designer</a>', ' data-i18n="programs.3d.title">3D Designer</a>'),
    (r'>AI & Programming Quest</a>', ' data-i18n="programs.ai.title">AI & Programming Quest</a>'),
    (r'>Generative AI Magic</a>', ' data-i18n="programs.genai.title">Generative AI Magic</a>'),
    (r'>App Development</a>', ' data-i18n="programs.app.title">App Development</a>'),
]

def add_data_i18n_attributes(file_path):
    """Add data-i18n attributes to VN pages"""
    print(f"Processing {file_path}...")

    content = file_path.read_text(encoding='utf-8')
    original_content = content
    changes = 0

    for pattern, replacement in REPLACEMENTS:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            changes += 1

    if content != original_content:
        file_path.write_text(content, encoding='utf-8')
        print(f"[OK] Added {changes} data-i18n attributes to {file_path.name}")
    else:
        print(f"[SKIP] No changes needed for {file_path.name}")

def main():
    print("=" * 60)
    print("Adding data-i18n attributes to VN pages...")
    print("=" * 60)

    # Process VN root files
    vn_dir = BASE_DIR / 'vn'
    count = 0

    for html_file in vn_dir.glob('*.html'):
        if html_file.is_file():
            add_data_i18n_attributes(html_file)
            count += 1

    # Process VN programs files
    vn_programs = vn_dir / 'programs'
    if vn_programs.exists():
        for html_file in vn_programs.glob('*.html'):
            if html_file.is_file():
                add_data_i18n_attributes(html_file)
                count += 1

    print("\n" + "=" * 60)
    print(f"[SUCCESS] Processed {count} files!")
    print("=" * 60)
    print("\nNext: Run the translations update script to add Vietnamese translations")

if __name__ == '__main__':
    main()
