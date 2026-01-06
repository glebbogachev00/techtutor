(function() {
  'use strict';

  const target = document.body && document.body.dataset ? document.body.dataset.redirectTarget : null;
  if (!target) {
    return;
  }

  function redirectTo(lang) {
    const safeLang = lang === 'vn' ? 'vn' : 'en';
    const destination = `/${safeLang}/${target}`;
    window.location.replace(destination);
  }

  try {
    const saved = localStorage.getItem('tt-lang-manual');
    if (saved === 'vn' || saved === 'en') {
      redirectTo(saved);
      return;
    }
  } catch (error) {
    console.warn('[LocaleRedirect] Unable to read saved language:', error);
  }

  detectLanguage().then(redirectTo).catch(() => redirectTo('en'));

  async function detectLanguage() {
    // Try geolocation first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch('https://cloudflare.com/cdn-cgi/trace', { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await response.text();
      if (data) {
        const lines = data.split('\n');
        const locationLine = lines.find(line => line.startsWith('loc='));
        if (locationLine) {
          const country = locationLine.split('=')[1].trim();
          if (country === 'VN') {
            return 'vn';
          }
        }
      }
    } catch (error) {
      console.warn('[LocaleRedirect] Geolocation failed:', error.message);
    }

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('vi')) {
      return 'vn';
    }

    return 'en';
  }
})();
