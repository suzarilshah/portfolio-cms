'use client';

import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
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

export default function ExperiencePage() {
  return (
    <SectionEditor<ExperienceContent>
      sectionKey="experience"
      title="Experience Section"
      description="Manage your professional career timeline."
      defaultContent={defaultExperience}
      renderForm={(content, onChange) => (
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
              <h3 className="text-lg font-bold text-slate-900">Career History</h3>
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

            <div className="grid gap-6">
                {content.jobs?.map((job, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative group hover:border-blue-200 transition-colors">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
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
                                <label className="text-xs font-medium text-slate-500">Tags (comma separated)</label>
                                <input 
                                type="text" 
                                value={job.tags?.join(', ') || ''} 
                                onChange={(e) => {
                                    const newJobs = [...content.jobs];
                                    newJobs[index].tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                    onChange({ ...content, jobs: newJobs });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-sm font-mono text-blue-600"
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
