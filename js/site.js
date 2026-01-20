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
