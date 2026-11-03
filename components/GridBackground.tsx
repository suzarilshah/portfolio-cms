'use client';

/**
 * The page's background field.
 *
 * It replaced a 47KB SVG of randomly-filled squares that rendered at a
 * hardcoded 0.7 opacity. Two problems with that: the filled cells read as a
 * loading skeleton rather than a texture, and the one setting that looked
 * like it controlled the grid (`background_overlay_opacity`) actually drove a
 * separate white wash — so the CMS could not turn the noise down.
 *
 * This draws the grid in CSS instead. Intensity is a real setting, the lines
 * fade toward the edges so the centre stays readable, and there is nothing to
 * download.
 */

interface GridBackgroundProps {
  className?: string;
  /** Accent name from site_settings; tints the grid to match the site. */
  svgColor?: string;
  /** 0–100 from site_settings. Around 14 is a texture; 60 is a statement. */
  intensity?: number;
}

// Hue per accent name. The grid is drawn with the accent at very low alpha,
// so it reads as tinted paper rather than as a coloured object.
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

export default function GridBackground({
  className = '',
  svgColor = 'indigo',
  intensity = 14,
}: GridBackgroundProps) {
  const hue = ACCENT_HUES[svgColor] ?? ACCENT_HUES.indigo;

  // Map 0–100 onto a deliberately narrow alpha range. The old background
  // proved that giving this control a wide range just lets the page shout;
  // even at 100 this stays a texture.
  const clamped = Math.min(100, Math.max(0, intensity));
  const line = (clamped / 100) * 0.3;
  const minor = line * 0.45;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-white" />

      {/* Major rules every 160px, minor every 40px. Two scales give the field
          some depth without needing an image. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(${hue} 60% 50% / ${line}) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(${hue} 60% 50% / ${line}) 1px, transparent 1px),
            linear-gradient(to right, hsl(${hue} 60% 50% / ${minor}) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(${hue} 60% 50% / ${minor}) 1px, transparent 1px)
          `,
          backgroundSize: '160px 160px, 160px 160px, 40px 40px, 40px 40px',
          // Fades the grid out behind the middle of the page, where the text
          // is, and lets it persist at the edges.
          maskImage:
            'radial-gradient(ellipse 85% 60% at 50% 38%, transparent 15%, black 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 60% at 50% 38%, transparent 15%, black 85%)',
        }}
      />

      {/* A single, very soft warm wash so the page is not clinical white. */}
      <div
        className="absolute inset-x-0 top-0 h-[70vh]"
        style={{
          background: `radial-gradient(ellipse 70% 100% at 50% 0%, hsl(${hue} 70% 60% / 0.05), transparent 70%)`,
        }}
      />
    </div>
  );
}
