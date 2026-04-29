/* ==========================================================================
   Nova Uni — cookie-consent.js
   Banner GDPR-compliant + integrazione con Google Analytics Consent Mode v2
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'novauni_cookie_consent_v1';
  const CONSENT_VERSION = '1';

  // ---- Storage helpers --------------------------------------------------
  const readConsent = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (obj.version !== CONSENT_VERSION) return null;
      return obj;
    } catch (e) { return null; }
  };

  const writeConsent = (analytics) => {
    const obj = {
      version: CONSENT_VERSION,
      analytics: !!analytics,
      timestamp: new Date().toISOString()
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
    return obj;
  };

  // ---- Apply consent to gtag --------------------------------------------
  const applyConsent = (analytics) => {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied'
      });
    }
  };

  // ---- Banner UI --------------------------------------------------------
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cc-accept');
  const rejectBtn = document.getElementById('cc-reject');

  const showBanner = () => {
    if (!banner) return;
    banner.hidden = false;
    document.body.classList.add('has-cookie-banner');
    // Piccolo delay per animazione di slide-in
    requestAnimationFrame(() => banner.classList.add('is-visible'));
  };

  const hideBanner = () => {
    if (!banner) return;
    banner.classList.remove('is-visible');
    document.body.classList.remove('has-cookie-banner');
    setTimeout(() => { banner.hidden = true; }, 300);
  };

  // ---- Init -------------------------------------------------------------
  const saved = readConsent();
  if (saved) {
    applyConsent(saved.analytics);
  } else {
    showBanner();
  }

  // ---- Bind actions -----------------------------------------------------
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      writeConsent(true);
      applyConsent(true);
      hideBanner();
    });
  }
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      writeConsent(false);
      applyConsent(false);
      hideBanner();
    });
  }

  // Riapertura banner da link nel footer (data-cc-open)
  document.querySelectorAll('[data-cc-open]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showBanner();
    });
  });
})();
