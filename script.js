/* Harshath portfolio: interactions */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Mobile menu
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Nav border and back-to-top visibility
  const nav = $('#nav'), toTop = $('#toTop');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    toTop.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // Active nav link highlighting
  const links = document.querySelectorAll('.nav-links a');
  const sections = [...links].map((a) => document.querySelector(a.getAttribute('href')));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && spy.observe(s));

  // Contact form validation
  const form = $('#contactForm'), status = $('#formStatus');
  const rules = {
    name: (v) => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Enter a subject (at least 3 characters).',
    message: (v) => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
  };
  function check(field) {
    const result = rules[field.name](field.value);
    const err = $('#' + field.name + 'Err');
    err.textContent = result === true ? '' : result;
    field.classList.toggle('invalid', result !== true);
    return result === true;
  }
  form.querySelectorAll('input,textarea').forEach((f) => f.addEventListener('blur', () => check(f)));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    const fields = [...form.querySelectorAll('input,textarea')];
    const ok = fields.map(check).every(Boolean);
    if (!ok) { fields.find((f) => f.classList.contains('invalid')).focus(); return; }
    // No backend: open the visitor's email app. Swap this for fetch() to Formspree/Netlify to send directly.
    const d = Object.fromEntries(new FormData(form));
    const body = encodeURIComponent(d.message + '\n\nFrom: ' + d.name + ' (' + d.email + ')');
    window.location.href = 'mailto:harshath190305@gmail.com?subject=' + encodeURIComponent(d.subject) + '&body=' + body;
    status.textContent = 'Opening your email app. Press send there to deliver the message.';
    form.reset();
  });
})();
