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
  Zap
} from 'lucide-react';

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
}

export default function SkillsMatrix() {
  const colorClasses: Record<string, { badge: string; dot: string }> = {
    primary: { badge: 'bg-primary-100 text-primary-600', dot: 'bg-primary-500' },
    indigo: { badge: 'bg-indigo-100 text-indigo-600', dot: 'bg-indigo-500' },
    violet: { badge: 'bg-violet-100 text-violet-600', dot: 'bg-violet-500' },
    emerald: { badge: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500' },
  };
  const skillCategories: SkillCategory[] = [
    {
      title: 'Cloud Platforms',
      icon: <Cloud className="w-6 h-6" />,
      skills: [
        'Microsoft Azure',
        'Azure AI & OpenAI',
        'Azure Machine Learning',
        'AWS',
        'Google Cloud Platform',
        'Azure IoT Hub',
        'Azure DevOps',
      ],
      color: 'primary',
    },
    {
      title: 'Container & Orchestration',
      icon: <Container className="w-6 h-6" />,
      skills: [
        'Kubernetes',
        'Docker',
        'Docker Compose',
        'Helm',
        'Container Registry',
        'Service Mesh',
      ],
      color: 'indigo',
    },
    {
      title: 'Infrastructure as Code',
      icon: <Blocks className="w-6 h-6" />,
      skills: [
        'Terraform',
        'ARM Templates',
        'Bicep',
        'CloudFormation',
        'Ansible',
        'Pulumi',
      ],
      color: 'violet',
    },
    {
      title: 'CI/CD & DevOps',
      icon: <Workflow className="w-6 h-6" />,
      skills: [
        'Azure Pipelines',
        'GitHub Actions',
        'GitLab CI/CD',
        'Jenkins',
        'ArgoCD',
        'GitOps',
        'Continuous Deployment',
      ],
      color: 'emerald',
    },
    {
      title: 'Programming & Scripting',
      icon: <Code2 className="w-6 h-6" />,
      skills: [
        'Python',
        'TypeScript',
        'JavaScript',
        'Bash/Shell',
        'PowerShell',
        'Go',
        'Node.js',
      ],
      color: 'primary',
    },
    {
      title: 'Databases & Storage',
      icon: <Database className="w-6 h-6" />,
      skills: [
        'PostgreSQL',
        'MongoDB',
        'Redis',
        'Cosmos DB',
        'SQL Server',
        'MySQL',
      ],
      color: 'indigo',
    },
    {
      title: 'Monitoring & Observability',
      icon: <Terminal className="w-6 h-6" />,
      skills: [
        'Azure Monitor',
        'Prometheus',
        'Grafana',
        'ELK Stack',
        'Application Insights',
        'Datadog',
        'New Relic',
      ],
      color: 'violet',
    },
    {
      title: 'Certifications & Recognition',
      icon: <Award className="w-6 h-6" />,
      skills: [
        'Microsoft MVP (AI & Azure)',
        'Docker Captain',
        'Windows Insider MVP',
        'Gold Student Ambassador',
        'Azure Certified',
        'Kubernetes Expert',
      ],
      color: 'emerald',
    },
  ];

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
              Technical Expertise
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Skills & Technologies
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive expertise across cloud platforms, DevOps tools, and modern infrastructure technologies
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary-200"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${
                  colorClasses[category.color]?.badge || 'bg-primary-100 text-primary-600'
                }`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg text-slate-900">
                  {category.title}
                </h3>
              </div>

              {/* Skills List */}
              <ul className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <li
                    key={skillIndex}
                    className="flex items-center gap-2 text-slate-600 text-sm"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      colorClasses[category.color]?.dot || 'bg-primary-500'
                    }`} />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />
            </motion.div>
          ))}
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
