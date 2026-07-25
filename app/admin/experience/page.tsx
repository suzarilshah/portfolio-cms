'use client';

import { useState, useEffect } from 'react';
import SectionEditor from '../components/SectionEditor';
import {
  Plus, Trash2, GripVertical, ChevronUp, ChevronDown, X,
  Briefcase, Target, Users, TrendingUp, Layers, Code, Award,
  Eye, EyeOff, Type, RotateCcw
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
  type: 'work' | 'project_management';
  team_size?: string;
  budget?: string;
  methodologies?: string[];
  tools?: string[];
  key_achievements?: string[];
}

// Tag Input Component with proper state management
function TagInput({
  tags,
  onChange,
  placeholder = "Type a tag and press Enter..."
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedTags = pastedText.split(',').map(t => t.trim()).filter(Boolean);
    const newTags = [...tags];
    pastedTags.forEach(tag => {
      if (!newTags.includes(tag)) {
        newTags.push(tag);
      }
    });
    onChange(newTags);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full group"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onPaste={handlePaste}
        placeholder={tags.length === 0 ? placeholder : "Add another..."}
        className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
      />
    </div>
  );
}

interface ExperienceContent {
  title: string;
  subtitle: string;
  typing_phrases: string[];
  curved_text: string;
  curved_text_repeat: number;
  work_experience: Job[];
  project_management: Job[];
  show_typing_effect: boolean;
  show_curved_text: boolean;
  show_parallax_background: boolean;
  jobs?: Job[]; // Legacy support
}

const defaultExperience: ExperienceContent = {
  title: "Experience",
  subtitle: "A track record of engineering excellence and leadership in high-stakes environments.",
  typing_phrases: [
    "Engineering Excellence",
    "Project Leadership",
    "System Architecture",
    "Cloud Innovation",
    "Digital Transformation"
  ],
  curved_text: "SHAH",
  curved_text_repeat: 3,
  show_typing_effect: true,
  show_curved_text: true,
  show_parallax_background: true,
  work_experience: [
    {
      company: 'Swift',
      role: 'Senior IT Systems & Customer Engineer',
      period: '2025 – Present',
      location: 'Kuala Lumpur, Malaysia',
      description: 'Leading the strategic architecture of enterprise IT systems.',
      tags: ['System Architecture', 'Enterprise Cloud', 'Strategic Leadership'],
      type: 'work'
    }
  ],
  project_management: [
    {
      company: 'Example Company',
      role: 'Project Manager',
      period: '2024 – Present',
      location: 'Remote',
      description: 'Leading cross-functional teams to deliver strategic initiatives.',
      tags: ['Agile', 'Scrum', 'Leadership'],
      type: 'project_management',
      team_size: '10-15',
      budget: '$500K+',
      methodologies: ['Agile', 'Scrum'],
      tools: ['Jira', 'Confluence'],
      key_achievements: ['On-time delivery', 'Budget adherence']
    }
  ]
};

// Work Experience Card Editor
function WorkJobCard({ job, index, jobs, onChange, dragHandleProps }: {
  job: Job;
  index: number;
  jobs: Job[];
  onChange: (jobs: Job[]) => void;
  dragHandleProps?: any;
}) {
  const moveJob = (direction: 'up' | 'down') => {
    const newJobs = [...jobs];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newJobs.length) return;
    [newJobs[index], newJobs[newIndex]] = [newJobs[newIndex], newJobs[index]];
    onChange(newJobs);
  };

  const updateJob = (field: keyof Job, value: any) => {
    const newJobs = [...jobs];
    newJobs[index] = { ...newJobs[index], [field]: value };
    onChange(newJobs);
  };

  const deleteJob = () => {
    onChange(jobs.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative group hover:border-blue-200 transition-colors">
      {/* Controls */}
      <div className="absolute top-4 left-4 flex flex-col items-center gap-1">
        <div
          {...dragHandleProps}
          className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-100 rounded transition-colors"
        >
          <GripVertical size={18} />
        </div>
        <div className="flex flex-col gap-0.5">
          <button onClick={() => moveJob('up')} disabled={index === 0} className="text-slate-300 hover:text-blue-500 disabled:opacity-30 p-0.5 hover:bg-blue-50 rounded transition-colors">
            <ChevronUp size={14} />
          </button>
          <button onClick={() => moveJob('down')} disabled={index === jobs.length - 1} className="text-slate-300 hover:text-blue-500 disabled:opacity-30 p-0.5 hover:bg-blue-50 rounded transition-colors">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <button onClick={deleteJob} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded">
        <Trash2 size={18} />
      </button>

      <div className="absolute top-4 left-16 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
        <Briefcase size={10} />
        #{index + 1}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14 pr-8 pt-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Company</label>
            <input type="text" value={job.company} onChange={(e) => updateJob('company', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Role</label>
            <input type="text" value={job.role} onChange={(e) => updateJob('role', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Period</label>
              <input type="text" value={job.period} onChange={(e) => updateJob('period', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-mono" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Location</label>
              <input type="text" value={job.location} onChange={(e) => updateJob('location', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Description</label>
            <textarea value={job.description} onChange={(e) => updateJob('description', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm h-32 resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Tags</label>
            <TagInput tags={job.tags || []} onChange={(tags) => updateJob('tags', tags)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// PM Experience Card Editor - with extra fields
function PMJobCard({ job, index, jobs, onChange, dragHandleProps }: {
  job: Job;
  index: number;
  jobs: Job[];
  onChange: (jobs: Job[]) => void;
  dragHandleProps?: any;
}) {
  const moveJob = (direction: 'up' | 'down') => {
    const newJobs = [...jobs];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newJobs.length) return;
    [newJobs[index], newJobs[newIndex]] = [newJobs[newIndex], newJobs[index]];
    onChange(newJobs);
  };

  const updateJob = (field: keyof Job, value: any) => {
    const newJobs = [...jobs];
    newJobs[index] = { ...newJobs[index], [field]: value };
    onChange(newJobs);
  };

  const deleteJob = () => {
    onChange(jobs.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6 shadow-sm relative group hover:border-purple-300 transition-colors">
      {/* Controls */}
      <div className="absolute top-4 left-4 flex flex-col items-center gap-1">
        <div {...dragHandleProps} className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-100 rounded transition-colors">
          <GripVertical size={18} />
        </div>
        <div className="flex flex-col gap-0.5">
          <button onClick={() => moveJob('up')} disabled={index === 0} className="text-slate-300 hover:text-purple-500 disabled:opacity-30 p-0.5 hover:bg-purple-50 rounded transition-colors">
            <ChevronUp size={14} />
          </button>
          <button onClick={() => moveJob('down')} disabled={index === jobs.length - 1} className="text-slate-300 hover:text-purple-500 disabled:opacity-30 p-0.5 hover:bg-purple-50 rounded transition-colors">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <button onClick={deleteJob} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded">
        <Trash2 size={18} />
      </button>

      <div className="absolute top-4 left-16 bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
        <Target size={10} />
        PM #{index + 1}
      </div>

      <div className="pl-14 pr-8 pt-4 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Company / Organization</label>
            <input type="text" value={job.company} onChange={(e) => updateJob('company', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Role / Title</label>
            <input type="text" value={job.role} onChange={(e) => updateJob('role', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Period</label>
            <input type="text" value={job.period} onChange={(e) => updateJob('period', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm font-mono" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Location</label>
            <input type="text" value={job.location} onChange={(e) => updateJob('location', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Description</label>
          <textarea value={job.description} onChange={(e) => updateJob('description', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm h-24 resize-none" />
        </div>

        {/* PM-Specific Fields */}
        <div className="bg-white rounded-lg p-4 border border-slate-100">
          <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Layers size={14} className="text-purple-500" />
            Project Management Details
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Users size={10} /> Team Size
              </label>
              <input type="text" value={job.team_size || ''} onChange={(e) => updateJob('team_size', e.target.value)} placeholder="e.g. 10-15" className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <TrendingUp size={10} /> Budget
              </label>
              <input type="text" value={job.budget || ''} onChange={(e) => updateJob('budget', e.target.value)} placeholder="e.g. $500K+" className="w-full p-2 border border-slate-200 rounded-md focus:border-purple-500 outline-none text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Layers size={10} /> Methodologies
              </label>
              <TagInput tags={job.methodologies || []} onChange={(tags) => updateJob('methodologies', tags)} placeholder="Agile, Scrum, Waterfall..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Code size={10} /> Tools Used
              </label>
              <TagInput tags={job.tools || []} onChange={(tags) => updateJob('tools', tags)} placeholder="Jira, Confluence, MS Project..." />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Award size={10} /> Key Achievements
            </label>
            <TagInput tags={job.key_achievements || []} onChange={(tags) => updateJob('key_achievements', tags)} placeholder="On-time delivery, Under budget..." />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Display Tags</label>
          <TagInput tags={job.tags || []} onChange={(tags) => updateJob('tags', tags)} />
        </div>
      </div>
    </div>
  );
}

// Tab Button
function TabButton({ active, onClick, icon: Icon, label, count, color = 'blue' }: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count: number;
  color?: 'blue' | 'purple';
}) {
  const colors = {
    blue: active ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300',
    purple: active ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all border ${colors[color]}`}
    >
      <Icon size={16} />
      <span>{label}</span>
      <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
        {count}
      </span>
    </button>
  );
}

export default function ExperiencePage() {
  const [activeTab, setActiveTab] = useState<'work' | 'pm'>('work');

  return (
    <SectionEditor<ExperienceContent>
      sectionKey="experience"
      title="Experience Section"
      description="Manage your career timeline with separate Work Experience and Project Management tracks."
      defaultContent={defaultExperience}
      renderForm={(content, onChange) => {
        // Ensure content has the new structure
        const normalizedContent: ExperienceContent = {
          ...defaultExperience,
          ...content,
          work_experience: content.work_experience || content.jobs || defaultExperience.work_experience,
          project_management: content.project_management || defaultExperience.project_management,
          typing_phrases: content.typing_phrases || defaultExperience.typing_phrases,
        };

        const handleWorkDragEnd = (result: any) => {
          if (!result.destination) return;
          const items = Array.from(normalizedContent.work_experience);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          onChange({ ...normalizedContent, work_experience: items });
        };

        const handlePMDragEnd = (result: any) => {
          if (!result.destination) return;
          const items = Array.from(normalizedContent.project_management);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          onChange({ ...normalizedContent, project_management: items });
        };

        return (
          <div className="space-y-8">
            {/* Section Settings */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Type size={18} />
                Section Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Section Title</label>
                  <input
                    type="text"
                    value={normalizedContent.title}
                    onChange={(e) => onChange({ ...normalizedContent, title: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Subtitle</label>
                  <input
                    type="text"
                    value={normalizedContent.subtitle}
                    onChange={(e) => onChange({ ...normalizedContent, subtitle: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              </div>

              {/* Visual Effects Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={normalizedContent.show_typing_effect}
                    onChange={(e) => onChange({ ...normalizedContent, show_typing_effect: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    {normalizedContent.show_typing_effect ? <Eye size={14} /> : <EyeOff size={14} />}
                    Typing Effect
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={normalizedContent.show_curved_text}
                    onChange={(e) => onChange({ ...normalizedContent, show_curved_text: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    {normalizedContent.show_curved_text ? <Eye size={14} /> : <EyeOff size={14} />}
                    Curved Text
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={normalizedContent.show_parallax_background}
                    onChange={(e) => onChange({ ...normalizedContent, show_parallax_background: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    {normalizedContent.show_parallax_background ? <Eye size={14} /> : <EyeOff size={14} />}
                    Parallax Background
                  </span>
                </label>
              </div>
            </div>

            {/* Typing Phrases */}
            {normalizedContent.show_typing_effect && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Type size={18} className="text-blue-600" />
                  Typing Effect Phrases
                </h3>
                <TagInput
                  tags={normalizedContent.typing_phrases}
                  onChange={(phrases) => onChange({ ...normalizedContent, typing_phrases: phrases })}
                  placeholder="Add phrases that will be typed out..."
                />
                <p className="text-xs text-slate-500">These phrases will cycle with a typing animation effect.</p>
              </div>
            )}

            {/* Curved Text Settings */}
            {normalizedContent.show_curved_text && (
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <RotateCcw size={18} className="text-purple-600" />
                  Curved Scroll Text
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Text</label>
                    <input
                      type="text"
                      value={normalizedContent.curved_text}
                      onChange={(e) => onChange({ ...normalizedContent, curved_text: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Repeat Count</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={normalizedContent.curved_text_repeat}
                      onChange={(e) => onChange({ ...normalizedContent, curved_text_repeat: parseInt(e.target.value) || 3 })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none bg-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">Preview: {Array(normalizedContent.curved_text_repeat).fill(normalizedContent.curved_text).join('')}</p>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-slate-200 pb-4">
              <TabButton
                active={activeTab === 'work'}
                onClick={() => setActiveTab('work')}
                icon={Briefcase}
                label="Work Experience"
                count={normalizedContent.work_experience.length}
                color="blue"
              />
              <TabButton
                active={activeTab === 'pm'}
                onClick={() => setActiveTab('pm')}
                icon={Target}
                label="Project Management"
                count={normalizedContent.project_management.length}
                color="purple"
              />
            </div>

            {/* Work Experience Tab */}
            {activeTab === 'work' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
                    <p className="text-xs text-slate-500">Engineering, development, and technical roles</p>
                  </div>
                  <button
                    onClick={() => onChange({
                      ...normalizedContent,
                      work_experience: [
                        { company: 'New Company', role: 'New Role', period: '2025', location: 'Remote', description: '', tags: [], type: 'work' },
                        ...normalizedContent.work_experience
                      ]
                    })}
                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Work Role
                  </button>
                </div>

                <DragDropContext onDragEnd={handleWorkDragEnd}>
                  <Droppable droppableId="work-list">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {normalizedContent.work_experience.map((job, index) => (
                          <Draggable key={`work-${index}`} draggableId={`work-${index}`} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-200' : ''}
                              >
                                <WorkJobCard
                                  job={job}
                                  index={index}
                                  jobs={normalizedContent.work_experience}
                                  onChange={(jobs) => onChange({ ...normalizedContent, work_experience: jobs })}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}

            {/* Project Management Tab */}
            {activeTab === 'pm' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Project Management Experience</h3>
                    <p className="text-xs text-slate-500">PM, leadership, and delivery roles with detailed metrics</p>
                  </div>
                  <button
                    onClick={() => onChange({
                      ...normalizedContent,
                      project_management: [
                        {
                          company: 'New Organization', role: 'Project Manager', period: '2025', location: 'Remote',
                          description: '', tags: [], type: 'project_management',
                          team_size: '', budget: '', methodologies: [], tools: [], key_achievements: []
                        },
                        ...normalizedContent.project_management
                      ]
                    })}
                    className="text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} /> Add PM Role
                  </button>
                </div>

                <DragDropContext onDragEnd={handlePMDragEnd}>
                  <Droppable droppableId="pm-list">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {normalizedContent.project_management.map((job, index) => (
                          <Draggable key={`pm-${index}`} draggableId={`pm-${index}`} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={snapshot.isDragging ? 'shadow-xl ring-2 ring-purple-200' : ''}
                              >
                                <PMJobCard
                                  job={job}
                                  index={index}
                                  jobs={normalizedContent.project_management}
                                  onChange={(jobs) => onChange({ ...normalizedContent, project_management: jobs })}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {normalizedContent.project_management.length === 0 && (
                  <div className="text-center py-12 bg-purple-50 rounded-xl border-2 border-dashed border-purple-200">
                    <Target size={40} className="mx-auto text-purple-300 mb-3" />
                    <p className="text-slate-600 font-medium">No project management experience added yet</p>
                    <p className="text-sm text-slate-500 mt-1">Click "Add PM Role" to get started</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
