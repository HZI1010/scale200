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

// Forms
const DEFAULT_SUCCESS_HTML = '<div class="rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-8 text-center"><div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-cyan/10"><svg class="h-6 w-6 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></div><h3 class="mb-2 text-xl font-bold">Success!</h3><p class="text-text-muted">Thanks for reaching out! We\'ll be in touch within 24 hours.</p></div>';

function sendKitByEmail(data) {
  return emailjs.send(
    'service_55n9w6m',
    'template_4p9q9rn',
    {
      email: data.email,
      first_name: data.name.trim(),
      download_link: 'https://scale2002v.netlify.app/downloads/scale200-package-v1.pdf'
    },
    { publicKey: 'MMAv2WZPl9Me-vOej' }
  );
}

const KIT_SENT_KEY = 'scale200_kit_sent';
function getSentEmails() {
  try {
    const raw = localStorage.getItem(KIT_SENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}
function recordSentEmail(email) {
  try {
    const list = getSentEmails();
    if (!list.includes(email)) list.push(email);
    localStorage.setItem(KIT_SENT_KEY, JSON.stringify(list));
  } catch (err) {}
}

function handleKitForm() {
  const form = document.getElementById('kit-form');
  if (!form) return;
  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.innerHTML : '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {};
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(inp => { data[inp.name] = inp.value.trim(); });

    for (const inp of inputs) {
      if (!data[inp.name] && inp.required) {
        if (statusEl) {
          statusEl.style.color = '';
          statusEl.textContent = 'Please fill in all fields';
        }
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      if (statusEl) {
        statusEl.style.color = '';
        statusEl.textContent = 'Please enter a valid email';
      }
      return;
    }

    const normalized = data.email.trim().toLowerCase();
    if (getSentEmails().includes(normalized)) {
      if (statusEl) {
        statusEl.style.color = '';
        statusEl.textContent = 'This email has already received the kit.';
      }
      return;
    }

    if (statusEl) statusEl.textContent = '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="inline-flex items-center gap-1"><svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Sending your kit&hellip;</span>';
    }

    try {
      await sendKitByEmail(data);
      recordSentEmail(normalized);
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
      if (statusEl) {
        statusEl.style.color = '#34d399';
        statusEl.textContent = 'Your kit is on the way. Please check your inbox and spam folder.';
      }
    } catch (err) {
      console.error('[Form] kit-form error:', err);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
      if (statusEl) {
        statusEl.style.color = '';
        statusEl.textContent = 'We couldn\'t send the kit. Please try again.';
      }
    }
  });
}

handleForm('contact-form');
handleKitForm();

async function handleForm(formId, opts = {}) {
  const form = document.getElementById(formId);
  if (!form) return;
  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.innerHTML : '';

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
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="inline-flex items-center gap-1"><svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Sending...</span>';
    }

    console.log(`[Form] ${formId}:`, data);

    if (opts.onSubmit) {
      try {
        await opts.onSubmit(data);
        form.innerHTML = opts.successHtml || DEFAULT_SUCCESS_HTML;
      } catch (err) {
        console.error(`[Form] ${formId} error:`, err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalLabel;
        }
        if (statusEl) statusEl.textContent = opts.errorMsg || 'Something went wrong. Please try again.';
      }
      return;
    }

    setTimeout(() => {
      form.innerHTML = opts.successHtml || DEFAULT_SUCCESS_HTML;
    }, 800);
  });
}
