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
    const targetLang = currentLang === 'en' ? 'vn' : 'en';

    console.log('[LangSwitcher] Current language:', currentLang);

    // Update all language switcher buttons
    const langButtons = document.querySelectorAll('[data-lang]');

    langButtons.forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');

      // Update button styles based on current language
      if (btnLang === currentLang) {
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

    // Save user's manual language preference
    localStorage.setItem('tt-lang-manual', targetLang);
    localStorage.setItem('tt-lang', targetLang); // Keep for compatibility

    // Get current path and replace language prefix
    const currentPath = window.location.pathname;
    let newPath;

    if (currentPath.startsWith('/en/')) {
      newPath = currentPath.replace('/en/', `/${targetLang}/`);
    } else if (currentPath.startsWith('/vn/')) {
      newPath = currentPath.replace('/vn/', `/${targetLang}/`);
    } else if (currentPath === '/en' || currentPath === '/en/') {
      newPath = `/${targetLang}/`;
    } else if (currentPath === '/vn' || currentPath === '/vn/') {
      newPath = `/${targetLang}/`;
    } else {
      newPath = `/${targetLang}/`;
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
