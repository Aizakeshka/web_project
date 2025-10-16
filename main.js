// Скролл по секциям
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

// Свечение имени и фамилии
const logo = document.querySelector('.logo');
logo.addEventListener('mouseenter', () => {
  logo.style.color = '#fcfafcff'; 
  logo.style.textShadow = `
    0 0 5px #fcfafcff,
    0 0 10px #fcfafcff,
    0 0 20px #ff90ff
  `;
});

logo.addEventListener('mouseleave', () => {
  logo.style.color = '';
  logo.style.textShadow = 'none';
});

// Бургер меню для мобилок
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');

  if (!burger || !menu) return;

  burger.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');

  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    burger.classList.add('is-open');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    const firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    burger.classList.remove('is-open');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    burger.focus();
  }

  burger.addEventListener('click', (e) => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  menu.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      if (menu.classList.contains('open')) closeMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target) && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menu.classList.contains('open')) {
      closeMenu();
    }
  });
});

// Переключение тем
const themeBtn = document.createElement('button');
themeBtn.textContent = '☀️';
themeBtn.className = 'theme-btn';
document.body.appendChild(themeBtn);

themeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-theme');
  themeBtn.textContent = isLight ? '🌙' : '☀️';
});

// Скрол наверх
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

  // Эффект печатания текста
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

// Заполнение формы
function handleSubmit(event) {
  event.preventDefault();

  const form = document.querySelector('.contact-form');
  if (!form) return false;

  const firstEl = form.querySelector('input[placeholder="First Name"]');
  const lastEl  = form.querySelector('input[placeholder="Last Name"]');
  const phoneEl = form.querySelector('input[placeholder="Phone"]');
  const subjectEl = form.querySelector('input[placeholder="Subject"]');
  const emailEl = form.querySelector('input[placeholder="Email"]');
  const msgEl   = form.querySelector('textarea[placeholder="Message"]');

  const firstName = (firstEl && firstEl.value) ? firstEl.value.trim() : '';
  const lastName  = (lastEl  && lastEl.value)  ? lastEl.value.trim()  : '';
  const phone     = (phoneEl && phoneEl.value) ? phoneEl.value.trim() : '';
  const subject   = (subjectEl && subjectEl.value) ? subjectEl.value.trim() : '';
  const email     = (emailEl && emailEl.value) ? emailEl.value.trim() : '';
  const message   = (msgEl   && msgEl.value)   ? msgEl.value.trim()   : '';

  if (!firstName || !lastName || !phone || !subject || !email || !message) {
    alert('Please fill in all fields');
    if (!firstName) firstEl.focus();
    else if (!lastName) lastEl.focus();
    else if (!phone) phoneEl.focus();
    else if (!subject) subjectEl.focus();
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

  const phonePattern = /^\+?\d{7,15}$/;
  if (!phonePattern.test(phone)) {
    alert('Invalid phone number. Use digits, optional leading +, 7–15 characters.');
    phoneEl.focus();
    return false;
  }

  alert(`Thank you, ${firstName} ${lastName}! Your message about "${subject}" has been sent successfully.`);
  form.reset();
  return true;
}

const form = document.querySelector('.contact-form');
if (form) form.addEventListener('submit', handleSubmit);


  const socialLinks = document.querySelectorAll('.social-icons a');
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href === '#') e.preventDefault();
    });
  });
