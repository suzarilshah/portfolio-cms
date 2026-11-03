'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * The living field behind the page.
 *
 * The brief for this site is infrastructure: things that run continuously and
 * respond to load. So the background is not a static texture — it is three
 * slow-drifting light sources over a grid that brightens under the cursor,
 * as if the pointer were carrying current through it.
 *
 * Two deliberate engineering choices:
 *
 * - The drift runs on CSS keyframes, not React state, so it costs the main
 *   thread nothing. The cursor light is written straight to CSS custom
 *   properties inside a rAF, which means pointer movement never triggers a
 *   React render.
 * - `prefers-reduced-motion` stops the drift and the cursor tracking, leaving
 *   a still composition that is still a composition.
 */

interface AuroraProps {
  /** Accent hue name from site_settings. */
  accent?: string;
  /** 0–100. The CMS control; also scales the cursor light. */
  intensity?: number;
  className?: string;
}

const ACCENT_HUES: Record<string, number> = {
  blue: 214,
  indigo: 239,
  violet: 258,
  purple: 270,
  cyan: 190,
  teal: 174,
  emerald: 152,
  lime: 85,
  amber: 38,
  orange: 25,
  rose: 350,
  pink: 330,
  slate: 215,
};

export default function Aurora({ accent = 'indigo', intensity = 40, className = '' }: AuroraProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const hue = ACCENT_HUES[accent] ?? ACCENT_HUES.indigo;
  const k = Math.min(100, Math.max(0, intensity)) / 100;

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    // Start the light off-centre rather than at 0,0, so the page does not
    // look lopsided before the pointer has moved.
    let targetX = 0.5;
    let targetY = 0.35;
    let x = targetX;
    let y = targetY;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
    };

    const tick = () => {
      // Ease toward the pointer. Following it exactly feels mechanical;
      // trailing it slightly reads as weight.
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      el.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white ${className}`}
      style={
        {
          '--mx': '50%',
          '--my': '35%',
          '--hue': hue,
        } as React.CSSProperties
      }
    >
      {/* Drifting light sources. Three, at different speeds, so the pattern
          never visibly repeats. */}
      <div
        className={reduce ? '' : 'aurora-drift-a'}
        style={{
          position: 'absolute',
          inset: '-30%',
          background: `radial-gradient(45% 45% at 30% 30%, hsl(${hue} 90% 58% / ${0.42 * k}) 0%, transparent 70%)`,
        }}
      />
      <div
        className={reduce ? '' : 'aurora-drift-b'}
        style={{
          position: 'absolute',
          inset: '-30%',
          background: `radial-gradient(40% 40% at 72% 28%, hsl(${(hue + 40) % 360} 92% 62% / ${0.34 * k}) 0%, transparent 70%)`,
        }}
      />
      <div
        className={reduce ? '' : 'aurora-drift-c'}
        style={{
          position: 'absolute',
          inset: '-30%',
          background: `radial-gradient(50% 50% at 50% 78%, hsl(${(hue - 35 + 360) % 360} 88% 60% / ${0.30 * k}) 0%, transparent 70%)`,
        }}
      />

      {/* The grid. Masked so it reads strongest where the light is. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(${hue} 45% 42% / 0.10) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(${hue} 45% 42% / 0.10) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(130% 110% at 50% 0%, black 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(130% 110% at 50% 0%, black 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
        }}
      />

      {/* Cursor light. Brightens the grid it passes over. */}
      {!reduce && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(420px circle at var(--mx) var(--my), hsl(${hue} 95% 60% / ${0.1 + 0.08 * k}), transparent 65%)`,
          }}
        />
      )}

      {/* Keeps text contrast safe no matter how bright the field gets. */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/15 to-white/70" />
    </div>
  );
}
