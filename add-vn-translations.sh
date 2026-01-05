#!/bin/bash
# Add translations.js and auto-translation to all VN pages

for file in vn/*.html vn/programs/*.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    # Check if translations.js is already loaded
    if ! grep -q "translations.js" "$file"; then
      # Add translations.js before lang-switcher.js
      sed -i 's|<script src="../js/lang-switcher.js"|<script src="../js/translations.js" defer></script>\n  <script src="../js/lang-switcher.js"|g' "$file"
    fi

    # Add auto-translation script if not present
    if ! grep -q "Auto-translate Vietnamese" "$file"; then
      # Add inline script after lang-switcher.js
      sed -i 's|</body>|  <script>\n    // Auto-translate Vietnamese pages on load\n    if (window.pageTranslations) {\n      document.addEventListener("DOMContentLoaded", function() {\n        document.querySelectorAll("[data-i18n]").forEach(el => {\n          const key = el.getAttribute("data-i18n");\n          if (window.pageTranslations.vi && window.pageTranslations.vi[key]) {\n            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {\n              el.placeholder = window.pageTranslations.vi[key];\n            } else {\n              el.innerHTML = window.pageTranslations.vi[key];\n            }\n          }\n        });\n        \n        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {\n          const key = el.getAttribute("data-i18n-placeholder");\n          if (window.pageTranslations.vi && window.pageTranslations.vi[key]) {\n            el.placeholder = window.pageTranslations.vi[key];\n          }\n        });\n      });\n    }\n  </script>\n</body>|g' "$file"
    fi
  fi
done

echo "Done! All VN pages updated with translation support."
