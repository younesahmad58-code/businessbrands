/* ============================================================
   Produse & Branduri Page Animations + Filters
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Hero ---------- */
  (function initHero() {
    var title = document.querySelector('.page-hero-title');
    if (title) {
      var chars = splitText(title);
      gsap.from(chars, {
        y: 60,
        rotateX: -50,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'back.out(1.5)',
        delay: 0.2
      });
    }
    gsap.from('.page-hero-subtitle', {
      y: 30, opacity: 0, duration: 0.7, delay: 0.6, ease: 'power3.out'
    });
  })();

  /* ---------- Brand Cards Stagger ---------- */
  (function initBrands() {
    gsap.utils.toArray('.brand-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 92%' },
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        delay: i * 0.03,
        ease: 'power3.out'
      });
    });
  })();

  /* ---------- Product Filter ---------- */
  (function initFilters() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.product-full-card');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        // Update active button
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Filter cards
        cards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          if (filter === 'toate' || category === filter) {
            card.classList.remove('hidden');
            gsap.fromTo(card,
              { opacity: 0, scale: 0.95, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  })();

  /* ---------- Product Cards 3D Tilt ---------- */
  initTiltCards('.product-full-card');

  gsap.utils.toArray('.product-full-card').forEach(function (card, i) {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%' },
      y: 60,
      opacity: 0,
      scale: 0.95,
      duration: 0.7,
      delay: i * 0.05,
      ease: 'power3.out'
    });
  });

  /* ---------- HomeGate Section ---------- */
  scrollReveal('.homegate-content h3', { x: -40, y: 0 });
  scrollReveal('.homegate-content p', { x: -30, y: 0, delay: 0.1 });
  scrollReveal('.homegate-content .btn', { x: -20, y: 0, delay: 0.2 });

  gsap.utils.toArray('.homegate-product-card').forEach(function (card, i) {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      x: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power3.out'
    });
  });

  /* ---------- General ---------- */
  scrollReveal('.section-label');
  scrollReveal('.section-title', { y: 40 });
  scrollReveal('.section-subtitle', { y: 30, delay: 0.1 });
});
