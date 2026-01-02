/**
 * Geo-based Language Redirect
 * Detects user location and redirects to appropriate language version
 * Only runs on root page (/)
 */

(function() {
  'use strict';

  // Only run on root page
  const currentPath = window.location.pathname;
  if (currentPath !== '/' && currentPath !== '/index.html') {
    return;
  }

  // Check if user has manually selected a language before
  const savedLang = localStorage.getItem('tt-lang-manual');

  if (savedLang) {
    // User has previously chosen a language - respect their choice
    console.log('[GeoRedirect] User preference found:', savedLang);
    window.location.replace(`/${savedLang}/`);
    return;
  }

  // Detect language based on geo-location
  detectLanguageAndRedirect();

  async function detectLanguageAndRedirect() {
    let targetLang = 'en'; // Default fallback

    try {
      console.log('[GeoRedirect] Detecting location...');

      // Use CloudFlare's free IP geolocation API
      const response = await fetch('https://cloudflare.com/cdn-cgi/trace', {
        method: 'GET'
      });

      const data = await response.text();
      const lines = data.split('\n');
      const locationLine = lines.find(line => line.startsWith('loc='));

      if (locationLine) {
        const countryCode = locationLine.split('=')[1];
        console.log('[GeoRedirect] Detected country:', countryCode);

        // Vietnam = VN, redirect to Vietnamese
        if (countryCode === 'VN') {
          targetLang = 'vn';
        }
      }
    } catch (error) {
      console.log('[GeoRedirect] Geo-detection failed, defaulting to English:', error);
    }

    console.log('[GeoRedirect] Redirecting to:', targetLang);

    // Perform redirect
    window.location.replace(`/${targetLang}/`);
  }
})();
