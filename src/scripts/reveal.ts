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

for (const element of document.querySelectorAll('[data-reveal]')) {
  observer.observe(element);
}
