/** Interactive behavior for the preserved public Riverwalk markup.
 * No original analytics, patient-tracking scripts, or vendor credentials run here.
 */
export function mountRiverwalk(root: HTMLElement) {
  const disposers: (() => void)[] = [];
  function listen(target: EventTarget | null, type: string, callback: EventListener, options?: AddEventListenerOptions) {
    target?.addEventListener(type, callback, options);
    disposers.push(() => target?.removeEventListener(type, callback, options));
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = root.querySelector<HTMLElement>('#scroll-progress');
  const floating = root.querySelector<HTMLElement>('#floating-actions');
  const updateScroll = () => {
    const height = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
    const visible = scrollY > 400;
    for (const name of ['opacity-0', 'translate-y-6', 'pointer-events-none']) floating?.classList.toggle(name, !visible);
    for (const name of ['opacity-100', 'translate-y-0', 'pointer-events-auto']) floating?.classList.toggle(name, visible);
  };
  listen(window, 'scroll', updateScroll, { passive: true });
  updateScroll();
  listen(root.querySelector('#back-to-top'), 'click', () => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' }));

  const menu = root.querySelector<HTMLElement>('#menu-btn');
  const close = root.querySelector<HTMLElement>('#close-drawer-btn');
  const drawer = root.querySelector<HTMLElement>('#nav-drawer');
  const panel = drawer?.querySelector('[data-drawer-panel]');
  const toggleDrawer = (open: boolean) => {
    drawer?.classList.toggle('-translate-x-full', !open);
    drawer?.classList.toggle('translate-x-0', open);
    drawer?.setAttribute('aria-hidden', String(!open));
    menu?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('overflow-hidden', open);
    // Prevent off-screen drawer links from entering the keyboard tab order.
    if (drawer) drawer.inert = !open;
    if (open) close?.focus();
  };
  toggleDrawer(false);
  listen(menu, 'click', () => toggleDrawer(true));
  listen(close, 'click', () => { toggleDrawer(false); menu?.focus(); });
  listen(document, 'keydown', (event) => {
    if ((event as KeyboardEvent).key === 'Escape' && drawer?.getAttribute('aria-hidden') === 'false') {
      toggleDrawer(false); menu?.focus();
    }
  });
  listen(drawer ?? null, 'click', (event) => {
    const target = event.target as Element;
    if ((panel && !panel.contains(target)) || target.closest('a[href]')) toggleDrawer(false);
  });
  root.querySelectorAll<HTMLElement>('[data-accordion-trigger]').forEach(trigger => {
    listen(trigger, 'click', () => {
      const content = trigger.parentElement?.parentElement?.querySelector<HTMLElement>(':scope > [data-accordion-content]');
      if (!content) return;
      const open = content.dataset.open !== 'true';
      content.dataset.open = String(open);
      content.style.maxHeight = open ? `${content.scrollHeight}px` : '0px';
      trigger.setAttribute('aria-expanded', String(open));
      trigger.querySelector('[data-accordion-arrow]')?.classList.toggle('rotate-180', open);
      let parent = content.parentElement?.closest<HTMLElement>('[data-accordion-content]');
      while (parent) {
        if (parent.dataset.open === 'true') parent.style.maxHeight = `${parent.scrollHeight}px`;
        parent = parent.parentElement?.closest<HTMLElement>('[data-accordion-content]') ?? null;
      }
    });
  });

  const reveals = root.querySelectorAll<HTMLElement>('.reveal-on-scroll, .reveal-left, .reveal-right, .scale-on-scroll');
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(node => node.classList.add('is-visible'));
  else {
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(node => observer.observe(node));
    disposers.push(() => observer.disconnect());
  }
  root.querySelectorAll<HTMLVideoElement>('video').forEach(video => {
    video.muted = true;
    if (reduced) { video.autoplay = false; video.pause(); }
    else if (video.autoplay) video.play().catch(() => { /* Poster remains available. */ });
  });

  root.querySelectorAll<HTMLElement>('[data-carousel-root]').forEach(carousel => {
    const track = carousel.querySelector<HTMLElement>('[data-carousel-track]');
    if (!track) return;
    const indicator = carousel.parentElement?.querySelector<HTMLElement>('[data-carousel-indicator]');
    const update = () => {
      if (!indicator) return;
      const limit = track.scrollWidth - track.clientWidth;
      indicator.style.width = `${limit <= 0 ? 100 : 30 + track.scrollLeft / limit * 70}%`;
    };
    listen(track, 'scroll', update, { passive: true });
    update();
    for (const [selector, direction] of [['[data-carousel-prev]', -1], ['[data-carousel-next]', 1]] as const) {
      listen(carousel.querySelector(selector), 'click', () => track.scrollBy({ left: direction * track.clientWidth * 0.6, behavior: reduced ? 'instant' : 'smooth' }));
    }
    let down = false, dragged = false, startX = 0, startScroll = 0;
    listen(track, 'mousedown', event => { down = true; dragged = false; startX = (event as MouseEvent).pageX; startScroll = track.scrollLeft; });
    listen(window, 'mouseup', () => { down = false; });
    listen(track, 'mouseleave', () => { down = false; });
    listen(track, 'mousemove', event => {
      if (!down) return;
      const delta = ((event as MouseEvent).pageX - startX) * 1.8;
      if (Math.abs(delta) > 6) { dragged = true; event.preventDefault(); track.scrollLeft = startScroll - delta; }
    });
    listen(track, 'click', event => { if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; } }, { capture: true });
  });

  root.querySelectorAll<HTMLFormElement>('form[data-contact-form]').forEach(form => {
    const button = form.querySelector<HTMLButtonElement>('[data-contact-submit]');
    const error = form.querySelector<HTMLElement>('[id$="-error"]');
    const showError = (text: string) => {
      if (!error) return;
      error.textContent = text; error.style.display = 'block'; error.setAttribute('role', 'alert');
    };
    const submit = async () => {
      if (!form.reportValidity()) return;
      const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
      if (!endpoint) {
        showError('This copied website is a preview. Messages are not being sent yet. Please call your preferred office to request an appointment.');
        return;
      }
      if (button) button.disabled = true;
      if (error) error.style.display = 'none';
      try {
        const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Submission failed');
        const success = root.querySelector<HTMLElement>(`#${form.id}-success`);
        if (success) { success.style.display = 'block'; success.setAttribute('role', 'status'); form.style.display = 'none'; }
        else showError('Your message has been sent. The office will contact you to confirm your request.');
        form.reset();
      } catch { showError('Your message could not be sent. Please try again or call your preferred office directly.'); }
      finally { if (button) button.disabled = false; }
    };
    listen(button, 'click', () => { void submit(); });
    listen(form, 'submit', event => { event.preventDefault(); void submit(); });
  });
  return () => {
    disposers.forEach(dispose => dispose());
    document.body.classList.remove('overflow-hidden');
    document.documentElement.classList.remove('js-reveal');
  };
}
