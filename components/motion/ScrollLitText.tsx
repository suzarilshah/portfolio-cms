'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/**
 * A paragraph that lights up as you scroll through it.
 *
 * Each word is dim until the scroll position reaches it, then resolves to
 * full contrast. Unlike an entrance animation this is *scroll-linked* — drag
 * the scrollbar backwards and the text dims again — which is what makes it
 * feel like a material responding to you rather than a clip being played at
 * you.
 *
 * Use it on one paragraph per page at most. The effect earns attention by
 * being rare; on every block it becomes noise, and it genuinely does slow
 * reading down.
 */

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="transition-none">
      {children}{' '}
    </motion.span>
  );
}

export default function ScrollLitText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();

  // Starts when the paragraph's top reaches 85% down the viewport and
  // finishes when its bottom passes the middle — so it completes while the
  // reader is still looking at it, not after they have scrolled past.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.5'],
  });

  if (reduce) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(' ');

  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden>
        {words.map((word, index) => {
          const start = index / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={index} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </span>
    </p>
  );
}
