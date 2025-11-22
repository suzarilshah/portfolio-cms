'use client';

import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2, FileText, BookOpen, ChevronDown } from 'lucide-react';

interface PublicationItem {
  title: string;
  publisher: string;
  date: string;
  link: string;
  doi?: string;
}

interface PublicationsContent {
  title: string;
  description: string;
  articles: PublicationItem[];
  journals: PublicationItem[];
}

const defaultPublications: PublicationsContent = {
  title: 'Publications & Thought Leadership',
  description: 'Sharing knowledge through technical articles and academic research.',
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
  ]
};

export default function PublicationsPage() {
  return (
    <SectionEditor<PublicationsContent>
      sectionKey="publications"
      title="Publications Section"
      description="Manage your technical articles and research journals."
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
          <details className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" open>
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
        </div>
      )}
    />
  );
}
