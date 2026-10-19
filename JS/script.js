(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = [...document.querySelectorAll('.main-nav .nav-link')];
  const form = document.getElementById('contactForm');
  const emailInput = document.getElementById('contactEmail');
  const formNote = document.getElementById('formNote');
  const toast = document.getElementById('toast');
  let toastTimer;

  // Keep the sticky header subtle once the page begins to scroll.
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Mobile navigation: toggle, close on selection, Escape, or outside click.
  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('is-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    mainNav?.classList.toggle('is-open', !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (mainNav?.classList.contains('is-open') &&
        !mainNav.contains(event.target) && !menuToggle?.contains(event.target)) {
      closeMenu();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) closeMenu();
  });

  // Highlight the section currently in view in the main navigation.
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // The inquiry form is front-end only until it is connected to an email service.
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const email = emailInput.value.trim();
    if (!email) return;

    if (formNote) {
      formNote.textContent = 'Thanks! This demo form is ready to connect to your inbox.';
    }
    showToast('Thanks for reaching out!');
    form.reset();
  });

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  // Keep the footer date current.
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
