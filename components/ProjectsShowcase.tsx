import React from 'react';
import pool from '@/lib/db';
import {
  Award,
  ExternalLink,
  Cloud,
  Container,
  Cpu,
  Network,
  Zap,
  Code,
  Server,
  Globe,
  TrendingUp,
  X,
} from 'lucide-react';

type ProjectsSectionContent = {
  title?: string;
  description?: string;
  subtitle?: string;
};

type ImpactItem = { metric: string; value: string };

type Project = {
  id: number;
  title: string;
  tagline: string | null;
  challenge: string | null;
  solution: string | null;
  impact: ImpactItem[];
  technologies: string[];
  category: string | null;
  icon_name: string | null;
  year: string | null;
  link: string | null;
  project_url: string | null;
  thumbnail_url: string | null;
  snapshot_url: string | null;
  has_snapshot: boolean | null;
};

function getIconByName(name: string | null) {
  switch (name) {
    case 'Cloud':
      return Cloud;
    case 'Container':
      return Container;
    case 'Cpu':
      return Cpu;
    case 'Network':
      return Network;
    case 'Zap':
      return Zap;
    case 'Server':
      return Server;
    case 'Globe':
      return Globe;
    case 'Code':
    default:
      return Code;
  }
}

function normalizeImpact(value: unknown): ImpactItem[] {
  if (Array.isArray(value)) {
    return value
      .map((item: any) => ({
        metric: typeof item?.metric === 'string' ? item.metric : '',
        value: typeof item?.value === 'string' ? item.value : '',
      }))
      .filter((x) => x.metric && x.value)
      .slice(0, 10);
  }

  if (typeof value === 'string') {
    try {
      return normalizeImpact(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeTech(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((x) => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  if (typeof value === 'string') {
    try {
      return normalizeTech(JSON.parse(value));
    } catch {
      return [];
    }
  }

  return [];
}

const FALLBACK_PROJECTS: Omit<Project, 'id'>[] = [
  {
    title: 'Enterprise Cloud Infrastructure Optimization',
    tagline: 'Swift Banking Operations',
    challenge:
      'Managing complex cloud infrastructure for critical banking operations requiring 99.9% uptime while optimizing costs and performance.',
    solution:
      'Architected and implemented Azure cloud infrastructure with Kubernetes orchestration, automated CI/CD, and advanced monitoring. Deployed infrastructure as code using Terraform for consistency and scalability.',
    impact: [
      { metric: 'Uptime', value: '99.9%' },
      { metric: 'Incident Response', value: '-40%' },
      { metric: 'Deployment Speed', value: '3× Faster' },
      { metric: 'Infrastructure Cost', value: '-25%' },
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
    title: 'Containerization & Deployment Optimization',
    tagline: 'Virtual Spirit Cloud Migration',
    challenge:
      'Legacy infrastructure with manual deployments causing delays and resource inefficiency. Needed a modern container platform for scalability and reliability.',
    solution:
      'Led containerization using Docker + Kubernetes, introduced GitOps workflows, and improved deployment reliability with monitoring and rollbacks.',
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
    title: 'Azure AI‑Powered Smart Aquaponics',
    tagline: 'Imagine Cup 2022 — Top 4 Asia',
    challenge:
      'Sustainable agriculture needs intelligent automation and real‑time monitoring. Traditional methods are inefficient and resource‑intensive.',
    solution:
      'Built an IoT + AI system with Azure IoT Hub, ML, and computer vision to automate monitoring and optimize yields.',
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

async function getProjects(): Promise<Project[]> {
  if (!process.env.DATABASE_URL) {
    return FALLBACK_PROJECTS.map((p, idx) => ({ ...p, id: idx + 1 }));
  }

  try {
    const res = await pool.query(
      `SELECT
        id,
        title,
        tagline,
        challenge,
        solution,
        impact,
        technologies,
        category,
        icon_name,
        year,
        link,
        project_url,
        thumbnail_url,
        snapshot_url,
        has_snapshot
      FROM projects
      WHERE is_visible = TRUE
      ORDER BY sort_order ASC, created_at DESC`
    );

    return (res.rows as any[]).map((row) => ({
      id: Number(row.id),
      title: String(row.title || ''),
      tagline: row.tagline ?? null,
      challenge: row.challenge ?? null,
      solution: row.solution ?? null,
      impact: normalizeImpact(row.impact),
      technologies: normalizeTech(row.technologies),
      category: row.category ?? null,
      icon_name: row.icon_name ?? null,
      year: row.year ?? null,
      link: row.link ?? null,
      project_url: row.project_url ?? null,
      thumbnail_url: row.thumbnail_url ?? null,
      snapshot_url: row.snapshot_url ?? null,
      has_snapshot: row.has_snapshot ?? null,
    }));
  } catch {
    return FALLBACK_PROJECTS.map((p, idx) => ({ ...p, id: idx + 1 }));
  }
}

export default async function ProjectsShowcase({
  content,
}: {
  content?: ProjectsSectionContent;
}) {
  const projects = await getProjects();

  const title = content?.title?.trim() || 'Projects & Case Studies';
  const description =
    content?.description?.trim() ||
    'A selection of real-world systems I’ve built—measurable outcomes, clean execution, and maintainable engineering.';

  const baseUrl = 'https://www.suzarilshah.uk';
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListElement: projects.map((p, idx) => {
      const url = p.project_url || p.link || `${baseUrl}/#project-${p.id}`;
      const desc = p.tagline || p.challenge || '';
      return {
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'CreativeWork',
          name: p.title,
          description: desc,
          url,
        },
      };
    }),
  };

  return (
    <section id="projects" className="relative py-20 sm:py-24 font-sans">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/50 backdrop-blur-md px-4 py-2 text-primary-700 shadow-sm">
            <Award className="w-4 h-4" />
            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">
              Selected Work
            </span>
          </div>

          <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          <p className="mt-3 text-sm text-slate-500 max-w-3xl mx-auto">
            Click a project to open the full case study.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project) => {
            const Icon = getIconByName(project.icon_name);
            const preview = project.thumbnail_url || project.snapshot_url;
            const liveUrl = project.project_url || project.link;
            const chips = project.technologies.slice(0, 3);
            const headlineMetric = project.impact[0];

            return (
              <a
                key={project.id}
                href={`#project-${project.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/55 backdrop-blur-xl shadow-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl hover:border-primary-200/60 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                aria-label={`Open case study: ${project.title}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt={`${project.title} preview`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary-100/60 via-white/40 to-purple-100/60" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/0 to-slate-950/0" />

                  <div className="absolute left-4 bottom-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                      <Icon className="h-4 w-4 text-primary-700" />
                      {project.category || 'Project'}
                    </span>
                    {project.year ? (
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-mono font-semibold text-slate-700">
                        {project.year}
                      </span>
                    ) : null}
                  </div>

                  {liveUrl ? (
                    <div className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                      Live
                    </div>
                  ) : null}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-black tracking-tight text-slate-900">
                    {project.title}
                  </h3>
                  {project.tagline ? (
                    <p className="mt-1 text-sm text-slate-600 font-medium">
                      {project.tagline}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {chips.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                    {headlineMetric ? (
                      <span className="rounded-full border border-primary-200/60 bg-primary-50/80 px-3 py-1 text-xs font-bold text-primary-700">
                        {headlineMetric.metric}: {headlineMetric.value}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary-700">
                      View case study
                    </span>
                    <span className="text-xs text-slate-500">Opens modal</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Case study modals (CSS :target) */}
        {projects.map((project) => {
          const Icon = getIconByName(project.icon_name);
          const preview = project.thumbnail_url || project.snapshot_url;
          const liveUrl = project.project_url || project.link;

          return (
            <div
              key={`modal-${project.id}`}
              id={`project-${project.id}`}
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`project-${project.id}-title`}
            >
              <a
                href="#projects"
                className="project-modal__backdrop"
                aria-label="Close case study"
              />

              <div className="project-modal__panel">
                <div className="p-5 sm:p-7 border-b border-slate-200/60">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                          <Icon className="h-4 w-4" />
                          {project.category || 'Project'}
                        </span>
                        {project.year ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-mono font-semibold text-slate-700">
                            {project.year}
                          </span>
                        ) : null}
                      </div>

                      <h3
                        id={`project-${project.id}-title`}
                        className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900"
                      >
                        {project.title}
                      </h3>

                      {project.tagline ? (
                        <p className="mt-2 text-base sm:text-lg text-slate-600 font-medium">
                          {project.tagline}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      {liveUrl ? (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary-700 transition-colors"
                        >
                          Live
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}

                      <a
                        href="#projects"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7 space-y-8">
                  {preview ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50">
                      <img
                        src={preview}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto"
                      />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5">
                      <h4 className="text-xs font-black tracking-[0.2em] uppercase text-slate-500">
                        Challenge
                      </h4>
                      <p className="mt-3 text-slate-700 leading-relaxed">
                        {project.challenge || '—'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5">
                      <h4 className="text-xs font-black tracking-[0.2em] uppercase text-slate-500">
                        Solution
                      </h4>
                      <p className="mt-3 text-slate-700 leading-relaxed">
                        {project.solution || '—'}
                      </p>
                    </div>
                  </div>

                  {project.impact.length > 0 ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary-700" />
                        <h4 className="text-sm font-black text-slate-900">
                          Outcomes
                        </h4>
                      </div>
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {project.impact.slice(0, 6).map((item, idx) => (
                          <div
                            key={`${project.id}-impact-${idx}`}
                            className="rounded-2xl border border-slate-200/60 bg-white/70 p-4"
                          >
                            <div className="text-lg font-black text-slate-900">
                              {item.value}
                            </div>
                            <div className="mt-1 text-xs font-semibold text-slate-600">
                              {item.metric}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {project.technologies.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Stack
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={`${project.id}-tech-${tech}`}
                            className="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        {/* SEO-friendly text fallback for crawlers (kept minimal and honest) */}
        <div className="sr-only" aria-label="Project case studies text">
          <h3>Project Case Studies</h3>
          <ul>
            {projects.map((p) => (
              <li key={`seo-${p.id}`}>
                <strong>{p.title}.</strong> {p.tagline || ''} {p.challenge || ''} {p.solution || ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
