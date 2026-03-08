/* ============================================================
   Produse & Branduri Page — Dynamic Rendering + Filters + Modal
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

  /* ---------- Dynamic Products Rendering ---------- */
  var grid = document.getElementById('products-grid');
  var loadMoreBtn = document.getElementById('load-more-btn');
  var productsCount = document.getElementById('products-count');
  var perPage = (typeof PRODUCTS_PER_PAGE !== 'undefined') ? PRODUCTS_PER_PAGE : 24;
  var allProducts = (typeof PRODUCTS_DATA !== 'undefined') ? PRODUCTS_DATA : [];
  var currentFilter = 'toate';
  var currentPage = 1;

  var categoryLabels = {
    curatenie: 'Curățenie',
    detergenti: 'Detergenți Rufe',
    ingrijire: 'Îngrijire Personală',
    casa: 'Casă & Grădină',
    electronice: 'Electronice'
  };

  function getFilteredProducts() {
    if (currentFilter === 'toate') return allProducts;
    return allProducts.filter(function (p) { return p.category === currentFilter; });
  }

  function createCardHTML(product) {
    var imgSrc = product.images && product.images.length > 0 ? product.images[0] : '';
    var catLabel = categoryLabels[product.category] || product.category;
    return '<div class="product-full-card tilt-card glow-card" data-category="' + product.category + '" data-id="' + product.id + '">' +
      '<img src="' + imgSrc + '" alt="' + product.name + '" loading="lazy">' +
      '<div class="product-full-card-overlay">' +
        '<span class="product-full-card-category">' + catLabel + '</span>' +
        '<div class="product-full-card-name">' + product.name + '</div>' +
      '</div>' +
    '</div>';
  }

  function renderProducts(resetGrid) {
    var filtered = getFilteredProducts();
    var end = currentPage * perPage;
    var visible = filtered.slice(0, end);

    if (resetGrid) {
      grid.innerHTML = '';
    }

    // If not reset, only append new items
    var startIndex = resetGrid ? 0 : (currentPage - 1) * perPage;
    var newItems = filtered.slice(startIndex, end);

    var fragment = document.createDocumentFragment();
    var temp = document.createElement('div');
    newItems.forEach(function (p) {
      temp.innerHTML = createCardHTML(p);
      fragment.appendChild(temp.firstChild);
    });

    if (resetGrid) {
      grid.innerHTML = '';
    }
    grid.appendChild(fragment);

    // Update count text
    productsCount.textContent = visible.length + ' din ' + filtered.length + ' produse';

    // Show/hide load more
    if (end < filtered.length) {
      loadMoreBtn.style.display = 'inline-flex';
    } else {
      loadMoreBtn.style.display = 'none';
    }

    // Animate new cards
    var allCards = grid.querySelectorAll('.product-full-card');
    var newCards = [];
    for (var i = startIndex; i < allCards.length; i++) {
      newCards.push(allCards[i]);
    }

    gsap.fromTo(newCards,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.03 }
    );

    // Re-init tilt on new cards
    if (typeof initTiltCards === 'function') {
      initTiltCards('.product-full-card');
    }

    // Refresh ScrollTrigger
    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 500);
  }

  // Initial render
  renderProducts(true);

  // Load More
  loadMoreBtn.addEventListener('click', function () {
    currentPage++;
    renderProducts(false);
  });

  /* ---------- Product Filter ---------- */
  var buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      currentFilter = filter;
      currentPage = 1;

      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      renderProducts(true);
    });
  });

  /* ---------- Product Modal ---------- */
  var modal = document.getElementById('product-modal');
  var modalImg = document.getElementById('product-modal-img');
  var modalThumbs = document.getElementById('product-modal-thumbs');
  var modalName = document.getElementById('product-modal-name');
  var modalCategory = document.getElementById('product-modal-category');
  var modalBrand = document.getElementById('product-modal-brand');
  var modalClose = modal ? modal.querySelector('.product-modal-close') : null;
  var modalOverlay = modal ? modal.querySelector('.product-modal-overlay') : null;

  function findProduct(id) {
    for (var i = 0; i < allProducts.length; i++) {
      if (allProducts[i].id === id) return allProducts[i];
    }
    return null;
  }

  function openModal(productId) {
    var product = findProduct(productId);
    if (!product || !modal) return;

    modalName.textContent = product.name;
    modalCategory.textContent = categoryLabels[product.category] || product.category;
    modalBrand.textContent = product.brand ? 'Brand: ' + product.brand : '';

    // Main image
    var mainSrc = product.images && product.images.length > 0 ? product.images[0] : '';
    modalImg.src = mainSrc;
    modalImg.alt = product.name;

    // Thumbnails
    modalThumbs.innerHTML = '';
    if (product.images && product.images.length > 1) {
      product.images.forEach(function (src, idx) {
        var thumb = document.createElement('img');
        thumb.src = src;
        thumb.alt = product.name + ' ' + (idx + 1);
        thumb.className = 'product-modal-thumb' + (idx === 0 ? ' active' : '');
        thumb.addEventListener('click', function () {
          modalImg.src = src;
          modalThumbs.querySelectorAll('.product-modal-thumb').forEach(function (t) {
            t.classList.remove('active');
          });
          thumb.classList.add('active');
        });
        modalThumbs.appendChild(thumb);
      });
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(modal.querySelector('.product-modal-content'),
      { scale: 0.9, y: 30 },
      { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
    );
  }

  function closeModal() {
    if (!modal) return;
    gsap.to(modal, {
      opacity: 0, duration: 0.25, onComplete: function () {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // Delegate click on product cards
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.product-full-card');
    if (!card) return;
    var id = card.getAttribute('data-id');
    if (id) openModal(id);
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
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
