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

  function initPageTranslations() {
    const translations = window.pageTranslations;
    if (!translations) return;
    const langButtons = document.querySelectorAll('[data-lang]');
    if (!langButtons.length) return;
    const STORAGE_KEY = 'tt-lang';

    const applyLanguage = (lang) => {
      if (!translations[lang]) {
        lang = 'en';
      }
      document.documentElement.setAttribute('lang', lang === 'vi' ? 'vi' : 'en');
      document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        const value = translations[lang] && translations[lang][key];
        if (!value) return;
        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
          node.placeholder = value;
        } else {
          node.innerHTML = value;
        }
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
        const key = node.getAttribute('data-i18n-placeholder');
        const value = translations[lang] && translations[lang][key];
        if (value) {
          node.placeholder = value;
        }
      });

      langButtons.forEach((btn) => {
        const isActive = btn.dataset.lang === lang;
        btn.setAttribute('aria-pressed', isActive.toString());
        btn.classList.toggle('bg-primary', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('text-slate-500', !isActive);
        btn.classList.toggle('hover:bg-slate-100', !isActive);
      });

      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {}
    };

    langButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang') || 'en';
        applyLanguage(lang);
      });
    });

    let saved = 'en';
    try {
      saved = localStorage.getItem('tt-lang') || 'en';
    } catch (e) {}
    applyLanguage(saved);
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
      initFormspree();
      initPageTranslations();
    });
  } else {
    initNavigation();
    initFormspree();
    initPageTranslations();
  }
})();
