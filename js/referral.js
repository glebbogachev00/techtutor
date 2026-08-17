/**
 * Referral capture for TechTutor Academy.
 *
 * A family shares https://techtutor.academy?ref=fam-XXXXXXXXXX from their
 * parent page. That code has to survive two things before it is any use:
 *
 *   1. The region redirect at the root, which sends the visitor to /vn/, /en/,
 *      /in/ or /us/. Query strings are preserved there now, but this script
 *      stores the code immediately anyway so a redirect can never lose it.
 *   2. The gap between arriving and actually booking, which is usually a few
 *      pages and sometimes a few days.
 *
 * So: read it once, keep it in localStorage, and attach it to the trial form
 * on submit. Bookings arrive by email through Formspree, so the code rides
 * along as a hidden field and shows up in the enquiry.
 *
 * Load this BEFORE any redirect script.
 */
(function () {
  'use strict';

  var KEY = 'techtutor_ref';
  // Long enough to cover a family thinking it over, short enough that a code
  // does not get credited a year later.
  var MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
  // Codes we mint look like fam-XXXXXXXXXX. Kept permissive for campaign tags,
  // but bounded so nothing strange ends up in an email or in storage.
  var VALID = /^[A-Za-z0-9._-]{3,64}$/;

  function save(code) {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ code: code, at: Date.now() })
      );
    } catch (e) {
      /* private mode, or storage full — the visit still works */
    }
  }

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      if (!v || !v.code || !VALID.test(v.code)) return null;
      // First-touch wins, but only for as long as it is plausibly the reason
      // they came.
      if (typeof v.at === 'number' && Date.now() - v.at > MAX_AGE_MS) {
        localStorage.removeItem(KEY);
        return null;
      }
      return v.code;
    } catch (e) {
      return null;
    }
  }

  // Capture as early as possible — before any redirect runs.
  try {
    var fromUrl = new URLSearchParams(window.location.search).get('ref');
    if (fromUrl && VALID.test(fromUrl)) save(fromUrl);
  } catch (e) {
    /* no URLSearchParams — very old browser, nothing to do */
  }

  /**
   * Attach the stored code to every form on the page as a hidden field.
   * Runs on submit rather than on load so a code captured mid-visit (another
   * tab, a later navigation) is still picked up.
   */
  function attach() {
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      (function (form) {
        form.addEventListener('submit', function () {
          var code = read();
          if (!code) return;
          if (form.querySelector('input[name="referred_by"]')) return;
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'referred_by';
          input.value = code;
          form.appendChild(input);
        });
      })(forms[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  // Exposed so other scripts (or a future Supabase booking path) can read it.
  window.TechTutorReferral = { get: read };
})();
