/**
 * Root-level Geo-Redirection Logic for TechTutor Academy
 * Automatically redirects users from the root (/) to their regional site
 */

(function() {
  'use strict';

  // Check if user has manually selected a region (stored in localStorage)
  const manualRegion = localStorage.getItem('techtutor_region');
  if (manualRegion) {
    // User has manually selected, respect their choice
    window.location.href = `${manualRegion}/index.html`;
    return;
  }

  // Detect user's country using timezone and navigator
  function detectCountry() {
    // Try to detect based on timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // India timezones
    if (timezone && (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta'))) {
      return 'in';
    }

    // US and Western countries timezones (US, Canada, Europe, UK, Australia, NZ)
    const westernTimezones = [
      // United States
      'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
      'America/Phoenix', 'America/Anchorage', 'Pacific/Honolulu',
      // Canada
      'America/Toronto', 'America/Vancouver', 'America/Edmonton', 'America/Winnipeg',
      'America/Halifax', 'America/Montreal',
      // Europe
      'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Rome',
      'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Vienna', 'Europe/Stockholm',
      'Europe/Oslo', 'Europe/Copenhagen', 'Europe/Helsinki', 'Europe/Dublin',
      'Europe/Zurich', 'Europe/Prague', 'Europe/Warsaw', 'Europe/Budapest',
      'Europe/Athens', 'Europe/Lisbon', 'Europe/Bucharest',
      // United Kingdom
      'Europe/Belfast', 'Europe/Edinburgh', 'Europe/Cardiff',
      // Australia
      'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
      'Australia/Perth', 'Australia/Adelaide', 'Australia/Hobart',
      'Australia/Darwin', 'Australia/Canberra',
      // New Zealand
      'Pacific/Auckland', 'Pacific/Wellington', 'Pacific/Chatham'
    ];

    if (timezone && westernTimezones.some(tz => timezone.includes(tz))) {
      return 'us';
    }

    // Vietnam timezone
    if (timezone && timezone.includes('Asia/Ho_Chi_Minh')) {
      return 'vn';
    }

    // Fallback: Try to detect from navigator.language
    const language = navigator.language || navigator.userLanguage;
    if (language) {
      const lang = language.toLowerCase();

      // India
      if (lang.includes('en-in') || lang.includes('hi')) {
        return 'in';
      }

      // Vietnam
      if (lang.includes('vi')) {
        return 'vn';
      }

      // US and Western countries
      if (lang.includes('en-us') || lang.includes('en-ca') || lang.includes('en-gb') ||
          lang.includes('en-au') || lang.includes('en-nz') || lang.includes('fr-ca') ||
          lang.includes('fr-fr') || lang.includes('de') || lang.includes('es-es') ||
          lang.includes('it') || lang.includes('nl') || lang.includes('sv') ||
          lang.includes('no') || lang.includes('da') || lang.includes('fi')) {
        return 'us';
      }
    }

    // Default: redirect to EN version
    return 'en';
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
