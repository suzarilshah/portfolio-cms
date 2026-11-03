/**
 * Seed the section rows that are empty.
 *
 * `contact`, `projects` and `skills` all hold `{}`, which means the public
 * page has been rendering each of them from hardcoded component fallbacks.
 * The Contact section is the sharp edge: the email address and social links
 * a visitor sees today exist only in ContactSection.tsx, so editing them in
 * the CMS changed nothing.
 *
 * This writes the values the components were already publishing, so the live
 * output does not change — what changes is that the CMS becomes the source
 * of truth for them.
 *
 * Only writes rows whose content is empty. An existing edit is never
 * overwritten, so this is safe to re-run.
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const SEEDS = {
  // Lifted from ContactSection.tsx, which is where these live today.
  contact: {
    eyebrow: 'Contact',
    heading: 'Tell me what you are building.',
    description:
      'Open to platform engineering and cloud architecture work, speaking, and community collaboration.',
    booking_url: 'https://suzarilshah.youcanbook.me',
    email: 'shah@suzarilshah.uk',
    linkedin: 'https://linkedin.com/in/suzarilshah',
    github: 'https://github.com/suzarilshah',
    twitter: 'https://x.com/suzarilshah',
    website: 'https://blog.suzarilshah.uk/',
  },
  projects: {
    eyebrow: 'Selected work',
    title: 'Systems I have shipped',
    description: 'Production platforms with measurable outcomes, not side projects.',
  },
};

async function seed() {
  try {
    for (const [key, content] of Object.entries(SEEDS)) {
      const { rows } = await pool.query(
        'SELECT content FROM content_sections WHERE section_key = $1',
        [key]
      );

      if (rows.length === 0) {
        console.log(`· ${key}: no row, skipping`);
        continue;
      }

      const existing = rows[0].content || {};
      if (Object.keys(existing).length > 0) {
        console.log(`· ${key}: already has content, leaving it alone`);
        continue;
      }

      await pool.query(
        'UPDATE content_sections SET content = $1::jsonb, updated_at = NOW() WHERE section_key = $2',
        [JSON.stringify(content), key]
      );
      console.log(`✓ ${key}: seeded ${Object.keys(content).length} fields`);
    }

    // Report what is still empty, rather than claiming a clean sweep.
    const { rows } = await pool.query(
      `SELECT section_key, is_visible
         FROM content_sections
        WHERE content IS NULL OR content::jsonb = '{}'::jsonb
        ORDER BY sort_order`
    );
    if (rows.length > 0) {
      console.log('\nStill empty (rendering from component fallbacks):');
      rows.forEach((r) =>
        console.log(`  - ${r.section_key}${r.is_visible === false ? ' (hidden)' : ''}`)
      );
    } else {
      console.log('\nEvery section row has content.');
    }
  } catch (e) {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
