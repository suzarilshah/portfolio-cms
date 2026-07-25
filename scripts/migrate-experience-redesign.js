const pool = require('../lib/db-script');

async function migrate() {
  try {
    console.log('Starting DB migration for Experience Section Redesign...');
    console.log('This migration updates the experience content structure to support:');
    console.log('  - Dual experience types: Work Experience & Project Management');
    console.log('  - Typing effect phrases');
    console.log('  - Curved scroll text');
    console.log('');

    // 1. Get current experience content
    const result = await pool.query(
      `SELECT content FROM content_sections WHERE section_key = 'experience'`
    );

    const currentContent = result.rows[0]?.content || {};
    console.log('📦 Current experience content:', JSON.stringify(currentContent, null, 2).slice(0, 200) + '...');

    // 2. Transform existing jobs to work_experience, keeping project_management empty for user to fill
    const existingJobs = currentContent.jobs || [];

    const newContent = {
      // Section header
      title: currentContent.title || "Experience",
      subtitle: currentContent.subtitle || "A track record of engineering excellence and leadership.",

      // Typing effect phrases for the hero area
      typing_phrases: [
        "Engineering Excellence",
        "Project Leadership",
        "System Architecture",
        "Cloud Innovation",
        "Digital Transformation"
      ],

      // Curved scroll text
      curved_text: "SHAH",
      curved_text_repeat: 3, // How many times to repeat (SHAHSHAHSHAH)

      // Dual experience categories
      work_experience: existingJobs.map(job => ({
        company: job.company || '',
        role: job.role || '',
        period: job.period || '',
        location: job.location || '',
        description: job.description || '',
        tags: job.tags || [],
        type: 'work' // explicit type marker
      })),

      project_management: [
        {
          company: 'Add your PM experience',
          role: 'Project Manager',
          period: '2024 - Present',
          location: 'Remote',
          description: 'Describe your project management experience here.',
          tags: ['Agile', 'Scrum', 'Stakeholder Management'],
          type: 'project_management',
          // PM-specific fields
          team_size: '',
          budget: '',
          methodologies: ['Agile'],
          tools: ['Jira', 'Confluence'],
          key_achievements: []
        }
      ],

      // Visual settings
      show_typing_effect: true,
      show_curved_text: true,
      show_parallax_background: true,

      // Legacy support - keep old jobs for backwards compatibility
      jobs: existingJobs
    };

    // 3. Update the experience section with new structure
    await pool.query(
      `UPDATE content_sections
       SET content = $1, updated_at = NOW()
       WHERE section_key = 'experience'`,
      [JSON.stringify(newContent)]
    );

    console.log('✅ Updated experience section with new dual-type structure.');

    // 4. Save to history
    await pool.query(
      `INSERT INTO content_history (section_key, content) VALUES ($1, $2)`,
      ['experience', JSON.stringify(newContent)]
    );
    console.log('✅ Saved migration snapshot to content_history.');

    // 5. Log the new structure
    console.log('');
    console.log('📋 New Experience Content Structure:');
    console.log('  - title: Section title');
    console.log('  - subtitle: Section subtitle');
    console.log('  - typing_phrases: Array of phrases for typing effect');
    console.log('  - curved_text: Text for curved SVG effect');
    console.log('  - work_experience: Array of work/engineering roles');
    console.log('  - project_management: Array of PM roles with extra fields');
    console.log('  - show_typing_effect: Toggle typing animation');
    console.log('  - show_curved_text: Toggle curved text');
    console.log('  - show_parallax_background: Toggle parallax');
    console.log('');
    console.log('🎉 Migration complete!');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
