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

      // Submit to Web3Forms
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Redirect to thank-you page
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        } else {
          console.error('Form submission failed:', data);
          alert('There was an error submitting the form. Please try again.');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting the form. Please try again.');
      }
    });
  });
});
