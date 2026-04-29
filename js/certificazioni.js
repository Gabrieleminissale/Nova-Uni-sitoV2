/* ==========================================================================
   Nova Uni — certificazioni.js
   Navbar (scroll/hamburger/dropdown) + form contatti + pre-fill da URL
   ========================================================================== */

(() => {
  'use strict';

  /* ── Navbar: hamburger menu mobile ──────────────────────────────────── */
  const toggle = document.getElementById('navbarToggle');
  const menu = document.getElementById('navbarMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Navbar: dropdown "Corsi di laurea" ─────────────────────────────── */
  const dropdown = document.getElementById('navbarDropdown');
  if (dropdown) {
    const trigger = dropdown.querySelector('.navbar__dropdown-trigger');
    const closeDropdown = () => {
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) closeDropdown();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  /* ── Pre-fill form: ?cert=inglese | ?cert=eipass ─────────────────────── */
  const params = new URLSearchParams(window.location.search);
  const certParam = (params.get('cert') || '').toLowerCase();
  const certSelect = document.getElementById('cf-cert');
  if (certSelect && certParam) {
    const map = { inglese: 'Inglese B2', eipass: 'EIPASS', entrambe: 'Entrambe' };
    const target = map[certParam];
    if (target) {
      for (const opt of certSelect.options) {
        if (opt.value === target || opt.text === target) {
          certSelect.value = opt.value;
          break;
        }
      }
    }
  }

  /* ── Form contatti: invio via Web3Forms (stesso pattern home) ─────────── */
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('formSubmit');
  const submitLabel = form.querySelector('.form__submit-label');
  const submitSpinner = form.querySelector('.form__submit-spinner');
  const successBox = document.getElementById('formSuccess');
  const errorBox = document.getElementById('formError');

  const setLoading = (loading) => {
    submitBtn.disabled = loading;
    submitLabel.hidden = loading;
    submitSpinner.hidden = !loading;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    setLoading(true);

    const data = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();

      if (json.success) {
        form.hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(json.message || 'Invio fallito');
      }
    } catch (err) {
      console.error('Errore invio form:', err);
      errorBox.hidden = false;
      setLoading(false);
    }
  });
})();
