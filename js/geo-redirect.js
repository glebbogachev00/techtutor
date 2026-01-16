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

    // US timezones
    const usTimezones = [
      'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
      'America/Phoenix', 'America/Anchorage', 'Pacific/Honolulu'
    ];
    if (timezone && usTimezones.some(tz => timezone.includes(tz))) {
      return 'us';
    }

    // Fallback: Try to detect from navigator.language
    const language = navigator.language || navigator.userLanguage;
    if (language) {
      if (language.toLowerCase().includes('en-in')) {
        return 'in';
      }
      if (language.toLowerCase().includes('en-us')) {
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
