/* ============================================================
   Contact Page Animations + Form Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Hero ---------- */
  (function initHero() {
    var title = document.querySelector('.page-hero-title');
    if (title) {
      var chars = splitText(title);
      gsap.from(chars, {
        y: 60, rotateX: -50, opacity: 0,
        stagger: 0.025, duration: 0.8,
        ease: 'back.out(1.5)', delay: 0.2
      });
    }
    gsap.from('.page-hero-subtitle', {
      y: 30, opacity: 0, duration: 0.7, delay: 0.6, ease: 'power3.out'
    });
  })();

  /* ---------- Contact Info Stagger ---------- */
  gsap.utils.toArray('.contact-info-item').forEach(function (item, i) {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%' },
      x: -50, opacity: 0, duration: 0.7,
      delay: i * 0.1, ease: 'power3.out'
    });
  });

  /* ---------- Form Card ---------- */
  gsap.from('.contact-form-card', {
    scrollTrigger: { trigger: '.contact-form-card', start: 'top 85%' },
    x: 60, opacity: 0, duration: 0.8, ease: 'power3.out'
  });

  /* ---------- Float Labels ---------- */
  document.querySelectorAll('.form-input, .form-textarea').forEach(function (input) {
    // Check initial value
    if (input.value.trim() !== '') {
      input.classList.add('has-value');
    }

    input.addEventListener('input', function () {
      if (input.value.trim() !== '') {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });

    input.addEventListener('blur', function () {
      if (input.value.trim() !== '') {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });

  /* ---------- Form Submit ---------- */
  var form = document.getElementById('contact-form');
  var formInner = document.querySelector('.contact-form-inner');
  var formSuccess = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Hide form, show success
      gsap.to(formInner, {
        opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
        onComplete: function () {
          formInner.style.display = 'none';
          formSuccess.classList.add('is-visible');

          gsap.from(formSuccess, {
            opacity: 0, y: 30, scale: 0.95,
            duration: 0.6, ease: 'back.out(1.5)'
          });

          gsap.from('.form-success-icon', {
            scale: 0, rotation: -180,
            duration: 0.7, delay: 0.2,
            ease: 'back.out(2)'
          });
        }
      });
    });
  }

  /* ---------- Map Section ---------- */
  var mapText = document.querySelector('.map-deco-text');
  if (mapText) {
    var chars = splitText(mapText);
    gsap.from(chars, {
      scrollTrigger: { trigger: '.map-section', start: 'top 80%' },
      y: 40, opacity: 0, stagger: 0.03,
      duration: 0.7, ease: 'power3.out'
    });
  }

  /* ---------- General Reveals ---------- */
  scrollReveal('.section-label');
  scrollReveal('.section-title', { y: 40 });
});
