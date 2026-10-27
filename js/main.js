// J. Henry Plumbing – site interactions

// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.has-dropdown > a').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    }
  });
});

// Reviews carousel (homepage)
const reviews = document.querySelectorAll('.review');
let current = 0;

function showReview(index) {
  reviews[current].classList.remove('active');
  current = (index + reviews.length) % reviews.length;
  reviews[current].classList.add('active');
}

if (reviews.length) {
  document.querySelector('.carousel-btn.prev').addEventListener('click', () => showReview(current - 1));
  document.querySelector('.carousel-btn.next').addEventListener('click', () => showReview(current + 1));
  setInterval(() => showReview(current + 1), 8000);
}

// Before/after slider (About)
document.querySelectorAll('.compare').forEach((compare) => {
  const range = compare.querySelector('.compare-range');
  range.addEventListener('input', () => compare.style.setProperty('--pos', `${range.value}%`));
});

// See Our Work: show three rows of photos per gallery, with a View more / View less toggle
document.querySelectorAll('.work-gallery').forEach((gallery) => {
  const photos = [...gallery.querySelectorAll('img')];
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'view-more';
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<span>View more</span><span class="chev" aria-hidden="true"></span>';
  gallery.append(button);
  let expanded = false;

  const render = () => {
    const columns = getComputedStyle(gallery).gridTemplateColumns.split(' ').length;
    const limit = columns * 3;
    photos.forEach((img, i) => { img.hidden = !expanded && i >= limit; });
    button.hidden = photos.length <= limit;
    button.setAttribute('aria-expanded', String(expanded));
    button.firstElementChild.textContent = expanded ? 'View less' : 'View more';
  };
  render();
  window.addEventListener('resize', render);

  button.addEventListener('click', () => {
    // Keep the button where it is on screen while the gallery grows or shrinks
    const before = button.getBoundingClientRect().top;
    expanded = !expanded;
    render();
    if (!expanded) window.scrollBy(0, button.getBoundingClientRect().top - before);
  });
});

// See Our Work: open photos in a slideshow, cycling through that section's photos
const workSections = document.querySelectorAll('.work');
if (workSections.length) {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML = `
    <img class="lightbox-img" alt="">
    <button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous photo"></button>
    <button type="button" class="lightbox-btn lightbox-next" aria-label="Next photo"></button>
    <button type="button" class="lightbox-btn lightbox-close" aria-label="Close"></button>
    <p class="lightbox-count" aria-live="polite"></p>`;
  document.body.append(box);
  const boxImg = box.querySelector('.lightbox-img');
  const count = box.querySelector('.lightbox-count');
  let slides = [];
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    boxImg.src = slides[index].currentSrc || slides[index].src;
    boxImg.alt = slides[index].alt;
    count.textContent = `${index + 1} / ${slides.length}`;
  };
  const open = (section, img) => {
    slides = [...section.querySelectorAll('.work-gallery img')];
    opener = img;
    show(slides.indexOf(img));
    box.classList.add('open');
    document.body.classList.add('lightbox-open');
    box.querySelector('.lightbox-close').focus();
  };
  const close = () => {
    box.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    if (opener) opener.focus();
  };

  workSections.forEach((section) => {
    section.querySelectorAll('.work-gallery img').forEach((img) => {
      img.tabIndex = 0;
      img.addEventListener('click', () => open(section, img));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(section, img); }
      });
    });
  });

  box.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });

  // Swipe left/right on touch screens
  let touchX = null;
  box.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}

// Article share buttons: point each at the current page
document.querySelectorAll('[data-share]').forEach((link) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  const targets = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    x: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`,
    email: `mailto:?subject=${title}&body=${url}`,
  };
  link.href = targets[link.dataset.share];
});

// Resume upload: show the chosen file name
document.querySelectorAll('.upload-drop input[type=file]').forEach((input) => {
  const label = input.nextElementSibling;
  const placeholder = label.textContent;
  input.addEventListener('change', () => {
    label.textContent = input.files.length ? input.files[0].name : placeholder;
  });
});

// Show a neutral placeholder for any photo not yet added to /images
document.querySelectorAll('img').forEach((img) => {
  const markMissing = () => img.classList.add('img-missing');
  if (img.complete && img.naturalWidth === 0) markMissing();
  else img.addEventListener('error', markMissing);
});

// Home "Backed Up" photos: fade to the next photo every 5 seconds
// (stays on the first photo for visitors who prefer reduced motion)
const splitSlides = document.querySelectorAll('.split-slides img');
if (splitSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let shown = 0;
  setInterval(() => {
    if (document.hidden) return;
    splitSlides[shown].classList.remove('is-active');
    shown = (shown + 1) % splitSlides.length;
    splitSlides[shown].classList.add('is-active');
  }, 5000);
}

// Slide the hero van in from the right the first time it comes into view,
// once its photo has loaded (otherwise the slide finishes before it appears)
const heroVan = document.querySelector('.hero-van');
const vanImg = heroVan && heroVan.querySelector('img');
if (vanImg && 'IntersectionObserver' in window) {
  heroVan.classList.add('slide-in');
  const showVan = () => heroVan.classList.add('in-view');
  const watchVan = () => {
    // Force a reflow so the off-screen start position is applied before animating
    void heroVan.offsetWidth;
    const vanObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        showVan();
        vanObserver.disconnect();
      }
    }, { threshold: 0.2 });
    vanObserver.observe(heroVan);
  };
  if (vanImg.complete && vanImg.naturalWidth) watchVan();
  else {
    vanImg.addEventListener('load', watchVan, { once: true });
    vanImg.addEventListener('error', showVan, { once: true });
  }
}

// FAQ accordion: animate open/close and keep only one question open at a time
const faqItems = document.querySelectorAll('.faq details');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const animateHeight = (item, from, to, done) => {
  if (item.faqAnim) item.faqAnim.cancel();
  item.style.overflow = 'hidden';
  const anim = item.animate(
    { height: [`${from}px`, `${to}px`] },
    { duration: reduceMotion.matches ? 0 : 300, easing: 'cubic-bezier(.4, 0, .2, 1)' }
  );
  item.faqAnim = anim;
  anim.onfinish = () => {
    item.faqAnim = null;
    item.style.overflow = '';
    if (done) done();
  };
};

const openFaq = (item) => {
  const from = item.offsetHeight;
  item.classList.remove('closing');
  item.open = true;
  animateHeight(item, from, item.scrollHeight);
};

const closeFaq = (item) => {
  const from = item.offsetHeight;
  item.classList.add('closing');
  animateHeight(item, from, item.querySelector('summary').offsetHeight, () => {
    item.open = false;
    item.classList.remove('closing');
  });
};

faqItems.forEach((item) => {
  item.querySelector('summary').addEventListener('click', (e) => {
    e.preventDefault();
    if (item.open && !item.classList.contains('closing')) {
      closeFaq(item);
    } else {
      faqItems.forEach((other) => {
        if (other !== item && other.open && !other.classList.contains('closing')) closeFaq(other);
      });
      openFaq(item);
    }
  });
});

// Home service-area map: a still map (no dragging or zooming) with the
// outline of the area we serve drawn on it
const serviceMap = document.getElementById('service-map');
if (serviceMap && window.L) {
  const area = L.polygon([
    [34.995, -87.120], [35.174, -86.599], [35.124, -86.441], [34.967, -86.320],
    [34.523, -86.359], [34.304, -86.580], [34.310, -87.033], [34.778, -87.178]
  ], { color: '#2b2ee0', weight: 2, fillColor: '#2b2ee0', fillOpacity: 0.12 });
  const map = L.map(serviceMap, {
    dragging: false, touchZoom: false, scrollWheelZoom: false, doubleClickZoom: false,
    boxZoom: false, keyboard: false, zoomControl: false, attributionControl: false, zoomSnap: 0.25
  });
  // the map credit sits top left, clear of the contact card that overlaps the map
  L.control.attribution({ position: 'topleft', prefix: false }).addTo(map);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
  }).addTo(map);
  area.addTo(map);
  // leave room on the side the card covers: the right edge, or the bottom on narrow screens
  const fit = () => {
    const stacked = window.innerWidth <= 900;
    map.fitBounds(area.getBounds(), { paddingTopLeft: [20, 20], paddingBottomRight: stacked ? [20, 60] : [80, 20] });
  };
  fit();
  window.addEventListener('resize', () => { map.invalidateSize(); fit(); });
}

// Card carousels (home services and Plumbing News): step along one card at a
// time with a 5 second pause between steps, looping forever by moving the
// card that slid off to the other end. Arrows (shown on hover) step them by
// hand. They hold still while hovered or focused; with reduced motion they
// only move by the arrows
document.querySelectorAll('.card-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.card-carousel-track');
  const rail = carousel.querySelector('.card-carousel-rail');
  const pause = 5000;
  let held = false;
  let moving = false;
  let timer = null;

  const shift = () => rail.firstElementChild.offsetWidth + (parseFloat(getComputedStyle(rail).columnGap) || 0);
  const slide = (to, done) => {
    moving = true;
    rail.style.transition = reduceMotion.matches ? 'none' : 'transform .7s ease';
    rail.style.transform = to;
    const finish = () => {
      rail.style.transition = 'none';
      if (done) done();
      moving = false;
    };
    if (reduceMotion.matches) finish();
    else rail.addEventListener('transitionend', finish, { once: true });
  };

  const next = () => {
    if (moving) return;
    const first = rail.firstElementChild;
    slide(`translateX(-${shift()}px)`, () => {
      rail.appendChild(first);
      rail.style.transform = '';
    });
  };
  const prev = () => {
    if (moving) return;
    // put the last card in front, start one card to the left, then slide in
    rail.style.transition = 'none';
    rail.prepend(rail.lastElementChild);
    rail.style.transform = `translateX(-${shift()}px)`;
    rail.getBoundingClientRect();
    slide('translateX(0)', () => { rail.style.transform = ''; });
  };

  const schedule = () => {
    clearTimeout(timer);
    if (reduceMotion.matches) return;
    timer = setTimeout(() => {
      if (!held && !document.hidden) next();
      schedule();
    }, pause);
  };

  const makeArrow = (dir, label, go) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `card-carousel-arrow ${dir}`;
    btn.setAttribute('aria-label', label);
    btn.addEventListener('click', () => { go(); schedule(); });
    track.appendChild(btn);
    return btn;
  };
  const arrows = [makeArrow('prev', 'Previous', prev), makeArrow('next', 'Next', next)];

  // centre the arrows on the photos rather than the whole card
  const placeArrows = () => {
    const img = rail.querySelector('img');
    const top = img.getBoundingClientRect().top - track.getBoundingClientRect().top;
    arrows.forEach((btn) => { btn.style.top = `${top + img.offsetHeight / 2}px`; });
  };

  carousel.classList.add('is-carousel');
  carousel.addEventListener('mouseenter', () => { held = true; });
  carousel.addEventListener('mouseleave', () => { held = false; });
  carousel.addEventListener('focusin', () => { held = true; });
  carousel.addEventListener('focusout', () => { held = false; });
  window.addEventListener('resize', placeArrows);
  window.addEventListener('load', placeArrows);
  placeArrows();
  schedule();
});

// Home intro: on wide screens the schedule form sticks centred on the screen
// beside the taller text column (CSS position: sticky); this just works out
// how far down the screen "centred" is for the form's height
const introForm = document.querySelector('.intro-grid > .schedule-box');

if (introForm) {
  const header = document.querySelector('.site-header');
  const centreForm = () => {
    const headerH = header ? header.offsetHeight : 0;
    const visible = window.innerHeight - headerH;
    const formH = introForm.offsetHeight;
    // if the form is taller than the space under the header, keep its top in view
    const top = formH < visible ? headerH + (visible - formH) / 2 : headerH + 20;
    introForm.style.setProperty('--form-top', `${Math.round(top)}px`);
  };
  window.addEventListener('resize', centreForm);
  window.addEventListener('load', centreForm);
  centreForm();
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
