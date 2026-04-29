/* ==========================================================================
   Nova Uni — corsi.js
   Filtri, ricerca, dropdown navbar, mobile menu per la pagina /corsi
   ========================================================================== */

(() => {
  'use strict';

  /* ── Navbar: hamburger menu mobile (riuso pattern home) ──────────────── */
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

  /* ── Navbar: dropdown "Corsi di laurea" ──────────────────────────────── */
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

  /* ── Catalog: filtri + ricerca ───────────────────────────────────────── */
  const cards = Array.from(document.querySelectorAll('.course-card'));
  const radios = {
    ateneo: document.querySelectorAll('input[name="ateneo"]'),
    livello: document.querySelectorAll('input[name="livello"]'),
    ambito: document.querySelectorAll('input[name="ambito"]')
  };
  const searchInput = document.getElementById('searchInput');
  const resetBtn = document.getElementById('filtersReset');
  const emptyResetBtn = document.getElementById('emptyResetBtn');
  const resultsCount = document.getElementById('resultsCount');
  const emptyState = document.getElementById('emptyState');
  const grid = document.getElementById('coursesGrid');

  // Toggle filtri mobile
  const filtersToggle = document.getElementById('filtersToggle');
  const filtersAside = document.getElementById('catalogFilters');
  const filtersToggleCount = document.getElementById('filtersToggleCount');
  if (filtersToggle && filtersAside) {
    filtersToggle.addEventListener('click', () => {
      const open = filtersAside.classList.toggle('is-open');
      filtersToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Chiudi cliccando fuori (overlay)
    filtersAside.addEventListener('click', (e) => {
      if (e.target === filtersAside) {
        filtersAside.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // Stato dei filtri
  const state = { ateneo: '', livello: '', ambito: '', search: '' };

  // Mappa livello: il filtro "magistrale" include anche "ciclo-unico"? NO.
  // Ma il dropdown mega menu link a "?livello=magistrale" deve includere ciclo unico.
  // Convenzione: se filtro = "magistrale", mostriamo magistrale e ciclo-unico.
  const livelloMatch = (cardLivello, filterLivello) => {
    if (!filterLivello) return true;
    if (filterLivello === 'magistrale') return cardLivello === 'magistrale' || cardLivello === 'ciclo-unico';
    return cardLivello === filterLivello;
  };

  const normalize = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const applyFilters = () => {
    const q = normalize(state.search.trim());
    let visibleCount = 0;
    let activeFiltersCount = 0;
    if (state.ateneo) activeFiltersCount++;
    if (state.livello) activeFiltersCount++;
    if (state.ambito) activeFiltersCount++;

    cards.forEach(card => {
      const ateneo = card.dataset.ateneo;
      const livello = card.dataset.livello;
      const ambito = card.dataset.ambito;
      const name = normalize(card.dataset.name);
      const keywords = normalize(card.dataset.keywords || '');

      const matchAteneo = !state.ateneo || ateneo === state.ateneo;
      const matchLivello = livelloMatch(livello, state.livello);
      const matchAmbito = !state.ambito || ambito === state.ambito;
      const matchSearch = !q || name.includes(q) || keywords.includes(q);

      const visible = matchAteneo && matchLivello && matchAmbito && matchSearch;
      card.classList.toggle('is-hidden', !visible);
      if (visible) visibleCount++;
    });

    // Update counter
    if (resultsCount) {
      resultsCount.textContent = visibleCount === 1 ? '1 corso' : `${visibleCount} corsi`;
    }

    // Empty state
    if (emptyState) emptyState.hidden = visibleCount > 0;
    if (grid) grid.style.display = visibleCount > 0 ? '' : 'block';

    // Mobile filters count badge
    if (filtersToggleCount) {
      if (activeFiltersCount > 0) {
        filtersToggleCount.textContent = activeFiltersCount;
        filtersToggleCount.hidden = false;
      } else {
        filtersToggleCount.hidden = true;
      }
    }

    // Sincronizza URL (senza ricaricare la pagina)
    const params = new URLSearchParams();
    if (state.ateneo) params.set('ateneo', state.ateneo);
    if (state.livello) params.set('livello', state.livello);
    if (state.ambito) params.set('ambito', state.ambito);
    if (state.search) params.set('q', state.search);
    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    history.replaceState(null, '', newUrl + window.location.hash);
  };

  // Bind radio
  Object.entries(radios).forEach(([key, group]) => {
    group.forEach(r => {
      r.addEventListener('change', () => {
        state[key] = r.value;
        applyFilters();
      });
    });
  });

  // Bind search (debounced)
  let searchTimer;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.search = e.target.value;
        applyFilters();
      }, 150);
    });
  }

  // Reset
  const doReset = () => {
    state.ateneo = '';
    state.livello = '';
    state.ambito = '';
    state.search = '';
    Object.values(radios).forEach(group => {
      group.forEach(r => { r.checked = r.value === ''; });
    });
    if (searchInput) searchInput.value = '';
    applyFilters();
  };
  if (resetBtn) resetBtn.addEventListener('click', doReset);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', doReset);

  // Inizializzazione: leggi URL params (deep-linking dal mega menu)
  const urlParams = new URLSearchParams(window.location.search);
  const initFilter = (key, allowed) => {
    const val = urlParams.get(key);
    if (val && (!allowed || allowed.includes(val))) {
      state[key] = val;
      const radio = document.querySelector(`input[name="${key}"][value="${val}"]`);
      if (radio) radio.checked = true;
    }
  };
  initFilter('ateneo', ['pegaso', 'mercatorum', 'sanraffaele']);
  initFilter('livello', ['triennale', 'magistrale', 'ciclo-unico']);
  initFilter('ambito');
  const qInit = urlParams.get('q');
  if (qInit) {
    state.search = qInit;
    if (searchInput) searchInput.value = qInit;
  }

  applyFilters();
})();
