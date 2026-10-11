const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.setAttribute('data-revealed', '');
      observer.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -10% 0px' },
);

// Elements already on screen show at once, so the first paint (and a view transition
// landing on them) is never blank; only what scrolls in later animates.
for (const element of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
  if (element.getBoundingClientRect().top < window.innerHeight) {
    element.style.transition = 'none';
    element.setAttribute('data-revealed', '');
    requestAnimationFrame(() => element.style.removeProperty('transition'));
  } else {
    observer.observe(element);
  }
}
