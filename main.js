// ===== SMOOTH SCROLL (custom easing + duration) =====
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const getNavHeight = () => (nav ? nav.offsetHeight : 0);

  const DURATION_MS = 1200; 
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function animateScrollTo(targetY, duration = DURATION_MS, callback) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    if (!diff) { if (callback) callback(); return; }
    let startTime = null;
    let cancel = false;

    function step(ts) {
      if (cancel) return;
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = ease(t);
      window.scrollTo(0, Math.round(startY + diff * eased));
      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        if (callback) callback();
      }
    }

    const rafId = requestAnimationFrame(step);

    return () => { cancel = true; cancelAnimationFrame(rafId); };
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const top = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - getNavHeight());
      animateScrollTo(top, DURATION_MS, () => {
        try { history.pushState(null, '', href); } catch (err) {}
      });
    });
  });

  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      setTimeout(() => {
        const top = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - getNavHeight());
        animateScrollTo(top, DURATION_MS);
      }, 70);
    }
  }
});



  // ===== THEME TOGGLE =====
const themeBtn = document.createElement('button');
themeBtn.textContent = '☀️';
themeBtn.className = 'theme-btn';
document.body.appendChild(themeBtn);

themeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-theme');
  themeBtn.textContent = isLight ? '🌙' : '☀️';
});


  // ===== SCROLL TO TOP BUTTON =====
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.className = 'scroll-top';
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.pointerEvents = 'auto';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.pointerEvents = 'none';
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scroll({ top: 0, behavior: 'smooth' });
  });

  scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 10px 30px rgba(0, 238, 255, 0.5)';
  });

  scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 5px 20px rgba(0, 238, 255, 0.3)';
  });

  // ===== TYPING EFFECT =====
  const nameElement = document.querySelector('.hero-content h1');
  if(nameElement){
    const fullText = nameElement.textContent;
    nameElement.textContent = '';
    let index = 0;
    function typeEffect() {
      if(index < fullText.length) {
        nameElement.textContent += fullText.charAt(index);
        index++;
        setTimeout(typeEffect, 100);
      }
    }
    typeEffect();
  }

  // ===== FORM SUBMISSION =====
function handleSubmit(event) {
  event.preventDefault();

  const form = document.querySelector('.contact-form');
  const nameEl = form.querySelector('input[type="text"]');
  const emailEl = form.querySelector('input[type="email"]');
  const msgEl = form.querySelector('textarea');

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const message = msgEl.value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all fields');
    if (!name) nameEl.focus();
    else if (!email) emailEl.focus();
    else msgEl.focus();
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!emailPattern.test(email)) {
    alert('Invalid email address');
    emailEl.focus();
    return false;
  }

  alert(`Thank you, ${name}! Your message has been sent successfully`);
  form.reset();
  return true;
}

const form = document.querySelector('.contact-form');
if (form) form.addEventListener('submit', handleSubmit);


  // ===== SOCIAL ICONS LINKS =====
  const socialLinks = document.querySelectorAll('.social-icons a');
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href === '#') e.preventDefault();
    });
  });
