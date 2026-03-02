'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, BookOpen, ArrowUpRight, ChevronDown, Rss, Calendar, Tag, Loader2 } from 'lucide-react';

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories: string[];
  thumbnail?: string;
}

// Default articles for fallback
const defaultArticles = [
  {
    title: 'Deploying GPT-4o AI Chat app on Azure via Azure AI Services – a step-by-step guide',
    publisher: 'Microsoft Tech Community',
    date: '2024',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/deploying-gpt-4o-ai-chat-app-on-azure-via-azure-ai-services-%e2%80%93-a-step-by-step-gui/4179472'
  },
  {
    title: 'Vulnerability Assessment on Azure Container Registry with Microsoft Defender and Docker Scout',
    publisher: 'Microsoft Tech Community',
    date: '2024',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/vulnerability-assessment-on-azure-container-registry-with-microsoft-defender-and/4169136'
  },
  {
    title: 'Host and Deploy Images on Azure Container Registries (ACR) via App Service - A step-by-step guide',
    publisher: 'Microsoft Tech Community',
    date: '2024',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/host-and-deploy-images-on-azure-container-registries-acr-via-app-service---a-ste/4148105'
  },
  {
    title: 'Setting up Azure API on Postman and Azure CLI – Step-by-step guide',
    publisher: 'Microsoft Tech Community',
    date: '2024',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/setting-up-azure-api-on-postman-and-azure-cli-%E2%80%93-step-by-step-guide/4137250'
  },
  {
    title: 'Deploy Open Web UI on Azure VM via Docker: A Step-by-Step Guide with Custom Domain Setup',
    publisher: 'Microsoft Tech Community',
    date: '2025',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/deploy-open-web-ui-on-azure-vm-via-docker-a-step-by-step-guide-with-custom-domai/4387717'
  },
  {
    title: 'Step-by-step: Integrate Ollama Web UI to use Azure Open AI API with LiteLLM Proxy',
    publisher: 'Microsoft Tech Community',
    date: '2025',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/step-by-step-integrate-ollama-web-ui-to-use-azure-open-ai-api-with-litellm-proxy/4386612'
  },
  {
    title: 'Power Up Your Open WebUI with Azure AI Speech: Quick STT & TTS Integration',
    publisher: 'Microsoft Tech Community',
    date: '2025',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/power-up-your-open-webui-with-azure-ai-speech-quick-stt--tts-integration/4412985'
  },
  {
    title: 'Configure Embedding Models on Azure AI Foundry with Open Web UI',
    publisher: 'Microsoft Tech Community',
    date: '2025',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/configure-embedding-models-on-azure-ai-foundry-with-open-web-ui/4420304'
  },
  {
    title: 'Create Stunning AI Videos with Sora on Azure AI Foundry!',
    publisher: 'Microsoft Tech Community',
    date: '2025',
    link: 'https://techcommunity.microsoft.com/blog/educatordeveloperblog/create-stunning-ai-videos-with-sora-on-azure-ai-foundry/4426442'
  }
];

// Default journals for fallback
const defaultJournals = [
  {
    title: 'LoRa Network-Based Wearable Tracker - A Preliminary Work',
    publisher: 'IEEE',
    date: '2022',
    link: 'https://ieeexplore.ieee.org/document/10033340',
    doi: '10.1109/IVIT55443.2022.10033340'
  },
  {
    title: 'Automated Aquaponics Systems to Support Sustainable Development Goals',
    publisher: 'SpringerLink',
    date: '2024',
    link: 'https://link.springer.com/chapter/10.1007/978-3-031-67437-2_11',
    doi: '10.1007/978-3-031-67437-2_11'
  }
];

// Helper to sort items by year (most recent first)
const sortByYear = (items: any[]) => {
  return [...items].sort((a, b) => {
    const yearA = parseInt(a.date || a.year || '0');
    const yearB = parseInt(b.date || b.year || '0');
    return yearB - yearA; // Descending order (newest first)
  });
};

export default function PublicationsSection({ content }: { content?: any }) {
  // Use content from database, or fall back to rich defaults
  // Sort by year (most recent first)
  const rawArticles = content?.articles?.length > 0 ? content.articles : defaultArticles;
  const rawJournals = content?.journals?.length > 0 ? content.journals : defaultJournals;
  const articles = sortByYear(rawArticles);
  const journals = sortByYear(rawJournals);
  const title = content?.title || "Publications & Thought Leadership";
  const description = content?.description || "Sharing knowledge through technical articles, academic research, and blog posts.";
  const blogSettings = content?.blog || { showCategories: true, maxPosts: 6, blogUrl: 'https://blog.suzarilshah.uk' };

  const [activeTab, setActiveTab] = useState<'articles' | 'journals' | 'blog'>('articles');
  const [showAllPublications, setShowAllPublications] = useState(false);

  // Blog posts state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogUrl, setBlogUrl] = useState('https://blog.suzarilshah.uk');

  // Fetch blog posts when blog tab is selected
  useEffect(() => {
    if (activeTab === 'blog' && blogPosts.length === 0 && !blogLoading) {
      setBlogLoading(true);
      fetch('/api/blog')
        .then(res => res.json())
        .then(data => {
          if (data.posts && data.posts.length > 0) {
            setBlogPosts(data.posts.slice(0, blogSettings.maxPosts || 6));
          }
          if (data.blogUrl) {
            setBlogUrl(data.blogUrl);
          }
          if (data.error) {
            setBlogError(data.error);
          }
        })
        .catch(() => {
          setBlogError('Failed to load blog posts');
        })
        .finally(() => {
          setBlogLoading(false);
        });
    }
  }, [activeTab, blogPosts.length, blogLoading, blogSettings.maxPosts]);

  // Reset show all when tab changes
  useEffect(() => {
    setShowAllPublications(false);
  }, [activeTab]);

  // Helper to determine tab counts for badge
  const articleCount = articles.length;
  const journalCount = journals.length;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Get current items based on active tab
  const getCurrentItems = () => {
    if (activeTab === 'articles') return articles;
    if (activeTab === 'journals') return journals;
    return [];
  };

  const currentItems = getCurrentItems();
  const showViewMore = currentItems.length > 6 && !showAllPublications;
  const displayItems = showViewMore ? currentItems.slice(0, 6) : currentItems;

  // Tab configuration for cleaner rendering
  const tabs = [
    {
      id: 'articles' as const,
      label: 'Technical Articles',
      description: 'Microsoft Tech Community',
      icon: FileText,
      count: articleCount,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'journals' as const,
      label: 'Research Journals',
      description: 'IEEE & Academic',
      icon: BookOpen,
      count: journalCount,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'blog' as const,
      label: 'Blog Posts',
      description: 'blog.suzarilshah.uk',
      icon: Rss,
      count: null,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

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

              {/* Beautiful Vertical Tab Switcher */}
              <div className="space-y-3 mb-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r ' + tab.gradient + ' text-white shadow-lg shadow-' + tab.color + '-500/25'
                          : 'bg-white border border-slate-200 hover:border-' + tab.color + '-300 hover:shadow-md'
                      }`}
                    >
                      <div className="relative z-10 flex items-center gap-4 p-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-white/20'
                            : 'bg-' + tab.color + '-50 text-' + tab.color + '-600 group-hover:bg-' + tab.color + '-100'
                        }`}>
                          <Icon size={24} className={isActive ? 'text-white' : ''} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            {tab.label}
                          </div>
                          <div className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {tab.description}
                          </div>
                        </div>
                        {tab.count !== null && (
                          <div className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tab.count}
                          </div>
                        )}
                        {tab.count === null && (
                          <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-' + tab.color + '-100 text-' + tab.color + '-600'
                          }`}>
                            Live
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <a
                href={blogUrl}
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
              {/* Articles & Journals Tab Content */}
              {(activeTab === 'articles' || activeTab === 'journals') && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="grid md:grid-cols-2 gap-5">
                      {displayItems.map((item: any, index: number) => {
                        const isJournal = activeTab === 'journals';
                        const hasValidLink = item.link && item.link.startsWith('http');

                        const cardContent = (
                          <>
                            {hasValidLink && (
                              <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ExternalLink className="text-primary-500" size={20} />
                              </div>
                            )}

                            <div className="mb-6">
                              <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors ${isJournal ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                                {isJournal ? <BookOpen size={24} /> : <FileText size={24} />}
                              </div>
                              <h3 className={`font-display font-bold text-slate-900 transition-colors text-lg leading-snug line-clamp-3 ${hasValidLink ? 'group-hover:text-primary-600' : ''}`}>
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
                          </>
                        );

                        if (hasValidLink) {
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300 relative overflow-hidden cursor-pointer h-full"
                              >
                                {cardContent}
                              </a>
                            </motion.div>
                          );
                        }

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl transition-all duration-300 relative overflow-hidden"
                          >
                            {cardContent}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* View More / Show Less Button */}
                    {currentItems.length > 6 && (
                      <div className="mt-8 flex justify-center relative z-20">
                        <button
                          onClick={() => setShowAllPublications(!showAllPublications)}
                          className="group flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full shadow-lg text-slate-900 font-medium hover:border-primary-500 hover:text-primary-600 transition-all duration-300 hover:-translate-y-1"
                        >
                          {showAllPublications ? 'Show Less' : 'View More Publications'}
                          <ChevronDown size={16} className={`transition-transform ${showAllPublications ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Blog Tab Content */}
              {activeTab === 'blog' && (
                <motion.div
                  key="blog"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Loading State */}
                  {blogLoading && (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-4" />
                      <p>Loading latest posts...</p>
                    </div>
                  )}

                  {/* Error or No Posts State */}
                  {!blogLoading && (blogPosts.length === 0 || blogError) && (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Rss className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Check out my blog
                      </h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        I write about cloud architecture, DevOps practices, and lessons learned from building scalable systems.
                      </p>
                      <a
                        href={blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
                      >
                        Visit blog.suzarilshah.uk
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Blog Posts Grid */}
                  {!blogLoading && blogPosts.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-5">
                      {blogPosts.map((post, index) => (
                        <motion.div
                          key={post.link}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 relative overflow-hidden h-full"
                          >
                            <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                              <ExternalLink className="text-orange-500" size={20} />
                            </div>

                            <div className="mb-6">
                              <div className="inline-flex p-3 rounded-xl mb-4 transition-colors bg-orange-50 text-orange-600 group-hover:bg-orange-100">
                                <Rss size={24} />
                              </div>
                              <h3 className="font-display font-bold text-slate-900 group-hover:text-orange-600 transition-colors text-lg leading-snug line-clamp-3">
                                {post.title}
                              </h3>
                              {post.description && (
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                  {post.description}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-slate-500 border-t border-slate-50 pt-4 mt-auto">
                              {post.pubDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {formatDate(post.pubDate)}
                                </span>
                              )}
                              {blogSettings.showCategories !== false && post.categories?.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Tag size={12} />
                                  {post.categories.slice(0, 2).join(', ')}
                                </span>
                              )}
                            </div>
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* View All Link */}
                  {!blogLoading && blogPosts.length > 0 && (
                    <div className="mt-8 flex justify-center">
                      <a
                        href={blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full shadow-lg text-slate-900 font-medium hover:border-orange-500 hover:text-orange-600 transition-all duration-300 hover:-translate-y-1"
                      >
                        View all posts on blog.suzarilshah.uk
                        <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
