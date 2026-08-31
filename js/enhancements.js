/**
 * TechTutor Academy - UI Enhancements
 * Exit intent popup, sticky CTA, and chat widget
 */

(function() {
  'use strict';

  // ==========================================
  // 1. Exit Intent Popup
  // ==========================================
  function initExitIntentPopup() {
    let popupShown = false;
    const popupDelay = 1000; // Wait 1 second before enabling exit intent

    // Check if user has seen popup in last 24 hours
    const lastShown = localStorage.getItem('tt_exit_popup_shown');
    if (lastShown && (Date.now() - parseInt(lastShown)) < 24 * 60 * 60 * 1000) {
      return; // Don't show again
    }

    // Create the popup HTML
    const popupHTML = `
      <div id="exitIntentPopup" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] hidden items-center justify-center p-4" style="display: none;">
        <div class="bg-white rounded-2xl max-w-lg w-full p-8 relative animate-bounce-in">
          <button onclick="closeExitPopup()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div class="text-center">
            <div class="text-6xl mb-4">🎁</div>
            <h2 class="text-3xl font-black mb-3 text-primary">Wait! Unlock a FREE Course</h2>
            <p class="text-xl text-gray-700 mb-4">
              Register your email and get access to a <span class="text-orange-500 font-bold">FREE course</span>
            </p>
            <p class="text-gray-600 mb-6">
              Start learning today with our exclusive free course offer
            </p>
            <form id="exitPopupForm" class="mb-4" onsubmit="handleExitPopupSubmit(event)">
              <input
                type="email"
                id="exitPopupEmail"
                name="email"
                placeholder="Enter your email"
                required
                class="w-full px-4 py-3 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none mb-4"
              />
              <button type="submit" class="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-full shadow-lg transition transform hover:scale-105">
                Get My Free Course
              </button>
            </form>
            <p class="text-sm text-gray-500">
              ✅ No credit card required
            </p>
          </div>
        </div>
      </div>
    `;

    // Insert popup into DOM
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce-in {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-bounce-in {
        animation: bounce-in 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);

    // Exit intent detection
    setTimeout(() => {
      document.addEventListener('mouseout', function(e) {
        if (!popupShown && e.clientY < 10) {
          popupShown = true;
          const popup = document.getElementById('exitIntentPopup');
          if (popup) {
            popup.style.display = 'flex';
            popup.classList.remove('hidden');
            localStorage.setItem('tt_exit_popup_shown', Date.now().toString());
          }
        }
      });
    }, popupDelay);
  }

  // Global function to close exit popup
  window.closeExitPopup = function() {
    const popup = document.getElementById('exitIntentPopup');
    if (popup) {
      popup.style.display = 'none';
      popup.classList.add('hidden');
    }
  };

  // Global function to handle exit popup form submission
  window.handleExitPopupSubmit = function(event) {
    event.preventDefault();
    const email = document.getElementById('exitPopupEmail').value;

    // Submit to Formspree
    fetch('https://formspree.io/f/xqaynogk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        type: 'Free Course Registration'
      })
    }).then(() => {
      // Show success message
      const popup = document.getElementById('exitIntentPopup');
      if (popup) {
        popup.querySelector('.text-center').innerHTML = `
          <div class="text-6xl mb-4">✅</div>
          <h2 class="text-3xl font-black mb-3 text-primary">Success!</h2>
          <p class="text-xl text-gray-700 mb-6">
            Check your email for your free course access link
          </p>
          <button onclick="closeExitPopup()" class="inline-block bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-full shadow-lg transition transform hover:scale-105">
            Close
          </button>
        `;
      }
    }).catch(() => {
      alert('Something went wrong. Please try again.');
    });
  };

  // ==========================================
  // 2. Sticky Book Free Trial CTA
  // ==========================================
  function initStickyCTA() {
    // Position adjusted to not overlap with Tawk.to chat widget (bottom-right)
    // Chat widget is at bottom-right, so we put CTA at bottom-left
    const stickyHTML = `
      <div id="stickyCTA" class="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 opacity-0 transform translate-y-4 transition-all duration-300">
        <a href="#trial" class="flex items-center gap-2 md:gap-3 bg-primary hover:bg-primary-light text-white font-bold py-3 px-5 md:py-4 md:px-6 rounded-full shadow-2xl transition transform hover:scale-105">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span>Book Free Trial</span>
        </a>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', stickyHTML);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      const stickyButton = document.getElementById('stickyCTA');

      if (!stickyButton) return;

      if (currentScroll > 500) {
        stickyButton.classList.remove('opacity-0', 'translate-y-4');
        stickyButton.classList.add('opacity-100', 'translate-y-0');
      } else {
        stickyButton.classList.add('opacity-0', 'translate-y-4');
        stickyButton.classList.remove('opacity-100', 'translate-y-0');
      }
    });
  }

  // ==========================================
  // 3. Tawk.to Live Chat Widget
  // ==========================================
  function initLiveChat() {
    // Tawk.to widget code
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();

    // Hide message bubble using API
    Tawk_API.onLoad = function() {
      Tawk_API.hideWidget();
      Tawk_API.showWidget();
    };

    (function() {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/69728a03aeefba19791e8a48/1jfjmm7s9';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    // Hide the chat message bubble with CSS and remove animations
    const style = document.createElement('style');
    style.textContent = `
      /* Hide Tawk.to message bubble completely */
      .tawk-min-container,
      .tawk-tooltip,
      .tawk-button-circle > span,
      div[style*="tawk"],
      #tawk-bubble-container {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        pointer-events: none !important;
      }

      /* Keep only the main button visible */
      .tawk-button-circle {
        display: block !important;
      }
    `;
    document.head.appendChild(style);

    hideGreetingOnPhones();
  }

  // On phones the "Hi! How can we help" greeting card covers a good chunk of a
  // small screen, so we hide it there and leave the launcher button alone.
  // Desktop keeps the greeting.
  //
  // None of the CSS above can do this: Tawk renders the widget into a
  // body-level div whose id — and every iframe id inside it — is regenerated
  // on each page load, with no class, title or src to match on. So we find the
  // pieces by geometry instead. The launcher is the small iframe pinned to the
  // bottom-right corner; the greeting is the wider card floating above it.
  function hideGreetingOnPhones() {
    const phone = window.matchMedia('(max-width: 767px)');
    let pending = null;

    // A Tawk iframe has no real document of its own — it is about:blank or
    // srcdoc — which is what separates it from the embedded class video.
    const tawkFrames = () =>
      Array.prototype.filter.call(
        document.querySelectorAll('body > div > iframe'),
        (f) => {
          const src = f.getAttribute('src');
          return (!src || src === 'about:blank') || f.hasAttribute('srcdoc');
        }
      );

    const apply = () => {
      const frames = tawkFrames();
      if (!frames.length) return;

      // Never touch the widget while it is open, or the chat window itself
      // would disappear.
      const open = window.Tawk_API && typeof Tawk_API.isChatMaximized === 'function'
        && Tawk_API.isChatMaximized();

      if (!phone.matches || open) {
        frames.forEach((f) => { f.style.removeProperty('display'); });
        return;
      }

      const visible = frames
        .map((f) => ({ el: f, box: f.getBoundingClientRect() }))
        .filter((f) => f.box.width > 0 && f.box.height > 0)
        // The open chat window fills a phone screen. Skipping anything that
        // large means we cannot black out the conversation if the DOM mounts
        // a frame before Tawk flips its maximized flag.
        .filter((f) => f.box.width < window.innerWidth * 0.85
                    && f.box.height < window.innerHeight * 0.6);
      if (visible.length < 2) return;   // launcher only, nothing to hide

      // Smallest box is the launcher; everything else is the greeting card.
      visible.sort((a, b) => (a.box.width * a.box.height) - (b.box.width * b.box.height));
      visible.forEach((f, i) => {
        f.el.style.setProperty('display', i === 0 ? 'block' : 'none', 'important');
      });
    };

    const schedule = () => {
      if (pending) cancelAnimationFrame(pending);
      pending = requestAnimationFrame(apply);
    };

    // Tawk mounts late and resizes its frames as the greeting animates in, so
    // watch for that rather than guessing at a delay.
    new MutationObserver(schedule).observe(document.body, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['style', 'width', 'height']
    });

    if (phone.addEventListener) phone.addEventListener('change', schedule);
    window.addEventListener('resize', schedule);
    if (window.Tawk_API) {
      Tawk_API.onChatMaximized = schedule;
      Tawk_API.onChatMinimized = schedule;
    }
    schedule();
  }

  // ==========================================
  // 4. Improve Mobile Navigation
  // ==========================================
  function improveMobileNav() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');

    if (!mobileMenu || !mobileMenuButton) return;

    // Add smooth slide-in animation
    const style = document.createElement('style');
    style.textContent = `
      #mobile-menu {
        transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
      }
      #mobile-menu:not(.hidden) {
        max-height: 1000px;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenuButton.click(); // Trigger the existing toggle
        }
      }
    });

    // Close menu when clicking on a link
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenuButton.click();
        }
      });
    });
  }

  // ==========================================
  // Initialize all enhancements
  // ==========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initExitIntentPopup();
      initStickyCTA();
      initLiveChat();
      improveMobileNav();
    });
  } else {
    initExitIntentPopup();
    initStickyCTA();
    initLiveChat();
    improveMobileNav();
  }
})();
