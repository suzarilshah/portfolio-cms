'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, BookOpen, ArrowUpRight, ChevronDown } from 'lucide-react';

const defaultPublications = [
  {
    title: 'LoRa Network Based Wearable Tracker - A Preliminary Work',
    platform: 'IEEE Xplore',
    year: '2022',
    type: 'Research Paper',
    link: 'https://ieeexplore.ieee.org/document/10033340'
  }
];

export default function PublicationsSection({ content }: { content?: any }) {
  const articles = content?.articles || [];
  const journals = content?.journals || [];
  const title = content?.title || "Publications & Research";
  const description = content?.description || "Documenting my findings and sharing technical knowledge through research papers, articles, and community guides.";

  const [activeTab, setActiveTab] = useState<'articles' | 'journals'>('articles');
  const [showAllPublications, setShowAllPublications] = useState(false);

  // Fallback: if no articles/journals but legacy items exist, map them
  const legacyItems = content?.items || defaultPublications;
  const hasNewStructure = articles.length > 0 || journals.length > 0;

  // Helper to determine tab counts for badge
  const articleCount = articles.length;
  const journalCount = journals.length;

  return (
    <section id="publications" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Header Column (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <div className="sticky top-32">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {title}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
                {description}
              </p>
              
              {/* Tabs Switcher */}
              {hasNewStructure && (
                  <div className="flex flex-col gap-2 mb-8">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Filter Content</p>
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('articles')}
                            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'articles' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {activeTab === 'articles' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-sm rounded-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                Technical Articles
                                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-[10px] leading-none border border-slate-200 group-hover:border-slate-300">
                                    {articleCount}
                                </span>
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('journals')}
                            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'journals' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {activeTab === 'journals' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-sm rounded-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                Research Journals
                                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-[10px] leading-none border border-slate-200">
                                    {journalCount}
                                </span>
                            </span>
                        </button>
                      </div>
                  </div>
              )}

              <a 
                href="https://blog.suzarilshah.uk/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-primary-600 transition-colors group"
              >
                Visit My Full Blog <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Content Column (Right) */}
          <div className="lg:col-span-8 min-h-[500px]">
            <AnimatePresence mode='wait'>
                {hasNewStructure ? (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {(activeTab === 'articles' ? articles : journals).length > 6 && !showAllPublications ? (
                            <div className="relative">
                                <div className="grid md:grid-cols-2 gap-5">
                                    {(activeTab === 'articles' ? articles : journals).slice(0, 6).map((item: any, index: number) => {
                                        const isJournal = activeTab === 'journals';
                                        return (
                                            <motion.a
                                                key={index}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                    <ExternalLink className="text-primary-500" size={20} />
                                                </div>

                                                <div className="mb-6">
                                                    <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors ${isJournal ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                                                        {isJournal ? <BookOpen size={24} /> : <FileText size={24} />}
                                                    </div>
                                                    <h3 className="font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors text-lg leading-snug line-clamp-3">
                                                        {item.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-slate-500 border-t border-slate-50 pt-4 mt-auto">
                                                    <span className="text-slate-700 px-2 py-1 bg-slate-50 rounded-md">{item.publisher || item.platform}</span>
                                                    <span>{item.date || item.year}</span>
                                                    {isJournal && item.doi && (
                                                        <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]" title={item.doi}>DOI: {item.doi}</span>
                                                    )}
                                                </div>
                                            </motion.a>
                                        );
                                    })}
                                </div>

                                {/* Gradient overlay matching Experience section */}
                                {!showAllPublications && (
                                    <div className="absolute bottom-full w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                                )}

                                {/* View More Button - matching Experience section */}
                                <div className="mt-8 flex justify-center relative z-20">
                                    <button
                                        onClick={() => setShowAllPublications(true)}
                                        className="group flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full shadow-lg text-slate-900 font-medium hover:border-primary-500 hover:text-primary-600 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        View More Publications
                                        <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-5">
                                {(activeTab === 'articles' ? articles : journals).map((item: any, index: number) => {
                                    const isJournal = activeTab === 'journals';
                                    return (
                                        <motion.a
                                            key={index}
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                <ExternalLink className="text-primary-500" size={20} />
                                            </div>

                                            <div className="mb-6">
                                                <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors ${isJournal ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                                                    {isJournal ? <BookOpen size={24} /> : <FileText size={24} />}
                                                </div>
                                                <h3 className="font-display font-bold text-slate-900 group-hover:text-primary-600 transition-colors text-lg leading-snug line-clamp-3">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-slate-500 border-t border-slate-50 pt-4 mt-auto">
                                                <span className="text-slate-700 px-2 py-1 bg-slate-50 rounded-md">{item.publisher || item.platform}</span>
                                                <span>{item.date || item.year}</span>
                                                {isJournal && item.doi && (
                                                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]" title={item.doi}>DOI: {item.doi}</span>
                                                )}
                                            </div>
                                        </motion.a>
                                    );
                                })}

                                {/* Show Less Button - matching Experience section */}
                                {(activeTab === 'articles' ? articles : journals).length > 6 && (
                                    <div className="col-span-2 mt-8 flex justify-center">
                                        <button
                                            onClick={() => setShowAllPublications(false)}
                                            className="group flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full shadow-lg text-slate-900 font-medium hover:border-primary-500 hover:text-primary-600 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            Show Less
                                            <ChevronDown size={16} className="rotate-180 group-hover:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    // Legacy Fallback List
                    <div className="grid gap-4">
                        {legacyItems.map((pub: any, index: number) => (
                            <div key={index} className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-bold">{pub.title}</h3>
                                <p className="text-sm text-slate-500">{pub.platform} • {pub.year}</p>
                            </div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
