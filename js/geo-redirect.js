/**
 * Language Redirect
 * Detects user language preference and redirects to appropriate version
 * Priority: 1) Saved preference, 2) Browser language, 3) Geolocation, 4) Default to English
 */

(function() {
  'use strict';

  console.log('[LangRedirect] Script started, path:', window.location.pathname);

  // Only run on root page
  const currentPath = window.location.pathname;
  if (currentPath !== '/' && currentPath !== '/index.html') {
    console.log('[LangRedirect] Not root page, exiting');
    return;
  }

  // Check if user has manually selected a language before
  const savedLang = localStorage.getItem('tt-lang-manual');

  if (savedLang) {
    console.log('[LangRedirect] User preference found:', savedLang);
    console.log('[LangRedirect] Redirecting to saved preference...');
    window.location.replace(`/${savedLang}/`);
    return;
  }

  console.log('[LangRedirect] No saved preference, detecting language...');

  // Detect language and redirect
  detectLanguageAndRedirect();

  async function detectLanguageAndRedirect() {
    let targetLang = 'en'; // Default fallback

    // 1. First try browser language (most reliable, works on localhost)
    const browserLang = navigator.language || navigator.userLanguage;
    console.log('[LangRedirect] Browser language:', browserLang);

    if (browserLang && browserLang.toLowerCase().startsWith('vi')) {
      console.log('[LangRedirect] Vietnamese browser detected!');
      targetLang = 'vn';
    } else {
      console.log('[LangRedirect] Non-Vietnamese browser, trying geolocation...');

      // 2. Try geolocation as fallback (for production)
      try {
        const response = await fetch('https://cloudflare.com/cdn-cgi/trace');
        const data = await response.text();
        console.log('[LangRedirect] Cloudflare response:', data ? 'received' : 'empty');

        if (data) {
          const lines = data.split('\n');
          const locationLine = lines.find(line => line.startsWith('loc='));

          if (locationLine) {
            const countryCode = locationLine.split('=')[1].trim();
            console.log('[LangRedirect] Detected country:', countryCode);

            if (countryCode === 'VN') {
              console.log('[LangRedirect] Vietnam detected via geolocation!');
              targetLang = 'vn';
            }
          } else {
            console.log('[LangRedirect] No location data in response');
          }
        }
      } catch (error) {
        console.log('[LangRedirect] Geolocation failed:', error.message);
      }
    }

    console.log('[LangRedirect] Final decision: Redirecting to /' + targetLang + '/');

    // Small delay so console logs are visible
    setTimeout(() => {
      window.location.replace(`/${targetLang}/`);
    }, 100);
  }
})();
