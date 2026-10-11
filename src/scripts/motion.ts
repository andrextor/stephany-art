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
  { rootMargin: '0px 0px -10% 0px' },
);
for (const element of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
  if (reduceMotion || element.getBoundingClientRect().top < window.innerHeight) {
    element.classList.add('is-in');
  } else {
    reveal.observe(element);
  }
}

// Words light up in reading order as the block moves from 80% to 45% of the viewport.
const blocks = [...document.querySelectorAll<HTMLElement>('[data-words]')].map((block) => ({
  block,
  words: [...block.querySelectorAll<HTMLElement>('[data-word]')],
}));
const lightWords = (): void => {
  for (const { block, words } of blocks) {
    const rect = block.getBoundingClientRect();
    const start = window.innerHeight * 0.8;
    const end = window.innerHeight * 0.45;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height)));
    const lit = reduceMotion ? words.length : Math.round(progress * words.length);
    for (const [index, word] of words.entries()) word.classList.toggle('is-lit', index < lit);
  }
};
if (blocks.length > 0) {
  lightWords();
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        lightWords();
        ticking = false;
      });
    },
    { passive: true },
  );
}
