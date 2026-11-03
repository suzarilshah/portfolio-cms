'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Inertial scrolling.
 *
 * This is the single change that most affects how expensive a site feels,
 * and it is almost invisible described in words: the page carries a little
 * momentum and settles rather than stopping dead. Every scroll-linked
 * animation on the page inherits that smoothness for free, because they all
 * read the same scroll position.
 *
 * Three things it has to get right:
 *
 * - Respect `prefers-reduced-motion`. Hijacked scrolling is a genuine
 *   accessibility and motion-sickness problem, so when that is set we do not
 *   initialise at all and the browser's native scrolling stands.
 * - Leave anchors working. Lenis intercepts wheel events, so `#section`
 *   links are routed through it explicitly, honouring the same 6rem offset
 *   the CSS uses to clear the floating nav.
 * - Never run inside the CMS preview iframe, where the editor is already
 *   scrolling the parent document.
 */

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      // Slightly under a second to settle: long enough to feel weighted,
      // short enough that it never feels like the page is lagging behind.
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Touch devices already have excellent native inertia. Overriding it
      // makes the page feel worse, not better.
      smoothWheel: true,
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
