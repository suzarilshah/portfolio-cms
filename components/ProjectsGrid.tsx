'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SpotlightCard from './motion/SpotlightCard';
import CountUp from './motion/CountUp';
import { SectionHeading } from './layout/SectionFrame';
import {
  ArrowUpRight,
  Cloud,
  Code,
  Container,
  Cpu,
  ExternalLink,
  Globe,
  Network,
  Server,
  TrendingUp,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * The work section.
 *
 * It replaced a coverflow carousel that showed one focused card with its
 * neighbours scaled down and faded — two projects visible on a 1440px screen,
 * the rest behind arrow buttons. Recruiters do not press arrows. A grid shows
 * everything at once and puts the outcome metric on the card, so the value is
 * legible without a single click.
 *
 * The detail modal survives, because the challenge/solution/outcomes
 * breakdown is genuinely worth reading once someone is interested.
 */

type ImpactItem = { metric: string; value: string };

export type Project = {
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

interface ProjectsGridProps {
  projects: Project[];
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Position in the page's render order, shown in the margin. */
  index?: number;
}

const ICONS: Record<string, LucideIcon> = {
  Cloud,
  Container,
  Cpu,
  Network,
  Zap,
  Server,
  Globe,
  Code,
};

const iconFor = (name: string | null) => ICONS[name ?? ''] ?? Code;

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const Icon = iconFor(project.icon_name);
  const image = project.thumbnail_url || project.snapshot_url;
  const headline = project.impact?.[0];

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 5) * 0.06 }}
    >
      {/* One interactive surface per project: the whole card is the target,
          and there is exactly one tab stop. */}
      <SpotlightCard
        as="button"
        onClick={onOpen}
        ariaLabel={`${project.title}: open case study`}
        className="flex h-full w-full flex-col text-left shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-shadow duration-300 hover:shadow-[0_2px_8px_rgb(15_23_42/0.06),0_24px_56px_-20px_rgb(15_23_42/0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              className="h-full w-full scale-[1.02] object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-300">
              <Icon size={28} />
            </div>
          )}
          {/* A wash that lifts on hover, so the image gains contrast as you
              consider it rather than sitting flat. */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-0" />
          {project.year && (
            <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-700 shadow-sm">
              {project.year}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {project.category && (
            <span className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
              <Icon size={11} />
              {project.category}
            </span>
          )}

          <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] text-slate-900">
            {project.title}
          </h3>

          {project.tagline && (
            <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-slate-600">
              {project.tagline}
            </p>
          )}

          {project.technologies.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[12px] text-slate-600"
                >
                  {tech}
                </li>
              ))}
              {project.technologies.length > 4 && (
                <li className="px-1 py-1 text-[12px] text-slate-400">
                  +{project.technologies.length - 4}
                </li>
              )}
            </ul>
          )}

          {/* The outcome is the point of the card, so it anchors the bottom
              and stays aligned across cards of different text lengths. */}
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
            {headline ? (
              <div className="min-w-0">
                <CountUp
                  value={headline.value}
                  className="block text-[26px] font-bold leading-none tracking-[-0.025em] text-slate-900 tabular-nums"
                />
                <div className="mt-1.5 truncate text-[12px] text-slate-500">{headline.metric}</div>
              </div>
            ) : (
              <span className="text-[13px] text-slate-400">Case study</span>
            )}
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </SpotlightCard>
    </motion.li>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const Icon = iconFor(project.icon_name);
  const image = project.thumbnail_url || project.snapshot_url;
  const href = project.project_url || project.link;

  // Escape closes, and the page behind must not scroll while it is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
              <Icon size={11} />
              {project.category || 'Project'}
              {project.year && <span className="text-slate-300">·</span>}
              {project.year}
            </span>
            <h3 className="truncate text-[20px] font-bold tracking-[-0.015em] text-slate-900">
              {project.title}
            </h3>
            {project.tagline && (
              <p className="mt-0.5 text-[14px] text-slate-600">{project.tagline}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="-mr-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-6">
          {image && (
            <img
              src={image}
              alt=""
              className="w-full rounded-xl border border-slate-200"
            />
          )}

          {(project.challenge || project.solution) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Challenge', project.challenge],
                ['Approach', project.solution],
              ]
                .filter(([, body]) => body)
                .map(([label, body]) => (
                  <div key={label as string} className="rounded-xl bg-slate-50 p-5">
                    <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                      {label}
                    </h4>
                    <p className="text-[14px] leading-relaxed text-slate-700">{body}</p>
                  </div>
                ))}
            </div>
          )}

          {project.impact.length > 0 && (
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                <TrendingUp size={12} />
                Outcomes
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {project.impact.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 p-4">
                    <div className="text-[22px] font-bold leading-none tracking-[-0.02em] text-slate-900">
                      {item.value}
                    </div>
                    <div className="mt-2 text-[12px] leading-snug text-slate-500">{item.metric}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.technologies.length > 0 && (
            <div>
              <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                Built with
              </h4>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-[13px] text-slate-700"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-primary-600"
            >
              Visit the project
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsGrid({
  projects,
  eyebrow,
  title,
  description,
  index,
}: ProjectsGridProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const close = useCallback(() => setSelected(null), []);

  if (projects.length === 0) return null;

  // Two projects in a three-column grid leaves a conspicuous hole. The grid
  // tracks the number of projects rather than assuming a full shelf.
  const columns =
    projects.length <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="projects" className="scroll-mt-28 py-20 sm:py-24">
      <div className="river">
        <SectionHeading
          index={index}
          title={title || 'Systems I have shipped'}
          standfirst={description || eyebrow}
        />

        <ul className={`grid grid-cols-1 gap-5 ${columns}`}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() => setSelected(project)}
            />
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
