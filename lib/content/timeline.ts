/**
 * Turning CMS period strings into a drawable timeline.
 *
 * This is deliberately a plain module with no React in it. The rules below —
 * what counts as ongoing, how two roles are judged to overlap, which lane a
 * role lands in — are the part of the timeline that can actually be wrong,
 * so they are the part that gets tested. A chart drawn from correct geometry
 * is just arithmetic; a chart drawn from a mis-parsed date is a lie about
 * someone's career.
 *
 * Periods are written by hand in the CMS, so the parser has to be forgiving:
 * "2022", "2022-2024", "2024 - 2025", "2025 – Present" and "Jan 2023 — Mar
 * 2024" all appear or plausibly will.
 */

export interface ParsedPeriod {
  /** Fractional year, so months position correctly on a continuous axis. */
  start: number;
  /** Null while the role is ongoing. */
  end: number | null;
  startLabel: string;
  endLabel: string;
}

export interface TimelineEntry<T> {
  item: T;
  period: ParsedPeriod;
  /** Row the bar sits in. 0 is nearest the axis. */
  lane: number;
}

const MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

/** Words that mean "this has not ended". */
const ONGOING = /^(present|now|current|ongoing|today)$/i;

/**
 * One endpoint of a period → a fractional year.
 *
 * Returns null for an ongoing marker, and undefined when nothing
 * year-shaped could be found, so callers can tell "still running" apart from
 * "unparseable" rather than treating a typo as a current role.
 */
export function parseEndpoint(raw: string): number | null | undefined {
  const text = raw.trim();
  if (text === '') return undefined;
  if (ONGOING.test(text)) return null;

  const year = text.match(/\b(\d{4})\b/);
  if (!year) return undefined;

  const value = Number(year[1]);
  const month = MONTHS.findIndex((name) => text.toLowerCase().includes(name));

  // Months are fractions of a year: March 2024 is 2024.1666…, which places
  // it a quarter of the way along 2024 on the axis.
  return month >= 0 ? value + month / 12 : value;
}

/**
 * A CMS period string → a start and an end.
 *
 * `now` is injected rather than read from the clock so the function is pure
 * and the tests are not hostage to the date they run on.
 */
export function parsePeriod(raw: unknown, now: number): ParsedPeriod | null {
  if (typeof raw !== 'string' || raw.trim() === '') return null;

  // En dash, em dash, "to" and a plain hyphen all show up as separators.
  const normalised = raw.replace(/[‒-―]/g, '-').replace(/\bto\b/gi, '-');
  const parts = normalised.split('-').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const start = parseEndpoint(parts[0]);
  if (start === undefined || start === null) return null;

  // A single value is a role that began and ended inside one year, not one
  // that is still running.
  const rawEnd = parts.length > 1 ? parseEndpoint(parts.slice(1).join('-')) : start;
  if (rawEnd === undefined) return null;

  return {
    start,
    end: rawEnd,
    startLabel: parts[0],
    endLabel: parts.length > 1 ? parts.slice(1).join(' - ') : parts[0],
  };
}

/** Where a period ends on the axis. Ongoing roles run to the present. */
export function effectiveEnd(period: ParsedPeriod, now: number): number {
  // Guard against a start in the future, or a transposed range: a bar with
  // negative width would render inside-out.
  return Math.max(period.end ?? now, period.start);
}

/**
 * Pack entries into lanes so overlapping roles never share a row.
 *
 * Greedy first-fit over entries sorted by start. This is the whole point of
 * the chart: three roles held at once is a fact about the career that a
 * vertical list structurally cannot show, because a list has only one lane.
 */
export function assignLanes<T>(
  entries: Array<{ item: T; period: ParsedPeriod }>,
  now: number
): Array<TimelineEntry<T>> {
  const sorted = [...entries].sort((a, b) => {
    if (a.period.start !== b.period.start) return a.period.start - b.period.start;
    // Stable tiebreak: the longer role first, so the spine of a career reads
    // above the short engagements that sit inside it.
    return effectiveEnd(b.period, now) - effectiveEnd(a.period, now);
  });

  // The furthest right each lane currently reaches.
  const laneEnds: number[] = [];

  return sorted.map(({ item, period }) => {
    const end = effectiveEnd(period, now);
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= period.start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    return { item, period, lane };
  });
}

/** Inclusive year ticks spanning the whole timeline. */
export function yearTicks(from: number, to: number): number[] {
  const first = Math.floor(from);
  // Floor, not ceil: ceiling the end emits a tick for a year the timeline has
  // not reached, which reads as a claim about the future.
  const last = Math.floor(to);
  if (!Number.isFinite(first) || !Number.isFinite(last) || last < first) return [];
  // A career spanning decades should not emit 400 ticks.
  const step = last - first > 14 ? 5 : 1;
  const ticks: number[] = [];
  for (let year = first; year <= last; year += step) ticks.push(year);
  return ticks;
}

/**
 * Build everything the chart needs in one pass.
 *
 * Entries whose period cannot be parsed are dropped from the chart but the
 * caller keeps them in the card track — a role with a malformed date is
 * still a real role, and silently deleting it from a CV would be the worst
 * possible failure mode.
 */
export function buildTimeline<T>(
  items: T[],
  getPeriod: (item: T) => unknown,
  now: number
): {
  entries: Array<TimelineEntry<T>>;
  unparsed: T[];
  from: number;
  to: number;
  lanes: number;
} {
  const parsed: Array<{ item: T; period: ParsedPeriod }> = [];
  const unparsed: T[] = [];

  for (const item of items) {
    const period = parsePeriod(getPeriod(item), now);
    if (period) parsed.push({ item, period });
    else unparsed.push(item);
  }

  const entries = assignLanes(parsed, now);
  const from = entries.length ? Math.min(...entries.map((e) => e.period.start)) : now;
  const to = entries.length ? Math.max(...entries.map((e) => effectiveEnd(e.period, now)), now) : now;

  return {
    entries,
    unparsed,
    from: Math.floor(from),
    // The axis stops at today, not at the end of the calendar year.
    to: Math.max(to, Math.floor(from) + 1),
    lanes: entries.reduce((max, e) => Math.max(max, e.lane + 1), 0),
  };
}
