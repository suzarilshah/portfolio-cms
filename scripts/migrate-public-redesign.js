/**
 * Schema for the public-site redesign.
 *
 * Everything the public page renders should come from the database. These
 * columns cover the chrome that was previously hardcoded in components:
 * the navigation, the footer, the background intensity and the identity
 * facts that JSON-LD asserts about the owner.
 *
 * Page *sections* stay in content_sections, where they get history and the
 * section editor. Chrome is not a section — it has no position in the render
 * order and no visibility toggle — so it belongs on site_settings.
 *
 * Idempotent: safe to run against a database that already has some of this.
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// What the hardcoded components rendered before this migration. Seeded only
// into columns that are still null, so re-running never overwrites edits.
const DEFAULT_NAV = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Recognition', href: '#awards' },
  { label: 'Writing', href: '#publications' },
  { label: 'Contact', href: '#contact' },
];

const DEFAULT_FOOTER = {
  tagline: 'Cloud architecture, platform engineering and AI systems.',
  note: 'Built and maintained in the open.',
  links: [
    { label: 'Blog', href: 'https://blog.suzarilshah.uk' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/suzarilshah' },
    { label: 'GitHub', href: 'https://github.com/suzarilshah' },
  ],
};

const DEFAULT_IDENTITY = {
  name: 'Muhammad Suzaril Shah',
  job_title: 'Senior IT Systems & Customer Engineer',
  employer: 'Swift',
  locality: 'Kuala Lumpur',
  country: 'MY',
  same_as: [
    'https://linkedin.com/in/suzarilshah',
    'https://github.com/suzarilshah',
    'https://blog.suzarilshah.uk',
  ],
};

async function migrate() {
  try {
    console.log('Adding site_settings columns…');
    await pool.query(`
      ALTER TABLE site_settings
      ADD COLUMN IF NOT EXISTS background_grid_intensity INTEGER,
      ADD COLUMN IF NOT EXISTS nav_items JSONB,
      ADD COLUMN IF NOT EXISTS footer JSONB,
      ADD COLUMN IF NOT EXISTS identity JSONB;
    `);

    console.log('Seeding defaults where unset…');
    await pool.query(
      `UPDATE site_settings
         SET background_grid_intensity = COALESCE(background_grid_intensity, $1),
             nav_items                 = COALESCE(nav_items, $2::jsonb),
             footer                    = COALESCE(footer, $3::jsonb),
             identity                  = COALESCE(identity, $4::jsonb)`,
      [14, JSON.stringify(DEFAULT_NAV), JSON.stringify(DEFAULT_FOOTER), JSON.stringify(DEFAULT_IDENTITY)]
    );

    const { rows } = await pool.query(
      'SELECT background_grid_intensity, nav_items, footer, identity FROM site_settings LIMIT 1'
    );
    console.log('Result:', JSON.stringify(rows[0], null, 2));
    console.log('Migration successful.');
  } catch (e) {
    console.error('Migration failed:', e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
