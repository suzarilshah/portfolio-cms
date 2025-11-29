'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Medal, Star, ExternalLink, CheckCircle2 } from 'lucide-react';
import Script from 'next/script';

const defaultAwards = [
  {
    title: 'Microsoft AI & Azure MVP',
    issuer: 'Microsoft',
    year: '2024',
    description: 'Awarded for exceptional technical leadership and community contributions in AI and Cloud Computing.',
    icon: 'trophy',
    link: 'https://mvp.microsoft.com/'
  },
  {
    title: 'Docker Captain',
    issuer: 'Docker',
    year: '2024',
    description: 'Recognized as a community leader and expert in containerization technologies.',
    icon: 'trophy',
    link: 'https://www.docker.com/community/captains'
  },
  {
    title: 'Windows Insider MVP',
    issuer: 'Microsoft',
    year: '2023',
    description: 'Honored for valuable feedback and advocacy within the Windows Insider community.',
    icon: 'award'
  },
  {
    title: 'Gold Student Ambassador',
    issuer: 'Microsoft',
    year: '2022',
    description: 'Highest tier of student ambassadorship, leading global student initiatives.',
    icon: 'star'
  },
  {
    title: 'Runner Up (Top 4 Asia)',
    issuer: 'Microsoft Imagine Cup',
    year: '2022',
    description: 'Global finalist for innovative IoT solution "Smart Aquaponics".',
    icon: 'medal'
  },
  {
    title: 'ITEX Silver Medal',
    issuer: 'International Technology Expo',
    year: '2021',
    description: 'International recognition for automated sustainable agriculture systems.',
    icon: 'medal'
  }
];

interface AwardItem {
  title: string;
  issuer: string;
  year: string;
  description: string;
  icon: string;
  link?: string;
}

interface AwardsContent {
  title?: string;
  subtitle?: string;
  items?: AwardItem[];
}

export default function AwardsSection({ badges, content }: { badges?: any[]; content?: AwardsContent }) {
  const items = content?.items || defaultAwards;
  const title = content?.title || "Global Recognition";
  const subtitle = content?.subtitle || "Acknowledged by industry giants for technical innovation, community leadership, and engineering excellence.";
  
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  // Initialize selected badge
  useEffect(() => {
    if (badges && badges.length > 0 && !selectedBadgeId) {
      setSelectedBadgeId(badges[0].id);
    }
  }, [badges]);

  const selectedBadge = badges?.find(b => b.id === selectedBadgeId) || badges?.[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'award': return Award;
      case 'star': return Star;
      case 'medal': return Medal;
      default: return Trophy;
    }
  };

  return (
    <section id="awards" className="py-20 md:py-32 relative bg-slate-50/50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <Script src="//cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* AWARDS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-32">
          {/* Header */}
          <div className="lg:col-span-4 relative lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                {title?.split(' ')[0] || 'Global'} <br /> <span className="text-primary-600">{title?.split(' ').slice(1).join(' ') || 'Recognition'}</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          </div>

          {/* Awards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((award: any, index: number) => {
              const Icon = getIcon(award.icon);
              const CardContent = (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-primary-50 rounded-xl group-hover:bg-primary-600 transition-colors duration-500">
                        <Icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-500" />
                    </div>
                    <span className="font-mono text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded-md group-hover:bg-slate-800 group-hover:text-slate-300 transition-colors duration-500">
                      {award.year}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {award.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wide group-hover:text-slate-400 transition-colors">
                    {award.issuer}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-500 transition-colors">
                    {award.description}
                  </p>
                  
                  {award.link && (
                    <div className="mt-6 flex items-center text-sm font-medium text-primary-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        View Recognition <ExternalLink className="ml-2 w-4 h-4" />
                    </div>
                  )}
                </>
              );

              const cardClasses = "group p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-500 h-full flex flex-col relative overflow-hidden";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                    {award.link ? (
                        <a href={award.link} target="_blank" rel="noopener noreferrer" className={cardClasses}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {CardContent}
                        </a>
                    ) : (
                        <div className={cardClasses}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {CardContent}
                        </div>
                    )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CREDLY BADGES GALLERY */}
        {badges && badges.length > 0 && (
            <div className="border-t border-slate-200 pt-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">Verified Credentials</h3>
                    <p className="text-slate-600 text-lg">
                        Professional certifications verified by Credly.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Main Stage - Selected Badge */}
                    <div className="lg:col-span-5 order-1 lg:order-1">
                        <AnimatePresence mode="wait">
                            {selectedBadge && (
                                <motion.div
                                    key={selectedBadge.id}
                                    initial={{ opacity: 0, scale: 0.95, x: -20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: 20 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 via-purple-100/50 to-transparent rounded-[2rem] blur-3xl -z-10" />
                                    
                                    <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
                                        {/* Spotlight effect */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white via-transparent to-transparent opacity-50 pointer-events-none" />
                                        
                                        <div className="relative z-10 flex flex-col items-center">
                                            <motion.div 
                                                className="w-64 h-64 md:w-80 md:h-80 mb-8 drop-shadow-2xl"
                                                whileHover={{ scale: 1.1, rotate: 2 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <img 
                                                    src={selectedBadge.image_url} 
                                                    alt={selectedBadge.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            </motion.div>

                                            <h4 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                                                {selectedBadge.title ? selectedBadge.title.split(' was issued by')[0] : 'Credential'}
                                            </h4>
                                            
                                            {selectedBadge.issuer && (
                                                <p className="text-slate-500 font-medium uppercase tracking-widest text-sm mb-8">
                                                    {selectedBadge.issuer}
                                                </p>
                                            )}

                                            <a 
                                                href={`https://www.credly.com/badges/${selectedBadge.badge_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg hover:shadow-primary-500/25 group-hover:scale-105 duration-300"
                                            >
                                                Verify Credential <CheckCircle2 size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Selector Grid */}
                    <div className="lg:col-span-7 order-2 lg:order-2">
                        <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 md:p-10 shadow-sm">
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-h-[600px] overflow-y-auto px-2 py-2 custom-scrollbar">
                                {badges.map((badge, idx) => (
                                    <button
                                        key={badge.id}
                                        onClick={() => setSelectedBadgeId(badge.id)}
                                        className={`relative aspect-square p-4 rounded-xl border-2 transition-all duration-300 group ${
                                            selectedBadgeId === badge.id 
                                                ? 'bg-white border-primary-500 shadow-lg scale-110 ring-4 ring-primary-100 z-10' 
                                                : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-md hover:scale-105 hover:z-10'
                                        }`}
                                    >
                                        <div className="w-full h-full flex items-center justify-center relative">
                                            <img 
                                                src={badge.image_url} 
                                                alt={badge.title}
                                                className={`w-full h-full object-contain transition-all duration-300 ${
                                                    selectedBadgeId === badge.id ? 'scale-110' : 'scale-100 group-hover:scale-110'
                                                }`}
                                                loading="lazy"
                                            />
                                        </div>
                                        
                                        {/* Hover Badge Name Tooltip */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 w-max max-w-[150px] bg-slate-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl text-center z-20 ${
                                            idx < 5 ? 'top-full mt-2' : 'bottom-full mb-2'
                                        }`}>
                                            {badge.title ? badge.title.split(' was issued by')[0] : 'Credential'}
                                            <div className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
                                                idx < 5 ? 'bottom-full border-b-slate-900' : 'top-full border-t-slate-900'
                                            }`}></div>
                                        </div>

                                        {selectedBadgeId === badge.id && (
                                            <motion.div 
                                                layoutId="activeBadgeIndicator"
                                                className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full p-1 shadow-sm z-20"
                                            >
                                                <CheckCircle2 size={12} />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 text-center md:text-right">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                    Select a badge to view details • {badges.length} Total Credentials
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </section>
  );
}
