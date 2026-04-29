/* ==========================================================================
   Nova Uni — main.js
   ========================================================================== */

(() => {
  'use strict';

  /* ── Navbar: cambia stile dopo lo scroll ──────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Navbar: menu hamburger su mobile ─────────────────────────────────── */
  const toggle = document.getElementById('navbarToggle');
  const menu = document.getElementById('navbarMenu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  });
  // Chiudi il menu quando clicchi un link
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Testimonianze: carousel a click ──────────────────────────────────── */
  const testimonials = [
    {
      text: "Polo professionale, mi sono iscritto con una facilità unica, sempre disponibili per chiarimenti e suggerimenti. Grazie a loro sono riuscito ad esonerare degli esami. Corsi validissimi. Consigliatissimo",
      author: "Ignazio M.",
      role: "Lavoratore, iscritto a Pegaso"
    },
    {
      text: "La consiglio vivamente. Precisa, educata, disponibile ed economica. Ho effettuato due corsi e mi sono stati convalidati immediatamente dall’università. Massima serietà. La consiglio.",
      author: "Alessia D.",
      role: "Studentessa universitaria — Certificazioni EIPASS e Inglese B2"
    },
    {
      text: "Sono seguita da questo polo che mi ha aiutato nell’iscrizione, ho trovato cortesia e professionalità! Inoltre, sono sempre molto disponibili per qualsiasi assistenza o informazione.",
      author: "Cristina M.",
      role: "Diplomata, iscritta a Pegaso"
    },
    {
      text: "Laura è riuscita in una telefonata di 10’ a darmi le informazioni giuste e aiutarmi con l’iscrizione all’università, informazioni che da un anno provavo a trovare. Consigliatissima.",
      author: "Lucila C.",
      role: "Studentessa Residente all'estero, iscritta a Mercatorum "
    }
  ];

  const testiText = document.getElementById('testiText');
  const testiAuthor = document.getElementById('testiAuthor');
  const testiRole = document.getElementById('testiRole');
  const dots = document.querySelectorAll('#testiDots .testimonial__dot');

  const setActive = (idx) => {
    const t = testimonials[idx];
    if (!t) return;
    testiText.textContent = t.text;
    testiAuthor.textContent = t.author;
    testiRole.textContent = t.role;
    dots.forEach((d, i) => d.classList.toggle('testimonial__dot--active', i === idx));
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => setActive(Number(dot.dataset.idx)));
  });

  /* ── Navbar: dropdown "Corsi di laurea" ───────────────────────────────── */
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

  /* ── Form contatti: pre-compila da URL (es: ?corso=Scienze%20Motorie) ── */
  const params = new URLSearchParams(window.location.search);
  const corsoParam = params.get('corso');
  if (corsoParam) {
    const msgField = document.getElementById('f-msg');
    const areaField = document.getElementById('f-area');
    if (msgField) {
      msgField.value = `Vorrei ricevere informazioni sul corso: ${corsoParam}`;
    }
    // Mappa rapida corso → area di interesse del select (best effort)
    if (areaField) {
      const lower = corsoParam.toLowerCase();
      const map = [
        ['giurispruden', 'Giurisprudenza'],
        ['economia', 'Economia e Management'],
        ['gestion', 'Economia e Management'],
        ['management', 'Economia e Management'],
        ['psicologi', 'Psicologia'],
        ['motori', 'Scienze Motorie'],
        ['sport', 'Scienze Motorie'],
        ['ingegneri', 'Ingegneria'],
        ['informatic', 'Ingegneria'],
        ['educazion', 'Scienze dell’Educazione'],
        ['pedagogi', 'Scienze dell’Educazione']
      ];
      for (const [keyword, value] of map) {
        if (lower.includes(keyword)) {
          for (const opt of areaField.options) {
            if (opt.text === value) { areaField.value = opt.value || opt.text; break; }
          }
          break;
        }
      }
    }
    // Scroll alla sezione contatti se siamo già sulla home
    const contatti = document.getElementById('contatti');
    if (contatti) {
      setTimeout(() => contatti.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }

  /* ── Form contatti: invio via Web3Forms ───────────────────────────────── */
  const form = document.getElementById('contactForm');
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
