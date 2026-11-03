'use client';

import type { ReactNode } from 'react';

/**
 * An endless horizontal strip.
 *
 * The content is rendered twice and the track is translated by exactly -50%,
 * which is what makes the loop seamless: at the moment the animation resets,
 * copy two is sitting precisely where copy one started. Any other width and
 * you get a visible jump once per cycle.
 *
 * It runs as a CSS animation on a transform, so it stays on the compositor
 * and keeps running smoothly while React is busy elsewhere.
 */

export default function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  fade = true,
  repeat = 1,
  className = '',
}: {
  children: ReactNode;
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  pauseOnHover?: boolean;
  fade?: boolean;
  /**
   * Times to repeat the content *within* each half of the track.
   *
   * With only a few items the content is narrower than the viewport, so the
   * duplicate half becomes visible and the strip reads as a short list
   * repeated twice rather than as a continuous band. Repeating until the
   * content comfortably exceeds the screen fixes that.
   */
  repeat?: number;
  className?: string;
}) {
  const half = (
    <div className="flex shrink-0 items-stretch">
      {Array.from({ length: Math.max(1, repeat) }, (_, i) => (
        <div key={i} className="flex shrink-0 items-stretch">
          {children}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden ${pauseOnHover ? 'marquee-paused' : ''} ${className}`}
      style={
        fade
          ? {
              // Soft edges, so items enter and leave rather than being
              // chopped off at the viewport.
              maskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }
          : undefined
      }
    >
      <div
        className="marquee-track flex w-max items-stretch"
        style={{ '--marquee-duration': `${speed}s` } as React.CSSProperties}
      >
        {half}
        {/* The duplicate is decorative; it would otherwise be read twice. */}
        <div aria-hidden>{half}</div>
      </div>
    </div>
  );
}
