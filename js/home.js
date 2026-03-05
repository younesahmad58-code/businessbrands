/* ============================================================
   Home Page Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  (function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Animate preloader text letters
    var textEl = preloader.querySelector('.preloader-text');
    if (textEl) {
      var letters = textEl.querySelectorAll('span');
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.4
      });
    }

    // After ring draws + text reveals, split preloader
    gsap.to(preloader, {
      delay: 1.2,
      duration: 0.6,
      clipPath: 'inset(0 50% 0 50%)',
      ease: 'power3.inOut',
      onComplete: function () {
        preloader.style.display = 'none';
        initHeroAnimations();
      }
    });
  })();

  /* ---------- Hero Animations ---------- */
  function initHeroAnimations() {
    var heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Badge
    tl.from('.hero-badge', { y: -30, opacity: 0, duration: 0.7 }, 0);

    // Title character reveal
    var titleLines = document.querySelectorAll('.hero-title-line');
    titleLines.forEach(function (line, i) {
      var chars = splitText(line);
      tl.from(chars, {
        y: 80,
        rotateX: -60,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'back.out(1.5)'
      }, 0.3 + i * 0.2);
    });

    // Subtitle
    tl.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.7 }, '-=0.3');

    // CTA
    tl.from('.hero-cta', { y: 20, opacity: 0, scale: 0.95, duration: 0.6 }, '-=0.2');

    // Scroll indicator
    tl.from('.hero-scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.1');

    // Parallax on scroll
    if (window.matchMedia('(min-width: 769px)').matches) {
      gsap.to('.hero-content', {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        },
        y: -120,
        opacity: 0.3,
        ease: 'none'
      });

    }
  }

  // If no preloader (inner page nav), init hero directly
  if (!document.getElementById('preloader')) {
    initHeroAnimations();
  }

  /* ---------- Intro Section - Number Fill + Line ---------- */
  (function initIntro() {
    var fill = document.querySelector('.intro-number-fill');
    if (fill) {
      gsap.to(fill, {
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 70%',
          end: 'center center',
          scrub: 1
        },
        clipPath: 'inset(0% 0 0 0)',
        ease: 'none'
      });
    }

    var divider = document.querySelector('.intro-divider');
    if (divider) {
      gsap.to(divider, {
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 75%',
          end: 'center center',
          scrub: 1
        },
        height: '100%',
        ease: 'none'
      });
    }

    // Text lines reveal
    gsap.utils.toArray('.intro-text p, .intro-text .btn').forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%'
        },
        x: 60,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });
  })();

  /* ---------- Services Grid ---------- */
  (function initServicesGrid() {
    gsap.utils.toArray('.service-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%'
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
      });
    });
  })();

  /* ---------- Brands Marquee - Kinetic Word ---------- */
  (function initBrandsSection() {
    var kineticWord = document.querySelector('.kinetic-word');
    if (kineticWord) {
      gsap.to(kineticWord, {
        scrollTrigger: {
          trigger: '.brands-section',
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1
        },
        scaleX: 1.15,
        ease: 'none'
      });

      gsap.to(kineticWord, {
        scrollTrigger: {
          trigger: '.brands-section',
          start: 'top 20%',
          end: 'bottom 50%',
          scrub: 1
        },
        scaleX: 1,
        ease: 'none'
      });
    }

    // Init counters in stats
    initCounters();
  })();

  /* ---------- Products Teaser - 3D Tilt ---------- */
  (function initProductsTeaser() {
    initTiltCards('.product-card');

    gsap.utils.toArray('.product-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%'
        },
        y: 80,
        opacity: 0,
        rotateX: -10,
        scale: 0.95,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'power3.out'
      });
    });
  })();

  /* ---------- Why Section - Timeline Line Draw ---------- */
  (function initWhySection() {
    var lineInner = document.querySelector('.why-timeline-line-inner');
    if (lineInner) {
      gsap.to(lineInner, {
        scrollTrigger: {
          trigger: '.why-timeline',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        },
        height: '100%',
        ease: 'none'
      });
    }

    // Animate items from sides
    gsap.utils.toArray('.why-item').forEach(function (item, i) {
      var isEven = i % 2 === 1;
      gsap.from(item.querySelector('.why-item-content'), {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%'
        },
        x: isEven ? -60 : 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  })();

  /* ---------- CTA Banner ---------- */
  (function initCTA() {
    var ctaTitle = document.querySelector('.cta-banner-title');
    if (ctaTitle) {
      var chars = splitText(ctaTitle);
      gsap.from(chars, {
        scrollTrigger: {
          trigger: '.cta-banner',
          start: 'top 80%'
        },
        y: 40,
        opacity: 0,
        stagger: 0.015,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    var ctaBtn = document.querySelector('.cta-banner .btn');
    if (ctaBtn) {
      gsap.from(ctaBtn, {
        scrollTrigger: {
          trigger: ctaBtn,
          start: 'top 90%'
        },
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        ease: 'power3.out'
      });
    }
  })();

  /* ---------- General Scroll Reveals ---------- */
  scrollReveal('.section-label');
  scrollReveal('.section-title', { y: 40 });
  scrollReveal('.section-subtitle', { y: 30, delay: 0.1 });

});
