'use client';

import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2, Trophy, Award, Medal, Star, ChevronUp, ChevronDown } from 'lucide-react';

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--raised)] p-6 rounded-[4px] border border-[var(--line)]">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]">Section Title</label>
              <input 
                type="text" 
                value={content.title} 
                onChange={(e) => onChange({ ...content, title: e.target.value })}
                className="studio-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text)]">Subtitle</label>
              <input 
                type="text" 
                value={content.subtitle} 
                onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
                className="studio-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--line)] pb-4">
              <h3 className="text-lg font-bold text-[var(--text)]">Awards List</h3>
              <button 
                onClick={() => onChange({
                  ...content,
                  items: [
                    { title: 'New Award', issuer: 'Issuer', year: '2025', description: '', icon: 'trophy', link: '' },
                    ...(content.items || [])
                  ]
                })}
                className="text-sm bg-[var(--accent)] text-[#06080b] px-3 py-1.5 rounded-[4px] font-medium hover:bg-[var(--accent)] transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add Award
              </button>
            </div>

            <div className="grid gap-6">
                {content.items?.map((item, index) => (
                <div key={index} className="bg-[var(--surface)] border border-[var(--line)] rounded-[4px] p-6 relative group hover:border-[var(--line)] transition-colors">
                    <div className="absolute top-4 right-4 flex gap-2">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => {
                                    if (index > 0) {
                                        const newItems = [...content.items];
                                        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
                                        onChange({ ...content, items: newItems });
                                    }
                                }}
                                disabled={index === 0}
                                className="text-[var(--faint)] hover:text-[var(--faint)] disabled:text-[var(--faint)] disabled:cursor-not-allowed transition-colors p-1 hover:bg-[var(--hover)] rounded"
                                title="Move up"
                            >
                                <ChevronUp size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    if (index < content.items.length - 1) {
                                        const newItems = [...content.items];
                                        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                                        onChange({ ...content, items: newItems });
                                    }
                                }}
                                disabled={index === content.items.length - 1}
                                className="text-[var(--faint)] hover:text-[var(--faint)] disabled:text-[var(--faint)] disabled:cursor-not-allowed transition-colors p-1 hover:bg-[var(--hover)] rounded"
                                title="Move down"
                            >
                                <ChevronDown size={16} />
                            </button>
                        </div>
                        {/* Delete button */}
                        <button 
                        onClick={() => {
                            const newItems = [...content.items];
                            newItems.splice(index, 1);
                            onChange({ ...content, items: newItems });
                        }}
                        className="text-[var(--faint)] hover:text-[var(--danger)] transition-colors p-1 hover:bg-[var(--raised)] rounded"
                        >
                        <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-[var(--faint)]">Award Title</label>
                                <input 
                                type="text" 
                                value={item.title} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].title = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="studio-input"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-[var(--faint)]">Issuer</label>
                                <input 
                                type="text" 
                                value={item.issuer} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].issuer = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="studio-input"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--faint)]">Year</label>
                                    <input 
                                    type="text" 
                                    value={item.year} 
                                    onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[index].year = e.target.value;
                                        onChange({ ...content, items: newItems });
                                    }}
                                    className="studio-input"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[var(--faint)]">Icon</label>
                                    <select
                                        value={item.icon}
                                        onChange={(e) => {
                                            const newItems = [...content.items];
                                            newItems[index].icon = e.target.value;
                                            onChange({ ...content, items: newItems });
                                        }}
                                        className="studio-input"
                                    >
                                        <option value="trophy">Trophy</option>
                                        <option value="award">Award</option>
                                        <option value="star">Star</option>
                                        <option value="medal">Medal</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-[var(--faint)]">External URL (Optional)</label>
                                <input 
                                type="url" 
                                value={item.link || ''} 
                                placeholder="https://..."
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].link = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="studio-input"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-[var(--faint)]">Description</label>
                                <textarea 
                                value={item.description} 
                                onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[index].description = e.target.value;
                                    onChange({ ...content, items: newItems });
                                }}
                                className="studio-input"
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
