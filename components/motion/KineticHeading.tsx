'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * A heading that arrives a word at a time.
 *
 * Each word sits in its own `overflow-hidden` box and rises into it, so the
 * text appears to be revealed by a mask rather than faded in. The difference
 * is small frame by frame and large in feel: a fade says "content loaded", a
 * mask reveal says "this was composed".
 *
 * Words, not characters. Per-character staggering on a headline this size
 * reads as a gimmick and, worse, breaks the shape of the word while it
 * animates — the eye tries to read letters that are still moving.
 */

interface KineticHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between words. Lower reads as faster, not smoother. */
  stagger?: number;
  /** Animate on mount (hero) or when scrolled into view (everything else). */
  trigger?: 'mount' | 'view';
  /** Words to tint with the accent, matched case-insensitively. */
  highlight?: string[];
}

const wordVariants: Variants = {
  hidden: { y: '115%', opacity: 0, rotate: 2 },
  visible: {
    y: '0%',
    opacity: 1,
    rotate: 0,
    // A long, heavily-damped ease. The overshoot-free settle is what makes
    // it feel weighted rather than springy.
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function KineticHeading({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = 0.055,
  trigger = 'view',
  highlight = [],
}: KineticHeadingProps) {
  const reduce = useReducedMotion();
  const words = text.split(' ').filter(Boolean);
  const highlighted = new Set(highlight.map((w) => w.toLowerCase().replace(/[.,]/g, '')));

  // Reduced motion gets the finished composition, not a degraded animation.
  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      {...(trigger === 'mount'
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, margin: '-12% 0px' } })}
      // The words are spans inside boxes; without this the heading reads as
      // a pile of fragments to a screen reader.
      aria-label={text}
    >
      {words.map((word, index) => {
        const isHighlighted = highlighted.has(word.toLowerCase().replace(/[.,]/g, ''));
        return (
          <span
            key={`${word}-${index}`}
            aria-hidden
            // inline-block + overflow-hidden is what clips the rising word.
            // The bottom padding stops descenders (g, y, p) being shaved off.
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              variants={wordVariants}
              className={`inline-block ${isHighlighted ? 'text-primary-600' : ''}`}
            >
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
