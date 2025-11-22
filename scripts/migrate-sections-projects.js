const pool = require('../lib/db-script');

async function migrate() {
  try {
    console.log('Starting DB migration for Section Visibility and Projects...');

    // 1. Add visibility and sort_order to content_sections
    await pool.query(`
      ALTER TABLE content_sections 
      ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
    `);
    console.log('✅ Updated content_sections with visibility and sort_order columns.');

    // 2. Create Projects Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        tagline TEXT,
        challenge TEXT,
        solution TEXT,
        impact JSONB DEFAULT '[]'::jsonb,
        technologies JSONB DEFAULT '[]'::jsonb,
        category TEXT,
        icon_name TEXT DEFAULT 'Code',
        year TEXT,
        link TEXT,
        sort_order INTEGER DEFAULT 0,
        is_visible BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created projects table.');

    // 3. Seed Initial Section Order if everything is 0
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'awards', 'publications', 'community', 'contact'];
    for (let i = 0; i < sections.length; i++) {
        // Upsert logic to ensure rows exist
        await pool.query(`
            INSERT INTO content_sections (section_key, content, sort_order)
            VALUES ($1, '{}'::jsonb, $2)
            ON CONFLICT (section_key) 
            DO UPDATE SET sort_order = $2 WHERE content_sections.sort_order = 0;
        `, [sections[i], i * 10]);
    }
    console.log('✅ Seeded default section order.');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
