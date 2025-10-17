const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initBurgerMenu();
  initThemeToggle();
  initScrollTop();
  initForm();
  initSocialLinks();
});

//Скрол по секциям
function initSmoothScroll() {
  const nav = $('nav');
  const navHeight = () => (nav ? nav.offsetHeight : 0);
  const DURATION = 900;
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function animateTo(targetY, duration = DURATION) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    if (!diff) return;
    let start = null;
    let raf;

    const step = ts => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      window.scrollTo(0, Math.round(startY + diff * ease(t)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }

  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - navHeight());
      animateTo(top);
      try { history.pushState(null, '', href); } catch (err) {}
    });
  });

  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    const t = document.getElementById(id);
    if (t) setTimeout(() => {
      const top = Math.max(0, t.getBoundingClientRect().top + window.pageYOffset - navHeight());
      animateTo(top, 700);
    }, 60);
  }
}

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

//Бургер меню для мобилок
function initBurgerMenu() {
  const burger = $('#hamburger');
  const menu = $('#menu');
  if (!burger || !menu) return;

  burger.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');

  const open = () => {
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    const first = menu.querySelector('a');
    if (first) first.focus();
  };
  const close = () => {
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    burger.focus();
  };

  on(burger, 'click', () => burger.getAttribute('aria-expanded') === 'true' ? close() : open());

  on(document, 'keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) close(); });

  $$('#menu a[href^="#"]').forEach(a => on(a, 'click', close));

  on(document, 'click', e => {
    if (!menu.contains(e.target) && !burger.contains(e.target) && menu.classList.contains('open')) close();
  });

  on(window, 'resize', () => { if (window.innerWidth > 768 && menu.classList.contains('open')) close(); });
}

//Переключатель тем
function initThemeToggle() {
  const btn = document.createElement('button');
  btn.className = 'theme-btn';
  btn.setAttribute('aria-label', 'Toggle theme');
  btn.textContent = '☀️';
  document.body.appendChild(btn);

  on(btn, 'click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    btn.textContent = isLight ? '🌙' : '☀️';
  });
}

//Скрол вверх
function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  const toggle = () => {
    const visible = window.pageYOffset > 300;
    btn.style.opacity = visible ? '1' : '0';
    btn.style.pointerEvents = visible ? 'auto' : 'none';
  };
  on(window, 'scroll', toggle);
  toggle();

  on(btn, 'click', () => window.scroll({ top: 0, behavior: 'smooth' }));

  on(btn, 'mouseenter', () => btn.classList.add('scroll-top--hover'));
  on(btn, 'mouseleave', () => btn.classList.remove('scroll-top--hover'));
}

//Валидация формы
function initForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  on(form, 'submit', (e) => {
    e.preventDefault();

    const data = {
      first: form.querySelector('input[placeholder="First Name"]')?.value.trim() || '',
      last:  form.querySelector('input[placeholder="Last Name"]')?.value.trim() || '',
      phone: form.querySelector('input[placeholder="Phone"]')?.value.trim() || '',
      subject: form.querySelector('input[placeholder="Subject"]')?.value.trim() || '',
      email: form.querySelector('input[placeholder="Email"]')?.value.trim() || '',
      message: form.querySelector('textarea[placeholder="Message"]')?.value.trim() || ''
    };

    for (const [k, v] of Object.entries(data)) {
      if (!v) {
        alert('Please fill in all fields');
        const el = form.querySelector('[placeholder$="' + (k === 'last' ? 'Last Name' : k[0].toUpperCase() + k.slice(1)) + '"]');
        if (el) el.focus();
        return;
      }
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRe.test(data.email)) { alert('Invalid email address'); form.querySelector('input[placeholder="Email"]').focus(); return; }

    const phoneRe = /^\+?\d{7,15}$/;
    if (!phoneRe.test(data.phone)) { alert('Invalid phone number'); form.querySelector('input[placeholder="Phone"]').focus(); return; }

    alert(`Thank you, ${data.first} ${data.last}! Your message about "${data.subject}" has been sent successfully.`);
    form.reset();
  });
}

//Ссылки для соцсетей
function initSocialLinks() {
  $$('.social-icons a').forEach(a => on(a, 'click', e => {
    if (a.getAttribute('href') === '#') e.preventDefault();
  }));
}

