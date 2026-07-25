import ProjectsCarousel from './ProjectsCarousel';
import { secureDb } from '@/lib/security/database';

// Fallback projects for when DB is empty
const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'Enterprise Cloud Infrastructure Optimization',
    tagline: 'Swift Banking Operations',
    challenge: 'Managing complex cloud infrastructure for critical banking operations requiring 99.9% uptime while optimizing costs and performance.',
    solution: 'Architected and implemented Azure cloud infrastructure with Kubernetes orchestration, automated CI/CD, and advanced monitoring.',
    impact: [
      { metric: 'Uptime', value: '99.9%' },
      { metric: 'Incident Response', value: '-40%' },
      { metric: 'Deployment Speed', value: '3× Faster' },
    ],
    technologies: ['Azure', 'Kubernetes', 'Terraform', 'CI/CD', 'Observability'],
    category: 'Cloud Architecture',
    icon_name: 'Cloud',
    year: '2024–2025',
    link: null,
    project_url: null,
    thumbnail_url: null,
    snapshot_url: null,
    has_snapshot: false,
  },
  {
    id: 2,
    title: 'Containerization & Deployment Optimization',
    tagline: 'Virtual Spirit Cloud Migration',
    challenge: 'Legacy infrastructure with manual deployments causing delays and resource inefficiency.',
    solution: 'Led containerization using Docker + Kubernetes, introduced GitOps workflows, and improved deployment reliability.',
    impact: [
      { metric: 'Deployment Time', value: '-85%' },
      { metric: 'Reliability', value: '+45%' },
      { metric: 'Developer Productivity', value: '+50%' },
    ],
    technologies: ['Docker', 'Kubernetes', 'GitOps', 'Helm', 'Observability'],
    category: 'DevOps Transformation',
    icon_name: 'Container',
    year: '2023–2024',
    link: null,
    project_url: null,
    thumbnail_url: null,
    snapshot_url: null,
    has_snapshot: false,
  },
  {
    id: 3,
    title: 'Azure AI‑Powered Smart Aquaponics',
    tagline: 'Imagine Cup 2022 — Top 4 Asia',
    challenge: 'Sustainable agriculture needs intelligent automation and real‑time monitoring.',
    solution: 'Built an IoT + AI system with Azure IoT Hub, ML, and computer vision to automate monitoring.',
    impact: [
      { metric: 'Water Savings', value: '90%' },
      { metric: 'Crop Yield', value: '+40%' },
      { metric: 'Monitoring', value: '24/7' },
    ],
    technologies: ['Azure IoT Hub', 'Azure ML', 'Python', 'Computer Vision', 'React'],
    category: 'IoT / AI',
    icon_name: 'Cpu',
    year: '2022',
    link: null,
    project_url: null,
    thumbnail_url: null,
    snapshot_url: null,
    has_snapshot: false,
  },
];

function normalizeImpact(value: unknown): { metric: string; value: string }[] {
  if (Array.isArray(value)) {
    return value
      .map((item: any) => ({
        metric: typeof item?.metric === 'string' ? item.metric : '',
        value: typeof item?.value === 'string' ? item.value : '',
      }))
      .filter((x) => x.metric && x.value);
  }
  if (typeof value === 'string') {
    try { return normalizeImpact(JSON.parse(value)); } catch { return []; }
  }
  return [];
}

function normalizeTech(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((x) => typeof x === 'string').map((x) => x.trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    try { return normalizeTech(JSON.parse(value)); } catch { return []; }
  }
  return [];
}

async function getProjects() {
  try {
    const result = await secureDb.query('SELECT * FROM projects WHERE is_visible = true ORDER BY sort_order ASC, created_at DESC');
    return result.map((p: any) => ({
      ...p,
      impact: normalizeImpact(p.impact),
      technologies: normalizeTech(p.technologies),
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
}

export default async function ProjectsShowcaseWrapper({ content }: { content?: any }) {
  const projects = await getProjects();
  const projectsToUse = (projects && projects.length > 0) ? projects : FALLBACK_PROJECTS;

  return (
    <ProjectsCarousel
      projects={projectsToUse}
      title={content?.title}
      description={content?.description}
    />
  );
}
