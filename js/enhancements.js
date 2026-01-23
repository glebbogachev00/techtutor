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
            <h2 class="text-3xl font-black mb-3 text-primary">Wait! Don't Miss Out</h2>
            <p class="text-xl text-gray-700 mb-6">
              Get <span class="text-orange-500 font-bold">20% OFF</span> your first course bundle
            </p>
            <p class="text-gray-600 mb-8">
              Book your free trial now and unlock this exclusive discount
            </p>
            <a href="#trial" onclick="closeExitPopup()" class="inline-block bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-full shadow-lg transition transform hover:scale-105">
              Claim My 20% Discount
            </a>
            <p class="text-sm text-gray-500 mt-4">
              ⏰ Offer expires in 24 hours
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

    (function() {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/69728a03aeefba19791e8a48/1jfjmm7s9';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    // Hide the chat message bubble (the "Hi, how can we help" popup)
    const style = document.createElement('style');
    style.textContent = `
      /* Hide Tawk.to message bubble (not the widget itself) */
      .tawk-min-container,
      .tawk-branding,
      div[class*="tawk"][class*="message"],
      div[class*="tawk"][class*="bubble"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);
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
