/* ============================================================
   Servicii (Services) Page Animations
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
      y: 30,
      opacity: 0,
      duration: 0.7,
      delay: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.hero-deco-number', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      delay: 0.1,
      ease: 'power2.out'
    });
  })();

  /* ---------- Service Sections ---------- */
  gsap.utils.toArray('.service-full').forEach(function (section) {
    var content = section.querySelector('.service-full-content');
    var icon = section.querySelector('.service-icon-wrapper');
    var bullets = section.querySelectorAll('.service-bullet');
    var number = section.querySelector('.service-full-number');
    var isReverse = section.classList.contains('service-full--reverse');

    if (number) {
      gsap.from(number, {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    if (content) {
      gsap.from(content.querySelector('.service-full-title'), {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        x: isReverse ? 60 : -60,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: 'power3.out'
      });

      gsap.from(content.querySelector('.service-full-desc'), {
        scrollTrigger: { trigger: section, start: 'top 70%' },
        x: isReverse ? 40 : -40,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: 'power3.out'
      });
    }

    if (bullets.length) {
      gsap.from(bullets, {
        scrollTrigger: { trigger: section, start: 'top 65%' },
        x: isReverse ? 30 : -30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        delay: 0.3,
        ease: 'power3.out'
      });
    }

    if (icon) {
      gsap.from(icon, {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        x: isReverse ? -80 : 80,
        opacity: 0,
        scale: 0.9,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out'
      });
    }
  });

  /* ---------- CTA ---------- */
  var ctaTitle = document.querySelector('.services-cta-title');
  if (ctaTitle) {
    var chars = splitText(ctaTitle);
    gsap.from(chars, {
      scrollTrigger: { trigger: '.services-cta', start: 'top 80%' },
      y: 40,
      opacity: 0,
      stagger: 0.015,
      duration: 0.7,
      ease: 'power3.out'
    });
  }
});
