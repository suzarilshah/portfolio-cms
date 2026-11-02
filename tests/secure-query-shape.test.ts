import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * `secureDb.validateQuery` rejects any query containing WHERE, VALUES or SET
 * without a `$n` placeholder — it cannot tell a literal from an interpolated
 * value, so it refuses both.
 *
 * That is a reasonable rule, but it fails at runtime, inside a try/catch that
 * falls back to hardcoded content. The public Projects section shipped
 * hardcoded sample projects for exactly this reason: the query said
 * `WHERE is_visible = true`, the guard rejected it, and the catch served
 * fallbacks without anyone seeing an error.
 *
 * So this is checked statically instead, where it shows up as a failing test
 * rather than as the wrong content on the live site.
 */

const ROOT = join(__dirname, '..');
const SKIP = new Set(['node_modules', '.next', '.git', 'tests', 'coverage']);

function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, acc);
    else if (/\.(ts|tsx)$/.test(entry)) acc.push(full);
  }
  return acc;
}

/** Mirrors the rule in lib/security/database.ts. */
function wouldBeRejected(query: string): boolean {
  const needsParams = /(where\s+.+|values\s*\(|set\s+.+)/i.test(query);
  const hasPlaceholders = /\$\d+/.test(query) || query.includes('?');
  return needsParams && !hasPlaceholders && /select|insert|update|delete/i.test(query);
}

describe('secureDb query shapes', () => {
  const offenders: string[] = [];

  for (const file of sourceFiles(ROOT)) {
    const source = readFileSync(file, 'utf8');
    if (!source.includes('secureDb.query')) continue;

    // Only literal queries can be checked here; a query built in a variable
    // is beyond a regex, and those are the ones already passing params.
    for (const match of source.matchAll(/secureDb\.query\(\s*(['"`])([\s\S]*?)\1/g)) {
      if (wouldBeRejected(match[2])) {
        offenders.push(`${file.replace(ROOT + '/', '')}: ${match[2].slice(0, 80)}`);
      }
    }
  }

  it('never passes an unparameterised WHERE/VALUES/SET query', () => {
    expect(offenders).toEqual([]);
  });

  it('models the guard correctly', () => {
    expect(wouldBeRejected('SELECT * FROM projects WHERE is_visible = true')).toBe(true);
    expect(wouldBeRejected('SELECT * FROM projects WHERE is_visible = $1')).toBe(false);
    expect(wouldBeRejected('SELECT * FROM projects ORDER BY sort_order ASC')).toBe(false);
  });
});
