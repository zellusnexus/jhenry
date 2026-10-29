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

// Home service-area map: scale the wide map to the box height and slide it so its
// centre (the service area) sits in the middle of the part the card doesn't cover
const serviceMap = document.querySelector('.service-map');
const contactCard = document.querySelector('.map-contact .contact-card');
if (serviceMap && contactCard) {
  const placeMap = () => {
    const box = serviceMap.getBoundingClientRect();
    const card = contactCard.getBoundingClientRect();
    // a little bigger than the box so it can slide up or down and still fill it
    const scale = (box.height / 540) * 1.1;
    const beside = card.top < box.bottom - 60 && card.left > box.left + box.width / 3;
    // free area: left of the card on desktop, above the card's overlap when stacked
    const cx = beside ? (card.left - box.left) / 2 : box.width / 2;
    const cy = beside ? box.height / 2 : (Math.min(card.top, box.bottom) - box.top) / 2;
    serviceMap.style.setProperty('--map-scale', scale);
    serviceMap.style.setProperty('--map-x', `${cx - 1200 * scale}px`);
    // keep the title bar (top 60px) above the box and the map's bottom below it
    const top = Math.min(-60 * scale, Math.max(box.height - 600 * scale, cy - 330 * scale));
    serviceMap.style.setProperty('--map-y', `${top}px`);
  };
  window.addEventListener('resize', placeMap);
  placeMap();
}

// Google's map embed scrolls the page down to itself as it loads. It loads hidden
// in a fixed position (which the page can't scroll to), then drops into place;
// for a few seconds after that, any scroll the visitor didn't make is undone by
// putting the map back where it was on screen
let noteOwnScroll = () => {};    // the page's own scrolls (hash alignment below) call this
const mapFrame = document.querySelector('.service-map iframe');
if (mapFrame) {
  const root = document.documentElement;
  const mapBox = mapFrame.parentElement;
  const mapTop = () => mapBox.getBoundingClientRect().top;
  let lastInput = -1e4;
  let keptTop = 0;
  let guarding = false;
  const userActive = () => performance.now() - lastInput < 300;
  const touched = () => { lastInput = performance.now(); };
  ['wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'].forEach((type) => window.addEventListener(type, touched, { capture: true, passive: true }));
  noteOwnScroll = () => { keptTop = mapTop(); };

  window.addEventListener('scroll', () => {
    if (!guarding) return;
    const top = mapTop();
    // the visitor's scrolling (momentum carries on after the finger lifts), or the
    // browser holding the view still while images above load
    if (userActive() || Math.abs(top - keptTop) < 2) {
      if (userActive()) touched();
      keptTop = top;
      return;
    }
    root.style.scrollBehavior = 'auto';
    window.scrollBy(0, top - keptTop);
    root.style.scrollBehavior = '';
    keptTop = mapTop();
  }, { passive: true });

  let shown = false;
  const show = () => {
    if (shown) return;
    shown = true;
    mapFrame.classList.remove('map-loading');
    keptTop = mapTop();
    guarding = true;
    setTimeout(() => { guarding = false; }, 6000);
  };
  // the page's load event waits for the map too (and may already have fired)
  if (document.readyState === 'complete') setTimeout(show, 2500);
  else window.addEventListener('load', () => setTimeout(show, 2500), { once: true });
  setTimeout(show, 10000);    // in case the map is slow or never loads
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

// Arriving on a link to a section (e.g. index.html#services): images above it can
// still change size as they load and push it down, so keep it lined up under the
// header while the page settles (up to 3 seconds, or until the visitor scrolls)
const hashTarget = location.hash && document.getElementById(location.hash.slice(1));
if (hashTarget && 'ResizeObserver' in window) {
  const root = document.documentElement;
  const align = () => {
    root.style.scrollBehavior = 'auto';    // jump straight there rather than glide
    hashTarget.scrollIntoView();
    root.style.scrollBehavior = '';
    noteOwnScroll();
  };
  const watcher = new ResizeObserver(align);
  const stop = () => watcher.disconnect();
  watcher.observe(document.body);
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((type) => window.addEventListener(type, stop, { once: true, passive: true }));
  setTimeout(stop, 3000);
}

// In-page links (e.g. Book Now to #schedule): photos loading on the way down can
// push the section further along while the page glides there, so once the
// scroll ends, finish the trip if it fell short (unless the visitor took over)
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="#"]');
  if (!link || link.pathname !== location.pathname || !link.hash) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  const root = document.documentElement;
  let tries = 0;
  let cancelled = false;
  const cancel = () => { cancelled = true; };
  ['wheel', 'touchstart', 'keydown'].forEach((type) => window.addEventListener(type, cancel, { once: true, passive: true }));
  const wait = () => {
    if ('onscrollend' in window) window.addEventListener('scrollend', check, { once: true });
    else setTimeout(check, 1200);
  };
  const check = () => {
    if (cancelled) return;
    const pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    if (Math.abs(target.getBoundingClientRect().top - pad) > 2 && tries++ < 3) {
      target.scrollIntoView({ behavior: 'smooth' });
      wait();
    }
  };
  wait();
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
