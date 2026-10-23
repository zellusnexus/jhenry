// J. Henry Plumbing – homepage interactions

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

// Reviews carousel
const reviews = document.querySelectorAll('.review');
let current = 0;

function showReview(index) {
  reviews[current].classList.remove('active');
  current = (index + reviews.length) % reviews.length;
  reviews[current].classList.add('active');
}

document.querySelector('.carousel-btn.prev').addEventListener('click', () => showReview(current - 1));
document.querySelector('.carousel-btn.next').addEventListener('click', () => showReview(current + 1));
setInterval(() => showReview(current + 1), 8000);

// FAQ: keep only one item open at a time
document.querySelectorAll('.faq details').forEach((item, _, all) => {
  item.addEventListener('toggle', () => {
    if (item.open) all.forEach((other) => { if (other !== item) other.open = false; });
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
