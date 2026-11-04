'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { effectiveEnd, yearTicks, type TimelineEntry } from '@/lib/content/timeline';

/**
 * The career, drawn to scale.
 *
 * A résumé is a list, and a list has exactly one lane — so it cannot show
 * that three of these roles are held at the same time. That fact is the most
 * interesting thing in the data and it was invisible. Here each role is a bar
 * positioned and sized by its real dates, packed into lanes, so overlap is
 * the shape of the picture rather than something you have to work out by
 * reading six date ranges and holding them in your head.
 *
 * It sits pinned above the card track while the section holds the viewport,
 * so it works as a map: the bars are the territory, the highlighted one is
 * where you are.
 */

export interface CareerChartJob {
  company?: string;
  role?: string;
  period?: string;
}

export default function CareerChart({
  entries,
  from,
  to,
  lanes,
  now,
  activeIndex,
  onSelect,
}: {
  entries: Array<TimelineEntry<CareerChartJob>>;
  from: number;
  to: number;
  lanes: number;
  now: number;
  /** Index into `entries` of the card currently centred in the viewport. */
  activeIndex: number;
  onSelect?: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const span = to - from || 1;

  // Fraction of the axis a point in time sits at.
  const at = (value: number) => ((value - from) / span) * 100;

  const ticks = yearTicks(from, to);
  const laneHeight = 22;

  if (entries.length === 0) return null;

  return (
    <div className="select-none">
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
          {Math.floor(from)} — now
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
          {entries.length} roles · drawn to scale
        </span>
      </div>

      <div className="relative" style={{ height: lanes * laneHeight + 22 }}>
        {/* Year grid. Hairlines rather than labelled axes: this is a
            diagram you glance at, not one you read values off. */}
        {ticks.map((year) => (
          <div
            key={year}
            aria-hidden
            className="absolute top-0 bottom-[22px] w-px bg-slate-900/[0.07]"
            style={{ left: `${at(year)}%` }}
          />
        ))}

        {/* Bars. */}
        {entries.map((entry, index) => {
          const end = effectiveEnd(entry.period, now);
          const left = at(entry.period.start);
          const width = Math.max(at(end) - left, 0.9); // a single-year role still needs to be visible
          const ongoing = entry.period.end === null;
          const active = index === activeIndex;

          return (
            <button
              key={`${entry.item.company}-${entry.period.start}-${index}`}
              type="button"
              onClick={() => onSelect?.(index)}
              aria-label={`${entry.item.role} at ${entry.item.company}, ${entry.item.period}`}
              aria-current={active ? 'true' : undefined}
              className="group absolute flex items-center rounded-full text-left"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                top: entry.lane * laneHeight,
                height: laneHeight - 6,
              }}
            >
              <motion.span
                aria-hidden
                initial={false}
                animate={
                  reduce
                    ? undefined
                    : { opacity: active ? 1 : 0.32, scaleY: active ? 1 : 0.62 }
                }
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute inset-0 rounded-full ${
                  active ? 'bg-primary-500' : 'bg-slate-900 group-hover:opacity-60'
                }`}
              />
              {/* An ongoing role has no right edge to draw, so it is left
                  open and tipped with a live dot instead of being capped at
                  an arbitrary "today". */}
              {ongoing && (
                <span
                  aria-hidden
                  className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-500"
                />
              )}
              <span
                className={`relative ml-2.5 truncate font-mono text-[9px] uppercase tracking-[0.1em] transition-colors ${
                  active ? 'text-white' : 'text-white/0 group-hover:text-white/80'
                }`}
              >
                {entry.item.company}
              </span>
            </button>
          );
        })}

        {/* Year labels, on the baseline. */}
        <div className="absolute inset-x-0 bottom-0 h-[22px]">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-slate-900/10" />
          {ticks.map((year) => (
            <span
              key={year}
              aria-hidden
              className="absolute top-[6px] -translate-x-1/2 font-mono text-[9px] tabular-nums text-slate-400"
              style={{ left: `${at(year)}%` }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
