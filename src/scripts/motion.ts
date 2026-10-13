import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) new Lenis({ autoRaf: true, anchors: true });

// Staggered entrances. What is already on screen at load shows at once, so the first paint
// is never blank; only what scrolls in later animates.
const reveal = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      reveal.unobserve(entry.target);
    }
  },
  // No bottom margin: the footer's last line sits at the very end of the page, where a
  // negative margin would keep it from ever counting as visible.
  { threshold: 0 },
);
for (const element of document.querySelectorAll<HTMLElement>('[data-reveal], [data-words], .brush--scroll')) {
  if (reduceMotion || element.getBoundingClientRect().top < window.innerHeight) {
    element.classList.add('is-in');
  } else {
    reveal.observe(element);
  }
}
