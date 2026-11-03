'use client';

import { useState, useEffect } from 'react';
import { uploadPortfolioFile } from '@/lib/upload-client';
import { Save, Loader2, Image as ImageIcon, User, Globe, Palette, Upload, FileText, Search, Grid3X3, Layers, Compass, Link2, Plus, Trash2 } from 'lucide-react';
import { Button, Field, Input, Label, Meta, TagInput, Textarea } from '../components/ui';

export interface SiteLink {
  label: string;
  href: string;
}

/**
 * Navigation, footer and identity.
 *
 * These were hardcoded in Navigation.tsx, Footer.tsx and StructuredData.tsx.
 * That is how a nav link to a deleted #blog section and two footer links
 * pointing at "#" survived on the live site: nothing in the CMS could see
 * them, so nothing in the CMS could fix them.
 */
function LinkListEditor({
  links,
  onChange,
  max,
  addLabel,
}: {
  links: SiteLink[];
  onChange: (next: SiteLink[]) => void;
  max: number;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {links.length === 0 && (
        <p className="rounded-[var(--r-field)] bg-[var(--sunken)] px-4 py-5 text-center text-[13px] text-[var(--muted)]">
          Nothing here yet.
        </p>
      )}
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={link.label}
            placeholder="Label"
            className="sm:w-[180px]"
            onChange={(e) =>
              onChange(links.map((l, i) => (i === index ? { ...l, label: e.target.value } : l)))
            }
          />
          <Input
            value={link.href}
            placeholder="#section or https://…"
            onChange={(e) =>
              onChange(links.map((l, i) => (i === index ? { ...l, href: e.target.value } : l)))
            }
          />
          <Button
            type="button"
            variant="ghost"
            aria-label={`Remove ${link.label || 'link'}`}
            onClick={() => onChange(links.filter((_, i) => i !== index))}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => onChange([...links, { label: '', href: '' }])}
        disabled={links.length >= max}
      >
        <Plus size={14} />
        {addLabel}
      </Button>
      <Meta>
        A link needs both a label and a destination to be saved. Anything else is dropped rather
        than published as a dead link.
      </Meta>
    </div>
  );
}

function SiteChromeFields({
  settings,
  setSettings,
}: {
  settings: any;
  setSettings: (next: any) => void;
}) {
  const identity = settings.identity ?? {};
  const footer = settings.footer ?? { tagline: '', note: '', links: [] };

  return (
    <>
      <div className="studio-card p-6 sm:p-7">
        <div className="mb-5 flex items-center gap-2">
          <Compass size={18} className="text-[var(--accent)]" />
          <h2 className="text-[15px] font-semibold">Navigation</h2>
        </div>
        <p className="mb-4 text-[13px] leading-relaxed text-[var(--muted)]">
          The links in the floating nav, in order. Up to eight.
        </p>
        <LinkListEditor
          links={settings.nav_items ?? []}
          max={8}
          addLabel="Add nav link"
          onChange={(nav_items) => setSettings({ ...settings, nav_items })}
        />
      </div>

      <div className="studio-card p-6 sm:p-7">
        <div className="mb-5 flex items-center gap-2">
          <Link2 size={18} className="text-[var(--accent)]" />
          <h2 className="text-[15px] font-semibold">Footer</h2>
        </div>
        <div className="space-y-5">
          <Field label="Tagline">
            <Input
              value={footer.tagline || ''}
              onChange={(e) =>
                setSettings({ ...settings, footer: { ...footer, tagline: e.target.value } })
              }
            />
          </Field>
          <Field label="Small print" hint="Sits opposite the copyright line.">
            <Input
              value={footer.note || ''}
              onChange={(e) =>
                setSettings({ ...settings, footer: { ...footer, note: e.target.value } })
              }
            />
          </Field>
          <div>
            <Label>Footer links</Label>
            <div className="mt-2.5">
              <LinkListEditor
                links={footer.links ?? []}
                max={6}
                addLabel="Add footer link"
                onChange={(links) => setSettings({ ...settings, footer: { ...footer, links } })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="studio-card p-6 sm:p-7">
        <div className="mb-5 flex items-center gap-2">
          <User size={18} className="text-[var(--accent)]" />
          <h2 className="text-[15px] font-semibold">Identity</h2>
        </div>
        <p className="mb-5 text-[13px] leading-relaxed text-[var(--muted)]">
          What the page tells Google and LinkedIn about you, as JSON-LD. Your hero credentials are
          included automatically, so the two cannot disagree.
        </p>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name">
              <Input
                value={identity.name || ''}
                onChange={(e) =>
                  setSettings({ ...settings, identity: { ...identity, name: e.target.value } })
                }
              />
            </Field>
            <Field label="Job title">
              <Input
                value={identity.job_title || ''}
                onChange={(e) =>
                  setSettings({ ...settings, identity: { ...identity, job_title: e.target.value } })
                }
              />
            </Field>
            <Field label="Employer">
              <Input
                value={identity.employer || ''}
                onChange={(e) =>
                  setSettings({ ...settings, identity: { ...identity, employer: e.target.value } })
                }
              />
            </Field>
            <Field label="City">
              <Input
                value={identity.locality || ''}
                onChange={(e) =>
                  setSettings({ ...settings, identity: { ...identity, locality: e.target.value } })
                }
              />
            </Field>
          </div>
          <Field
            label="Profiles elsewhere"
            hint="Full https:// URLs. These are the sameAs links that tie your profiles together for search engines."
          >
            <TagInput
              values={identity.same_as ?? []}
              max={10}
              placeholder="https://linkedin.com/in/…"
              onChange={(same_as) => setSettings({ ...settings, identity: { ...identity, same_as } })}
            />
          </Field>
        </div>
      </div>
    </>
  );
}

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    logo_text: '',
    logo_highlight: '',
    logo_url: '',
    profile_photo_url: '',
    favicon_url: '',
    resume_url: '',
    accent_color: 'primary',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    seo_og_image: '',
    background_pattern: 'dots',
    // New background settings
    background_svg_color: 'blue',
    background_overlay_opacity: 50,
    background_grid_intensity: 14,
    // Chrome that used to be hardcoded in the page components.
    nav_items: [] as SiteLink[],
    footer: { tagline: '', note: '', links: [] as SiteLink[] },
    identity: {
      name: '',
      job_title: '',
      employer: '',
      locality: '',
      country: '',
      same_as: [] as string[],
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cms/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setSettings(prev => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings();
  };

  const saveSettings = async (payload?: any) => {
    try {
      setSaving(true);
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || settings)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];

    try {
        setUploadingField(field);
        
        const data = await uploadPortfolioFile(file);
        if (data.url) {
            const updated = { ...settings, [field]: data.url };
            setSettings(updated);
            // Auto-save immediately so changes persist to DB
            await saveSettings(updated);
        }
    } catch (error: any) {
        alert(`Upload failed: ${error.message}`);
        console.error(error);
    } finally {
        setUploadingField(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-[var(--faint)]">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      
      {/* Brand Identity */}
      <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--raised)] flex items-center gap-2">
            <Globe size={18} className="text-[var(--accent)]" />
            <h3 className="font-semibold text-[var(--text)]">Brand Identity</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--dim)]">Logo Text</label>
                <input 
                    type="text" 
                    className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all"
                    value={settings.logo_text}
                    onChange={e => setSettings({...settings, logo_text: e.target.value})}
                    placeholder="e.g. SUZARIL"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--dim)]">Highlight (Accent)</label>
                <input 
                    type="text" 
                    className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all"
                    value={settings.logo_highlight}
                    onChange={e => setSettings({...settings, logo_highlight: e.target.value})}
                    placeholder="e.g. SHAH"
                />
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-[var(--dim)] flex items-center gap-2">
                    Logo Image <span className="text-xs font-normal text-[var(--faint)]">(Optional, overrides text)</span>
                </label>
                <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                        <input 
                            type="text" 
                            className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all text-sm"
                            value={settings.logo_url || ''}
                            onChange={e => setSettings({...settings, logo_url: e.target.value})}
                            placeholder="https://..."
                        />
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-[var(--raised)] border border-[var(--line)] hover:bg-[var(--raised)] text-[var(--dim)] px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                <Upload size={14} />
                                {uploadingField === 'logo_url' ? 'Uploading...' : 'Upload Logo'}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} disabled={uploadingField === 'logo_url'} />
                            </label>
                            <span className="text-xs text-[var(--faint)]">Supports PNG, JPG, SVG</span>
                        </div>
                    </div>
                    {settings.logo_url && (
                        <div className="w-16 h-16 rounded bg-[var(--raised)] border border-[var(--line)] flex items-center justify-center overflow-hidden shrink-0 p-2">
                            <img src={settings.logo_url} alt="Logo Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Visual Assets */}
      <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--raised)] flex items-center gap-2">
            <ImageIcon size={18} className="text-[var(--accent)]" />
            <h3 className="font-semibold text-[var(--text)]">Visual Assets</h3>
        </div>
        <div className="p-6 space-y-6">
             {/* Profile Photo */}
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--dim)] flex items-center gap-2">
                        <User size={16} /> Profile Photo
                    </label>
                    <input 
                        type="text" 
                        className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all text-sm"
                        value={settings.profile_photo_url || ''}
                        onChange={e => setSettings({...settings, profile_photo_url: e.target.value})}
                        placeholder="https://..."
                    />
                    <div className="flex items-center gap-2 pt-1">
                        <label className="cursor-pointer bg-[var(--raised)] border border-[var(--line)] hover:bg-[var(--raised)] text-[var(--dim)] px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                            <Upload size={14} />
                            {uploadingField === 'profile_photo_url' ? 'Uploading...' : 'Upload Photo'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile_photo_url')} disabled={uploadingField === 'profile_photo_url'} />
                        </label>
                        <p className="text-xs text-[var(--faint)]">Used in the Hero section and About cards.</p>
                    </div>
                </div>
                <div className="w-24 h-24 rounded-full bg-[var(--raised)] border border-[var(--line)] flex items-center justify-center overflow-hidden shadow-inner">
                    {settings.profile_photo_url ? (
                        <img src={settings.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={32} className="text-[var(--faint)]" />
                    )}
                </div>
             </div>

             {/* Favicon */}
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start border-t border-[var(--line)] pt-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--dim)]">Favicon</label>
                    <input 
                        type="text" 
                        className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all text-sm"
                        value={settings.favicon_url || ''}
                        onChange={e => setSettings({...settings, favicon_url: e.target.value})}
                        placeholder="https://..."
                    />
                    <div className="flex items-center gap-2 pt-1">
                        <label className="cursor-pointer bg-[var(--raised)] border border-[var(--line)] hover:bg-[var(--raised)] text-[var(--dim)] px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                            <Upload size={14} />
                            {uploadingField === 'favicon_url' ? 'Uploading...' : 'Upload Favicon'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon_url')} disabled={uploadingField === 'favicon_url'} />
                        </label>
                        <p className="text-xs text-[var(--faint)]">Recommended 32x32px or 64x64px.</p>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-[4px] bg-[var(--raised)] border border-[var(--line)] flex items-center justify-center overflow-hidden">
                    {settings.favicon_url ? (
                        <img src={settings.favicon_url} alt="Favicon" className="w-full h-full object-contain" />
                    ) : (
                        <Globe size={20} className="text-[var(--faint)]" />
                    )}
                </div>
             </div>
        </div>
      </div>

      {/* Documents & Resume */}
      <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--raised)] flex items-center gap-2">
            <FileText size={18} className="text-[var(--warn)]" />
            <h3 className="font-semibold text-[var(--text)]">Documents</h3>
        </div>
        <div className="p-6 space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--dim)] flex items-center gap-2">
                    Resume / CV
                </label>
                <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                        <input 
                            type="text" 
                            className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all text-sm font-mono text-[var(--dim)]"
                            value={settings.resume_url || ''}
                            onChange={e => setSettings({...settings, resume_url: e.target.value})}
                            placeholder="https://..."
                        />
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-[var(--raised)] border border-[var(--line)] hover:bg-[var(--raised)] text-[var(--dim)] px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                <Upload size={14} />
                                {uploadingField === 'resume_url' ? 'Uploading...' : 'Upload Resume'}
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resume_url')} disabled={uploadingField === 'resume_url'} />
                            </label>
                            <span className="text-xs text-[var(--faint)]">PDF, DOC, DOCX</span>
                        </div>
                    </div>
                    {settings.resume_url && (
                        <a 
                            href={settings.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="h-10 px-4 rounded bg-[var(--raised)] text-[var(--warn)] border border-[var(--line)] flex items-center justify-center font-medium text-sm hover:bg-[var(--raised)] transition-colors"
                        >
                            View PDF
                        </a>
                    )}
                </div>
             </div>
        </div>
      </div>

      {/* Search Engine Optimization (SEO) */}
      <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--raised)] flex items-center gap-2">
            <Search size={18} className="text-[var(--ok)]" />
            <h3 className="font-semibold text-[var(--text)]">Search Engine Optimization (SEO)</h3>
        </div>
        <div className="p-6 space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--dim)]">Site Title Template</label>
                <input 
                    type="text" 
                    className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all"
                    value={settings.seo_title || ''}
                    onChange={e => setSettings({...settings, seo_title: e.target.value})}
                    placeholder="e.g. Suzaril Shah | AI & Cloud Architect"
                />
                <p className="text-xs text-[var(--faint)]">Used as the default window title.</p>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--dim)]">Meta Description</label>
                <textarea 
                    className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all h-24 resize-none"
                    value={settings.seo_description || ''}
                    onChange={e => setSettings({...settings, seo_description: e.target.value})}
                    placeholder="Brief summary of your portfolio for search results (150-160 chars recommended)..."
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--dim)]">Keywords</label>
                <input 
                    type="text" 
                    className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all"
                    value={settings.seo_keywords || ''}
                    onChange={e => setSettings({...settings, seo_keywords: e.target.value})}
                    placeholder="e.g. Cloud, Azure, DevOps, AI, Portfolio"
                />
                <p className="text-xs text-[var(--faint)]">Comma-separated list of topics.</p>
             </div>
             
             {/* OG Image */}
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start border-t border-[var(--line)] pt-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--dim)]">Social Share Image (OG Image)</label>
                    <input 
                        type="text" 
                        className="w-full border border-[var(--line)] rounded-[4px] px-3 py-2 outline-none transition-all text-sm"
                        value={settings.seo_og_image || ''}
                        onChange={e => setSettings({...settings, seo_og_image: e.target.value})}
                        placeholder="https://..."
                    />
                    <div className="flex items-center gap-2 pt-1">
                        <label className="cursor-pointer bg-[var(--raised)] border border-[var(--line)] hover:bg-[var(--raised)] text-[var(--dim)] px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                            <Upload size={14} />
                            {uploadingField === 'seo_og_image' ? 'Uploading...' : 'Upload Image'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'seo_og_image')} disabled={uploadingField === 'seo_og_image'} />
                        </label>
                        <p className="text-xs text-[var(--faint)]">Recommended 1200x630px for Facebook/LinkedIn/Twitter cards.</p>
                    </div>
                </div>
                <div className="w-32 h-[67px] rounded-[4px] bg-[var(--raised)] border border-[var(--line)] flex items-center justify-center overflow-hidden">
                    {settings.seo_og_image ? (
                        <img src={settings.seo_og_image} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={24} className="text-[var(--faint)]" />
                    )}
                </div>
             </div>
        </div>
      </div>

      {/* Design System */}
      <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--raised)] flex items-center gap-2">
            <Palette size={18} className="text-[var(--ok)]" />
            <h3 className="font-semibold text-[var(--text)]">Design System</h3>
        </div>
        <div className="p-6 space-y-8">
            <div className="space-y-3">
                <label className="block text-sm font-medium text-[var(--dim)]">Primary Accent Color</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[
                        { value: 'primary', label: 'Executive Blue', color: 'bg-[var(--accent)]' },
                        { value: 'indigo', label: 'Deep Indigo', color: 'bg-[var(--accent)]' },
                        { value: 'violet', label: 'Creative Violet', color: 'bg-[var(--accent)]' },
                        { value: 'emerald', label: 'Tech Emerald', color: 'bg-[var(--ok)]' },
                        { value: 'slate', label: 'Minimal Slate', color: 'bg-slate-600' },
                        { value: 'orange', label: 'Energetic Orange', color: 'bg-[var(--warn)]' },
                        { value: 'cyan', label: 'Modern Cyan', color: 'bg-[var(--accent)]' },
                        { value: 'rose', label: 'Passionate Rose', color: 'bg-[var(--danger)]' },
                        { value: 'teal', label: 'Calm Teal', color: 'bg-teal-500' },
                        { value: 'amber', label: 'Warm Amber', color: 'bg-transparent0' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setSettings({...settings, accent_color: option.value})}
                            className={`flex items-center gap-3 p-3 rounded-[4px] border transition-all ${settings.accent_color === option.value ? 'border-[var(--accent-line)]  bg-[var(--raised)]' : 'border-[var(--line)] hover:bg-[var(--raised)]'}`}
                        >
                            <div className={`w-6 h-6 rounded-full ${option.color} `} />
                            <span className="text-xs font-medium text-[var(--dim)]">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3 border-t border-[var(--line)] pt-6">
                <label className="block text-sm font-medium text-[var(--dim)]">Background Pattern</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { value: 'topography', label: 'Topography', preview: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` },
                        { value: 'circuit', label: 'Circuit Board', preview: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` },
                        { value: 'hexagons', label: 'Hexagons', preview: `url("data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10s-10 4.477-10 10v20c0 5.523 4.477 10 10 10z' fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")` },
                        { value: 'cubes', label: '3D Cubes', preview: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` },
                        { value: 'texture', label: 'Noise Texture', preview: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.2'/%3E%3C/svg%3E")` },
                        { value: 'dots', label: 'Minimal Dots', preview: 'radial-gradient(#94a3b8 2px, transparent 2px)' },
                        { value: 'none', label: 'Clean White', preview: 'none' },
                    ].map((pattern) => (
                        <button
                            key={pattern.value}
                            type="button"
                            onClick={() => setSettings({...settings, background_pattern: pattern.value})}
                            className={`relative h-24 rounded-[4px] border overflow-hidden transition-all group ${settings.background_pattern === pattern.value ? 'border-[var(--accent-line)] ' : 'border-[var(--line)] hover:border-[var(--line)]'}`}
                        >
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: pattern.preview !== 'none' ? pattern.preview : 'none',
                                    backgroundSize: pattern.value === 'dots' ? '24px 24px' : 'auto',
                                    backgroundColor: '#f8fafc'
                                }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-[var(--surface)] p-2 border-t border-[var(--line)] text-xs font-medium text-[var(--dim)] text-center">
                                {pattern.label}
                            </div>
                            {settings.background_pattern === pattern.value && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center text-white">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Background SVG Settings */}
      <div className="bg-[var(--surface)] rounded-[4px] border border-[var(--line)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--raised)] flex items-center gap-2">
            <Grid3X3 size={18} className="text-[var(--accent)]" />
            <h3 className="font-semibold text-[var(--text)]">Background Grid Effect</h3>
        </div>
        <div className="p-6 space-y-6">
            {/* SVG Grid Color */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-[var(--dim)]">Grid Pattern Color</label>
                <p className="text-xs text-[var(--faint)]">Choose the color for the animated grid background pattern.</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {[
                        { value: 'blue', label: 'Blue', hue: 210, color: 'bg-[var(--accent)]' },
                        { value: 'lime', label: 'Lime', hue: 75, color: 'bg-lime-400' },
                        { value: 'cyan', label: 'Cyan', hue: 180, color: 'bg-cyan-400' },
                        { value: 'purple', label: 'Purple', hue: 270, color: 'bg-[var(--accent)]' },
                        { value: 'rose', label: 'Rose', hue: 350, color: 'bg-[var(--danger)]' },
                        { value: 'emerald', label: 'Emerald', hue: 150, color: 'bg-[var(--ok)]' },
                        { value: 'orange', label: 'Orange', hue: 30, color: 'bg-[var(--warn)]' },
                        { value: 'amber', label: 'Amber', hue: 45, color: 'bg-amber-400' },
                        { value: 'indigo', label: 'Indigo', hue: 240, color: 'bg-[var(--accent)]' },
                        { value: 'teal', label: 'Teal', hue: 170, color: 'bg-teal-500' },
                        { value: 'pink', label: 'Pink', hue: 330, color: 'bg-pink-500' },
                        { value: 'slate', label: 'Slate', hue: 215, color: 'bg-[var(--raised)]0' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setSettings({...settings, background_svg_color: option.value})}
                            className={`flex flex-col items-center gap-2 p-3 rounded-[4px] border transition-all ${settings.background_svg_color === option.value ? 'border-[var(--accent-line)]  bg-[var(--raised)]' : 'border-[var(--line)] hover:bg-[var(--raised)]'}`}
                        >
                            <div className={`w-8 h-8 rounded-full ${option.color} `} />
                            <span className="text-xs font-medium text-[var(--dim)]">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid intensity. This replaced a "White Overlay Opacity"
                slider that drove a separate wash and could not quiet the
                grid at all — the grid's own opacity was hardcoded. */}
            <div className="space-y-3 border-t border-[var(--line)] pt-6">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-[var(--dim)]">Grid intensity</label>
                    <span className="text-sm font-mono text-[var(--faint)] bg-[var(--raised)] px-2 py-0.5 rounded">{settings.background_grid_intensity}</span>
                </div>
                <p className="text-xs text-[var(--faint)]">How present the background grid is. It stays a texture at every setting; the old background competed with your content, which is what this fixes.</p>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="2"
                    value={settings.background_grid_intensity}
                    onChange={(e) => setSettings({...settings, background_grid_intensity: parseInt(e.target.value)})}
                    className="w-full h-2 bg-[var(--raised)] rounded-[4px] appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-[var(--faint)]">
                    <span>Invisible</span>
                    <span>Present</span>
                </div>
            </div>
        </div>
      </div>

      <SiteChromeFields settings={settings} setSettings={setSettings} />

      <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[var(--accent)] text-[#06080b] px-8 py-3 rounded-[4px] font-medium hover:bg-[var(--accent)] flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving Configuration...' : 'Save Global Settings'}
          </button>
      </div>
    </form>
  );
}
