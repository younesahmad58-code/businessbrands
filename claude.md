# CLAUDE.md — Business Brands SRL Website Project

## Project Overview
Static presentation website for **Business Brands SRL** — a Romanian FMCG distribution company.
- **Hosted at:** `younesahmad58-code.github.io/businessbrands/`
- **Tech stack:** Pure HTML/CSS/JS, no frameworks. GSAP 3.12.5 for animations. GitHub Pages hosting.
- **Pages:** `index.html` (Acasă), `despre.html` (Despre Noi), `servicii.html` (Servicii), `produse.html` (Produse & Branduri), `contact.html` (Contact)
- **CSS files:** `css/global.css`, `css/effects.css`, `css/nav.css`, `css/footer.css`, `css/home.css`, `css/servicii.css`, `css/despre.css`, `css/produse.css`, `css/contact.css`
- **JS files:** `js/global.js` (shared), `js/home.js`, `js/servicii.js`, `js/despre.js`, `js/produse.js`, `js/contact.js`

## New Assets (Added by Client)
- **New Logo:** `logo2` file in project root — must replace `images/products/logo.png` everywhere. The new logo should NOT display as a square box — only the logo graphic + text, no background square. Ensure `object-fit: contain` and transparent background.
- **Brand Logos:** `images/brands/` folder — contains parent company logos for the marquee
- **Product Photos:** `poze site/` folder in project root — ~743 product images (with duplicates and subfolders). Must be deduplicated, categorized, and imported into the products page.

## Critical Architecture Notes

### Navigation & Shared Components
- **Nav and footer are duplicated in every HTML file** — there is NO templating system. Any change to nav/footer MUST be replicated across ALL 5 HTML files.
- Nav structure: centered logo with links split left/right on desktop, hamburger + slide-out panel on mobile (≤1024px).
- `global.js` handles: GSAP registration, splitText utility, navbar scroll effect, active link detection, hamburger toggle, page transitions, particle generation, scroll progress bar, magnetic buttons.

### Page Transition System
The site has a sophisticated page transition system with TWO distinct flows:
1. **Home/Logo navigation:** Uses body fade-out (`gsap.to(document.body, {opacity: 0})`), sets `bb-skip-preloader` in sessionStorage, then navigates. On arrival, preloader is skipped.
2. **Other page navigation:** Uses panel slide-in transition (`transition-panel--left/right`), sets `bb-transitioning` in sessionStorage. On arrival, panels slide out to reveal page.
3. **First visit to home/logo click:** Shows preloader (ring animation + letter reveal, then clip-path split).

**Important:** The inline `<script>` in each page's `<head>` checks for `bb-transitioning` and adds class `bb-entering` BEFORE page renders. This is critical for the panel transition to work.

### Preloader Logic (home.js)
- Preloader ONLY exists in `index.html` (other pages don't have `#preloader` element)
- `initPreloader()` checks: if `bbTransitioningIn` (set by global.js) OR `bb-skip-preloader` sessionStorage → skip preloader, show hero directly
- Otherwise: animate ring + text letters, then clip-path split after 1.2s
- Safety timeout at 4000ms forces preloader hidden

### GSAP Animation Pattern
All page-specific JS files follow this pattern:
```js
document.addEventListener('DOMContentLoaded', function() {
  // Hero title animation using splitText()
  // Section-specific ScrollTrigger animations
  // scrollReveal() calls for section labels/titles/subtitles
  // initTiltCards() for product cards
  // initCounters() for data-count elements
});
```

### CSS Architecture
- `global.css`: CSS variables (`:root`), reset, base typography, section/container, button styles, glass-card, effects
- Theme: Dark navy (#0A1118, #0D1B2A) with gold accents (#D4AF37)
- Font stack: Cormorant Garamond (display), Playfair Display (heading), DM Sans (body)
- Responsive breakpoints: 1024px, 768px, 480px

### Product Filter System (produse.js)
- Filter buttons with `data-filter` attribute
- Product cards with `data-category` attribute
- Filtering adds/removes `.hidden` class and uses GSAP for reveal animation
- **BUG:** When filtering to few items, ScrollTrigger-based animations on the NEXT section may not fire because the page height changes and triggers are never reached. FIX: Call `ScrollTrigger.refresh()` after filter animation completes.

---

## TASK LIST — All Changes Required

### 🔴 BUG FIXES

#### 1. Preloader/Splash Screen Not Working
**Problem:** The splash screen (preloader with logo + ring animation) should play when visiting the homepage or clicking the logo, but it's broken.
**Root cause:** Investigate the page transition logic in `global.js`. The `isHome` check and `bb-skip-preloader` logic may be preventing the preloader from showing. The preloader should show on:
- First visit to site (no sessionStorage flags)
- Clicking the logo from any page
- Navigating to index.html from any page
**Files:** `js/global.js` (page transitions), `js/home.js` (preloader init)
**Fix approach:**
- For first visit: preloader should always show (no sessionStorage flags set)
- For logo/home clicks: Remove the `bb-skip-preloader` logic. Instead, let the preloader play on every home navigation. OR keep skip-preloader but ensure it's only set for internal nav, not logo clicks.
- Debug: Check if `window.bbTransitioningIn` is being set incorrectly
- The `sessionStorage.setItem('bb-skip-preloader', '1')` in global.js line 277 may be the culprit — it skips preloader for ALL home navigations including logo clicks

#### 2. Servicii Page — CTA Text Not Visible on Mobile
**Problem:** On `servicii.html`, the CTA section text "Pregătiți pentru o colaborare de succes?" is not visible/cut off on mobile (see Screenshot 1).
**Root cause:** In `css/servicii.css` lines 168-183, the `.services-cta-title` has `white-space: nowrap` which prevents text wrapping on small screens, AND the font-size clamp is too small.
**Fix:** Remove `white-space: nowrap` from mobile media queries. Ensure text wraps properly. Same issue exists in `css/home.css` for `.cta-banner-title` (lines 673-680, 837-841).
**Files:** `css/servicii.css`, `css/home.css`

#### 3. Home Page — CTA Text Not Centered on Mobile
**Problem:** Similar to servicii — the "Pregătiți pentru un parteneriat de succes?" text on home page CTA banner is not properly centered on mobile.
**Fix:** Remove `white-space: nowrap`, ensure `text-align: center` and proper padding.
**Files:** `css/home.css`

#### 4. Mobile Hero — Empty Space Where Logo Should Be (Screenshot 4)
**Problem:** On mobile (index.html), there's a visible empty rectangular space above the hero badge where the hero image/logo should appear, but it's blank.
**Analysis:** Looking at Screenshot 4 (mobile) vs Screenshot 5 (desktop) — the desktop version does NOT have this space. This empty area is likely the hero-bg or a missing background image that only appears on mobile.
**Fix:** On mobile only, make the logo in `.nav-logo img` larger and centered. Check if there's a hidden element creating the gap. The green rectangle in screenshot 4 points to an empty space below the navbar — this could be extra padding or a missing element.
**Files:** `css/home.css`, `css/nav.css`

#### 5. Products Page — Filter Breaks Scroll/Next Section Loading
**Problem:** When filtering products on `produse.html` and only 2-3 items remain, scrolling down doesn't trigger the next section's animations/loading.
**Root cause:** GSAP ScrollTrigger positions are calculated on page load. When products are hidden, page height shrinks but ScrollTrigger doesn't recalculate.
**Fix:** After filter animation completes, call `ScrollTrigger.refresh()`:
```js
// In produse.js, after filter animation:
setTimeout(function() {
  ScrollTrigger.refresh();
}, 500);
```
**Files:** `js/produse.js`

### 🟡 CONTENT & DATA UPDATES

#### 6. Phone Number Update
**Old:** `0792 628 227` / `+40792628227`
**New:** `0787 747 939` / `+40787747939`
**Locations:** ALL 5 HTML files — footer contact section, contact.html (contact info + map address), meta description in contact.html
**Search & replace across all files.**

#### 7. Email Update
**Old:** `comenzi@homegate.ro`
**New:** `businessbrand40@yahoo.com`
**Locations:** ALL 5 HTML files — footer, contact.html (contact info + map address), meta description

#### 8. Location Update
**Old:** `București, România` / `Bulevardul Voluntari 86, Smart Expo Flora, București`
**New:** `Voluntari, Ilfov, România` / `Bulevardul Voluntari 86, Smart Expo Flora, Voluntari, Ilfov`
**Locations:** ALL footers (5 files), contact.html (contact info section + map section), map-deco-text ("BUCUREȘTI" → "VOLUNTARI"), hero-badge on index.html ("BUCUREȘTI — DISTRIBUȚIE FMCG" → "VOLUNTARI, ILFOV — DISTRIBUȚIE FMCG")
**Note:** The Google Maps embed iframe URL may need updating to show Voluntari correctly.

#### 9. CEO Name Addition
**Add:** "CEO: Husein Adnan" — add this to the contact page and footer where appropriate.

#### 10. HomeGate.ro — Mark as Partner Brand/Firm
**Problem:** HomeGate.ro is on a different company (since 2023). The website currently presents it as "Brandul Nostru" (Our Brand) and "Magazinul nostru online" — this creates legal ambiguity.
**Fix:** Change ALL references to clarify HomeGate.ro is a "firmă/brand partener" (partner brand/company):
- `index.html` line 204: "Retail Online — HomeGate.ro" → "Retail Online — HomeGate.ro (Brand Partener)"
- `index.html` line 208: "Magazinul nostru online..." → "Magazinul online al partenerului nostru, HomeGate.ro..."
- `servicii.html` line 182-207: Same changes for service 04
- `produse.html` lines 93-95: "Brandul Nostru" → "Brand Partener"
- `produse.html` lines 311-317: "Brandul Nostru" / "brandul propriu Business Brands" → "Brand partener" / "brand partener al Business Brands"
- All footer links to homegate.ro should note "(Brand Partener)"
- The `homegate-section` on produse.html should be reworded entirely

### 🟢 NEW FEATURES

#### 11. Language Switcher (RO / EN / AR)
**Requirement:** Add a language dropdown button in the navbar with Romanian, English, and Arabic options. Each option should show the country flag next to the language code.
**Implementation approach:**
- Add a dropdown to the nav (both desktop and mobile) positioned after the right nav links
- Flags: Romania 🇷🇴 (RO), UK 🇬🇧 (EN), UAE/generic Arab 🇦🇪 (AR)
- For now, this can be UI-only (no actual translation) OR create separate HTML files per language (e.g., `index-en.html`, `index-ar.html`)
- Recommended: Use small flag SVGs/images and a CSS dropdown
- For Arabic: add `dir="rtl"` support
- See Screenshot 3 for the desired dropdown design reference
**Files:** ALL 5 HTML files (nav section), `css/nav.css`, `js/global.js`

#### 12. Marquee Brands → Parent Companies with Logos
**Problem:** The marquee on index.html shows individual product brand names (Persil, Ariel, Fairy, etc.). Client wants parent company names with their logos instead.
**Brand → Parent Company Mapping:**

| Current Brand | Parent Company |
|---|---|
| Persil | Henkel |
| Ariel | Procter & Gamble |
| Fairy | Procter & Gamble |
| Lenor | Procter & Gamble |
| Domestos | Unilever |
| Perwoll | Henkel |
| Chanteclair | Realchimica S.p.A. (Italian, independent) |
| Dove | Unilever |
| CIF | Unilever |
| Calgon | Reckitt Benckiser |
| ACE | Fater (P&G + Angelini JV) |
| Duracell | Duracell (Berkshire Hathaway) |
| BIC | Société BIC S.A. |
| Dermomed | Dermomed S.r.l. (Italian, independent) |
| TRESemmé | Unilever |
| Pantene | Procter & Gamble |
| Asevi | Pons Químicas S.A. (Spanish) |
| Malizia | Mirato S.p.A. (Italian) |
| Semana | S.C. Farmec S.A. (Romanian) |
| HomeGate | Business Brands SRL (mark as Partner) |

**Deduplicated parent companies for marquee:**
Row 1: Procter & Gamble, Henkel, Unilever, Reckitt Benckiser, Duracell
Row 2: Société BIC, Fater, Mirato, Realchimica, Pons Químicas, Farmec, HomeGate (Partner)

**Implementation:** Replace text-only `.marquee-item` spans with logo images + company name. Ahmad needs to find/download each parent company's logo.
**What Ahmad needs to search for (logo downloads):**
- "Procter & Gamble logo PNG transparent"
- "Henkel logo PNG transparent"
- "Unilever logo PNG transparent"
- "Reckitt Benckiser logo PNG transparent"
- "Duracell logo PNG transparent"
- "BIC logo PNG transparent"
- "Fater spa logo PNG"
- "Mirato spa logo PNG"
- "Realchimica chanteclair logo PNG"
- "Pons Quimicas Asevi logo PNG"
- "Farmec Romania logo PNG"
**Save logos to:** `images/brands/` folder (create it)
**Files:** `index.html` (marquee section), `css/home.css`

#### 13. Hero Slideshow on Desktop (Above Badge)
**Requirement:** On desktop only, add an image slideshow above the "VOLUNTARI, ILFOV — DISTRIBUȚIE FMCG" badge, using the service images from `images/icons/` (import.png, distribution.png, engros.png, retail.png).
**Implementation:**
- Create a slideshow container inside `.hero-content`, positioned before `.hero-badge`
- Images slide left continuously (CSS animation or GSAP)
- Only visible on desktop (hide on mobile with `@media (max-width: 768px) { display: none; }`)
- Style: rounded corners, subtle shadow, maybe 60-70% width of hero
**Files:** `index.html`, `css/home.css`, `js/home.js`

#### 14. Footer — Google Maps Button
**Requirement:** Add a button in the footer that opens Google Maps to the warehouse/depot location.
**Implementation:** Add an `<a>` tag with Google Maps URL:
```html
<a href="https://www.google.com/maps/place/Bd.+Voluntari+86,+Voluntari+077190" target="_blank" rel="noopener" class="btn btn--outline btn--shimmer" style="margin-top: 0.75rem; font-size: 0.8rem; padding: 0.5rem 1.2rem;">
  Locația pe Hartă <span class="btn-arrow">→</span>
</a>
```
**Files:** ALL 5 HTML files (footer section)

#### 15. Products Page — Pagination/Load-More for 300-400 Products
**Problem:** Currently 25 products, but will grow to 300-400. Infinite scroll won't work. Need pagination or "Load More" system.
**Implementation options (recommended: Load More + lazy render):**
1. Show first 24 products, then "Încarcă Mai Multe" button loads next 24
2. When filtering, reset to page 1 of filtered results
3. Product data should be moved to a JS array/JSON for easy management
4. Each product needs: image path, name, category, optional detail images
5. Add `ScrollTrigger.refresh()` after each load
**Files:** `produse.html`, `js/produse.js`, `css/produse.css`

#### 16. Product Detail Page
**Requirement:** Clicking a product should open a detail view (modal or separate page) showing multiple images if available.
**Implementation options:**
- **Option A (Recommended):** Lightbox/modal overlay with image gallery
- **Option B:** Separate `produs.html?id=X` page
- For now, use a modal with image carousel
**Files:** New `css/product-modal.css` or add to `produse.css`, update `js/produse.js`

#### 17. Bulk Product Image Import (743 items folder)
**Notes for handling the product images folder:**
- Images folder has ~743 items including subfolders
- Many duplicates exist — use filename comparison + file size to detect
- Some products have multiple images (in subfolders or sequential names)
- Product data structure:
```js
{
  id: "product-001",
  name: "Persil Power Gel",
  category: "curatenie",
  images: ["img1.jpg", "img2.jpg"],
  brand: "Henkel"
}
```
- Create a build script or manual JSON file mapping images to products
- Use lazy loading (`loading="lazy"`) for all images
- Consider image optimization (WebP conversion) for performance

---

## TESTING CHECKLIST

After making changes, verify:
- [ ] Preloader works on first visit to homepage
- [ ] Preloader works when clicking logo from any page
- [ ] Other page transitions work (panel slide)
- [ ] Mobile: CTA text visible and centered on ALL pages
- [ ] Mobile: No empty space in hero section
- [ ] Mobile: Nav hamburger opens/closes correctly
- [ ] Desktop: Slideshow appears in hero
- [ ] Language switcher dropdown appears and works
- [ ] Phone number is 0787 747 939 everywhere
- [ ] Email is businessbrand40@yahoo.com everywhere
- [ ] Location shows Voluntari, Ilfov everywhere
- [ ] HomeGate.ro marked as "Brand Partener" everywhere
- [ ] Product filter works AND next section loads after filtering
- [ ] Footer Google Maps button opens correct location
- [ ] Marquee shows parent company logos (when provided)
- [ ] All 5 HTML files have consistent nav/footer content
- [ ] CEO name "Husein Adnan" appears where appropriate

## FILE CHANGE SUMMARY

| File | Changes |
|---|---|
| `index.html` | Phone, email, location, HomeGate partner text, marquee brands, hero slideshow, language switcher, footer Maps button, CEO name |
| `despre.html` | Phone, email, location, HomeGate references, language switcher, footer Maps button |
| `servicii.html` | Phone, email, location, HomeGate partner text, language switcher, footer Maps button |
| `produse.html` | Phone, email, location, HomeGate partner text, language switcher, footer Maps button, pagination system, product modal |
| `contact.html` | Phone, email, location, CEO name, language switcher, footer Maps button, Google Maps embed URL |
| `css/home.css` | Fix CTA white-space, add hero slideshow styles, mobile logo fix |
| `css/servicii.css` | Fix CTA white-space mobile |
| `css/nav.css` | Language switcher dropdown styles |
| `css/produse.css` | Pagination/load-more styles, product modal styles |
| `css/footer.css` | Google Maps button styles (if needed) |
| `js/global.js` | Fix preloader/transition logic, language switcher dropdown toggle |
| `js/home.js` | Fix preloader logic, hero slideshow JS |
| `js/produse.js` | ScrollTrigger.refresh() after filter, pagination/load-more logic, product modal |

## IMPORTANT WARNINGS FOR CLAUDE CODE

1. **DO NOT modify only one HTML file** — nav and footer are duplicated in ALL 5 files. Always update all 5.
2. **DO NOT remove GSAP dependencies** — the entire site depends on GSAP + ScrollTrigger.
3. **DO NOT change the page transition system** without understanding both flows (home fade vs panel slide).
4. **DO NOT use `localStorage`** — the site uses `sessionStorage` intentionally (clears on tab close).
5. **DO NOT add npm/build tooling** — this is a plain static site on GitHub Pages.
6. **Test on mobile viewport (375px)** after every CSS change.
7. **The `splitText()` function in global.js** is a custom utility (not GSAP SplitText plugin). It wraps each character in a `<span>`. Don't replace it with a GSAP plugin import.
8. **Font loading:** Fonts are loaded via Google Fonts `@import` in global.css. Don't move this to `<link>` tags without updating all pages.
9. **Image paths use URL encoding** — spaces in filenames are `%20` (e.g., `Web_Photo_Editor%20-%202026-02-27T154206.270.jpg`). Preserve this encoding.
10. **`effects.css`** contains particle animations, glass-card backdrop-filter, gradient-mesh, noise-overlay, text-chrome effects, transition panels, and tilt/glow card styles. It's shared across all pages.