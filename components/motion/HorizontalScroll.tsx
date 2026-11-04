'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * A section that pins and travels sideways.
 *
 * The page scrolls down; the content inside this moves left. It is the one
 * gesture that breaks a vertical document's monotony without being decorative,
 * and it suits a career timeline exactly — time is a horizontal axis
 * everywhere except on résumés.
 *
 * How the geometry works: the outer element is made artificially tall, and the
 * inner one sticks to the top of the viewport for the whole of that height.
 * Progress through the tall element therefore maps one-to-one onto horizontal
 * travel. The height is derived from the measured overflow rather than
 * guessed, so the track always finishes exactly as the pin releases — hardcode
 * it and you get either dead scrolling at the end or content that never
 * arrives.
 *
 * It is disabled below `lg` and under reduced motion. Hijacking scroll on a
 * touch device fights the user's own gesture, and the fallback — an ordinary
 * vertical stack — is a legitimate layout rather than a broken one.
 */

export default function HorizontalScroll({
  children,
  header,
  className = '',
  /** Extra scroll distance beyond the overflow, as a fraction. Gives the
   *  first and last items a beat on screen instead of snapping away. */
  padding = 0.35,
}: {
  children: ReactNode;
  /**
   * Pinned above the track. While the section holds the viewport the page's
   * own header has scrolled away, so without this the reader is looking at
   * cards with no idea what they belong to.
   */
  header?: ReactNode;
  className?: string;
  padding?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [enabled, setEnabled] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');

    const measure = () => {
      const on = query.matches && !reduce;
      setEnabled(on);
      if (!on || !trackRef.current) {
        setDistance(0);
        return;
      }
      // How far the track has to travel for its right edge to reach the
      // viewport's right edge. Never negative: content narrower than the
      // screen should not drift.
      const overflow = trackRef.current.scrollWidth - window.innerWidth;
      setDistance(Math.max(0, overflow));
    };

    measure();
    query.addEventListener('change', measure);
    window.addEventListener('resize', measure);

    // Card content can reflow after fonts load, which changes scrollWidth
    // after the first measurement.
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);

    return () => {
      query.removeEventListener('change', measure);
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
    // Deliberately not keyed on `children`: a JSX child is a new object every
    // render, so including it would tear down and rebuild the observer in a
    // loop. Content changes are what the ResizeObserver is for.
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Springing the travel keeps a trackpad flick from reading as a jump,
  // without the drift a heavier spring would add at the ends.
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -distance]), {
    stiffness: 180,
    damping: 32,
    mass: 0.35,
  });

  // Two separate states, and the distinction matters.
  //
  // `enabled` decides the track's *layout* — a row on wide screens, a column
  // otherwise. `active` additionally requires a measured overflow, and is what
  // turns on the pin.
  //
  // Deriving the layout from `active` instead looks equivalent and is not: a
  // column's scrollWidth is one card wide, so it can never exceed the
  // viewport, so `distance` stays 0, so it never becomes active, so it never
  // becomes a row. The track could not measure itself into existence.
  const active = enabled && distance > 0;

  return (
    <div
      ref={outerRef}
      className={className}
      // 100vh of pin plus the travel: the section releases at the exact
      // moment the track runs out.
      style={active ? { height: `calc(100vh + ${distance * (1 + padding)}px)` } : undefined}
    >
      <div
        className={
          active
            ? 'sticky top-0 flex h-screen items-center overflow-hidden'
            : 'relative overflow-visible'
        }
      >
        {active && header && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-[var(--river-pad)] pt-[clamp(2rem,9vh,5.5rem)]">
            <div className="pointer-events-auto">{header}</div>
          </div>
        )}

        <motion.div
          ref={trackRef}
          style={active ? { x } : undefined}
          className={
            enabled
              ? 'flex w-max items-stretch gap-6 px-[var(--river-pad,1.5rem)]'
              : // The vertical fallback still sits on the river's measure, or
                // the cards would run edge to edge on a phone.
                'flex flex-col gap-6 px-[var(--river-pad)]'
          }
        >
          {children}
        </motion.div>

        {/* Travel indicator. A horizontal section has no scrollbar of its
            own, so without this there is no way to tell how much is left. */}
        {active && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[var(--river-pad)] bottom-[clamp(2rem,9vh,5.5rem)] h-px bg-slate-900/10"
          >
            <motion.span
              style={{ scaleX: scrollYProgress }}
              className="block h-px origin-left bg-slate-900/45"
            />
          </div>
        )}
      </div>
    </div>
  );
}
