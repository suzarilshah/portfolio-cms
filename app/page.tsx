import pool from '@/lib/db';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsMatrix from '@/components/SkillsMatrix';
import ProjectsShowcase from '@/components/ProjectsShowcaseWrapper';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import AwardsSection from './components/AwardsSection';
import PublicationsSection from './components/PublicationsSection';
import CommunitySection from './components/CommunitySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

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

  // Component Mapping
  const SectionComponents: Record<string, React.ReactNode> = {
    hero: <HeroSection key="hero" content={sectionData.hero} settings={settings} />,
    about: <AboutSection key="about" content={sectionData.about} settings={settings} />,
    skills: <SkillsMatrix key="skills" />,
    projects: <ProjectsShowcase key="projects" content={sectionData.projects} />,
    experience: <ExperienceSection key="experience" content={sectionData.experience} settings={settings} />,
    education: <EducationSection key="education" content={sectionData.education} />,
    awards: <AwardsSection key="awards" badges={badges} content={sectionData.awards} />,
    publications: <PublicationsSection key="publications" content={sectionData.publications} />,
    community: <CommunitySection key="community" content={sectionData.community} />,
    contact: <ContactSection key="contact" content={sectionData.contact} />
  };

  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-primary-100 selection:text-primary-900">
      {/* Stunning Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      <div className="fixed inset-0 grid-pattern opacity-[0.3] pointer-events-none -z-30" />
      
      {/* Navigation */}
      <Navigation settings={settings} />
      
      {/* Main content */}
      <div className="relative z-10">
        {renderOrder.map((key: string) => SectionComponents[key] || null)}
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
