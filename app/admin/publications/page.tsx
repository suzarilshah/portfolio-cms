'use client';

import { useState, useEffect } from 'react';
import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2, FileText, BookOpen, ChevronDown, Rss, ExternalLink, RefreshCw, Loader2, Calendar, Tag, CheckCircle2 } from 'lucide-react';

interface PublicationItem {
  title: string;
  publisher: string;
  date: string;
  link: string;
  doi?: string;
}

interface BlogSettings {
  showCategories: boolean;
  maxPosts: number;
  blogUrl: string;
}

interface PublicationsContent {
  title: string;
  description: string;
  articles: PublicationItem[];
  journals: PublicationItem[];
  blog: BlogSettings;
}

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories: string[];
  thumbnail?: string;
}

const defaultPublications: PublicationsContent = {
  title: 'Publications & Thought Leadership',
  description: 'Sharing knowledge through technical articles, academic research, and blog posts.',
  articles: [
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
  ],
  journals: [
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
  ],
  blog: {
    showCategories: true,
    maxPosts: 6,
    blogUrl: 'https://blog.suzarilshah.uk'
  }
};

function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      if (data.posts) {
        setPosts(data.posts);
        setLastFetched(new Date());
      }
      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  return (
    <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Rss size={20} className="text-orange-600" />
            Blog Feed Preview
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Posts from blog.suzarilshah.uk
            {lastFetched && (
              <span className="ml-2 text-xs text-slate-400">
                Last updated: {lastFetched.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Fetching latest posts...</p>
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> {error}. The blog tab will display a link to your blog instead.
          </p>
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-8 text-slate-500">
          <p>No posts found. Make sure your blog has published content.</p>
          <a
            href="https://blog.suzarilshah.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:underline"
          >
            Visit blog.suzarilshah.uk
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      {posts.length > 0 && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {posts.slice(0, 6).map((post, index) => (
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  {post.pubDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(post.pubDate)}
                    </span>
                  )}
                  {post.categories.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {post.categories.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink size={16} className="text-slate-300 group-hover:text-orange-500 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 size={16} />
            <span>{posts.length} posts detected</span>
          </div>
          <a
            href="https://blog.suzarilshah.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            Open Blog
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}

export default function PublicationsPage() {
  return (
    <SectionEditor<PublicationsContent>
      sectionKey="publications"
      title="Publications & Blog"
      description="Manage your technical articles, research journals, and blog settings."
      defaultContent={defaultPublications}
      renderForm={(content, onChange) => (
        <div className="space-y-8">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Section Title</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => onChange({ ...content, title: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Description</label>
              <input
                type="text"
                value={content.description}
                onChange={(e) => onChange({ ...content, description: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Articles List Accordion */}
          <details className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" open>
            <summary className="px-6 py-4 bg-slate-50/50 cursor-pointer flex items-center justify-between font-semibold text-slate-900 select-none hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                    <FileText className="text-blue-600" size={20} />
                    <span>Technical Articles</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                        {content.articles?.length || 0}
                    </span>
                </div>
                <ChevronDown size={20} className="text-slate-400 transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => onChange({
                        ...content,
                        articles: [
                            { title: 'New Article', publisher: 'Microsoft Tech Community', date: '2025', link: '#' },
                            ...(content.articles || [])
                        ]
                        })}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={16} /> Add Article
                    </button>
                </div>

                <div className="space-y-4">
                    {(!content.articles || content.articles.length === 0) && (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                            No articles listed.
                        </div>
                    )}
                    {content.articles?.map((item, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative group hover:border-blue-200 transition-colors">
                        <button
                        onClick={() => {
                            const newItems = [...content.articles];
                            newItems.splice(index, 1);
                            onChange({ ...content, articles: newItems });
                        }}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                        >
                        <Trash2 size={18} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pr-8 items-start">
                            <div className="md:col-span-6 space-y-1">
                                <label className="text-xs font-medium text-slate-500">Article Title</label>
                                <textarea
                                value={item.title}
                                onChange={(e) => {
                                    const newItems = [...content.articles];
                                    newItems[index].title = e.target.value;
                                    onChange({ ...content, articles: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-medium resize-none h-20"
                                />
                            </div>
                            <div className="md:col-span-3 space-y-1">
                                <label className="text-xs font-medium text-slate-500">Publisher</label>
                                <input
                                type="text"
                                value={item.publisher}
                                onChange={(e) => {
                                    const newItems = [...content.articles];
                                    newItems[index].publisher = e.target.value;
                                    onChange({ ...content, articles: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div className="md:col-span-3 space-y-1">
                                <label className="text-xs font-medium text-slate-500">Date</label>
                                <input
                                type="text"
                                value={item.date}
                                onChange={(e) => {
                                    const newItems = [...content.articles];
                                    newItems[index].date = e.target.value;
                                    onChange({ ...content, articles: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div className="md:col-span-12 space-y-1">
                                <label className="text-xs font-medium text-slate-500">URL</label>
                                <input
                                type="text"
                                value={item.link}
                                onChange={(e) => {
                                    const newItems = [...content.articles];
                                    newItems[index].link = e.target.value;
                                    onChange({ ...content, articles: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm text-blue-600 font-mono"
                                />
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          </details>

          {/* Journals List Accordion */}
          <details className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <summary className="px-6 py-4 bg-slate-50/50 cursor-pointer flex items-center justify-between font-semibold text-slate-900 select-none hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                    <BookOpen className="text-purple-600" size={20} />
                    <span>Research Journals</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold border border-purple-200">
                        {content.journals?.length || 0}
                    </span>
                </div>
                <ChevronDown size={20} className="text-slate-400 transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => onChange({
                        ...content,
                        journals: [
                            { title: 'New Journal', publisher: 'IEEE', date: '2025', link: '#', doi: '' },
                            ...(content.journals || [])
                        ]
                        })}
                        className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={16} /> Add Journal
                    </button>
                </div>

                <div className="space-y-4">
                    {(!content.journals || content.journals.length === 0) && (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                            No journals listed.
                        </div>
                    )}
                    {content.journals?.map((item, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative group hover:border-purple-200 transition-colors">
                        <button
                        onClick={() => {
                            const newItems = [...content.journals];
                            newItems.splice(index, 1);
                            onChange({ ...content, journals: newItems });
                        }}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                        >
                        <Trash2 size={18} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pr-8 items-start">
                            <div className="md:col-span-6 space-y-1">
                                <label className="text-xs font-medium text-slate-500">Paper Title</label>
                                <textarea
                                value={item.title}
                                onChange={(e) => {
                                    const newItems = [...content.journals];
                                    newItems[index].title = e.target.value;
                                    onChange({ ...content, journals: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm font-medium resize-none h-20"
                                />
                            </div>
                            <div className="md:col-span-3 space-y-1">
                                <label className="text-xs font-medium text-slate-500">Publisher</label>
                                <input
                                type="text"
                                value={item.publisher}
                                onChange={(e) => {
                                    const newItems = [...content.journals];
                                    newItems[index].publisher = e.target.value;
                                    onChange({ ...content, journals: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm"
                                />
                            </div>
                            <div className="md:col-span-3 space-y-1">
                                <label className="text-xs font-medium text-slate-500">Date</label>
                                <input
                                type="text"
                                value={item.date}
                                onChange={(e) => {
                                    const newItems = [...content.journals];
                                    newItems[index].date = e.target.value;
                                    onChange({ ...content, journals: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm"
                                />
                            </div>
                            <div className="md:col-span-6 space-y-1">
                                <label className="text-xs font-medium text-slate-500">URL</label>
                                <input
                                type="text"
                                value={item.link}
                                onChange={(e) => {
                                    const newItems = [...content.journals];
                                    newItems[index].link = e.target.value;
                                    onChange({ ...content, journals: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm text-blue-600 font-mono"
                                />
                            </div>
                            <div className="md:col-span-6 space-y-1">
                                <label className="text-xs font-medium text-slate-500">DOI (Digital Object Identifier)</label>
                                <input
                                type="text"
                                value={item.doi || ''}
                                onChange={(e) => {
                                    const newItems = [...content.journals];
                                    newItems[index].doi = e.target.value;
                                    onChange({ ...content, journals: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm font-mono"
                                />
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          </details>

          {/* Blog Settings Accordion */}
          <details className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <summary className="px-6 py-4 bg-slate-50/50 cursor-pointer flex items-center justify-between font-semibold text-slate-900 select-none hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                    <Rss className="text-orange-600" size={20} />
                    <span>Blog Posts</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200">
                        Auto-fetched
                    </span>
                </div>
                <ChevronDown size={20} className="text-slate-400 transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                {/* Blog URL Info */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ExternalLink className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-orange-900">Your Blog</h3>
                            <p className="text-sm text-orange-700 mt-1">
                                Posts are automatically fetched from your blog RSS feed.
                            </p>
                            <a
                                href="https://blog.suzarilshah.uk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-white border border-orange-200 rounded-lg text-orange-600 font-medium hover:bg-orange-50 transition-colors"
                            >
                                blog.suzarilshah.uk
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Display Options */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                        <div>
                            <label className="text-sm font-semibold text-slate-900">Show Categories</label>
                            <p className="text-xs text-slate-500 mt-0.5">Display category tags on blog post cards</p>
                        </div>
                        <button
                            onClick={() => onChange({
                                ...content,
                                blog: { ...content.blog, showCategories: !content.blog?.showCategories }
                            })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                                content.blog?.showCategories !== false ? 'bg-orange-600' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                    content.blog?.showCategories !== false ? 'left-7' : 'left-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <label className="text-sm font-semibold text-slate-900 block mb-2">
                            Maximum Posts to Display
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="3"
                                max="12"
                                value={content.blog?.maxPosts || 6}
                                onChange={(e) => onChange({
                                    ...content,
                                    blog: { ...content.blog, maxPosts: parseInt(e.target.value) }
                                })}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                            />
                            <span className="w-8 text-center font-bold text-slate-900">{content.blog?.maxPosts || 6}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Shows up to {content.blog?.maxPosts || 6} posts in the Blog tab
                        </p>
                    </div>
                </div>

                {/* Live Preview */}
                <BlogPreview />
            </div>
          </details>
        </div>
      )}
    />
  );
}
