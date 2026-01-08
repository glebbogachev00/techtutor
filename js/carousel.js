// Carousel functionality for class photos
// Loaded with defer attribute

document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('classCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const allDots = document.querySelectorAll('.carousel-dot');

  if (!carousel || !prevBtn || !nextBtn) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  if (!slides.length) return;

  const totalSlides = slides.length;
  const dots = Array.from(allDots).slice(0, totalSlides);

  allDots.forEach((dot, index) => {
    if (index >= totalSlides) {
      dot.style.display = 'none';
    }
  });

  let currentSlide = 0;
  let autoSlideInterval;

  function goToSlide(index) {
    // Wrap around
    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    // Move carousel
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
        dot.style.backgroundColor = 'white';
      } else {
        dot.classList.remove('active');
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
      }
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Event listeners
  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(index);
      startAutoSlide();
    });
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);

  // Start auto-slide
  if (totalSlides > 1) {
    startAutoSlide();
  }
});
