/**
 * Root-level Geo-Redirection Logic for TechTutor Academy
 * Automatically redirects users from the root (/) to their regional site
 */

(function() {
  'use strict';

  // Check URL parameter to force a specific region or clear localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const forceRegion = urlParams.get('region');

  if (forceRegion === 'clear') {
    // Clear localStorage and continue with auto-detection
    localStorage.removeItem('techtutor_region');
    console.log('🧹 Cleared manual region preference');
  } else if (forceRegion && ['en', 'vn', 'in', 'us'].includes(forceRegion)) {
    // Force redirect to specific region
    console.log('🔗 URL parameter forcing region:', forceRegion);
    window.location.href = `${forceRegion}/index.html`;
    return;
  }

  // Check if user has manually selected a region (stored in localStorage)
  const manualRegion = localStorage.getItem('techtutor_region');
  if (manualRegion) {
    // User has manually selected, respect their choice
    console.log('💾 Using saved region preference:', manualRegion);
    window.location.href = `${manualRegion}/index.html`;
    return;
  }

  // Detect user's country using timezone and navigator
  function detectCountry() {
    // Try to detect based on timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('🌍 Detected timezone:', timezone);

    // India timezones
    if (timezone && (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta'))) {
      console.log('✅ India timezone detected');
      return 'in';
    }

    // Vietnam timezones
    // Note: Vietnam officially uses Asia/Ho_Chi_Minh, Asia/Saigon, or sometimes Asia/Bangkok (UTC+7)
    if (timezone && (timezone.includes('Asia/Ho_Chi_Minh') || timezone.includes('Asia/Saigon') || timezone.includes('Asia/Hanoi'))) {
      console.log('✅ Vietnam timezone detected');
      return 'vn';
    }

    // Check if timezone starts with Asia/ (might be India or other Asian countries)
    if (timezone && timezone.startsWith('Asia/')) {
      // First check for other major Asian countries that should go to US
      const asianUSTimezones = ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Hong_Kong',
                                'Asia/Singapore', 'Asia/Dubai', 'Asia/Manila'];

      if (asianUSTimezones.some(tz => timezone.includes(tz))) {
        console.log('✅ Asian timezone (non-India, non-Vietnam) detected');
        return 'us';
      }

      // Special case: Bangkok timezone is used by Thailand AND sometimes Vietnam
      // Need to check language to differentiate
      if (timezone.includes('Asia/Bangkok')) {
        const language = navigator.language || navigator.userLanguage;
        if (language && language.toLowerCase().includes('vi')) {
          console.log('✅ Bangkok timezone + Vietnamese language = Vietnam');
          return 'vn';
        }
        console.log('✅ Bangkok timezone (Thailand) detected');
        return 'us';
      }

      // Any other Asia/ timezone that's not India or Vietnam likely should go to IN
      // (since most Asian traffic to an education site will be from India)
      console.log('⚠️ Other Asian timezone detected, defaulting to India');
      return 'in';
    }

    // Check if timezone starts with common Western patterns
    if (timezone) {
      // US and Canada: America/
      if (timezone.startsWith('America/')) {
        console.log('✅ Americas timezone detected (US/Canada)');
        return 'us';
      }

      // Europe: Europe/
      if (timezone.startsWith('Europe/')) {
        console.log('✅ Europe timezone detected');
        return 'us';
      }

      // Australia: Australia/
      if (timezone.startsWith('Australia/')) {
        console.log('✅ Australia timezone detected');
        return 'us';
      }

      // New Zealand: Pacific/Auckland, Pacific/Wellington, etc
      if (timezone.startsWith('Pacific/') &&
          (timezone.includes('Auckland') || timezone.includes('Wellington') || timezone.includes('Chatham'))) {
        console.log('✅ New Zealand timezone detected');
        return 'us';
      }
    }

    // Fallback: Try to detect from navigator.language
    const language = navigator.language || navigator.userLanguage;
    console.log('🗣️ Browser language:', language);

    if (language) {
      const lang = language.toLowerCase();

      // India
      if (lang.includes('en-in') || lang.includes('hi')) {
        console.log('✅ India language detected');
        return 'in';
      }

      // Vietnam
      if (lang.includes('vi')) {
        console.log('✅ Vietnam language detected');
        return 'vn';
      }

      // US and Western countries
      if (lang.includes('en-us') || lang.includes('en-ca') || lang.includes('en-gb') ||
          lang.includes('en-au') || lang.includes('en-nz') || lang.includes('fr-ca') ||
          lang.includes('fr-fr') || lang.includes('de') || lang.includes('es-es') ||
          lang.includes('it') || lang.includes('nl') || lang.includes('sv') ||
          lang.includes('no') || lang.includes('da') || lang.includes('fi')) {
        console.log('✅ Western language detected');
        return 'us';
      }
    }

    // Default: redirect to US version (most likely audience)
    console.log('⚠️ No specific match, defaulting to US');
    return 'us';
  }

  // Perform redirection
  function redirectToRegion() {
    const detectedCountry = detectCountry();
    const targetUrl = `${detectedCountry}/index.html`;

    console.log(`Redirecting to ${detectedCountry.toUpperCase()} site:`, targetUrl);
    window.location.href = targetUrl;
  }

  // Run redirection immediately
  redirectToRegion();
})();
