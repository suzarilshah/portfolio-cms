'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, Calendar, MapPin, ChevronDown, ChevronUp,
  Briefcase, Download, Users, Target, Layers, Code,
  TrendingUp, Clock, Award
} from 'lucide-react';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import TypingEffect from '@/components/TypingEffect';
import ParallaxBackground from '@/components/ParallaxBackground';
import CurvedScrollText from '@/components/CurvedScrollText';

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

const defaultPMExperience = [
  {
    company: 'Your PM Experience',
    role: 'Project Manager',
    period: '2024 – Present',
    location: 'Remote',
    description: 'Add your project management experience here. Describe your leadership, stakeholder management, and delivery achievements.',
    tags: ['Agile', 'Scrum', 'Stakeholder Management'],
    type: 'project_management',
    team_size: '10-15',
    budget: '$500K+',
    methodologies: ['Agile', 'Scrum'],
    tools: ['Jira', 'Confluence'],
    key_achievements: ['On-time delivery', 'Budget adherence']
  }
];

const defaultTypingPhrases = [
  "Engineering Excellence",
  "Project Leadership",
  "System Architecture",
  "Cloud Innovation",
  "Digital Transformation"
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

// Experience Card Component for Work Experience
function WorkExperienceCard({ exp, index, isLast }: { exp: ExperienceItem; index: number; isLast: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative grid grid-cols-1 md:grid-cols-[180px_60px_1fr] gap-0 md:gap-4"
    >
      {/* Date/Period Column (Desktop) */}
      <div className="hidden md:flex flex-col items-end pt-1 text-right px-2">
        <span className={`font-display text-lg font-bold ${index === 0 ? 'text-primary-600' : 'text-slate-900'}`}>
          {exp.period || 'Present'}
        </span>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
          {exp.location ? exp.location.split(',')[0] : 'Remote'}
        </span>
      </div>

      {/* Timeline Spine Column */}
      <div className="hidden md:flex justify-center relative min-h-[120px]">
        {!isLast && (
          <div className="absolute top-4 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-slate-200 group-hover:from-primary-200 group-hover:via-primary-200 group-hover:to-primary-100 transition-colors duration-500" />
        )}
        <div className={`relative z-10 mt-2 w-3 h-3 rounded-full border-2 transition-all duration-500 ${
          index === 0
            ? 'bg-primary-500 border-primary-200 scale-125 shadow-[0_0_0_4px_rgba(14,165,233,0.2)]'
            : 'bg-white border-slate-400 group-hover:border-primary-500 group-hover:scale-125'
        }`}>
          {index === 0 && (
            <span className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-75" />
          )}
        </div>
      </div>

      {/* Content Card Column */}
      <div className="pb-12 pl-12 md:pl-0 pt-0 md:pt-0 relative">
        {!isLast && (
          <div className="md:hidden absolute left-[1.85rem] top-4 bottom-0 w-px bg-slate-200" />
        )}
        <div className="md:hidden absolute left-6 top-2 w-3 h-3 rounded-full bg-white border-2 border-slate-400 z-10" />

        <div className="relative group-hover:-translate-y-1 transition-transform duration-300">
          <div className="md:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-3">
            <Calendar size={12} />
            {exp.period}
          </div>

          <h3 className="font-display text-2xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
            {exp.role}
          </h3>

          <div className="flex items-center gap-2 text-slate-600 font-medium mb-4 text-base">
            <Briefcase size={16} className="text-slate-400" />
            {exp.company}
          </div>

          <p className="text-slate-600 leading-relaxed mb-5 text-[15px] max-w-2xl">
            {exp.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {(exp.tags || []).map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-full group-hover:border-primary-200 group-hover:text-primary-700 transition-colors shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// PM Experience Card - More detailed with extra fields
function PMExperienceCard({ exp, index }: { exp: ExperienceItem; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-4">
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
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {exp.team_size && (
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <Users size={16} className="mx-auto text-primary-500 mb-1" />
              <p className="text-xs text-slate-500">Team Size</p>
              <p className="font-bold text-slate-900">{exp.team_size}</p>
            </div>
          )}
          {exp.budget && (
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <TrendingUp size={16} className="mx-auto text-primary-500 mb-1" />
              <p className="text-xs text-slate-500">Budget</p>
              <p className="font-bold text-slate-900">{exp.budget}</p>
            </div>
          )}
          {exp.methodologies && exp.methodologies.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <Layers size={16} className="mx-auto text-primary-500 mb-1" />
              <p className="text-xs text-slate-500">Methodology</p>
              <p className="font-bold text-slate-900 text-sm">{exp.methodologies[0]}</p>
            </div>
          )}
          {exp.tools && exp.tools.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <Code size={16} className="mx-auto text-primary-500 mb-1" />
              <p className="text-xs text-slate-500">Tools</p>
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
            <div className="p-6 pt-4 bg-slate-50/50">
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
      <div className="px-6 pb-6 pt-2 flex items-center justify-between">
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

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
        active
          ? 'bg-slate-900 text-white shadow-lg'
          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <Icon size={20} className={active ? 'text-primary-400' : 'text-slate-400'} />
      <span>{label}</span>
      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
      }`}>
        {count}
      </span>
    </button>
  );
}

export default function ExperienceSection({ content, settings }: { content?: any; settings?: any }) {
  const [activeTab, setActiveTab] = useState<'work' | 'pm'>('work');
  const [showAll, setShowAll] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Parse content with fallbacks
  const workExperience = content?.work_experience || content?.jobs || defaultWorkExperience;
  const pmExperience = content?.project_management || defaultPMExperience;
  const typingPhrases = content?.typing_phrases || defaultTypingPhrases;
  const curvedText = content?.curved_text || 'SHAH';
  const curvedTextRepeat = content?.curved_text_repeat || 3;
  const showTypingEffect = content?.show_typing_effect !== false;
  const showCurvedText = content?.show_curved_text !== false;
  const showParallax = content?.show_parallax_background !== false;

  const displayedWork = showAll ? workExperience : workExperience.slice(0, 2);
  const resumeUrl = settings?.resume_url || '/resume.pdf';

  return (
    <section id="experience" className="relative min-h-screen py-24 overflow-hidden">
      {/* Parallax Background */}
      {showParallax && <ParallaxBackground />}

      {/* Curved Text - Background decoration */}
      {showCurvedText && (
        <div className="absolute top-20 left-0 right-0 pointer-events-none opacity-60">
          <CurvedScrollText text={curvedText} repeatCount={curvedTextRepeat} />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header with Typing Effect */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-6">
              <Clock size={14} />
              Career Journey
            </span>

            <h2 className="font-display text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              {content?.title || 'Experience'}
            </h2>

            {/* Typing Effect Subtitle */}
            {showTypingEffect && (
              <div className="h-10 flex items-center justify-center">
                <span className="text-xl md:text-2xl text-slate-500 font-medium">
                  <TypingEffect phrases={typingPhrases} />
                </span>
              </div>
            )}

            <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
              {content?.subtitle || "A track record of engineering excellence and leadership in high-stakes environments."}
            </p>
          </motion.div>

          {/* Download Resume Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowEmailModal(true)}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-primary-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Download Resume
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <TabButton
            active={activeTab === 'work'}
            onClick={() => setActiveTab('work')}
            icon={Briefcase}
            label="Work Experience"
            count={workExperience.length}
          />
          <TabButton
            active={activeTab === 'pm'}
            onClick={() => setActiveTab('pm')}
            icon={Target}
            label="Project Management"
            count={pmExperience.length}
          />
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'work' ? (
            <motion.div
              key="work"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Work Experience Timeline */}
              <div className="relative space-y-0">
                {displayedWork.map((exp: ExperienceItem, index: number) => (
                  <WorkExperienceCard
                    key={index}
                    exp={exp}
                    index={index}
                    isLast={index === displayedWork.length - 1}
                  />
                ))}
              </div>

              {/* Show More Button */}
              {workExperience.length > 2 && (
                <div className="mt-8 flex justify-center relative z-20">
                  {!showAll && (
                    <div className="absolute bottom-full w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                  )}
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="group flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full shadow-lg text-slate-900 font-medium hover:border-primary-500 hover:text-primary-600 transition-all duration-300 hover:-translate-y-1"
                  >
                    {showAll ? (
                      <>Show Less <ChevronUp size={16} /></>
                    ) : (
                      <>View More Experience <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" /></>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="pm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6"
            >
              {pmExperience.map((exp: ExperienceItem, index: number) => (
                <PMExperienceCard key={index} exp={exp} index={index} />
              ))}

              {/* Empty State for PM */}
              {pmExperience.length === 0 && (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <Target size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-600 mb-2">No Project Management Experience Added</h3>
                  <p className="text-slate-500">Add your PM roles in the admin panel</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        resumeUrl={resumeUrl || ''}
      />
    </section>
  );
}
