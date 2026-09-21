import { useEffect, useRef, useState } from 'react';

/**
 * useScrollTimeline — scroll-driven interactive timeline engine.
 *
 * Provides everything a vertical timeline needs to react to scrolling:
 *
 * 1. CONTINUOUS PROGRESS (0 → 1) of the timeline through the viewport,
 *    written directly to the container element as the CSS custom property
 *    `--timeline-progress` from inside a requestAnimationFrame callback.
 *    No React re-renders happen while scrolling. Consume it in CSS with
 *    `transform: scaleY(var(--timeline-progress))` + `transform-origin: top`
 *    so the progress line travels smoothly with the scroll (GPU-friendly).
 *
 * 2. ACTIVE ITEM INDEX — the item closest to the viewport "reading line".
 *    React state updates ONLY when the active item actually changes, so
 *    dots/cards can sync via `is-active` / `is-completed` classes.
 *
 * 3. REVEAL-ONCE — adds `revealClass` to each item the first time it enters
 *    the viewport (CSS owns the reveal animation itself).
 *
 * Performance: one passive scroll listener, rAF-batched, all layout reads
 * happen before all writes in the same frame (no layout thrashing),
 * transform/opacity-only rendering, full cleanup on unmount.
 */
export const useScrollTimeline = ({
  itemSelector = '.timeline-item',
  revealClass = 'is-revealed',
} = {}) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const items = Array.from(container.querySelectorAll(itemSelector));
    if (items.length === 0) return undefined;

    let rafId = 0;
    let scheduled = false;
    let lastIndex = -1;

    const update = () => {
      scheduled = false;

      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      if (viewportH === 0) return;

      // ---------- READ PHASE (all layout reads before any write) ----------
      const containerRect = container.getBoundingClientRect();
      const readingLine = viewportH * 0.55;
      const rects = items.map((item) => item.getBoundingClientRect());

      /**
       * Continuous progress:
       *   0   → timeline top is at the bottom edge of the viewport
       *   1   → the last item's center has reached the reading line
       * Clamped to [0, 1].
       *
       * We measure from the container's top position relative to the viewport.
       * startPoint = when container top is at the viewport bottom (progress 0)
       * endPoint   = when the last item's center reaches the reading line (progress 1)
       */
      const lastRect = rects[rects.length - 1] || containerRect;
      const lastItemCenterOffset = (lastRect.top - containerRect.top) + lastRect.height / 2;
      const startPoint = viewportH;
      const endPoint = readingLine - lastItemCenterOffset;
      const span = startPoint - endPoint;
      const rawProgress = span > 0 ? (startPoint - containerRect.top) / span : 1;
      const progress = Math.min(1, Math.max(0, rawProgress));

      let next = -1;
      let bestDistance = Number.POSITIVE_INFINITY;
      let anyOnScreen = false;
      const toReveal = [];

      for (let i = 0; i < items.length; i += 1) {
        const rect = rects[i];

        // Reveal each card the first time it enters the viewport
        if (!items[i].classList.contains(revealClass) && rect.top < viewportH * 0.92) {
          toReveal.push(items[i]);
        }

        if (rect.bottom < 0 || rect.top > viewportH) continue;
        anyOnScreen = true;

        // Active = item whose center is closest to the reading line
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - readingLine);
        if (distance < bestDistance) {
          bestDistance = distance;
          next = i;
        }
      }

      if (!anyOnScreen) {
        // Timeline fully off-screen: first item if still below, last if above
        next = containerRect.top > viewportH ? 0 : items.length - 1;
      } else if (next === -1) {
        next = 0;
      }

      // ---------- WRITE PHASE (no layout properties touched) ----------
      container.style.setProperty('--timeline-progress', progress.toFixed(4));
      toReveal.forEach((item) => item.classList.add(revealClass));

      if (next !== lastIndex) {
        lastIndex = next;
        setActiveIndex(next);
      }
    };

    const schedule = () => {
      if (!scheduled) {
        scheduled = true;
        rafId = window.requestAnimationFrame(update);
      }
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafId) window.cancelAnimationFrame(rafId);
      container.style.removeProperty('--timeline-progress');
    };
  }, [itemSelector, revealClass]);

  return { containerRef, activeIndex };
};

export default useScrollTimeline;
