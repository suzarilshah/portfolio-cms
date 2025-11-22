'use client';

import SectionEditor from '../components/SectionEditor';

interface AboutContent {
  bio: string;
  skills: string[];
}

const defaultAbout: AboutContent = {
  bio: "I'm an Engineering Technologist with a passion for cloud architecture and community building.\n\nMy journey in tech is driven by a curiosity to understand how things work and a desire to make them work better for everyone.",
  skills: [
    'Azure Cloud', 'DevOps', 'Docker', 'Kubernetes', 'CI/CD',
    'Python', 'JavaScript/TypeScript', 'React', 'Next.js',
    'IoT Solutions', 'AI Integration', 'System Architecture'
  ]
};

export default function AboutPage() {
  return (
    <SectionEditor<AboutContent>
      sectionKey="about"
      title="About Section"
      description="Edit your bio and technical expertise. This is where you tell your story."
      defaultContent={defaultAbout}
      renderForm={(content, onChange) => (
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Biography</label>
            <p className="text-xs text-slate-500">Your professional story. Use new lines for paragraphs.</p>
            <textarea 
              value={content.bio} 
              onChange={(e) => onChange({ ...content, bio: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none h-48 resize-none text-base leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Technical Skills</label>
            <p className="text-xs text-slate-500">Comma-separated list of your top skills (e.g. React, Azure, Docker).</p>
            <textarea 
              value={content.skills?.join(', ') || ''} 
              onChange={(e) => onChange({ 
                ...content, 
                skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
              })}
              className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none h-32 resize-none font-mono text-sm"
              placeholder="React, Node.js, TypeScript..."
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {content.skills?.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                        {skill}
                    </span>
                ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
