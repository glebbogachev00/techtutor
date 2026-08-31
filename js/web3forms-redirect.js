// Web3Forms redirect handler
// Handles form submission and redirects to thank-you page
// Works for both local testing and production

document.addEventListener('DOMContentLoaded', function() {
  // Find all forms with Web3Forms action
  const forms = document.querySelectorAll('form[action*="web3forms.com"]');

  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const redirectUrl = formData.get('redirect');

      // The trial form asks for "email or Zalo/WhatsApp" in a single `contact`
      // field. Web3Forms treats a field named `email` as the reply-to and
      // validates it, so a phone number there could be rejected. Send `email`
      // only when the value actually looks like an address: addresses keep a
      // working reply-to, phone numbers still submit cleanly.
      const contact = formData.get('contact');
      if (contact && !formData.get('email') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact).trim())) {
        formData.append('email', String(contact).trim());
      }

      // Show progress and block a second press. Without this the button looks
      // dead while the request is in flight, and people submit twice.
      const submitBtn = form.querySelector('[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
      }

      const restoreButton = () => {
        if (!submitBtn) return;
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
      };

      // Submit to Web3Forms
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Redirect to thank-you page
          const targetPage = redirectUrl || 'thank-you.html';

          // If redirect URL is already absolute (starts with /), use it directly
          if (targetPage.startsWith('/')) {
            window.location.href = targetPage;
          } else {
            // Construct absolute path based on current location for relative URLs
            const currentPath = window.location.pathname;
            const pathParts = currentPath.split('/').filter(part => part);
            const localeFolder = pathParts[0]; // Gets 'vn', 'en', 'us', or 'in'
            window.location.href = `/${localeFolder}/${targetPage}`;
          }
        } else {
          console.error('Form submission failed:', data);
          restoreButton();
          alert('There was an error submitting the form. Please try again, or message us on Zalo/WhatsApp.');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        restoreButton();
        alert('Network error. Please try again, or message us on Zalo/WhatsApp.');
      }
    });
  });
});
