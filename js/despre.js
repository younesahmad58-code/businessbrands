/* ============================================================
   Despre Noi (About) Page Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Hero ---------- */
  (function initHero() {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.page-hero-logo', {
      rotateY: 90,
      scale: 0.7,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.4)'
    }, 0.1);

    var title = document.querySelector('.page-hero-title');
    if (title) {
      var chars = splitText(title);
      tl.from(chars, {
        y: 60,
        rotateX: -50,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'back.out(1.5)'
      }, 0.3);
    }

    tl.from('.page-hero-subtitle', { y: 30, opacity: 0, duration: 0.7 }, '-=0.3');
  })();

  /* ---------- Timeline Line Draw ---------- */
  (function initTimeline() {
    var lineInner = document.querySelector('.timeline-line-inner');
    if (lineInner) {
      gsap.to(lineInner, {
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        },
        height: '100%',
        ease: 'none'
      });
    }

    gsap.utils.toArray('.timeline-node').forEach(function (node, i) {
      var isEven = i % 2 === 1;
      gsap.from(node.querySelector('.timeline-node-content'), {
        scrollTrigger: {
          trigger: node,
          start: 'top 85%'
        },
        x: isEven ? -60 : 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  })();

  /* ---------- Values Cards ---------- */
  (function initValues() {
    initTiltCards('.value-card');

    gsap.utils.toArray('.value-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%'
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out'
      });
    });
  })();

  /* ---------- Stats ---------- */
  initCounters();

  /* ---------- General Reveals ---------- */
  scrollReveal('.section-label');
  scrollReveal('.section-title', { y: 40 });
  scrollReveal('.section-subtitle', { y: 30, delay: 0.1 });
  scrollReveal('.company-info-item', { y: 30 });
});
