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

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
