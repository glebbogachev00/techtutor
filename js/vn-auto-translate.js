/**
 * Vietnamese Auto-Translation
 * Automatically applies Vietnamese translations on page load for /vn/ pages
 */

(function() {
  'use strict';

  function applyVietnameseTranslations() {
    // Wait for translations to be loaded
    if (!window.pageTranslations || !window.pageTranslations.vi) {
      console.warn('[VN Auto-Translate] Translations not loaded yet, retrying...');
      setTimeout(applyVietnameseTranslations, 100);
      return;
    }

    console.log('[VN Auto-Translate] Applying Vietnamese translations...');

    const translations = window.pageTranslations.vi;
    let translatedCount = 0;

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[key];
        } else {
          el.innerHTML = translations[key];
        }
        translatedCount++;
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        el.placeholder = translations[key];
        translatedCount++;
      }
    });

    console.log(`[VN Auto-Translate] Translated ${translatedCount} elements`);
  }

  // Run translation on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyVietnameseTranslations);
  } else {
    applyVietnameseTranslations();
  }
})();
