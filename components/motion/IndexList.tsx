'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/**
 * An index, not a grid.
 *
 * Card grids are the default because they are easy, and they are the reason
 * the awards, writing and community sections all looked like the same
 * section: six boxes, each box a miniature of the same layout, repeated until
 * the content runs out. A grid gives every item identical weight and spends
 * most of its pixels on borders and padding rather than on the content.
 *
 * This is the opposite trade. Each item is one line of large type across the
 * full measure, so the list reads like a contents page — scannable in one
 * vertical sweep, which is exactly what someone does with a list of awards.
 * The detail that a card would have shown permanently is instead revealed on
 * hover, in a panel that tracks the cursor.
 *
 * The interaction does the work the card was doing, but only for the one item
 * you are actually looking at, which is the only one you were reading anyway.
 *
 * Touch and reduced-motion get an honest fallback: no hover preview, with the
 * detail rendered inline underneath each row instead. A reveal nobody can
 * trigger is a reveal that hides content.
 */

export interface IndexListItem {
  id: string;
  /** The line of large type. */
  title: string;
  /** Mono, set right: a year, an issuer, a publication. */
  meta?: string;
  /** Shown in the hover panel, and inline on touch. */
  detail?: string;
  /** Optional image for the hover panel. */
  image?: string | null;
  href?: string | null;
  /** Small label before the title, e.g. a category. */
  kicker?: string;
}

export default function IndexList({
  items,
  /** Rendered inside the hover panel instead of the default body. */
  renderPreview,
  className = '',
}: {
  items: IndexListItem[];
  renderPreview?: (item: IndexListItem) => ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [pointerFine, setPointerFine] = useState(true);
  const listRef = useRef<HTMLUListElement>(null);

  // The panel trails the cursor rather than pinning to it: a panel welded to
  // the pointer feels like a tooltip, a panel that lags slightly feels like
  // an object being dragged through the page.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 32, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 260, damping: 32, mass: 0.5 });

  // Hover previews are meaningless on touch, so the layout changes rather
  // than the content disappearing. The server has no pointer to ask about, so
  // this starts optimistic and is corrected on mount; a touch device renders
  // the hover-only markup for one frame and then gets the inline detail.
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setPointerFine(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const interactive = pointerFine && !reduce;
  const active = items.find((item) => item.id === hovered) || null;

  const handleMove = (event: React.PointerEvent<HTMLUListElement>) => {
    if (!interactive || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    rawX.set(event.clientX - rect.left);
    rawY.set(event.clientY - rect.top);
  };

  if (items.length === 0) return null;

  return (
    <ul
      ref={listRef}
      onPointerMove={handleMove}
      onPointerLeave={() => setHovered(null)}
      className={`relative border-t border-slate-900/10 ${className}`}
    >
      {items.map((item, index) => {
        const dimmed = interactive && hovered !== null && hovered !== item.id;
        const Row = item.href ? 'a' : 'div';

        return (
          <li key={item.id} className="border-b border-slate-900/10">
            <Row
              {...(item.href
                ? { href: item.href, target: '_blank', rel: 'noreferrer' }
                : {})}
              onPointerEnter={() => interactive && setHovered(item.id)}
              onFocus={() => setHovered(item.id)}
              onBlur={() => setHovered(null)}
              className={`group flex items-baseline gap-5 py-6 transition-opacity duration-300 sm:gap-8 sm:py-7 ${
                dimmed ? 'opacity-35' : 'opacity-100'
              } ${item.href ? 'cursor-pointer' : ''}`}
            >
              <span className="w-6 shrink-0 font-mono text-[10px] tabular-nums tracking-[0.16em] text-slate-400">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* The title slides right on hover. The movement is what makes
                  the row feel picked up rather than merely highlighted. */}
              <span className="min-w-0 flex-1">
                {item.kicker && (
                  <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    {item.kicker}
                  </span>
                )}
                <span
                  className={`block text-balance font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.025em] text-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-[30px] ${
                    interactive ? 'group-hover:translate-x-2' : ''
                  }`}
                >
                  {item.title}
                </span>

                {/* Touch and reduced motion never see the panel, so the
                    detail is rendered here instead of being lost. */}
                {!interactive && item.detail && (
                  <span className="mt-2 block max-w-[60ch] text-[14px] leading-relaxed text-slate-600">
                    {item.detail}
                  </span>
                )}
              </span>

              {item.meta && (
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:text-[11px]">
                  {item.meta}
                </span>
              )}

              {item.href && (
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-900"
                />
              )}
            </Row>
          </li>
        );
      })}

      {/* The cursor-tracked panel. One element reused across rows, so moving
          between rows cross-fades content instead of unmounting a card. */}
      {interactive && (
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
        >
          <AnimatePresence>
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -4 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                // Offset from the cursor so the panel never sits under it.
                className="w-[320px] -translate-y-1/2 translate-x-8 overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-[0_24px_60px_-24px_rgb(15_23_42/0.35)] backdrop-blur-sm"
              >
                {renderPreview ? (
                  renderPreview(active)
                ) : (
                  <>
                    {active.image && (
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={active.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    {active.detail && (
                      <p className="p-4 text-[13px] leading-relaxed text-slate-600">
                        {active.detail}
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </ul>
  );
}
