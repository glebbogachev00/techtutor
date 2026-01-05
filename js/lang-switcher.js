/**
 * Language Switcher
 * Handles manual language switching between English and Vietnamese
 * Saves user preference to prevent auto-redirects
 */

(function() {
  'use strict';

  function initLanguageSwitcher() {
    // Detect current language from URL path
    const currentPath = window.location.pathname;
    const currentLang = currentPath.startsWith('/vn') ? 'vn' : 'en';

    console.log('[LangSwitcher] Current language:', currentLang);

    // Update all language switcher buttons
    const langButtons = document.querySelectorAll('[data-lang]');

    langButtons.forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');

      // Map button language to directory (vi → vn)
      const btnDir = btnLang === 'vi' ? 'vn' : btnLang;

      // Update button styles based on current language
      if (btnDir === currentLang) {
        btn.classList.add('bg-primary', 'text-white');
        btn.classList.remove('text-slate-500', 'hover:bg-slate-100');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('text-slate-500', 'hover:bg-slate-100');
        btn.setAttribute('aria-pressed', 'false');
      }

      // Add click handler to switch language
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchLanguage(btnLang);
      });
    });
  }

  function switchLanguage(targetLang) {
    console.log('[LangSwitcher] Switching to:', targetLang);

    // Map language code to directory name (vi → vn for Vietnamese)
    const langToDir = {
      'en': 'en',
      'vi': 'vn',
      'vn': 'vn'  // Support both for compatibility
    };

    const dirName = langToDir[targetLang] || targetLang;

    // Save user's manual language preference (use directory name)
    localStorage.setItem('tt-lang-manual', dirName);
    localStorage.setItem('tt-lang', targetLang); // Keep for compatibility

    // Get current path and filename
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const currentFile = pathParts[pathParts.length - 1] || 'index.html';

    // Determine current language directory
    const currentLang = currentPath.includes('/vn/') || currentPath.includes('/vn') ? 'vn' : 'en';

    // Build relative path to switch language
    let newPath;
    if (currentLang === dirName) {
      // Same language, don't navigate
      return;
    } else if (currentLang === 'vn' && dirName === 'en') {
      // From vn to en
      newPath = '../en/' + currentFile;
    } else if (currentLang === 'en' && dirName === 'vn') {
      // From en to vn
      newPath = '../vn/' + currentFile;
    } else {
      // Fallback
      newPath = '../' + dirName + '/' + currentFile;
    }

    console.log('[LangSwitcher] Navigating to:', newPath);

    // Navigate to new language version
    window.location.href = newPath;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  } else {
    initLanguageSwitcher();
  }

  // Export for external use
  window.switchLanguage = switchLanguage;
})();
