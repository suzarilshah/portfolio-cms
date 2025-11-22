'use client';

import SectionEditor from '../components/SectionEditor';
import { Mail, Calendar, Github, Linkedin, Twitter, Globe } from 'lucide-react';

interface ContactContent {
  bookingUrl: string;
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
}

const defaultContact: ContactContent = {
  bookingUrl: 'https://suzarilshah.youcanbook.me',
  email: 'shah@suzarilshah.uk',
  linkedin: 'https://linkedin.com/in/suzarilshah',
  github: 'https://github.com/suzarilshah',
  twitter: 'https://x.com/suzarilshah',
  website: 'https://blog.suzarilshah.uk/'
};

export default function ContactPage() {
  return (
    <SectionEditor<ContactContent>
      sectionKey="contact"
      title="Contact Section"
      description="Manage your contact information and social links."
      defaultContent={defaultContact}
      renderForm={(content, onChange) => (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Calendar size={16} /> Booking & Email
                </h3>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">Booking URL (YouCanBook.me)</label>
                    <input 
                        type="text" 
                        value={content.bookingUrl} 
                        onChange={(e) => onChange({ ...content, bookingUrl: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-500 outline-none text-blue-600 font-mono"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">Email Address</label>
                    <input 
                        type="email" 
                        value={content.email} 
                        onChange={(e) => onChange({ ...content, email: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Globe size={16} /> Social Profiles
                </h3>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-2"><Linkedin size={12} /> LinkedIn URL</label>
                    <input 
                        type="text" 
                        value={content.linkedin} 
                        onChange={(e) => onChange({ ...content, linkedin: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-500 outline-none font-mono"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-2"><Github size={12} /> GitHub URL</label>
                    <input 
                        type="text" 
                        value={content.github} 
                        onChange={(e) => onChange({ ...content, github: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-500 outline-none font-mono"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-2"><Twitter size={12} /> Twitter/X URL</label>
                    <input 
                        type="text" 
                        value={content.twitter} 
                        onChange={(e) => onChange({ ...content, twitter: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-500 outline-none font-mono"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-2"><Globe size={12} /> Website/Blog URL</label>
                    <input 
                        type="text" 
                        value={content.website} 
                        onChange={(e) => onChange({ ...content, website: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-md text-sm focus:border-blue-500 outline-none font-mono"
                    />
                </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
