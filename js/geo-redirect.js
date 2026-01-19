/**
 * Geo-Redirection Logic for TechTutor Academy
 * Automatically redirects users to their regional site based on their country
 */

(function() {
  'use strict';

  // Check if we should skip redirection (if already on regional site)
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/in/') || currentPath.startsWith('/us/')) {
    // Already on a regional site, no need to redirect
    return;
  }

  // Check if user has manually selected a region (stored in localStorage)
  const manualRegion = localStorage.getItem('techtutor_region');
  if (manualRegion) {
    // User has manually selected, respect their choice
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

    // Fallback: Try to detect from navigator.language
    const language = navigator.language || navigator.userLanguage;
    if (language) {
      const lang = language.toLowerCase();

      // India
      if (lang.includes('en-in') || lang.includes('hi')) {
        return 'in';
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

    // Default: no redirection (stay on /en/ or /vn/)
    return null;
  }

  // Perform redirection if needed
  function redirectToRegion() {
    const detectedCountry = detectCountry();

    if (!detectedCountry) {
      // No specific region detected, stay on current site
      return;
    }

    // Only redirect from /en/ pages
    if (!currentPath.startsWith('/en/')) {
      return;
    }

    // IMPORTANT: Only redirect from homepage (index.html) to avoid disrupting navigation
    // Users clicking on EN links should stay on EN unless they're on the homepage
    if (!currentPath.endsWith('/en/') && !currentPath.endsWith('/en/index.html')) {
      // Not on homepage, don't redirect
      return;
    }

    // Build the redirect URL
    const newPath = currentPath.replace('/en/', `/${detectedCountry}/`);
    const newUrl = window.location.origin + newPath + window.location.search + window.location.hash;

    // Perform redirect
    console.log(`Redirecting to ${detectedCountry.toUpperCase()} site:`, newUrl);
    window.location.replace(newUrl);
  }

  // Run redirection on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', redirectToRegion);
  } else {
    redirectToRegion();
  }
})();
