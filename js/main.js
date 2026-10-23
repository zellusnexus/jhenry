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

// FAQ: keep only one item open at a time
document.querySelectorAll('.faq details').forEach((item, _, all) => {
  item.addEventListener('toggle', () => {
    if (item.open) all.forEach((other) => { if (other !== item) other.open = false; });
  });
});

// Before/after slider (About)
document.querySelectorAll('.compare').forEach((compare) => {
  const range = compare.querySelector('.compare-range');
  range.addEventListener('input', () => compare.style.setProperty('--pos', `${range.value}%`));
});

// Work galleries: show the first N photos, "View more" reveals the rest
document.querySelectorAll('[data-gallery]').forEach((gallery) => {
  const limit = Number(gallery.dataset.gallery);
  const extra = [...gallery.querySelectorAll('img')].slice(limit);
  const button = gallery.querySelector('.view-more');
  if (!extra.length) {
    button.remove();
    return;
  }
  extra.forEach((img) => { img.hidden = true; });
  button.addEventListener('click', () => {
    extra.forEach((img) => { img.hidden = false; });
    button.remove();
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

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
