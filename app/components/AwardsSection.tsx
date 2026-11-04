'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Medal, Star, ExternalLink, CheckCircle2, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import { SectionHeading } from '@/components/layout/SectionFrame';
import IndexList from '@/components/motion/IndexList';

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

export default function AwardsSection({
  badges,
  content,
  index,
}: {
  badges?: any[];
  content?: AwardsContent;
  /** Position in the page's render order, shown in the margin. */
  index?: number;
}) {
  const items = content?.items || defaultAwards;
  const title = content?.title || "Global Recognition";
  const subtitle = content?.subtitle || "Acknowledged by industry giants for technical innovation, community leadership, and engineering excellence.";

  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  // Initialize selected badge
  useEffect(() => {
    if (badges && badges.length > 0 && !selectedBadgeId) {
      // Prefer badges with images, but select first badge if none have images
      const badgeWithImage = badges.find(b => b.image_url);
      setSelectedBadgeId((badgeWithImage || badges[0])?.id);
    }
  }, [badges, selectedBadgeId]);

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
    <section id="awards" className="py-20 sm:py-24 relative bg-slate-50/50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <Script src="//cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
      
      <div className="river relative z-10">
        <SectionHeading
          index={index}
          title={title || 'Global Recognition'}
          standfirst={subtitle}
          // Tint everything after the first word, which is how the old
          // hand-split heading read before it became a shared component.
          highlight={(title || 'Global Recognition').split(' ').slice(1)}
        />

        {/* The awards read as an index, not a six-card grid. A grid gives
            every award identical weight and spends most of its area on
            borders; a list of recognitions is something you scan, and the
            detail only matters for the one under the cursor. */}
        <IndexList
          items={items.map((award: AwardItem, i: number) => ({
            id: `${award.title}-${i}`,
            title: award.title,
            kicker: award.issuer,
            meta: award.year,
            detail: award.description,
            href: award.link || null,
          }))}
          renderPreview={(item) => {
            const award = items.find(
              (candidate: AwardItem, i: number) => `${candidate.title}-${i}` === item.id
            );
            const Icon = getIcon(award?.icon || 'trophy');
            return (
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-600">
                    <Icon size={17} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    {item.meta}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  {item.kicker}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{item.detail}</p>
              </div>
            );
          }}
          className="mb-16"
        />

        {/* CREDLY BADGES GALLERY */}
        {badges && badges.length > 0 && (
            <div className="border-t border-slate-200 pt-16">
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
                                                {selectedBadge.image_url ? (
                                                    <img 
                                                        src={selectedBadge.image_url} 
                                                        alt={selectedBadge.title || 'Badge'}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div 
                                                        data-iframe-width="150" 
                                                        data-iframe-height="270" 
                                                        data-share-badge-id={selectedBadge.badge_id} 
                                                        data-share-badge-host="https://www.credly.com"
                                                        className="w-full h-full"
                                                    />
                                                )}
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
                                            {badge.image_url ? (
                                                <img 
                                                    src={badge.image_url} 
                                                    alt={badge.title || 'Badge'}
                                                    className={`w-full h-full object-contain transition-all duration-300 ${
                                                        selectedBadgeId === badge.id ? 'scale-110' : 'scale-100 group-hover:scale-110'
                                                    }`}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div 
                                                    data-iframe-width="150" 
                                                    data-iframe-height="270" 
                                                    data-share-badge-id={badge.badge_id} 
                                                    data-share-badge-host="https://www.credly.com"
                                                    className="w-full h-full"
                                                />
                                            )}
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
