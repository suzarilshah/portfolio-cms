'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * A control that leans toward the cursor as it approaches.
 *
 * The pull is capped at a few pixels and springs back when the pointer
 * leaves. It is almost subliminal — most people do not consciously notice
 * it — but it makes a button feel like it wants to be pressed, and it
 * measurably shortens the distance the cursor has to travel.
 *
 * The *label* moves slightly further than the button, which gives a hint of
 * parallax depth within a single element.
 */

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Maximum pull in pixels. Past ~12 it stops feeling physical. */
  strength?: number;
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  strength = 8,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const spring = { stiffness: 260, damping: 18, mass: 0.35 };
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);
  const labelX = useSpring(useMotionValue(0), spring);
  const labelY = useSpring(useMotionValue(0), spring);

  const handleMove = (event: React.PointerEvent) => {
    if (reduce) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    // Normalised by half the element, so the pull is proportional to how far
    // across the control the cursor is rather than to raw pixels.
    const nx = Math.max(-1, Math.min(1, dx / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, dy / (rect.height / 2)));
    x.set(nx * strength);
    y.set(ny * strength);
    labelX.set(nx * strength * 0.4);
    labelY.set(ny * strength * 0.4);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    labelX.set(0);
    labelY.set(0);
  };

  const inner = (
    <motion.span style={reduce ? undefined : { x: labelX, y: labelY }} className="flex items-center gap-2.5">
      {children}
    </motion.span>
  );

  const motionProps = {
    style: reduce ? undefined : { x, y },
    onPointerMove: handleMove,
    onPointerLeave: reset,
    className,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      {...motionProps}
    >
      {inner}
    </motion.button>
  );
}
