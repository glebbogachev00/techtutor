/**
 * Language Redirect
 * Detects user language preference and redirects to appropriate version
 * Priority: 1) Saved preference, 2) Browser language, 3) Geolocation, 4) Default to English
 */

(function() {
  'use strict';

  const currentPath = window.location.pathname;
  if (currentPath !== '/' && currentPath !== '/index.html') {
    return;
  }

  try {
    const saved = localStorage.getItem('tt-lang-manual');
    if (saved === 'en' || saved === 'vn') {
      window.location.replace(`/${saved}/`);
      return;
    }
  } catch (error) {
    console.warn('[LangRedirect] Unable to read saved language', error);
  }

  detectLanguage().then((lang) => {
    window.location.replace(`/${lang}/`);
  });

  async function detectLanguage() {
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('vi')) {
      return 'vn';
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 450);
      const response = await fetch('https://cloudflare.com/cdn-cgi/trace', { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await response.text();
      if (data && data.includes('loc=VN')) {
        return 'vn';
      }
    } catch (error) {
      console.warn('[LangRedirect] Geolocation fallback failed', error.message);
    }

    return 'en';
  }
})();
