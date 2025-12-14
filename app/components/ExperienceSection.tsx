'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Calendar, MapPin, ChevronDown, ChevronUp, Briefcase, Download } from 'lucide-react';
import EmailCaptureModal from '@/components/EmailCaptureModal';

const experiences = [
  {
    company: 'Swift',
    role: 'Senior IT Systems & Customer Engineer',
    period: '2025 – Present',
    location: 'Kuala Lumpur, Malaysia',
    description: 'Leading the strategic architecture of enterprise IT systems and customer engineering solutions. Spearheading the adoption of scalable cloud infrastructures and ensuring 99.9% system reliability for critical banking operations.',
    tags: ['System Architecture', 'Enterprise Cloud', 'Strategic Leadership']
  },
  {
    company: 'Swift',
    role: 'System Engineer',
    period: '2023 – 2024',
    location: 'Kuala Lumpur, Malaysia',
    description: 'Managed mission-critical infrastructure for global financial messaging services. Optimized deployment workflows reducing incident response time by 40%.',
    tags: ['Infrastructure', 'Deployment Optimization', 'High Availability']
  },
  {
    company: 'Virtual Spirit',
    role: 'DevOps Engineer',
    period: '2023',
    location: 'Remote',
    description: 'Architected CI/CD pipelines enabling seamless delivery. Implemented containerization strategies that improved resource utilization by 60%.',
    tags: ['DevOps Architecture', 'CI/CD', 'Cloud Native']
  },
  {
    company: 'Celcom Axiata',
    role: 'Cloud Engineer (Protege)',
    period: '2022 – 2023',
    location: 'Petaling Jaya',
    description: 'Executed large-scale cloud migration projects on Azure. Managed resource governance and compliance for telecommunications infrastructure.',
    tags: ['Azure Migration', 'Cloud Governance', 'Telecom Ops']
  }
];

export default function ExperienceSection({ content, settings }: { content?: any; settings?: any }) {
  const experiencesList = content?.jobs || experiences;
  const [showAll, setShowAll] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const displayedExperiences = showAll ? experiencesList : experiencesList.slice(0, 2);
  const resumeUrl = settings?.resume_url || '/resume.pdf';

  return (
    <section id="experience" className="py-24 relative bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Experience
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
              {content?.subtitle || "A chronological journey of technical growth and engineering leadership."}
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => setShowEmailModal(true)}
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-primary-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            Download Resume
          </motion.button>
        </div>

        {/* Premium Magazine Layout Timeline */}
        <div className="relative space-y-0">
            <AnimatePresence mode="popLayout">
                {displayedExperiences.map((exp: any, index: number) => {
                    const isLast = index === displayedExperiences.length - 1;
                    
                    return (
                    <motion.div 
                        key={index} 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group relative grid grid-cols-1 md:grid-cols-[180px_60px_1fr] gap-0 md:gap-4"
                    >
                        
                        {/* 1. Date/Period Column (Desktop) */}
                        <div className="hidden md:flex flex-col items-end pt-1 text-right px-2">
                            <span className={`font-display text-lg font-bold ${index === 0 ? 'text-primary-600' : 'text-slate-900'}`}>
                                {exp.period || 'Present'}
                            </span>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                                {exp.location ? exp.location.split(',')[0] : 'Remote'}
                            </span>
                        </div>

                        {/* 2. Timeline Spine Column */}
                        <div className="hidden md:flex justify-center relative min-h-[120px]">
                            {/* The Line connecting this node to next */}
                            {!isLast && (
                                <div className="absolute top-4 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-slate-200 group-hover:from-primary-200 group-hover:via-primary-200 group-hover:to-primary-100 transition-colors duration-500" />
                            )}
                            
                            {/* The Dot */}
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

                        {/* 3. Content Card Column */}
                        <div className="pb-12 pl-12 md:pl-0 pt-0 md:pt-0 relative">
                             {/* Mobile Line connecting nodes */}
                             {!isLast && (
                                <div className="md:hidden absolute left-[1.85rem] top-4 bottom-0 w-px bg-slate-200" />
                            )}
                            {/* Mobile Dot Wrapper - creates the dot for mobile layout relative to card */}
                            <div className="md:hidden absolute left-6 top-2 w-3 h-3 rounded-full bg-white border-2 border-slate-400 z-10" />

                            <div className="relative group-hover:-translate-y-1 transition-transform duration-300">
                                {/* Period Badge (Mobile Only) */}
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
                })}
            </AnimatePresence>
        </div>

        {/* Expand/Collapse Button */}
        {experiencesList.length > 2 && (
            <div className="mt-8 flex justify-center relative z-20">
                {!showAll && (
                        <div className="absolute bottom-full w-full h-32 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none" />
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
