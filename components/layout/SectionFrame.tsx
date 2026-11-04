'use client';

import type { ReactNode } from 'react';
import KineticHeading from '@/components/motion/KineticHeading';

/**
 * The editorial section header.
 *
 * What it replaces is the reason the old page looked like a template: every
 * section opened with a centred coloured pill, a centred h2 and a centred
 * subtitle. Nine identical openings down one column, so the eye learned the
 * rhythm in about four seconds and stopped looking.
 *
 * This is the opposite shape. A rule runs the full width of the measure, the
 * section's number sits in the margin, the title hangs off the left edge, and
 * the standfirst is set right, across the gutter from it. Nothing is centred,
 * so the page has a left edge to read against — which is what makes it feel
 * like a document rather than a deck.
 */

export interface SectionFrameProps {
  id: string;
  /** Two-digit index shown in the margin. Pass the position in render order. */
  index?: number;
  title: string;
  /** Set right of the title on wide screens. Keep it to a line or two. */
  standfirst?: string;
  /** Words in the title to tint with the accent. */
  highlight?: string[];
  children?: ReactNode;
  /**
   * Rendered after `children` and *outside* the measure, edge to edge.
   * For tracks and strips that are supposed to run off the side of the page.
   */
  bleed?: ReactNode;
  /** Escape hatch for sections that manage their own vertical rhythm. */
  flush?: boolean;
  className?: string;
}

export default function SectionFrame({
  id,
  index,
  title,
  standfirst,
  highlight,
  children,
  bleed,
  flush = false,
  className = '',
}: SectionFrameProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-28 ${flush ? '' : 'py-20 sm:py-24 xl:py-28'} ${className}`}
    >
      <div className="river">
        <header className="mb-12 border-t border-slate-900/10 pt-6 sm:mb-14">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="flex items-start gap-4 sm:gap-6">
              {typeof index === 'number' && (
                <span
                  aria-hidden
                  className="mt-[0.7em] shrink-0 font-mono text-[11px] tabular-nums tracking-[0.18em] text-slate-400"
                >
                  {String(index).padStart(2, '0')}
                </span>
              )}
              <KineticHeading
                as="h2"
                text={title}
                highlight={highlight}
                stagger={0.045}
                className="max-w-[14ch] text-balance font-display text-[34px] font-bold leading-[1.02] tracking-[-0.035em] text-slate-900 sm:text-[44px] lg:text-[56px]"
              />
            </div>

            {standfirst && (
              <p className="max-w-[40ch] text-[15px] leading-relaxed text-slate-500 lg:mt-3 lg:text-right">
                {standfirst}
              </p>
            )}
          </div>
        </header>

        {children}
      </div>

      {bleed}
    </section>
  );
}
