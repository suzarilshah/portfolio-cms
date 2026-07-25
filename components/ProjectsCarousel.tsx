'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, animate } from 'framer-motion';
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
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
} from 'lucide-react';

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

interface ProjectsCarouselProps {
  projects: Project[];
  title?: string;
  description?: string;
}

function getIconByName(name: string | null) {
  switch (name) {
    case 'Cloud': return Cloud;
    case 'Container': return Container;
    case 'Cpu': return Cpu;
    case 'Network': return Network;
    case 'Zap': return Zap;
    case 'Server': return Server;
    case 'Globe': return Globe;
    case 'Code':
    default: return Code;
  }
}

// Card color themes for variety
const cardThemes = [
  { bg: 'bg-gradient-to-br from-blue-600 to-blue-700', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-slate-800 to-slate-900', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-purple-600 to-purple-700', text: 'text-white' },
  { bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', text: 'text-white' },
];

export default function ProjectsCarousel({ projects, title, description }: ProjectsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dragX = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (isDragging || selectedProject) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isDragging, selectedProject, projects.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      goToNext();
    } else if (offset > threshold || velocity > 500) {
      goToPrev();
    }

    animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
    setIsDragging(false);
  };

  const getCardTransforms = (index: number) => {
    const offset = index - activeIndex;
    const absOffset = Math.abs(offset);
    const isActive = index === activeIndex;

    // Wrap around logic for circular carousel
    let adjustedOffset = offset;
    if (offset > projects.length / 2) adjustedOffset = offset - projects.length;
    if (offset < -projects.length / 2) adjustedOffset = offset + projects.length;

    const rotateY = adjustedOffset * (isMobile ? -20 : -30);
    const translateX = adjustedOffset * (isMobile ? 180 : 320);
    const translateY = Math.pow(Math.abs(adjustedOffset), 1.4) * (isMobile ? 30 : 50);
    const translateZ = isActive ? 80 : -Math.abs(adjustedOffset) * 120;
    const scale = isActive ? 1.1 : Math.max(0.65, 0.85 - Math.abs(adjustedOffset) * 0.12);
    const opacity = Math.abs(adjustedOffset) > 2 ? 0 : 1 - Math.abs(adjustedOffset) * 0.25;

    return {
      rotateY,
      translateX,
      translateY,
      translateZ,
      scale,
      opacity,
      zIndex: isActive ? 10 : 5 - absOffset,
    };
  };

  return (
    <section id="projects" className="relative py-16 md:py-20 overflow-hidden">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold mb-4">
            <Award size={12} />
            Selected Work
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            {title || 'Projects & Case Studies'}
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            {description || 'A selection of real-world systems with measurable outcomes.'}
          </p>
        </motion.div>
      </div>

      {/* 3D Carousel */}
      <div
        className="relative h-[400px] md:h-[480px] mx-auto"
        style={{ perspective: '1800px' }}
      >
        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white hover:scale-110 transition-all"
        >
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white hover:scale-110 transition-all"
        >
          <ChevronRight size={24} className="text-slate-700" />
        </button>

        {/* Cards Container */}
        <motion.div
          className="relative h-full flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {projects.map((project, index) => {
            const transforms = getCardTransforms(index);
            const theme = cardThemes[index % cardThemes.length];
            const Icon = getIconByName(project.icon_name);
            const isActive = index === activeIndex;
            const preview = project.thumbnail_url || project.snapshot_url;

            return (
              <motion.div
                key={project.id}
                className="absolute"
                style={{
                  zIndex: transforms.zIndex,
                }}
                animate={{
                  rotateY: transforms.rotateY,
                  x: transforms.translateX,
                  y: transforms.translateY,
                  z: transforms.translateZ,
                  scale: transforms.scale,
                  opacity: transforms.opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 25,
                }}
                whileHover={isActive ? { scale: 1.15 } : {}}
                onClick={() => isActive && setSelectedProject(project)}
              >
                <div
                  className={`w-[280px] md:w-[380px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-shadow ${
                    isActive ? 'shadow-primary-500/20' : ''
                  }`}
                >
                  {/* Card Image/Gradient */}
                  <div className={`relative h-[160px] md:h-[200px] ${theme.bg}`}>
                    {preview ? (
                      <img
                        src={preview}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                        <Icon size={14} />
                        {project.category || 'Project'}
                      </span>
                    </div>

                    {/* Year */}
                    {project.year && (
                      <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-mono font-semibold">
                        {project.year}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="bg-white p-5">
                    <h3 className="font-display text-lg font-bold text-slate-900 line-clamp-1">
                      {project.title}
                    </h3>
                    {project.tagline && (
                      <p className="text-sm text-slate-600 mt-1 line-clamp-1">{project.tagline}</p>
                    )}

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Impact Metric */}
                    {project.impact[0] && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">{project.impact[0].metric}</span>
                        <span className="text-sm font-bold text-primary-600">{project.impact[0].value}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex
                  ? 'bg-primary-600 w-6'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between gap-4 z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold">
                      {React.createElement(getIconByName(selectedProject.icon_name), { size: 14 })}
                      {selectedProject.category || 'Project'}
                    </span>
                    {selectedProject.year && (
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-semibold">
                        {selectedProject.year}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {selectedProject.title}
                  </h3>
                  {selectedProject.tagline && (
                    <p className="text-slate-600 mt-1">{selectedProject.tagline}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {(selectedProject.project_url || selectedProject.link) && (
                    <a
                      href={selectedProject.project_url || selectedProject.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Live <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-5 space-y-6">
                {/* Preview Image */}
                {(selectedProject.thumbnail_url || selectedProject.snapshot_url) && (
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={selectedProject.thumbnail_url || selectedProject.snapshot_url || ''}
                      alt={selectedProject.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Challenge & Solution */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Challenge</h4>
                    <p className="text-slate-700 leading-relaxed">{selectedProject.challenge || '—'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Solution</h4>
                    <p className="text-slate-700 leading-relaxed">{selectedProject.solution || '—'}</p>
                  </div>
                </div>

                {/* Outcomes */}
                {selectedProject.impact.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-primary-600" />
                      <h4 className="text-sm font-bold text-slate-900">Outcomes</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedProject.impact.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                          <div className="text-xl font-bold text-slate-900">{item.value}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.metric}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                {selectedProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
