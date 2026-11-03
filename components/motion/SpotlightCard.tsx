'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * A card that responds to the pointer.
 *
 * Two effects, both driven from one pointer handler:
 *
 * 1. A light that follows the cursor across the card's border and surface.
 *    The border highlight is the important half — a lit edge reads as a
 *    physical object catching light, where a glow behind the card just reads
 *    as a glow.
 * 2. A small 3D tilt away from the cursor. Kept under 6° deliberately;
 *    beyond that the text starts to distort and the card becomes a toy.
 *
 * Everything moves through MotionValues, so a pointer sweep across a grid of
 * these costs zero React renders.
 */

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Degrees of tilt at the card's corners. 0 disables it. */
  tilt?: number;
  onClick?: () => void;
  ariaLabel?: string;
  as?: 'div' | 'button';
}

export default function SpotlightCard({
  children,
  className = '',
  tilt = 5,
  onClick,
  ariaLabel,
  as = 'div',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Springs on the rotation only. The light should track the cursor exactly
  // — any lag there looks like dropped frames — while the tilt benefits from
  // a little inertia.
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.4 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.4 });

  // Typed on HTMLElement rather than on div or button, since the same
  // handler serves both renderings.
  const handleMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    if (tilt > 0) {
      // -0.5 … 0.5 from the centre.
      rotateY.set(((x / rect.width) - 0.5) * tilt * 2);
      rotateX.set((0.5 - (y / rect.height)) * tilt * 2);
    }
  };

  const handleLeave = () => {
    mouseX.set(-500);
    mouseY.set(-500);
    rotateX.set(0);
    rotateY.set(0);
  };

  const surface = useMotionTemplate`radial-gradient(340px circle at ${mouseX}px ${mouseY}px, rgb(var(--p-500) / 0.09), transparent 72%)`;
  const edge = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, rgb(var(--p-500) / 0.65), transparent 70%)`;

  const Component = as === 'button' ? motion.button : motion.div;

  return (
    <Component
      // @ts-expect-error — ref type differs between button and div, and the
      // handlers below are identical for both.
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={onClick}
      aria-label={ariaLabel}
      style={
        reduce
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }
      }
      className={`group relative isolate overflow-hidden rounded-2xl border border-slate-200/90 bg-white/85 backdrop-blur-sm ${className}`}
    >
      {/* Lit edge. A 1px inset mask turns the gradient into a border. */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: edge,
            padding: '1px',
            WebkitMask:
              'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Surface light. */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: surface }}
        />
      )}

      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
}
