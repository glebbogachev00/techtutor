(function() {
  'use strict';

  const target = document.body && document.body.dataset ? document.body.dataset.redirectTarget : null;
  if (!target) {
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  if (body) {
    body.style.transition = 'opacity 160ms ease';
    body.style.opacity = '0';
    body.style.pointerEvents = 'none';
  }
  if (root && !root.style.backgroundColor) {
    root.style.backgroundColor = '#f8fafc';
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

  const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  redirectTo(browserLang.startsWith('vi') ? 'vn' : 'en');
})();
