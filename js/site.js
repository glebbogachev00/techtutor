(function () {
  function initNavigation() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', () => {
        const expanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', (!expanded).toString());
        mobileMenu.classList.toggle('hidden');
      });
    }

    const programsToggle = document.getElementById('mobile-programs-toggle');
    const programsMenu = document.getElementById('mobile-programs-menu');
    const arrow = document.getElementById('programs-arrow');
    if (programsToggle && programsMenu) {
      programsToggle.addEventListener('click', () => {
        programsMenu.classList.toggle('hidden');
        if (arrow) {
          arrow.classList.toggle('rotate-180');
        }
      });
    }

    const techbashToggle = document.getElementById('mobile-techbash-toggle');
    const techbashMenu = document.getElementById('mobile-techbash-menu');
    const techbashArrow = document.getElementById('techbash-arrow');
    if (techbashToggle && techbashMenu) {
      techbashToggle.addEventListener('click', () => {
        techbashMenu.classList.toggle('hidden');
        if (techbashArrow) {
          techbashArrow.classList.toggle('rotate-180');
        }
      });
    }
  }

  function initLanguagePreference() {
    // Skip language preference logic for US/IN sites (they don't have language switchers)
    const path = window.location.pathname || '';
    if (path.includes('/us/') || path.includes('/in/')) {
      return;
    }

    const langLinks = document.querySelectorAll('a[href*="/en/"], a[href*="/vn/"]');
    if (!langLinks.length) {
      return;
    }

    langLinks.forEach((link) => {
      link.addEventListener('click', () => {
        try {
          if (link.href.includes('/vn/')) {
            localStorage.setItem('tt-lang-manual', 'vn');
          } else if (link.href.includes('/en/')) {
            localStorage.setItem('tt-lang-manual', 'en');
          }
        } catch (error) {
          console.warn('Unable to persist language preference:', error);
        }
      });
    });
  }

  function cacheCurrentLanguage() {
    const path = window.location.pathname || '';

    // Skip language caching for US/IN sites (they don't have language switchers)
    if (path.includes('/us/') || path.includes('/in/')) {
      return;
    }

    try {
      if (path.includes('/vn/')) {
        localStorage.setItem('tt-lang-manual', 'vn');
      } else if (path.includes('/en/')) {
        localStorage.setItem('tt-lang-manual', 'en');
      }
    } catch (error) {
      console.warn('Unable to cache current language:', error);
    }
  }

  function initFormspree() {
    const forms = document.querySelectorAll('form[data-formspree]');
    forms.forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        const statusId = form.dataset.statusTarget;
        const statusEl = statusId ? document.getElementById(statusId) : null;

        if (statusEl) {
          statusEl.classList.remove('hidden');
          statusEl.textContent = 'Submitting...';
        }
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.dataset.originalText = originalText;
          submitBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Submitting...';
          submitBtn.disabled = true;
          submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
        }

        try {
          const response = await fetch(form.action || 'https://formspree.io/f/xqaynogk', {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' },
          });

          if (response.ok) {
            form.reset();
            if (statusEl) {
              statusEl.textContent = 'Thank you! We will contact you within 24 hours.';
            }
            form.dispatchEvent(new CustomEvent('formspree:success'));
          } else {
            if (statusEl) {
              statusEl.textContent = 'Something went wrong. Please try again or message us on Zalo/WhatsApp.';
            }
            form.dispatchEvent(new CustomEvent('formspree:error'));
          }
        } catch (error) {
          if (statusEl) {
            statusEl.textContent = 'Network error. Please try again shortly.';
          }
          form.dispatchEvent(new CustomEvent('formspree:error'));
        } finally {
          if (submitBtn) {
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNavigation();
      cacheCurrentLanguage();
      initLanguagePreference();
      initFormspree();
    });
  } else {
    initNavigation();
    cacheCurrentLanguage();
    initLanguagePreference();
    initFormspree();
  }
})();

// ── Hero stat counters ───────────────────────────────────────────────────────
// Counts each stat up from zero the first time the bar scrolls into view. The
// final value is already in the HTML, so if this never runs — no JS, an old
// browser, reduced motion — the real numbers are still on screen.
(function () {
  function initStatCounters() {
    const els = document.querySelectorAll('.stat-count');
    if (!els.length) return;

    const reduced = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    const render = (el, value) => {
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = value.toFixed(decimals) + (el.dataset.suffix || '');
    };

    const run = (el) => {
      const target = parseFloat(el.dataset.countTo);
      if (isNaN(target)) return;
      const duration = 1600;
      const start = performance.now();
      render(el, 0);
      const step = (now) => {
        // rAF hands back the frame's start time, which can predate the
        // performance.now() above — without the lower clamp the first frame
        // renders a negative number and the counter flashes "-0".
        const t = Math.min(Math.max((now - start) / duration, 0), 1);
        // ease-out: fast first, settling at the end
        render(el, target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
        else render(el, target);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = '1';
        observer.unobserve(entry.target);
        // On desktop the bar sits above the fold, so without this pause the
        // count would run while the hero is still painting and be over before
        // anyone looks at it.
        setTimeout(() => run(entry.target), 450);
      });
    }, { threshold: 0.25 });

    els.forEach((el) => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatCounters);
  } else {
    initStatCounters();
  }
})();
