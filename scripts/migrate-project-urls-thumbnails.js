const pool = require('../lib/db-script');

async function migrate() {
  try {
    console.log('Starting migration: Add URL and thumbnail fields to projects table...');

    // Add URL and thumbnail columns
    await pool.query(`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS project_url TEXT,
      ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
      ADD COLUMN IF NOT EXISTS snapshot_url TEXT,
      ADD COLUMN IF NOT EXISTS has_snapshot BOOLEAN DEFAULT FALSE;
    `);

    console.log('✅ Added URL and thumbnail columns to projects table');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
