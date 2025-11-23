'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, User, Globe, Palette, Upload, FileText, Search } from 'lucide-react';

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
    background_pattern: 'dots'
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
    const formData = new FormData();
    formData.append('file', file);

    try {
        setUploadingField(field);
        
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Upload failed');
        }
        
        const data = await res.json();
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
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      
      {/* Brand Identity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Globe size={18} className="text-blue-600" />
            <h3 className="font-semibold text-slate-900">Brand Identity</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Logo Text</label>
                <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    value={settings.logo_text}
                    onChange={e => setSettings({...settings, logo_text: e.target.value})}
                    placeholder="e.g. SUZARIL"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Highlight (Accent)</label>
                <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    value={settings.logo_highlight}
                    onChange={e => setSettings({...settings, logo_highlight: e.target.value})}
                    placeholder="e.g. SHAH"
                />
            </div>
            <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Logo Image <span className="text-xs font-normal text-slate-400">(Optional, overrides text)</span>
                </label>
                <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                        <input 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                            value={settings.logo_url || ''}
                            onChange={e => setSettings({...settings, logo_url: e.target.value})}
                            placeholder="https://..."
                        />
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                <Upload size={14} />
                                {uploadingField === 'logo_url' ? 'Uploading...' : 'Upload Logo'}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} disabled={uploadingField === 'logo_url'} />
                            </label>
                            <span className="text-xs text-slate-400">Supports PNG, JPG, SVG</span>
                        </div>
                    </div>
                    {settings.logo_url && (
                        <div className="w-16 h-16 rounded bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-2">
                            <img src={settings.logo_url} alt="Logo Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Visual Assets */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <ImageIcon size={18} className="text-purple-600" />
            <h3 className="font-semibold text-slate-900">Visual Assets</h3>
        </div>
        <div className="p-6 space-y-6">
             {/* Profile Photo */}
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <User size={16} /> Profile Photo
                    </label>
                    <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                        value={settings.profile_photo_url || ''}
                        onChange={e => setSettings({...settings, profile_photo_url: e.target.value})}
                        placeholder="https://..."
                    />
                    <div className="flex items-center gap-2 pt-1">
                        <label className="cursor-pointer bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                            <Upload size={14} />
                            {uploadingField === 'profile_photo_url' ? 'Uploading...' : 'Upload Photo'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile_photo_url')} disabled={uploadingField === 'profile_photo_url'} />
                        </label>
                        <p className="text-xs text-slate-500">Used in the Hero section and About cards.</p>
                    </div>
                </div>
                <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                    {settings.profile_photo_url ? (
                        <img src={settings.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={32} className="text-slate-300" />
                    )}
                </div>
             </div>

             {/* Favicon */}
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start border-t border-slate-100 pt-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Favicon</label>
                    <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                        value={settings.favicon_url || ''}
                        onChange={e => setSettings({...settings, favicon_url: e.target.value})}
                        placeholder="https://..."
                    />
                    <div className="flex items-center gap-2 pt-1">
                        <label className="cursor-pointer bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                            <Upload size={14} />
                            {uploadingField === 'favicon_url' ? 'Uploading...' : 'Upload Favicon'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon_url')} disabled={uploadingField === 'favicon_url'} />
                        </label>
                        <p className="text-xs text-slate-500">Recommended 32x32px or 64x64px.</p>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {settings.favicon_url ? (
                        <img src={settings.favicon_url} alt="Favicon" className="w-full h-full object-contain" />
                    ) : (
                        <Globe size={20} className="text-slate-300" />
                    )}
                </div>
             </div>
        </div>
      </div>

      {/* Documents & Resume */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <FileText size={18} className="text-orange-600" />
            <h3 className="font-semibold text-slate-900">Documents</h3>
        </div>
        <div className="p-6 space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Resume / CV
                </label>
                <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                        <input 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-mono text-slate-600"
                            value={settings.resume_url || ''}
                            onChange={e => setSettings({...settings, resume_url: e.target.value})}
                            placeholder="https://..."
                        />
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                <Upload size={14} />
                                {uploadingField === 'resume_url' ? 'Uploading...' : 'Upload Resume'}
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resume_url')} disabled={uploadingField === 'resume_url'} />
                            </label>
                            <span className="text-xs text-slate-400">PDF, DOC, DOCX</span>
                        </div>
                    </div>
                    {settings.resume_url && (
                        <a 
                            href={settings.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="h-10 px-4 rounded bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-medium text-sm hover:bg-orange-100 transition-colors"
                        >
                            View PDF
                        </a>
                    )}
                </div>
             </div>
        </div>
      </div>

      {/* Search Engine Optimization (SEO) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Search size={18} className="text-green-600" />
            <h3 className="font-semibold text-slate-900">Search Engine Optimization (SEO)</h3>
        </div>
        <div className="p-6 space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Site Title Template</label>
                <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    value={settings.seo_title || ''}
                    onChange={e => setSettings({...settings, seo_title: e.target.value})}
                    placeholder="e.g. Suzaril Shah | AI & Cloud Architect"
                />
                <p className="text-xs text-slate-500">Used as the default window title.</p>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Meta Description</label>
                <textarea 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all h-24 resize-none"
                    value={settings.seo_description || ''}
                    onChange={e => setSettings({...settings, seo_description: e.target.value})}
                    placeholder="Brief summary of your portfolio for search results (150-160 chars recommended)..."
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Keywords</label>
                <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    value={settings.seo_keywords || ''}
                    onChange={e => setSettings({...settings, seo_keywords: e.target.value})}
                    placeholder="e.g. Cloud, Azure, DevOps, AI, Portfolio"
                />
                <p className="text-xs text-slate-500">Comma-separated list of topics.</p>
             </div>
             
             {/* OG Image */}
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start border-t border-slate-100 pt-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Social Share Image (OG Image)</label>
                    <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                        value={settings.seo_og_image || ''}
                        onChange={e => setSettings({...settings, seo_og_image: e.target.value})}
                        placeholder="https://..."
                    />
                    <div className="flex items-center gap-2 pt-1">
                        <label className="cursor-pointer bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                            <Upload size={14} />
                            {uploadingField === 'seo_og_image' ? 'Uploading...' : 'Upload Image'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'seo_og_image')} disabled={uploadingField === 'seo_og_image'} />
                        </label>
                        <p className="text-xs text-slate-500">Recommended 1200x630px for Facebook/LinkedIn/Twitter cards.</p>
                    </div>
                </div>
                <div className="w-32 h-[67px] rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {settings.seo_og_image ? (
                        <img src={settings.seo_og_image} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={24} className="text-slate-300" />
                    )}
                </div>
             </div>
        </div>
      </div>

      {/* Design System */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Palette size={18} className="text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Design System</h3>
        </div>
        <div className="p-6 space-y-8">
            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Primary Accent Color</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[
                        { value: 'primary', label: 'Executive Blue', color: 'bg-blue-600' },
                        { value: 'indigo', label: 'Deep Indigo', color: 'bg-indigo-600' },
                        { value: 'violet', label: 'Creative Violet', color: 'bg-violet-600' },
                        { value: 'emerald', label: 'Tech Emerald', color: 'bg-emerald-600' },
                        { value: 'slate', label: 'Minimal Slate', color: 'bg-slate-600' },
                        { value: 'orange', label: 'Energetic Orange', color: 'bg-orange-500' },
                        { value: 'cyan', label: 'Modern Cyan', color: 'bg-cyan-500' },
                        { value: 'rose', label: 'Passionate Rose', color: 'bg-rose-500' },
                        { value: 'teal', label: 'Calm Teal', color: 'bg-teal-500' },
                        { value: 'amber', label: 'Warm Amber', color: 'bg-amber-500' },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setSettings({...settings, accent_color: option.value})}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${settings.accent_color === option.value ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            <div className={`w-6 h-6 rounded-full ${option.color} shadow-sm`} />
                            <span className="text-xs font-medium text-slate-700">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-6">
                <label className="block text-sm font-medium text-slate-700">Background Pattern</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { value: 'dots', label: 'Subtle Dots', preview: 'radial-gradient(#cbd5e1 1px, transparent 1px)' },
                        { value: 'grid', label: 'Modern Grid', preview: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)' },
                        { value: 'graph', label: 'Graph Paper', preview: 'linear-gradient(transparent 95%, #e2e8f0 95%), linear-gradient(90deg, transparent 95%, #e2e8f0 95%)' },
                        { value: 'polka', label: 'Polka Dots', preview: 'radial-gradient(#94a3b8 2px, transparent 2px)' },
                        { value: 'diagonal', label: 'Diagonal Lines', preview: 'repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 10px, #f8fafc 10px, #f8fafc 20px)' },
                        { value: 'none', label: 'Clean White', preview: 'none' },
                    ].map((pattern) => (
                        <button
                            key={pattern.value}
                            type="button"
                            onClick={() => setSettings({...settings, background_pattern: pattern.value})}
                            className={`relative h-24 rounded-lg border overflow-hidden transition-all group ${settings.background_pattern === pattern.value ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div 
                                className="absolute inset-0 opacity-50" 
                                style={{ 
                                    backgroundImage: pattern.preview !== 'none' ? pattern.preview : 'none',
                                    backgroundSize: pattern.value === 'dots' ? '20px 20px' : 
                                                   pattern.value === 'grid' ? '20px 20px' :
                                                   pattern.value === 'graph' ? '10px 10px' :
                                                   pattern.value === 'polka' ? '30px 30px' : 'auto',
                                    backgroundColor: '#f8fafc'
                                }} 
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 border-t border-slate-100 text-xs font-medium text-slate-700 text-center">
                                {pattern.label}
                            </div>
                            {settings.background_pattern === pattern.value && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-slate-900/20 transition-all"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving Configuration...' : 'Save Global Settings'}
          </button>
      </div>
    </form>
  );
}
