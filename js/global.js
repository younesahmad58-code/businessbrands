/* ============================================================
   BUSINESS BRANDS SRL — Global JavaScript
   GSAP Setup, Custom Cursor, Page Transitions, Utilities
   ============================================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* ---------- Custom SplitText Utility ---------- */
function splitText(element) {
  const text = element.textContent;
  element.innerHTML = '';
  element.setAttribute('aria-label', text);

  const chars = [];
  const words = text.split(' ');

  words.forEach(function(word, wi) {
    // Create word wrapper to prevent mid-word line breaks
    var wordSpan = document.createElement('span');
    wordSpan.classList.add('word');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';

    for (var i = 0; i < word.length; i++) {
      var span = document.createElement('span');
      span.classList.add('char');
      span.style.display = 'inline-block';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = word[i];
      wordSpan.appendChild(span);
      chars.push(span);
    }
    element.appendChild(wordSpan);

    // Add space between words (not after last word)
    if (wi < words.length - 1) {
      var space = document.createElement('span');
      space.classList.add('char');
      space.style.display = 'inline-block';
      space.setAttribute('aria-hidden', 'true');
      space.innerHTML = '&nbsp;';
      space.style.width = '0.3em';
      element.appendChild(space);
      chars.push(space);
    }
  });

  return chars;
}

/* ---------- Reusable Animation Functions ---------- */

// Character-by-character heading reveal with 3D
function animateHeading(element, delay) {
  if (typeof delay === 'undefined') delay = 0;
  var chars = splitText(element);
  gsap.from(chars, {
    y: 80,
    rotateX: -60,
    opacity: 0,
    stagger: 0.025,
    duration: 0.9,
    ease: 'back.out(1.5)',
    delay: delay
  });
}

// Scroll-triggered reveal (fade + slide up)
function scrollReveal(selector, fromVars) {
  gsap.utils.toArray(selector).forEach(function(el) {
    gsap.from(el, Object.assign({
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    }, fromVars || {}));
  });
}

// Counter animation
function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-count'));
  var suffix = el.getAttribute('data-suffix') || '';
  var prefix = el.getAttribute('data-prefix') || '';
  var obj = { val: 0 };

  gsap.to(obj, {
    val: target,
    duration: 2.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%'
    },
    onUpdate: function() {
      el.textContent = prefix + Math.round(obj.val) + suffix;
    }
  });
}

// Initialize all counters
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(animateCounter);
}

// Initialize 3D tilt cards
function initTiltCards(selector) {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll(selector).forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) scale3d(1.02, 1.02, 1.02)';
      // Update glow position
      card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
    });

    card.addEventListener('mouseleave', function() {
      gsap.to(card, {
        transform: 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
}

/* ---------- Magnetic Buttons ---------- */
(function initMagneticButtons() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.nav-links-left a, .nav-links-right a, .nav-mobile-links a, .btn').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', function() {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
})();

/* ---------- Navbar Scroll Effect ---------- */
(function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  var scrollThreshold = 60;

  function checkScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  // Active link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links-left a, .nav-links-right a, .nav-mobile-links a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile hamburger
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileLinks = document.querySelector('.nav-mobile-links');
  if (hamburger && mobileLinks) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileLinks.classList.toggle('open');
    });

    // Close on link click
    mobileLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileLinks.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileLinks.classList.remove('open');
      }
    });
  }
})();

/* ---------- Scroll Progress Bar ---------- */
(function initScrollProgress() {
  var bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

/* ---------- Page Transitions ---------- */
(function initPageTransitions() {
  var transition = document.getElementById('page-transition');
  if (!transition) return;

  // On page load - reveal (panels slide out)
  var panelLeft = transition.querySelector('.transition-panel--left');
  var panelRight = transition.querySelector('.transition-panel--right');
  var logo = transition.querySelector('.transition-logo');

  // Ensure body is visible (fix for home fade-out navigation)
  document.body.style.opacity = '1';

  // Check if we came from another page (CSS class set by inline head script)
  if (document.documentElement.classList.contains('bb-entering')) {
    window.bbTransitioningIn = true;
    sessionStorage.removeItem('bb-transitioning');

    var tl = gsap.timeline({ delay: 0.15, onComplete: function() {
      document.documentElement.classList.remove('bb-entering');
    }});
    tl.to(logo, { opacity: 0, duration: 0.25, ease: 'power2.in' })
      .to(panelLeft, { x: '-100%', duration: 0.5, ease: 'power3.inOut' }, 0.2)
      .to(panelRight, { x: '100%', duration: 0.5, ease: 'power3.inOut' }, 0.2);
  }

  // Intercept internal links
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;
    // Skip external links, anchors, mailto, tel
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    e.preventDefault();
    
    // Check if target is home or logo
    var isHome = href.includes('index.html') || href === 'index.html' || href === '/' || link.classList.contains('nav-logo');
    
    if (isHome) {
      // Fade out for Home/Logo — skip preloader on internal navigation
      sessionStorage.setItem('bb-skip-preloader', 'true');
      gsap.to(document.body, {opacity: 0, duration: 0.2, ease: 'power2.out', onComplete: function() {
        window.location.href = href;
      }});
    } else {
      // Smooth panel transition for other pages
      sessionStorage.setItem('bb-transitioning', 'true');
      
      var tl = gsap.timeline({
        onComplete: function() {
          window.location.href = href;
        }
      });
      
      tl.to(panelLeft, { x: '0%', duration: 0.45, ease: 'power3.inOut' }, 0)
        .to(panelRight, { x: '0%', duration: 0.45, ease: 'power3.inOut' }, 0);
        
      if (logo) {
        tl.to(logo, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.2);
      }
    }
  });
})();

/* ---------- Generate Floating Particles ---------- */
function generateParticles(container, count) {
  if (typeof count === 'undefined') count = 15;
  if (!container) return;

  for (var i = 0; i < count; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    p.style.setProperty('--size', (Math.random() * 3 + 1.5) + 'px');
    p.style.setProperty('--duration', (Math.random() * 6 + 6) + 's');
    p.style.setProperty('--delay', (Math.random() * 8) + 's');
    p.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
    p.style.setProperty('--dy', (Math.random() * -80 - 20) + 'px');
    p.style.setProperty('--max-opacity', (Math.random() * 0.3 + 0.15).toFixed(2));
    p.style.left = (Math.random() * 100) + '%';
    p.style.top = (Math.random() * 100) + '%';
    container.appendChild(p);
  }
}

// Auto-generate particles in all particle containers
document.querySelectorAll('.particles-container').forEach(function(c) {
  var count = parseInt(c.getAttribute('data-particles')) || 15;
  generateParticles(c, count);
});

/* ---------- Smooth Scroll for Anchor Links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var targetId = this.getAttribute('href');
    if (targetId === '#') return;
    var target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});
