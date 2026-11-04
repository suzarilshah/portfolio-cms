'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, ChevronDown, ChevronUp, Download,
  Users, Target, Layers, Code, TrendingUp, Award
} from 'lucide-react';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import SectionFrame from '@/components/layout/SectionFrame';
import HorizontalScroll from '@/components/motion/HorizontalScroll';
import SpotlightCard from '@/components/motion/SpotlightCard';
import CareerChart from './experience/CareerChart';
import { buildTimeline } from '@/lib/content/timeline';

/**
 * Fallback "now" for the server render, bumped on the client after mount.
 * Only the right-hand edge of the axis depends on it, so a stale value shifts
 * the last bar by a sliver for one frame rather than breaking the chart.
 */
const DEFAULT_NOW = 2026;

// Default data structures
const defaultWorkExperience = [
  {
    company: 'Swift',
    role: 'Senior IT Systems & Customer Engineer',
    period: '2025 – Present',
    location: 'Kuala Lumpur, Malaysia',
    description: 'Leading the strategic architecture of enterprise IT systems and customer engineering solutions. Spearheading the adoption of scalable cloud infrastructures and ensuring 99.9% system reliability for critical banking operations.',
    tags: ['System Architecture', 'Enterprise Cloud', 'Strategic Leadership'],
    type: 'work'
  },
  {
    company: 'Swift',
    role: 'System Engineer',
    period: '2023 – 2024',
    location: 'Kuala Lumpur, Malaysia',
    description: 'Managed mission-critical infrastructure for global financial messaging services. Optimized deployment workflows reducing incident response time by 40%.',
    tags: ['Infrastructure', 'Deployment Optimization', 'High Availability'],
    type: 'work'
  },
  {
    company: 'Virtual Spirit',
    role: 'DevOps Engineer',
    period: '2023',
    location: 'Remote',
    description: 'Architected CI/CD pipelines enabling seamless delivery. Implemented containerization strategies that improved resource utilization by 60%.',
    tags: ['DevOps Architecture', 'CI/CD', 'Cloud Native'],
    type: 'work'
  },
  {
    company: 'Celcom Axiata',
    role: 'Cloud Engineer (Protege)',
    period: '2022 – 2023',
    location: 'Petaling Jaya',
    description: 'Executed large-scale cloud migration projects on Azure. Managed resource governance and compliance for telecommunications infrastructure.',
    tags: ['Azure Migration', 'Cloud Governance', 'Telecom Ops'],
    type: 'work'
  }
];

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
  type: string;
  team_size?: string;
  budget?: string;
  methodologies?: string[];
  tools?: string[];
  key_achievements?: string[];
}

/**
 * One post, as a card on the horizontal track.
 *
 * The period is set as the card's largest element. On a vertical résumé the
 * dates are a column you skim past; on a track that moves through time as you
 * scroll, the date *is* the position, so it earns display size.
 */
const ExperienceCard = forwardRef<
  HTMLDivElement,
  { exp: ExperienceItem; index: number; total: number; active: boolean }
>(function ExperienceCard({ exp, index, total, active }, ref) {
  // Read from the dates, not from position. Ordering the track
  // chronologically moved the current role to the end, and a "Current" badge
  // pinned to index 0 would then have labelled the oldest job.
  const current = /present|now|current|ongoing/i.test(exp.period || '');

  return (
    <div ref={ref} className="flex w-full shrink-0 lg:w-[400px]">
      <SpotlightCard
        className={`flex w-full flex-col p-7 transition-[border-color,opacity] duration-500 lg:h-[440px] ${
          active ? 'border-slate-300' : 'lg:opacity-60'
        }`}
      >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-slate-400">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        {current && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Current
          </span>
        )}
      </div>

      <span className="mt-7 block font-display text-[30px] font-bold leading-none tracking-[-0.035em] text-slate-900">
        {exp.period || 'Present'}
      </span>

      <h3 className="mt-4 text-balance font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">
        {exp.role}
      </h3>

      <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
        <span>{exp.company}</span>
        {exp.location && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">{exp.location.split(',')[0]}</span>
          </>
        )}
      </div>

      <p className="mt-5 text-[14px] leading-relaxed text-slate-600 lg:line-clamp-5">
        {exp.description}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
        {(exp.tags || []).slice(0, 3).map((tag: string) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-slate-500"
          >
            {tag}
          </span>
        ))}
      </div>
      </SpotlightCard>
    </div>
  );
});

// PM Experience Card - More detailed with extra fields (expanded by default)
function PMExperienceCard({ exp, index }: { exp: ExperienceItem; index: number }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg">
                <Target size={20} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                  {exp.role}
                </h3>
                <p className="text-slate-500 text-sm font-medium">{exp.company}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-primary-600">{exp.period}</span>
            <p className="text-xs text-slate-400 mt-0.5">{exp.location}</p>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed mt-4 text-[15px]">
          {exp.description}
        </p>
      </div>

      {/* PM-Specific Metrics */}
      <div className="px-5 pb-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {exp.team_size && (
            <div className="bg-slate-50 rounded-lg p-2.5 text-center">
              <Users size={14} className="mx-auto text-primary-500 mb-0.5" />
              <p className="text-[10px] text-slate-500">Team</p>
              <p className="font-bold text-slate-900 text-sm">{exp.team_size}</p>
            </div>
          )}
          {exp.budget && (
            <div className="bg-slate-50 rounded-lg p-2.5 text-center">
              <TrendingUp size={14} className="mx-auto text-primary-500 mb-0.5" />
              <p className="text-[10px] text-slate-500">Budget</p>
              <p className="font-bold text-slate-900 text-sm">{exp.budget}</p>
            </div>
          )}
          {exp.methodologies && exp.methodologies.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-2.5 text-center">
              <Layers size={14} className="mx-auto text-primary-500 mb-0.5" />
              <p className="text-[10px] text-slate-500">Method</p>
              <p className="font-bold text-slate-900 text-sm">{exp.methodologies[0]}</p>
            </div>
          )}
          {exp.tools && exp.tools.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-2.5 text-center">
              <Code size={14} className="mx-auto text-primary-500 mb-0.5" />
              <p className="text-[10px] text-slate-500">Tools</p>
              <p className="font-bold text-slate-900 text-sm">{exp.tools.length}+</p>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="p-5 pt-3 bg-slate-50/50">
              {/* Key Achievements */}
              {exp.key_achievements && exp.key_achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Award size={14} className="text-primary-500" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-1">
                    {exp.key_achievements.map((achievement, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-primary-500 mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tools & Methodologies */}
              <div className="flex flex-wrap gap-2">
                {exp.methodologies?.map((method) => (
                  <span key={method} className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    {method}
                  </span>
                ))}
                {exp.tools?.map((tool) => (
                  <span key={tool} className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tags & Expand Button */}
      <div className="px-5 pb-4 pt-1 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(exp.tags || []).slice(0, 3).map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
        >
          {expanded ? 'Less' : 'More'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection({
  content,
  settings,
  index,
}: {
  content?: any;
  settings?: any;
  /** Position in the page's render order, shown in the margin. */
  index?: number;
}) {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const workExperience: ExperienceItem[] =
    content?.work_experience || content?.jobs || defaultWorkExperience;

  // Only rendered when the CMS actually holds entries. The module default is
  // placeholder copy ("Your PM Experience"), and placeholder copy on a live
  // CV is worse than an absent section.
  const pmExperience: ExperienceItem[] = Array.isArray(content?.project_management)
    ? content.project_management
    : [];

  const resumeUrl = settings?.resume_url;

  // The timeline is built once per content change. `now` is captured on the
  // client after mount rather than during render: calling Date.now() while
  // rendering makes the server and client markup disagree, and Next will
  // throw a hydration error for it.
  const [now, setNow] = useState(() => DEFAULT_NOW);
  useEffect(() => {
    const date = new Date();
    setNow(date.getFullYear() + date.getMonth() / 12);
  }, []);

  const timeline = useMemo(
    () => buildTimeline(workExperience, (job) => job.period, now),
    [workExperience, now]
  );

  // Chronological, earliest first. A timeline that runs right as you scroll
  // right has to run forwards in time, and arriving at the current role is a
  // better ending than opening on it. Roles whose dates could not be parsed
  // keep their place at the end rather than being dropped.
  const ordered = useMemo(
    () => [...timeline.entries.map((entry) => entry.item), ...timeline.unparsed],
    [timeline]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Which card is in the middle of the screen. A small box at the viewport's
  // centre works for both layouts — the horizontal track moves cards through
  // it sideways, the mobile fallback moves them through it vertically.
  useEffect(() => {
    const nodes = cardRefs.current.filter((node): node is HTMLDivElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const hit = observed.find((entry) => entry.isIntersecting);
        if (!hit) return;
        const index = nodes.indexOf(hit.target as HTMLDivElement);
        if (index >= 0) setActiveIndex(index);
      },
      { rootMargin: '-42% -46% -42% -46%', threshold: 0 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ordered.length]);

  const scrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };

  return (
    <SectionFrame
      id="experience"
      index={index}
      title={content?.title || 'Experience'}
      standfirst={
        content?.subtitle ||
        'Six posts across networking, platform support and financial messaging — three of them running at once.'
      }
      bleed={
        <>
          {/* The track. Scrolling down drives it left, so the section reads
              along the axis time actually runs on. */}
          <HorizontalScroll
            className="mt-10"
            header={
              <CareerChart
                entries={timeline.entries}
                from={timeline.from}
                to={timeline.to}
                lanes={timeline.lanes}
                now={now}
                activeIndex={activeIndex}
                onSelect={scrollToCard}
              />
            }
          >
            {ordered.map((exp, i) => (
              <ExperienceCard
                key={`${exp.company}-${exp.period}-${i}`}
                ref={(node) => {
                  cardRefs.current[i] = node;
                }}
                exp={exp}
                index={i}
                total={ordered.length}
                active={i === activeIndex}
              />
            ))}

            {/* Terminal card: the track should arrive somewhere rather than
                simply stop. */}
            <div className="flex w-full shrink-0 flex-col justify-end p-7 lg:h-[440px] lg:w-[320px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                End of record
              </span>
              <p className="mt-3 max-w-[24ch] font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">
                The next post is the one we talk about.
              </p>
              <a
                href="#contact"
                className="group mt-5 inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-slate-900"
              >
                <span className="relative">
                  Start a conversation
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-slate-900 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0" />
                </span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </HorizontalScroll>

          {pmExperience.length > 0 && (
            <div className="river mt-16">
              <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Project management
              </h3>
              <div className="grid gap-5 lg:grid-cols-2">
                {pmExperience.map((exp, i) => (
                  <PMExperienceCard key={i} exp={exp} index={i} />
                ))}
              </div>
            </div>
          )}
        </>
      }
    >
      {/* A meta row under the header, in the margin register. It also tells
          you the track is horizontal, which otherwise has to be discovered. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
        <span className="tabular-nums">{String(workExperience.length).padStart(2, '0')} posts</span>
        <span className="hidden items-center gap-2 lg:inline-flex">
          Scroll to advance
          <motion.span
            aria-hidden
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <ArrowRight size={13} />
          </motion.span>
        </span>
        {resumeUrl && (
          <button
            onClick={() => setShowEmailModal(true)}
            className="group inline-flex items-center gap-1.5 uppercase tracking-[0.14em] text-slate-600 transition-colors hover:text-slate-900"
          >
            <Download size={12} className="transition-transform group-hover:translate-y-0.5" />
            Download CV
          </button>
        )}
      </div>

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        resumeUrl={resumeUrl || ''}
      />
    </SectionFrame>
  );
}
