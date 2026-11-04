import pool from '@/lib/db';
import Navigation from './components/Navigation';
import PageSections from './components/PageSections';
import ProjectsShowcase from '@/components/ProjectsShowcaseWrapper';
import Footer from './components/Footer';
import Aurora from '@/components/motion/Aurora';
import Grain from '@/components/motion/Grain';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Spine from '@/components/layout/Spine';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching completely

async function getData() {
  // Default fallback data in case database fails
  const defaultSettings = {
    logo_text: 'SUZARIL',
    logo_highlight: 'SHAH',
    logo_url: null,
    profile_photo_url: null,
    favicon_url: null,
    accent_color: 'primary',
    resume_url: null,
    background_svg_color: 'blue',
    background_overlay_opacity: 30,
    // Chrome that used to be hardcoded in components. Null means "the
    // component decides", which keeps the page rendering if the migration
    // has not run against this database yet.
    background_grid_intensity: 14,
    nav_items: null,
    footer: null,
    identity: null,
  };

  const defaultOrder = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'awards', 'publications', 'community', 'contact'];
  
  // Check if database URL is available
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not configured, using fallback data');
    return { 
      sectionData: {}, 
      renderOrder: defaultOrder, 
      badges: [], 
      settings: defaultSettings 
    };
  }

  try {
    // Fetch sorted and visible sections
    const sectionsRes = await pool.query('SELECT * FROM content_sections ORDER BY sort_order ASC');
    const badgesRes = await pool.query('SELECT * FROM badges ORDER BY sort_order ASC');
    const settingsRes = await pool.query('SELECT * FROM site_settings LIMIT 1');
    
    // Log badge count for debugging
    console.log(`[getData] Fetched ${badgesRes.rows.length} badges from database`);
    
    // Convert to dictionary for content access but keep array for ordering
    const sectionData = sectionsRes.rows.reduce((acc: any, row: any) => {
        acc[row.section_key] = row.content;
        return acc;
    }, {});

    // Filter visible sections for rendering order
    const visibleSections = sectionsRes.rows
        .filter((row: any) => row.is_visible !== false) // Default to true if null
        .map((row: any) => row.section_key);
        
    // If no visible sections found (e.g. first run), use default order
    const renderOrder = visibleSections.length > 0 ? visibleSections : defaultOrder;

    const s = settingsRes.rows[0] || {};
    const settings = {
      logo_text: s.logo_text || defaultSettings.logo_text,
      logo_highlight: s.logo_highlight || defaultSettings.logo_highlight,
      logo_url: s.logo_url || defaultSettings.logo_url,
      profile_photo_url: s.profile_photo_url || defaultSettings.profile_photo_url,
      favicon_url: s.favicon_url || defaultSettings.favicon_url,
      accent_color: s.accent_color || defaultSettings.accent_color,
      resume_url: s.resume_url || defaultSettings.resume_url,
      background_svg_color: s.background_svg_color || defaultSettings.background_svg_color,
      background_overlay_opacity: s.background_overlay_opacity ?? defaultSettings.background_overlay_opacity,
      background_grid_intensity:
        s.background_grid_intensity ?? defaultSettings.background_grid_intensity,
      nav_items: s.nav_items ?? defaultSettings.nav_items,
      footer: s.footer ?? defaultSettings.footer,
      identity: s.identity ?? defaultSettings.identity,
    };

    return { 
      sectionData,
      renderOrder, 
      badges: badgesRes.rows,
      settings
    };
  } catch (e) {
    console.error('Database connection failed, using fallback data:', e);
    return { 
      sectionData: {}, 
      renderOrder: defaultOrder, 
      badges: [], 
      settings: defaultSettings 
    };
  }
}

export default async function Home() {
  const { sectionData, renderOrder, badges, settings } = await getData();

  return (
    // `overflow-x-clip`, not `overflow-hidden`. Both stop the full-bleed
    // strips causing a horizontal scrollbar, but `hidden` on one axis forces
    // the other to `auto`, which makes this element a scroll container — and
    // a scroll container ancestor silently disables `position: sticky` in
    // everything inside it. That killed both the spine and the pinned
    // experience track while looking, in the markup, completely correct.
    <main className="relative min-h-screen overflow-x-clip selection:bg-primary-100 selection:text-primary-900">
      {/* Global Grid Background with Parallax */}
      {/* The field the whole page sits on: drifting light, a grid that
          responds to the cursor, and grain over the top for material. */}
      <Aurora
        accent={settings.background_svg_color}
        intensity={settings.background_grid_intensity}
      />
      <Grain />
      <SmoothScroll />

      {/* The spine: a fixed index rail that replaces the nav on wide screens.
          It reads the same renderOrder the page renders, so the CMS owns the
          index exactly as it owns the page. */}
      <Spine order={renderOrder} settings={settings} />

      {/* Below xl there is no room for a rail, so the floating nav stands in.
          Running both at once would be two navigations for one page. */}
      <div className="xl:hidden">
        <Navigation settings={settings} />
      </div>

      {/* The river. Offset by the rail's width rather than centred, which is
          what gives the page a left edge to read against. */}
      <div className="xl:pl-[300px] 2xl:pl-[340px]">
        {/* Main content. The key → component map lives in PageSections so the
            CMS can swap content in without a round trip; see lib/preview. */}
        <PageSections
          sectionData={sectionData}
          renderOrder={renderOrder}
          badges={badges}
          settings={settings}
          projectsSlot={<ProjectsShowcase content={sectionData.projects} />}
        />

        {/* Footer */}
        <Footer content={settings.footer} settings={settings} />
      </div>
    </main>
  );
}
