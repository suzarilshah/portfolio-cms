'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Award,
  TrendingUp,
  Users,
  Cloud,
  Container,
  Cpu,
  Network,
  Zap,
  Code,
  Server,
  Globe
} from 'lucide-react';

// CSS animations for premium effects
const floatKeyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = floatKeyframes;
  document.head.appendChild(styleSheet);
}

interface Project {
  title: string;
  tagline: string;
  challenge: string;
  solution: string;
  impact: {
    metric: string;
    value: string;
  }[];
  technologies: string[];
  category: string;
  icon: React.ReactNode;
  icon_name?: string;
  year: string;
  link?: string;
  project_url?: string;
  thumbnail_url?: string;
  snapshot_url?: string;
  has_snapshot?: boolean;
}

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            // In a real scenario, we might want to fetch this server-side in the parent and pass it down
            // But for now, client-side fetch is fine for this component
            const res = await fetch('/api/cms/projects');
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    // Map icon string names to components
                    const mappedData = data.map((p: any) => ({
                        ...p,
                        icon: getIconComponent(p.icon_name)
                    }));
                    setProjects(mappedData);
                } else {
                    // Fallback to hardcoded if DB is empty
                    setProjects(fallbackProjects);
                }
            }
        } catch (e) {
            console.error('Failed to fetch projects', e);
            setProjects(fallbackProjects);
        } finally {
            setLoading(false);
        }
    };
    fetchProjects();
  }, []);

  const getIconComponent = (name: string) => {
      switch(name) {
          case 'Cloud': return <Cloud className="w-6 h-6" />;
          case 'Container': return <Container className="w-6 h-6" />;
          case 'Cpu': return <Cpu className="w-6 h-6" />;
          case 'Network': return <Network className="w-6 h-6" />;
          case 'Zap': return <Zap className="w-6 h-6" />;
          case 'Code': return <Code className="w-6 h-6" />;
          case 'Server': return <Server className="w-6 h-6" />;
          case 'Globe': return <Globe className="w-6 h-6" />;
          default: return <Code className="w-6 h-6" />;
      }
  };

  const fallbackProjects: Project[] = [
    {
      title: 'Enterprise Cloud Infrastructure Optimization',
      tagline: 'Swift Banking Operations',
      challenge: 'Managing complex cloud infrastructure for critical banking operations requiring 99.9% uptime while optimizing costs and performance.',
      solution: 'Architected and implemented a comprehensive Azure cloud infrastructure with Kubernetes orchestration, automated CI/CD pipelines, and advanced monitoring systems. Deployed infrastructure as code using Terraform for consistency and scalability.',
      impact: [
        { metric: 'Uptime', value: '99.9%' },
        { metric: 'Incident Response', value: '-40%' },
        { metric: 'Deployment Speed', value: '3x Faster' },
        { metric: 'Infrastructure Cost', value: '-25%' },
      ],
      technologies: ['Azure', 'Kubernetes', 'Terraform', 'Azure DevOps', 'Monitoring'],
      category: 'Cloud Architecture',
      icon: <Cloud className="w-6 h-6" />,
      year: '2024-2025',
    },
    // ... (rest of fallback projects if needed, but for brevity let's keep just one or rely on DB)
  ];

  if (loading) return null; // Or a skeleton loader

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-500/10 to-purple-500/10 text-primary-700 rounded-full mb-6 backdrop-blur-sm border border-primary-200/50">
            <Award className="w-5 h-5" />
            <span className="font-mono text-sm font-bold uppercase tracking-widest">
              Featured Work
            </span>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Projects &
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent">
              Case Studies
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Real-world cloud architecture, DevOps transformations, and IoT solutions
            <br />
            <span className="text-primary-600 font-semibold">driving measurable business impact</span>
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 hover:bg-white/80 hover:shadow-2xl transition-all duration-700 border border-white/40 hover:border-primary-200/50 overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

              {/* Floating particles effect */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-float" />

              {/* Project Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                      {project.icon}
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 text-xs font-bold rounded-full mb-3 border border-primary-200/50">
                        {project.category}
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      </span>
                      <p className="text-sm text-slate-500 font-mono font-semibold">{project.year}</p>
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-xl text-primary-600 font-bold">
                    {project.tagline}
                  </p>
                </div>
                {(project.project_url || project.link) && (
                  <a
                    href={project.project_url || project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="font-medium">Live Preview</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Snapshot/Thumbnail Display */}
              {(project.thumbnail_url || project.snapshot_url) && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={project.thumbnail_url || project.snapshot_url}
                    alt={`${project.title} preview`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}


              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary-500 rounded-full" />
                    Challenge
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                    Solution
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                  Measurable Impact
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.impact.map((item, impactIndex) => (
                    <div
                      key={impactIndex}
                      className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:border-primary-300 transition-colors"
                    >
                      <p className="text-2xl md:text-3xl font-bold text-primary-600 mb-1">
                        {item.value}
                      </p>
                      <p className="text-xs text-slate-600 font-medium">
                        {item.metric}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary-600" />
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* SEO-Optimized Projects Summary (Hidden but crawlable) */}
        <div className="sr-only" aria-label="Projects Summary">
          <h3>Cloud Architecture and DevOps Projects</h3>
          <p>
            Muhammad Suzaril Shah has delivered multiple enterprise-scale cloud architecture projects
            including Azure cloud migration, Kubernetes container orchestration, DevOps transformation,
            and IoT cloud solutions. Notable achievements include 99.9% uptime for Swift banking operations,
            60% improvement in resource utilization through containerization, and Top 4 Asia recognition
            in Microsoft Imagine Cup for AI-powered smart agriculture.
          </p>
          <p>
            Expertise demonstrated across Azure cloud infrastructure, Kubernetes deployment optimization,
            Infrastructure as Code with Terraform, CI/CD pipeline automation, Platform Engineering,
            IoT solutions with Azure IoT Hub, and published IEEE research on LoRa network optimization.
          </p>
        </div>
      </div>
    </section>
  );
}
