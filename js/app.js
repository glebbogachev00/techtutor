// TechTutor Academy - Main Application JavaScript
// Optimized for performance - loaded with defer attribute

// ======================
// Promo Button Functionality
// ======================
let promoButtonHidden = false;

function togglePromoButton() {
  const promoButton = document.getElementById('floatingPromo');
  const toggleIcon = document.getElementById('toggleIcon');
  const isMobile = window.innerWidth < 768;
  const keepVisible = isMobile ? '36px' : '48px';

  if (promoButtonHidden) {
    promoButton.style.transform = 'translateY(-50%) translateX(0)';
    toggleIcon.style.transform = 'rotate(0deg)';
    promoButtonHidden = false;
  } else {
    const hideAmount = `calc(100% - ${keepVisible})`;
    promoButton.style.transform = `translateY(-50%) translateX(${hideAmount})`;
    toggleIcon.style.transform = 'rotate(180deg)';
    promoButtonHidden = true;
  }
}

function openPromoPopup() {
  const modal = document.getElementById('promoModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closePromoPopup(event) {
  if (!event || event.target.id === 'promoModal' || event.type === 'click') {
    const modal = document.getElementById('promoModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

// Handle promo form submission
document.addEventListener('DOMContentLoaded', function() {
  const promoForm = document.getElementById('promoTrialForm');
  const promoStatus = document.getElementById('promoTrialStatus');

  if (promoForm) {
    promoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const submitBtn = e.target.querySelector('[type="submit"]');

      // Add loading state
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.dataset.originalText = originalText;
        submitBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Submitting...';
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
      }

      try {
        const response = await fetch(e.target.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          promoStatus.textContent = 'Thank you! We will contact you within 24 hours with your 20% discount code.';
          promoStatus.classList.remove('hidden', 'text-red-500');
          promoStatus.classList.add('text-green-600');
          e.target.reset();

          setTimeout(() => {
            closePromoPopup();
            promoStatus.classList.add('hidden');
          }, 3000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        promoStatus.textContent = 'Oops! There was a problem. Please try again.';
        promoStatus.classList.remove('hidden', 'text-green-600');
        promoStatus.classList.add('text-red-500');
      } finally {
        // Remove loading state
        if (submitBtn) {
          submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        }
      }
    });
  }
});
