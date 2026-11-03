'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * A metric that counts up the first time it is seen.
 *
 * Your project cards carry values like "300%", "-85%" and "3× Faster". The
 * number is the thing worth reading, and a value that ticks into place earns
 * a half-second of attention that a static one does not.
 *
 * It parses the numeric part out of whatever string the CMS holds and
 * reassembles the prefix and suffix around it, so "-85%" counts from 0 to
 * -85 and still renders its sign and unit. A value with no number in it
 * ("3× Faster" has one; "Improved" does not) is printed unchanged rather
 * than mangled.
 */

const NUMERIC = /^(\D*?)(-?[\d,]*\.?\d+)(.*)$/s;

export default function CountUp({
  value,
  className = '',
  duration = 1100,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduce = useReducedMotion();

  const match = value.match(NUMERIC);
  const target = match ? parseFloat(match[2].replace(/,/g, '')) : null;
  const prefix = match?.[1] ?? '';
  const suffix = match?.[3] ?? '';
  // Count in whole numbers unless the source had decimals, so 99.9 does not
  // animate through 99.87412.
  const decimals = match?.[2].includes('.') ? (match[2].split('.')[1]?.length ?? 1) : 0;

  const [display, setDisplay] = useState(() => (target === null || reduce ? value : `${prefix}0${suffix}`));

  useEffect(() => {
    if (target === null || reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Ease-out cubic: fast at first, settling into the final value, which
      // is what makes it read as arriving rather than scrolling.
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, value, prefix, suffix, decimals, duration, reduce]);

  // Screen readers get the final value immediately; the animation is purely
  // visual and announcing every intermediate number would be hostile.
  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
