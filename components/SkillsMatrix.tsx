'use client';

import { motion } from 'framer-motion';
import {
  Cloud,
  Container,
  Code2,
  Blocks,
  Award,
  Workflow,
  Database,
  Terminal,
  Zap,
} from 'lucide-react';

/** Icons cannot round-trip through JSON, so content stores a key. */
export const SKILL_ICONS = {
  cloud: Cloud,
  container: Container,
  blocks: Blocks,
  workflow: Workflow,
  code: Code2,
  database: Database,
  terminal: Terminal,
  award: Award,
} as const;

export type SkillIcon = keyof typeof SKILL_ICONS;
export const SKILL_COLORS = ['primary', 'indigo', 'violet', 'emerald'] as const;
export type SkillColor = (typeof SKILL_COLORS)[number];

export interface SkillCategory {
  title: string;
  icon: SkillIcon;
  color: SkillColor;
  skills: string[];
}

export interface SkillsContent {
  eyebrow: string;
  heading: string;
  intro: string;
  categories: SkillCategory[];
}

/**
 * The values this section shipped with while it was hardcoded. They are the
 * fallback, so an empty or missing `skills` row renders exactly what it did
 * before the section became editable.
 */
export const DEFAULT_SKILLS: SkillsContent = {
  eyebrow: 'Technical Expertise',
  heading: 'Skills & Technologies',
  intro:
    'Comprehensive expertise across cloud platforms, DevOps tools, and modern infrastructure technologies',
  categories: [
    {
      title: 'Cloud Platforms',
      icon: 'cloud',
      color: 'primary',
      skills: [
        'Microsoft Azure',
        'Azure AI & OpenAI',
        'Azure Machine Learning',
        'AWS',
        'Google Cloud Platform',
        'Azure IoT Hub',
        'Azure DevOps',
      ],
    },
    {
      title: 'Container & Orchestration',
      icon: 'container',
      color: 'indigo',
      skills: ['Kubernetes', 'Docker', 'Docker Compose', 'Helm', 'Container Registry', 'Service Mesh'],
    },
    {
      title: 'Infrastructure as Code',
      icon: 'blocks',
      color: 'violet',
      skills: ['Terraform', 'ARM Templates', 'Bicep', 'CloudFormation', 'Ansible', 'Pulumi'],
    },
    {
      title: 'CI/CD & DevOps',
      icon: 'workflow',
      color: 'emerald',
      skills: [
        'Azure Pipelines',
        'GitHub Actions',
        'GitLab CI/CD',
        'Jenkins',
        'ArgoCD',
        'GitOps',
        'Continuous Deployment',
      ],
    },
    {
      title: 'Programming & Scripting',
      icon: 'code',
      color: 'primary',
      skills: ['Python', 'TypeScript', 'JavaScript', 'Bash/Shell', 'PowerShell', 'Go', 'Node.js'],
    },
    {
      title: 'Databases & Storage',
      icon: 'database',
      color: 'indigo',
      skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Cosmos DB', 'SQL Server', 'MySQL'],
    },
    {
      title: 'Monitoring & Observability',
      icon: 'terminal',
      color: 'violet',
      skills: [
        'Azure Monitor',
        'Prometheus',
        'Grafana',
        'ELK Stack',
        'Application Insights',
        'Datadog',
        'New Relic',
      ],
    },
    {
      title: 'Certifications & Recognition',
      icon: 'award',
      color: 'emerald',
      skills: [
        'Microsoft MVP (AI & Azure)',
        'Docker Captain',
        'Windows Insider MVP',
        'Gold Student Ambassador',
        'Azure Certified',
        'Kubernetes Expert',
      ],
    },
  ],
};

const colorClasses: Record<string, { badge: string; dot: string }> = {
  primary: { badge: 'bg-primary-100 text-primary-600', dot: 'bg-primary-500' },
  indigo: { badge: 'bg-indigo-100 text-indigo-600', dot: 'bg-indigo-500' },
  violet: { badge: 'bg-violet-100 text-violet-600', dot: 'bg-violet-500' },
  emerald: { badge: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500' },
};

export default function SkillsMatrix({ content }: { content?: Partial<SkillsContent> | null }) {
  const data: SkillsContent = {
    ...DEFAULT_SKILLS,
    ...(content || {}),
    categories:
      content?.categories && content.categories.length > 0
        ? content.categories
        : DEFAULT_SKILLS.categories,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="skills" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">
              {data.eyebrow}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            {data.heading}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">{data.intro}</p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {data.categories.map((category, index) => {
            const Icon = SKILL_ICONS[category.icon] || Cloud;
            return (
              <motion.div
                key={`${category.title}-${index}`}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary-200"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${
                      colorClasses[category.color]?.badge || 'bg-primary-100 text-primary-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">{category.title}</h3>
                </div>

                {/* Skills List */}
                <ul className="space-y-2">
                  {(category.skills || []).map((skill, skillIndex) => (
                    <li
                      key={skillIndex}
                      className="flex items-center gap-2 text-slate-600 text-sm"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          colorClasses[category.color]?.dot || 'bg-primary-500'
                        }`}
                      />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* SEO-Optimized Skills Summary (Hidden but crawlable) */}
        <div className="sr-only" aria-label="Complete Skills List">
          <h3>Cloud & DevOps Expertise</h3>
          <p>
            Expert in Microsoft Azure Cloud Architecture, Azure AI, Azure OpenAI, Azure Machine Learning,
            Kubernetes container orchestration, Docker containerization, Infrastructure as Code with Terraform,
            CI/CD pipelines, DevOps automation, GitOps, Python programming, TypeScript development,
            PostgreSQL databases, monitoring and observability, Platform Engineering, and cloud native solutions.
          </p>
          <p>
            Certified Microsoft MVP for AI & Azure, Docker Captain, with deep expertise in
            enterprise cloud migration, Kubernetes cluster management, Azure DevOps, GitHub Actions,
            Infrastructure automation, container registry management, Helm charts, service mesh architecture,
            and IoT cloud solutions.
          </p>
        </div>
      </div>
    </section>
  );
}
