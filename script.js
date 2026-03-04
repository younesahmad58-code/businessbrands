/* ═══════════════════════════════════════════════════════════════
   BUSINESS BRANDS — Premium Website Script
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Preloader ─── */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add('loaded');
      }, 400);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {

    /* ─── Navbar Scroll Behavior ─── */
    var navbar = document.getElementById('navbar');
    var SCROLL_THRESHOLD = 80;

    function handleNavbarScroll() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* ─── Smooth Scroll ─── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 72;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Close mobile menu
          document.body.classList.remove('mobile-menu-open');
        }
      });
    });

    /* ─── Mobile Hamburger Menu ─── */
    var hamburger = document.querySelector('.nav-hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        document.body.classList.toggle('mobile-menu-open');
      });

      // Close menu on outside click
      document.addEventListener('click', function (e) {
        if (document.body.classList.contains('mobile-menu-open') &&
            !e.target.closest('.nav-links') &&
            !e.target.closest('.nav-hamburger')) {
          document.body.classList.remove('mobile-menu-open');
        }
      });
    }

    /* ─── Intersection Observer: Fade-In Animations ─── */
    var fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
      var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Add stagger delay for sibling elements
            var parent = entry.target.parentElement;
            if (parent) {
              var siblings = parent.querySelectorAll(':scope > .fade-in');
              var index = Array.from(siblings).indexOf(entry.target);
              if (index > 0) {
                entry.target.style.transitionDelay = (index * 0.1) + 's';
              }
            }
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      fadeElements.forEach(function (el) {
        fadeObserver.observe(el);
      });
    } else {
      // Fallback: show all immediately
      fadeElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }

    /* ─── Hero Text Reveal ─── */
    var revealLines = document.querySelectorAll('.reveal-line');
    setTimeout(function () {
      revealLines.forEach(function (line, i) {
        setTimeout(function () {
          line.classList.add('revealed');
        }, i * 350);
      });
    }, 600);

    /* ─── Counter Animation ─── */
    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2200;
      var startTime = null;

      function update(currentTime) {
        if (!startTime) startTime = currentTime;
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * eased);

        if (target >= 1000) {
          el.textContent = current.toLocaleString('ro-RO') + suffix;
        } else {
          el.textContent = current + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    var counterElements = document.querySelectorAll('[data-count]');

    if ('IntersectionObserver' in window && counterElements.length > 0) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counterElements.forEach(function (el) {
        counterObserver.observe(el);
      });
    }

    /* ─── Product Category Filter ─── */
    var filterButtons = document.querySelectorAll('.filter-btn');
    var productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // Filter with animation
        productCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            card.style.display = '';
          } else {
            card.classList.add('hidden');
            card.style.display = 'none';
          }
        });
      });
    });

    /* ─── Active Nav Link Highlighting ─── */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    if ('IntersectionObserver' in window && sections.length > 0) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              var href = link.getAttribute('href');
              if (href === '#' + id) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '-72px 0px -50% 0px'
      });

      sections.forEach(function (section) {
        sectionObserver.observe(section);
      });
    }

    /* ─── Contact Form Handler ─── */
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var wrapper = contactForm.closest('.contact-form-wrapper');
        if (wrapper) {
          wrapper.innerHTML =
            '<div class="form-success">' +
            '<h3>Mulțumim!</h3>' +
            '<p>Mesajul dvs. a fost înregistrat cu succes.<br>Vă vom contacta în cel mai scurt timp.</p>' +
            '</div>';
        }
      });
    }

    /* ─── Subtle Parallax on Hero (desktop only) ─── */
    if (window.innerWidth > 768) {
      var heroContent = document.querySelector('.hero-content');
      window.addEventListener('scroll', function () {
        if (window.scrollY < window.innerHeight) {
          var offset = window.scrollY * 0.3;
          heroContent.style.transform = 'translateY(' + offset + 'px)';
          heroContent.style.opacity = 1 - (window.scrollY / window.innerHeight) * 0.6;
        }
      }, { passive: true });
    }

  });
})();
