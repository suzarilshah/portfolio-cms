import ProjectsShowcase from './ProjectsShowcase';
import { secureDb } from '@/lib/security/database';

async function getProjects() {
  try {
    const result = await secureDb.query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
    return result;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
}

export default async function ProjectsShowcaseWrapper({ content }: { content?: any }) {
  const projects = await getProjects();
  return <ProjectsShowcase content={content} projects={projects || undefined} />;
}
