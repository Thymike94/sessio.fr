(() => {
  const STORE_EVENTS = {
    app_store: 'app_store_click',
    google_play: 'google_play_click'
  };

  function emit(name, detail = {}) {
    const payload = { event: name, ...detail };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('sessio:analytics', { detail: payload }));
  }

  const header = document.querySelector('[data-header]');
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  syncHeader();
  addEventListener('scroll', syncHeader, { passive: true });

  const storeLinks = [...document.querySelectorAll('[data-store]')];
  storeLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const store = link.dataset.store;
      const placement = link.dataset.placement || 'unknown';
      emit('store_cta_click', { store, placement });
      if (placement === 'hero') emit('hero_store_click', { store });
      if (placement === 'midpage') emit('midpage_store_click', { store });
      if (placement === 'footer') emit('footer_store_click', { store });
      if (STORE_EVENTS[store]) emit(STORE_EVENTS[store], { placement });
    });
  });

  const heroActions = document.querySelector('#telecharger');
  if (heroActions && 'IntersectionObserver' in window) {
    let viewed = false;
    new IntersectionObserver((entries, observer) => {
      if (!viewed && entries.some((entry) => entry.isIntersecting)) {
        viewed = true;
        emit('store_cta_view', { placement: 'hero' });
        observer.disconnect();
      }
    }, { threshold: .35 }).observe(heroActions);
  }

  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  if (isAndroid || isIOS) {
    const preferred = isAndroid ? 'google_play' : 'app_store';
    document.querySelectorAll('.store-actions').forEach((group) => {
      const preferredLink = group.querySelector('[data-store="' + preferred + '"]');
      if (preferredLink) group.prepend(preferredLink);
    });
  }
})();