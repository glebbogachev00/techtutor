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
      }
    });
  }
});
