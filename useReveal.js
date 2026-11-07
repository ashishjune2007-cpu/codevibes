import { useEffect, useRef } from 'react';

/**
 * useReveal — Intersection Observer hook for scroll-triggered animations.
 *
 * Usage:
 *   const ref = useReveal();
 *   <div ref={ref} className="reveal-ready">...</div>
 *
 * When the element enters the viewport, the class `reveal-visible` is added,
 * triggering the CSS transition defined in index.css.
 *
 * @param {object} options
 * @param {number} options.threshold  — 0–1, fraction visible before triggering (default 0.12)
 * @param {string} options.rootMargin — IntersectionObserver rootMargin (default '0px 0px -48px 0px')
 * @param {boolean} options.once     — if true (default), unobserves after first reveal
 */
export function useReveal({
  threshold = 0.12,
  rootMargin = '0px 0px -48px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('reveal-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove('reveal-visible');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * useRevealGroup — Observes a parent container and stagger-reveals its children.
 *
 * Usage:
 *   const ref = useRevealGroup({ staggerMs: 100 });
 *   <div ref={ref}>
 *     <div className="reveal-ready">child 1</div>
 *     <div className="reveal-ready">child 2</div>
 *   </div>
 *
 * @param {object} options
 * @param {number} options.staggerMs  — delay between each child reveal in ms (default 100)
 * @param {number} options.threshold
 * @param {string} options.rootMargin
 */
export function useRevealGroup({
  staggerMs = 100,
  threshold = 0.08,
  rootMargin = '0px 0px -32px 0px',
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.querySelectorAll('.reveal-ready').forEach((el) => {
        el.classList.add('reveal-visible');
      });
      return;
    }

    const children = Array.from(container.querySelectorAll(':scope > .reveal-ready'));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('reveal-visible'), i * staggerMs);
          });
          observer.unobserve(container);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [staggerMs, threshold, rootMargin]);

  return ref;
}
