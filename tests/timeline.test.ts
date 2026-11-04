import { describe, expect, it } from 'vitest';
import {
  assignLanes,
  buildTimeline,
  effectiveEnd,
  parseEndpoint,
  parsePeriod,
  yearTicks,
} from '@/lib/content/timeline';

// `now` is injected everywhere, so these assertions do not change meaning in
// January.
const NOW = 2026.8;

describe('parseEndpoint', () => {
  it('reads a bare year', () => {
    expect(parseEndpoint('2022')).toBe(2022);
  });

  it('places a month as a fraction of the year', () => {
    expect(parseEndpoint('Mar 2024')).toBeCloseTo(2024 + 2 / 12, 5);
    expect(parseEndpoint('January 2020')).toBe(2020);
  });

  it('returns null for every way of writing "still going"', () => {
    for (const word of ['Present', 'present', 'Now', 'Current', 'ongoing', 'Today']) {
      expect(parseEndpoint(word)).toBeNull();
    }
  });

  it('distinguishes unparseable from ongoing', () => {
    // The distinction matters: treating a typo as "Present" would promote a
    // finished role to a current one on a CV.
    expect(parseEndpoint('sometime')).toBeUndefined();
    expect(parseEndpoint('')).toBeUndefined();
    expect(parseEndpoint('Present')).toBeNull();
  });

  it('ignores numbers that are not years', () => {
    expect(parseEndpoint('99')).toBeUndefined();
  });
});

describe('parsePeriod', () => {
  it('handles every separator style in the live database', () => {
    // These six strings are the actual values in content_sections.
    const cases: Array<[string, number, number | null]> = [
      ['2025 – Present', 2025, null],
      ['2026 - Present', 2026, null],
      ['2025 - Present', 2025, null],
      ['2024 - 2025', 2024, 2025],
      ['2022-2024', 2022, 2024],
      ['2022', 2022, 2022],
    ];
    for (const [raw, start, end] of cases) {
      const parsed = parsePeriod(raw, NOW);
      expect(parsed, raw).not.toBeNull();
      expect(parsed!.start, raw).toBe(start);
      expect(parsed!.end, raw).toBe(end);
    }
  });

  it('treats a single year as a closed period, not an ongoing one', () => {
    // "2022" means a role that started and ended in 2022. Reading it as
    // ongoing would draw a bar to the present day.
    expect(parsePeriod('2022', NOW)!.end).toBe(2022);
  });

  it('accepts em dashes and the word "to"', () => {
    expect(parsePeriod('2019 — 2021', NOW)).toMatchObject({ start: 2019, end: 2021 });
    expect(parsePeriod('2019 to 2021', NOW)).toMatchObject({ start: 2019, end: 2021 });
  });

  it('rejects junk rather than guessing', () => {
    expect(parsePeriod('', NOW)).toBeNull();
    expect(parsePeriod('whenever', NOW)).toBeNull();
    expect(parsePeriod(undefined, NOW)).toBeNull();
    expect(parsePeriod(42, NOW)).toBeNull();
  });
});

describe('effectiveEnd', () => {
  it('runs an ongoing role to the present', () => {
    expect(effectiveEnd({ start: 2025, end: null, startLabel: '', endLabel: '' }, NOW)).toBe(NOW);
  });

  it('never returns a width that would render a bar inside-out', () => {
    const reversed = { start: 2024, end: 2020, startLabel: '', endLabel: '' };
    expect(effectiveEnd(reversed, NOW)).toBe(2024);
  });
});

describe('assignLanes', () => {
  const period = (start: number, end: number | null) => ({
    start,
    end,
    startLabel: '',
    endLabel: '',
  });

  it('keeps sequential roles in one lane', () => {
    const laid = assignLanes(
      [
        { item: 'a', period: period(2020, 2021) },
        { item: 'b', period: period(2021, 2022) },
        { item: 'c', period: period(2022, 2023) },
      ],
      NOW
    );
    expect(laid.every((entry) => entry.lane === 0)).toBe(true);
  });

  it('gives concurrent roles separate lanes', () => {
    // This is the case the whole chart exists for.
    const laid = assignLanes(
      [
        { item: 'swift', period: period(2025, null) },
        { item: 'yayasan', period: period(2026, null) },
        { item: 'gmi', period: period(2025, null) },
      ],
      NOW
    );
    expect(new Set(laid.map((entry) => entry.lane)).size).toBe(3);
  });

  it('reuses a lane once it is free again', () => {
    const laid = assignLanes(
      [
        { item: 'long', period: period(2020, 2026) },
        { item: 'short', period: period(2021, 2022) },
        { item: 'later', period: period(2023, 2024) },
      ],
      NOW
    );
    const byItem = Object.fromEntries(laid.map((entry) => [entry.item, entry.lane]));
    expect(byItem.long).toBe(0);
    expect(byItem.short).toBe(1);
    // 'short' ended in 2022, so lane 1 is free for a role starting in 2023.
    expect(byItem.later).toBe(1);
  });

  it('does not mutate the array it was given', () => {
    const input = [
      { item: 'b', period: period(2024, 2025) },
      { item: 'a', period: period(2020, 2021) },
    ];
    assignLanes(input, NOW);
    expect(input[0].item).toBe('b');
  });
});

describe('yearTicks', () => {
  it('covers the span inclusively', () => {
    expect(yearTicks(2022, 2026)).toEqual([2022, 2023, 2024, 2025, 2026]);
  });

  it('thins out over a long career instead of emitting one tick per year', () => {
    const ticks = yearTicks(1990, 2026);
    expect(ticks.length).toBeLessThan(12);
    expect(ticks[0]).toBe(1990);
  });

  it('returns nothing for a nonsensical range', () => {
    expect(yearTicks(2026, 2020)).toEqual([]);
    expect(yearTicks(NaN, 2020)).toEqual([]);
  });
});

describe('buildTimeline', () => {
  const jobs = [
    { period: '2025 – Present', company: 'Swift' },
    { period: '2026 - Present', company: 'Yayasan' },
    { period: '2025 - Present', company: 'GMI' },
    { period: '2024 - 2025', company: 'F5' },
    { period: '2022-2024', company: 'Docker' },
    { period: '2022', company: 'Ruijie' },
  ];

  const built = buildTimeline(jobs, (job) => job.period, NOW);

  it('spans from the first role to the present, and stops there', () => {
    expect(built.from).toBe(2022);
    expect(built.to).toBe(NOW);
  });

  it('does not emit a tick for a year the timeline has not reached', () => {
    expect(yearTicks(built.from, built.to)).toEqual([2022, 2023, 2024, 2025, 2026]);
  });

  it('surfaces the three concurrent current roles as three lanes', () => {
    expect(built.lanes).toBeGreaterThanOrEqual(3);
  });

  it('orders entries chronologically, earliest first', () => {
    const starts = built.entries.map((entry) => entry.period.start);
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
  });

  it('keeps unparseable roles out of the chart but hands them back', () => {
    // Dropping a role from a CV because its date was typed oddly would be
    // the worst available failure.
    const withJunk = buildTimeline(
      [...jobs, { period: 'ages ago', company: 'Mystery' }],
      (job) => job.period,
      NOW
    );
    expect(withJunk.entries).toHaveLength(6);
    expect(withJunk.unparsed.map((job) => job.company)).toEqual(['Mystery']);
  });

  it('degrades to an empty but valid range with no input', () => {
    const empty = buildTimeline([], () => undefined, NOW);
    expect(empty.entries).toEqual([]);
    expect(empty.lanes).toBe(0);
    expect(empty.to).toBeGreaterThan(empty.from);
  });
});
