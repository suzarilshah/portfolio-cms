import ProjectsShowcase from './ProjectsShowcase';

export default async function ProjectsShowcaseWrapper({ content }: { content?: any }) {
  // For now, we'll pass undefined projects and let the component use fallback data
  // In a full implementation, you would fetch projects from the database here
  return <ProjectsShowcase content={content} projects={undefined} />;
}
