(() => {
  'use strict';

  // Ogni modulo gestisce i propri messaggi, senza interferire con gli altri.
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    const submitBtn = form.querySelector('[type="submit"]');
    const submitLabel = form.querySelector('.form__submit-label');
    const submitSpinner = form.querySelector('.form__submit-spinner');
    const successBox = document.getElementById(form.dataset.success);
    const errorBox = document.getElementById(form.dataset.error);
    if (!submitBtn || !submitLabel || !submitSpinner || !successBox || !errorBox) return;

    let submitting = false;
    const setLoading = (loading) => {
      submitting = loading;
      submitBtn.disabled = loading;
      submitLabel.hidden = loading;
      submitSpinner.hidden = !loading;
      form.setAttribute('aria-busy', String(loading));
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submitting || !form.reportValidity()) return;
      if (form.elements.namedItem('botcheck')?.checked) return;

      errorBox.hidden = true;
      setLoading(true);
      const data = new FormData(form);
      data.set('data_invio_utc', new Date().toISOString());

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
          signal: controller.signal
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Invio non confermato');

        form.reset();
        form.hidden = true;
        successBox.hidden = false;
        successBox.focus({ preventScroll: true });
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {
        errorBox.hidden = false;
        errorBox.focus({ preventScroll: true });
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    });
  });
})();

