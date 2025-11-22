'use client';

import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2, Trophy, Award, Medal, Star } from 'lucide-react';

interface AwardItem {
  title: string;
  issuer: string;
  year: string;
  description: string;
  icon: string;
  link?: string;
}

interface AwardsContent {
  title: string;
  subtitle: string;
  items: AwardItem[];
}

const defaultAwards: AwardsContent = {
  title: "Global Recognition",
  subtitle: "Acknowledged by industry giants for technical innovation, community leadership, and engineering excellence.",
  items: [
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
  ]
};

export default function AwardsPage() {
  return (
    <SectionEditor<AwardsContent>
      sectionKey="awards"
      title="Awards & Recognition"
      description="Manage your manual awards list (distinct from Credly badges)."
      defaultContent={defaultAwards}
      renderForm={(content, onChange) => (
        <div className="space-y-8">
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
              <label className="text-sm font-semibold text-slate-900">Subtitle</label>
              <input 
                type="text" 
                value={content.subtitle} 
                onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Awards List</h3>
              <button 
                onClick={() => onChange({
                  ...content,
                  items: [
                    { title: 'New Award', issuer: 'Issuer', year: '2025', description: '', icon: 'trophy', link: '' },
                    ...(content.items || [])
                  ]
                })}
                className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add Award
              </button>
            </div>

            <div className="grid gap-6">
                {content.items?.map((item, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative group hover:border-blue-200 transition-colors">
                    <button 
                    onClick={() => {
                        const newItems = [...content.items];
                        newItems.splice(index, 1);
                        onChange({ ...content, items: newItems });
                    }}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                    >
                    <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Award Title</label>
                                <input 
                                type="text" 
                                value={item.title} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].title = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Issuer</label>
                                <input 
                                type="text" 
                                value={item.issuer} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].issuer = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Year</label>
                                    <input 
                                    type="text" 
                                    value={item.year} 
                                    onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[index].year = e.target.value;
                                        onChange({ ...content, items: newItems });
                                    }}
                                    className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Icon</label>
                                    <select
                                        value={item.icon}
                                        onChange={(e) => {
                                            const newItems = [...content.items];
                                            newItems[index].icon = e.target.value;
                                            onChange({ ...content, items: newItems });
                                        }}
                                        className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm bg-white"
                                    >
                                        <option value="trophy">Trophy</option>
                                        <option value="award">Award</option>
                                        <option value="star">Star</option>
                                        <option value="medal">Medal</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">External URL (Optional)</label>
                                <input 
                                type="url" 
                                value={item.link || ''} 
                                placeholder="https://..."
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].link = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Description</label>
                                <textarea 
                                value={item.description} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].description = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm h-36 resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
