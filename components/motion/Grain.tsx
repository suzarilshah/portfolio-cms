'use client';

/**
 * Film grain.
 *
 * A flat white page reads as unfinished; paper never is. This lays fractal
 * noise over everything at very low opacity, which gives the surface a
 * material quality and — usefully — hides the banding that large soft
 * gradients produce on 8-bit displays.
 *
 * It is an inline SVG filter rather than an image: no request, no cache, and
 * it scales to any viewport.
 */
export default function Grain({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-multiply"
      style={{ opacity }}
    >
      <svg className="h-full w-full">
        <filter id="grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
    </div>
  );
}
