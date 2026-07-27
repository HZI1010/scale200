// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '-80px' });

document.querySelectorAll('.reveal, .stagger-c').forEach(el => observer.observe(el));

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const open = mobileMenu.classList.contains('open');
    menuBtn.innerHTML = open
      ? '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
      : '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// Header blur on scroll
document.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Forms — simulate success for static site
async function handleForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {};
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(inp => { data[inp.name] = inp.value; });

    for (const inp of inputs) {
      if (!inp.value.trim() && inp.required) {
        if (statusEl) statusEl.textContent = 'Please fill in all fields';
        return;
      }
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      if (statusEl) statusEl.textContent = 'Please enter a valid email';
      return;
    }

    if (statusEl) statusEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-flex items-center gap-1"><svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Sending...</span>';

    console.log(`[Form] ${formId}:`, data);

    setTimeout(() => {
      form.innerHTML = '<div class="rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-8 text-center"><div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-cyan/10"><svg class="h-6 w-6 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></div><h3 class="mb-2 text-xl font-bold">Success!</h3><p class="text-text-muted">Thanks for reaching out! We\'ll be in touch within 24 hours.</p></div>';
    }, 800);
  });
}

handleForm('contact-form');
handleForm('kit-form');
