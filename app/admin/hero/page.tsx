'use client';

import SectionEditor from '../components/SectionEditor';

interface HeroContent {
  headline: string;
  subheadline: string;
  description: string;
}

const defaultHero: HeroContent = {
  headline: "Architecting Intelligent Scale",
  subheadline: "Engineering Technologist • Microsoft MVP • Docker Captain",
  description: "I am Muhammad Suzaril Shah, a Senior IT Systems Engineer at Swift. I bridge the gap between complex cloud infrastructure and human impact, specializing in Azure, AI, and DevOps ecosystems."
};

export default function HeroPage() {
  return (
    <SectionEditor<HeroContent>
      sectionKey="hero"
      title="Hero Section"
      description="Manage the main introduction banner at the top of your portfolio. Make a strong first impression."
      defaultContent={defaultHero}
      renderForm={(content, onChange) => (
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Main Headline</label>
            <p className="text-xs text-slate-500">The large text that grabs attention.</p>
            <input 
              type="text" 
              value={content.headline} 
              onChange={(e) => onChange({ ...content, headline: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-display text-xl font-bold"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Subheadline (Roles)</label>
            <p className="text-xs text-slate-500">Your roles or titles, separated by dots or pipes.</p>
            <input 
              type="text" 
              value={content.subheadline} 
              onChange={(e) => onChange({ ...content, subheadline: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-mono text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Bio Description</label>
            <p className="text-xs text-slate-500">A short, impactful paragraph introducing yourself.</p>
            <textarea 
              value={content.description} 
              onChange={(e) => onChange({ ...content, description: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none h-32 resize-none text-base"
            />
          </div>
        </div>
      )}
    />
  );
}
