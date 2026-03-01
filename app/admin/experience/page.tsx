'use client';

import { useState, useEffect } from 'react';
import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
}

// Tag Input Component with proper state management
function TagInput({
  tags,
  onChange
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
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
      // Remove last tag when backspace is pressed on empty input
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
        placeholder={tags.length === 0 ? "Type a tag and press Enter or comma..." : "Add another tag..."}
        className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
      />
      <p className="text-[10px] text-slate-400">Press Enter or comma to add a tag. Backspace to remove.</p>
    </div>
  );
}

interface ExperienceContent {
  title: string;
  subtitle: string;
  jobs: Job[];
}

const defaultExperience: ExperienceContent = {
  title: "Strategic",
  subtitle: "A track record of engineering excellence and leadership in high-stakes environments.",
  jobs: [
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
  ]
};

// Drag-and-drop job card component
function JobCard({ job, index, content, onChange, dragHandleProps }: {
  job: Job;
  index: number;
  content: ExperienceContent;
  onChange: (newContent: ExperienceContent) => void;
  dragHandleProps?: any;
}) {
  const moveJob = (direction: 'up' | 'down') => {
    const newJobs = [...content.jobs];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newJobs.length) return;
    [newJobs[index], newJobs[newIndex]] = [newJobs[newIndex], newJobs[index]];
    onChange({ ...content, jobs: newJobs });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative group hover:border-blue-200 transition-colors">
      {/* Drag handle and position controls */}
      <div className="absolute top-4 left-4 flex flex-col items-center gap-1">
        <div
          {...dragHandleProps}
          className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-100 rounded transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </div>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => moveJob('up')}
            disabled={index === 0}
            className="text-slate-300 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed p-0.5 hover:bg-blue-50 rounded transition-colors"
            title="Move up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={() => moveJob('down')}
            disabled={index === content.jobs.length - 1}
            className="text-slate-300 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed p-0.5 hover:bg-blue-50 rounded transition-colors"
            title="Move down"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => {
          const newJobs = [...content.jobs];
          newJobs.splice(index, 1);
          onChange({ ...content, jobs: newJobs });
        }}
        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
      >
        <Trash2 size={18} />
      </button>

      {/* Position badge */}
      <div className="absolute top-4 left-16 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full">
        #{index + 1}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14 pr-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Company</label>
            <input
              type="text"
              value={job.company}
              onChange={(e) => {
                const newJobs = [...content.jobs];
                newJobs[index].company = e.target.value;
                onChange({ ...content, jobs: newJobs });
              }}
              className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Role</label>
            <input
              type="text"
              value={job.role}
              onChange={(e) => {
                const newJobs = [...content.jobs];
                newJobs[index].role = e.target.value;
                onChange({ ...content, jobs: newJobs });
              }}
              className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Period</label>
              <input
                type="text"
                value={job.period}
                onChange={(e) => {
                  const newJobs = [...content.jobs];
                  newJobs[index].period = e.target.value;
                  onChange({ ...content, jobs: newJobs });
                }}
                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Location</label>
              <input
                type="text"
                value={job.location}
                onChange={(e) => {
                  const newJobs = [...content.jobs];
                  newJobs[index].location = e.target.value;
                  onChange({ ...content, jobs: newJobs });
                }}
                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Description</label>
            <textarea
              value={job.description}
              onChange={(e) => {
                const newJobs = [...content.jobs];
                newJobs[index].description = e.target.value;
                onChange({ ...content, jobs: newJobs });
              }}
              className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm h-32 resize-none leading-relaxed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Tags</label>
            <TagInput
              tags={job.tags || []}
              onChange={(newTags) => {
                const newJobs = [...content.jobs];
                newJobs[index] = { ...newJobs[index], tags: newTags };
                onChange({ ...content, jobs: newJobs });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <SectionEditor<ExperienceContent>
      sectionKey="experience"
      title="Experience Section"
      description="Manage your professional career timeline. Drag to reorder positions."
      defaultContent={defaultExperience}
      renderForm={(content, onChange) => {
        const handleDragEnd = (result: any) => {
          if (!result.destination) return;

          const jobs = Array.from(content.jobs || []);
          const [reorderedItem] = jobs.splice(result.source.index, 1);
          jobs.splice(result.destination.index, 0, reorderedItem);

          onChange({ ...content, jobs });
        };

        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Section Title (Prefix)</label>
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
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Career History</h3>
                  <p className="text-xs text-slate-500 mt-1">Drag the handle or use arrows to reorder positions</p>
                </div>
                <button
                  onClick={() => onChange({
                    ...content,
                    jobs: [
                      { company: 'New Company', role: 'New Role', period: '2025', location: 'Remote', description: '', tags: [] },
                      ...(content.jobs || [])
                    ]
                  })}
                  className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} /> Add Role
                </button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="jobs-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {content.jobs?.map((job, index) => (
                        <Draggable key={`job-${index}`} draggableId={`job-${index}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-shadow ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-200' : ''}`}
                            >
                              <JobCard
                                job={job}
                                index={index}
                                content={content}
                                onChange={onChange}
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
          </div>
        );
      }}
    />
  );
}
