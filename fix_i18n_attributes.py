#!/usr/bin/env python3
"""
Smart i18n Attribute Fixer
This script properly adds data-i18n attributes to the exact text elements
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\Manthan\.vscode\techtutor")
VN_DIR = BASE_DIR / "vn"

# Text replacements: (exact_text_or_pattern, replacement_with_i18n)
FIXES = [
    # Login buttons - add to the actual text, not parent div
    (
        r'<a href="/vn/login\.html"[^>]*>\s*<svg[^>]*>.*?</svg>\s*Login\s*</a>',
        lambda m: m.group(0).replace(
            'Login',
            '<span data-i18n="nav.login">Login</span>'
        )
    ),

    # Footer section titles
    (r'<h3[^>]*>CONTACT US!</h3>', '<h3 class="text-lg font-bold mb-4 text-white" data-i18n="footer.contact.title">CONTACT US!</h3>'),
    (r'<h3[^>]*>OPENING HOURS</h3>', '<h3 class="text-lg font-bold mb-4 text-white" data-i18n="footer.hours.title">OPENING HOURS</h3>'),
    (r'<h3[^>]*>START LEARNING</h3>', '<h3 class="text-lg font-bold mb-4 text-white" data-i18n="footer.learning.title">START LEARNING</h3>'),
    (r'<h3[^>]*>CONNECT WITH US!</h3>', '<h3 class="text-lg font-bold mb-4 text-white" data-i18n="footer.social.title">CONNECT WITH US!</h3>'),

    # Footer content items
    (r'<p class="text-slate-400 mb-1">Tel/WA/Zalo:</p>', '<p class="text-slate-400 mb-1" data-i18n="footer.contact.phone_label">Tel/WA/Zalo:</p>'),
    (r'<p class="text-slate-400 mb-1">Email:</p>', '<p class="text-slate-400 mb-1" data-i18n="footer.contact.email_label">Email:</p>'),
    (r'<p class="text-slate-300">Monday - Friday: 8am - 9pm</p>', '<p class="text-slate-300" data-i18n="footer.hours.weekday">Monday - Friday: 8am - 9pm</p>'),
    (r'<p class="text-slate-300">Saturday - Sunday: 8am - 8pm</p>', '<p class="text-slate-300" data-i18n="footer.hours.weekend">Saturday - Sunday: 8am - 8pm</p>'),

    # Footer links
    (r'<a href="/vn/#programs"[^>]*>Programs</a>', lambda m: m.group(0).replace('>Programs<', ' data-i18n="footer.learning.programs">Programs<')),
    (r'<a href="/vn/student-projects\.html"[^>]*>Projects</a>', lambda m: m.group(0).replace('>Projects<', ' data-i18n="footer.learning.projects">Projects<')),
    (r'<a href="/vn/plans-and-faq\.html"[^>]*>Pricing</a>', lambda m: m.group(0).replace('>Pricing<', ' data-i18n="footer.learning.pricing">Pricing<')),
    (r'<a href="/vn/blog\.html"[^>]*>Blog</a>', lambda m: m.group(0).replace('>Blog<', ' data-i18n="footer.learning.blog">Blog<')),
    (r'<a href="/vn/vision\.html"[^>]*>Our Vision</a>', lambda m: m.group(0).replace('>Our Vision<', ' data-i18n="footer.learning.vision">Our Vision<')),
    (r'<a href="/vn/free-trial\.html"[^>]*>Free trial</a>', lambda m: m.group(0).replace('>Free trial<', ' data-i18n="footer.learning.trial">Free trial<')),

    # Menu button
    (r'<button[^>]*>Menu</button>', lambda m: m.group(0).replace('>Menu<', ' data-i18n="nav.menu">Menu<')),
]


def fix_file(file_path):
    """Fix i18n attributes in a single file."""
    print(f"\nProcessing: {file_path.name}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes = 0

    for pattern, replacement in FIXES:
        if callable(replacement):
            # Function-based replacement
            matches = list(re.finditer(pattern, content, re.DOTALL))
            for match in reversed(matches):  # Process from end to avoid offset issues
                if 'data-i18n=' not in match.group(0):  # Only if not already has i18n
                    new_text = replacement(match)
                    content = content[:match.start()] + new_text + content[match.end():]
                    changes += 1
        else:
            # String-based replacement
            if pattern in content and 'data-i18n=' not in content[content.find(pattern):content.find(pattern)+200]:
                content = content.replace(pattern, replacement)
                changes += 1

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [OK] Made {changes} fixes")
    else:
        print(f"  [INFO] No fixes needed")

    return changes


def main():
    """Main execution."""
    print("=" * 80)
    print("SMART i18n ATTRIBUTE FIXER FOR TECHTUTOR VN PAGES")
    print("=" * 80)

    html_files = list(VN_DIR.glob("**/*.html"))
    print(f"\nFound {len(html_files)} HTML files")

    total_changes = 0
    for html_file in html_files:
        total_changes += fix_file(html_file)

    print("\n" + "=" * 80)
    print(f"COMPLETE! Made {total_changes} total fixes")
    print("=" * 80)


if __name__ == "__main__":
    main()
