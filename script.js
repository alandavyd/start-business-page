// ====================================
// STAR BUSINESS 3ª Edição — Script
// ====================================

// --- NAVBAR SCROLL ---
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// --- HAMBURGER MENU ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- PARTICLE SYSTEM ---
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 60;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = 2 + Math.random() * 4;
    const delay = Math.random() * 5;
    const size = Math.random() < 0.3 ? 3 : Math.random() < 0.6 ? 2 : 1;
    const opacity = 0.3 + Math.random() * 0.7;
    p.style.cssText = `
      left: ${x}%; top: ${y}%;
      width: ${size}px; height: ${size}px;
      --dur: ${dur}s; --delay: ${delay}s; --max-opacity: ${opacity};
    `;
    container.appendChild(p);
  }
}
createParticles();

// --- COUNTDOWN ---
function updateCountdown() {
  const eventDate = new Date('2026-11-15T09:00:00');
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('countdown-section').innerHTML = '<p class="countdown-label" style="color: var(--gold-light); font-size: 18px;">🎉 O evento começou!</p>';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('days').textContent    = pad(days);
  document.getElementById('hours').textContent   = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// --- NUMBER COUNTER ANIMATION ---
function animateNumbers() {
  const numberEls = document.querySelectorAll('.number-value[data-target]');
  numberEls.forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = Date.now();
    const run = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(run);
      else el.textContent = target.toLocaleString('pt-BR');
    };
    run();
  });
}

// --- SCROLL REVEAL ---
function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger number animation when numbers section appears
        if (entry.target.closest('.numbers-section')) animateNumbers();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Add reveal class to elements
  const targets = document.querySelectorAll(
    '.feature-card, .speaker-card, .testimonial-card, .team-card, .pricing-card, .timeline-item, .faq-item, .number-item'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    observer.observe(el);
  });

  // Observe numbers section
  const numbersSection = document.querySelector('.numbers-section');
  if (numbersSection) observer.observe(numbersSection);
}
setupReveal();

// --- FAQ ACCORDION ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    faqItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// --- SMOOTH SCROLL (polyfill for older browsers) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- PRICING CARD HOVER GLOW ---
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(201,168,76,0.06) 0%, transparent 70%), linear-gradient(160deg, var(--dark-3) 0%, var(--dark-4) 100%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// --- ACTIVE NAV LINK ON SCROLL ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.pageYOffset >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--gold-light)';
    }
  });
}, { passive: true });

console.log('%c⭐ STAR BUSINESS 3ª Edição', 'color: #c9a84c; font-size: 20px; font-weight: bold;');
console.log('%cLanding page desenvolvida com ❤️', 'color: #9da8b8; font-size: 14px;');
