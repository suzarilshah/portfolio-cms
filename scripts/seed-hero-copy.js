/**
 * Populate the hero's new fields, and fix two copy problems.
 *
 * This is a *content* change, not a schema one, and it is deliberately in its
 * own script so it is easy to see and easy to undo — every field it writes is
 * editable at /admin/hero, and the previous version is in content_history.
 *
 * What it changes and why:
 *
 * - `headline` was "Managing Intelligent Scale Cloud and AI Solutions", which
 *   is grammatically strained and says nothing a hundred other portfolios do
 *   not. Replaced with a concrete claim.
 *
 * - `description` was: Ts. Muhammad Suzaril Shah: "I bridge the gap between
 *   complex cloud infrastructure and human impact." Quoting yourself, by
 *   name, with the name both inside and outside the quotation marks, reads
 *   oddly to anyone it is meant to impress.
 *
 * - `tagline`, `credentials`, `primary_cta` and `secondary_cta` are new
 *   fields the rebuilt hero renders.
 *
 * Existing values for the new fields are never overwritten.
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const HERO = {
  headline: 'I build the cloud platforms that critical systems run on.',
  tagline: 'Azure architecture, Kubernetes and DevOps at production scale.',
  description:
    'Senior IT Systems & Customer Engineer at Swift in Kuala Lumpur. I design and operate the infrastructure behind financial systems that cannot go down, and teach what I learn to the communities I serve.',
  credentials: [
    {
      label: 'Microsoft MVP',
      issuer: 'AI & Azure',
      url: 'https://mvp.microsoft.com/en-us/PublicProfile/5005264',
    },
    { label: 'Docker Captain', issuer: 'Docker Inc.', url: 'https://www.docker.com/captains/' },
    { label: 'AWS Community Builder', issuer: 'Amazon Web Services' },
    { label: 'Professional Technologist', issuer: 'MBOT' },
  ],
  primary_cta: { label: 'Start a conversation', href: '#contact' },
  secondary_cta: { label: 'See the work', href: '#projects' },
};

// Replaced only if the stored value still matches, so a later edit wins.
const REPLACE_IF_UNCHANGED = {
  headline: 'Managing Intelligent Scale Cloud and AI Solutions',
  description:
    'Ts. Muhammad Suzaril Shah: "I bridge the gap between complex cloud infrastructure and human impact."',
};

async function seed() {
  try {
    const { rows } = await pool.query(
      'SELECT content FROM content_sections WHERE section_key = $1',
      ['hero']
    );
    if (rows.length === 0) {
      console.log('No hero row; nothing to do.');
      return;
    }

    const current = rows[0].content || {};
    const next = { ...current };
    const changed = [];

    for (const field of ['tagline', 'credentials', 'primary_cta', 'secondary_cta']) {
      const existing = current[field];
      const isEmpty =
        existing == null || (Array.isArray(existing) && existing.length === 0);
      if (isEmpty) {
        next[field] = HERO[field];
        changed.push(`${field} (was unset)`);
      }
    }

    for (const [field, previous] of Object.entries(REPLACE_IF_UNCHANGED)) {
      if (!current[field] || current[field].trim() === previous) {
        next[field] = HERO[field];
        changed.push(`${field} (rewritten)`);
      } else {
        console.log(`· ${field}: already edited, leaving it alone`);
      }
    }

    // Retired by the rebuilt hero. Dropping them keeps the row honest about
    // what the page can actually render.
    for (const dead of ['typing_phrases', 'curved_text', 'subheadline']) {
      if (dead in next) {
        delete next[dead];
        changed.push(`${dead} (removed, no longer rendered)`);
      }
    }

    if (changed.length === 0) {
      console.log('Hero already up to date.');
      return;
    }

    await pool.query(
      'UPDATE content_sections SET content = $1::jsonb, updated_at = NOW() WHERE section_key = $2',
      [JSON.stringify(next), 'hero']
    );

    console.log('Updated hero:');
    changed.forEach((c) => console.log(`  ✓ ${c}`));
    console.log('\nAll of this is editable at /admin/hero.');
  } catch (e) {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
