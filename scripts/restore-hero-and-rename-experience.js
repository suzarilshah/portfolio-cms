#!/usr/bin/env node
/**
 * Puts the hero copy back to the version that predates the redesign, and
 * renames the Experience section.
 *
 * The hero's original headline, strapline, description and rotating phrases
 * were overwritten by scripts/seed-hero-copy.js. The pre-change version is
 * still in `content_history`, so this reads it from there rather than from a
 * hardcoded copy in this file: whatever was actually live is the thing to
 * restore, not my reconstruction of it.
 *
 * `credentials` is deliberately carried forward from the current row. The
 * credential belt stays, so the field it reads has to stay with it.
 *
 * Preview and production share one database, so this changes the live site
 * too. Every write is double-written to content_history first, which is what
 * made this restore possible in the first place.
 *
 *   node scripts/restore-hero-and-rename-experience.js          # dry run
 *   node scripts/restore-hero-and-rename-experience.js --commit
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const COMMIT = process.argv.includes('--commit');
const EXPERIENCE_TITLE = 'Work Experiences';

/** Fields the restored hero layout reads. */
const RESTORE_KEYS = ['headline', 'subheadline', 'description', 'typing_phrases', 'curved_text'];

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const current = await pool.query(
      'SELECT content FROM content_sections WHERE section_key = $1',
      ['hero']
    );
    if (current.rowCount === 0) throw new Error('no hero row');
    const live = current.rows[0].content || {};

    // The most recent history entry that actually carries the old fields.
    const history = await pool.query(
      'SELECT id, content FROM content_history WHERE section_key = $1 ORDER BY id DESC LIMIT 50',
      ['hero']
    );
    const source = history.rows.find(
      (row) => row.content && typeof row.content.typing_phrases !== 'undefined'
    );
    if (!source) throw new Error('no history entry with the pre-redesign hero fields');

    const restored = { ...live };
    for (const key of RESTORE_KEYS) {
      if (typeof source.content[key] !== 'undefined') restored[key] = source.content[key];
    }
    // Retired by the restored layout; leaving them would let a stale tagline
    // win over the strapline it falls back from.
    delete restored.tagline;

    const experience = await pool.query(
      'SELECT content FROM content_sections WHERE section_key = $1',
      ['experience']
    );
    const experienceContent = { ...(experience.rows[0]?.content || {}) };
    const previousTitle = experienceContent.title;
    experienceContent.title = EXPERIENCE_TITLE;

    console.log(`hero: restoring from content_history id ${source.id}`);
    for (const key of RESTORE_KEYS) {
      const before = JSON.stringify(live[key]);
      const after = JSON.stringify(restored[key]);
      if (before !== after) console.log(`  ${key}:\n    was ${before}\n    now ${after}`);
    }
    console.log(`  credentials kept: ${(restored.credentials || []).length} entries`);
    console.log(`experience: title ${JSON.stringify(previousTitle)} -> ${JSON.stringify(EXPERIENCE_TITLE)}`);

    if (!COMMIT) {
      console.log('\nDry run. Re-run with --commit to write.');
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // History first, so the current values are recoverable the same way
      // these are being recovered now.
      await client.query(
        'INSERT INTO content_history (section_key, content) VALUES ($1, $2)',
        ['hero', JSON.stringify(live)]
      );
      await client.query(
        'UPDATE content_sections SET content = $1, updated_at = NOW() WHERE section_key = $2',
        [JSON.stringify(restored), 'hero']
      );
      await client.query(
        'INSERT INTO content_history (section_key, content) VALUES ($1, $2)',
        ['experience', JSON.stringify(experience.rows[0]?.content || {})]
      );
      await client.query(
        'UPDATE content_sections SET content = $1, updated_at = NOW() WHERE section_key = $2',
        [JSON.stringify(experienceContent), 'experience']
      );
      await client.query('COMMIT');
      console.log('\nWritten.');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Failed:', error.message);
  process.exit(1);
});
