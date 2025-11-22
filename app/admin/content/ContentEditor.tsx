'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Eye, Code, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroContent {
  name?: string;
  title1?: string;
  title2?: string;
  description?: string;
  primaryButton?: string;
  secondaryButton?: string;
}

interface AboutContent {
  bio?: string;
  skills?: string[];
  interests?: { title: string; icon: string; description: string }[];
}

export default function ContentEditor() {
  const [sectionKey, setSectionKey] = useState('hero');
  const [content, setContent] = useState<any>({}); // Parsed JSON object
  const [jsonString, setJsonString] = useState(''); // For raw editor
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Fetch content on section change
  useEffect(() => {
    setLoading(true);
    setFeedback(null);
    fetch(`/api/cms/sections?key=${sectionKey}`)
      .then(res => res.json())
      .then(data => {
        const fetchedContent = data.content || {};
        setContent(fetchedContent);
        setJsonString(JSON.stringify(fetchedContent, null, 2));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setFeedback({ type: 'error', message: 'Failed to load content.' });
      });
  }, [sectionKey]);

  // Sync Visual -> Code
  useEffect(() => {
    if (mode === 'visual') {
      setJsonString(JSON.stringify(content, null, 2));
    }
  }, [content, mode]);

  // Sync Code -> Visual (when switching back or saving from code mode)
  const handleModeSwitch = (newMode: 'visual' | 'code') => {
    if (newMode === 'visual') {
      try {
        const parsed = JSON.parse(jsonString);
        setContent(parsed);
        setFeedback(null);
        setMode('visual');
      } catch (e) {
        setFeedback({ type: 'error', message: 'Invalid JSON in Code Mode. Fix errors before switching.' });
        return;
      }
    } else {
      setMode('code');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
        const finalContent = mode === 'code' ? JSON.parse(jsonString) : content;
        
        await fetch('/api/cms/sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section_key: sectionKey, content: finalContent })
        });
        
        setContent(finalContent);
        setJsonString(JSON.stringify(finalContent, null, 2));
        setFeedback({ type: 'success', message: 'Changes published successfully.' });
        
        // Clear success message after 3s
        setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
        setFeedback({ type: 'error', message: 'Failed to save. Check your inputs.' });
    }
    setSaving(false);
  };

  // Visual Editors
  const renderHeroEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Display Name</label>
          <input 
            type="text" 
            value={content.name || ''} 
            onChange={(e) => setContent({ ...content, name: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            placeholder="e.g., Muhammad Suzaril Shah"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Role / Title 1</label>
          <input 
            type="text" 
            value={content.title1 || ''} 
            onChange={(e) => setContent({ ...content, title1: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            placeholder="e.g., Microsoft MVP"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Role / Title 2</label>
          <input 
            type="text" 
            value={content.title2 || ''} 
            onChange={(e) => setContent({ ...content, title2: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            placeholder="e.g., Docker Captain"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Main Description</label>
        <textarea 
          value={content.description || ''} 
          onChange={(e) => setContent({ ...content, description: e.target.value })}
          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none h-32 resize-none"
          placeholder="Brief professional bio..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Primary Button Text</label>
          <input 
            type="text" 
            value={content.primaryButton || ''} 
            onChange={(e) => setContent({ ...content, primaryButton: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Secondary Button Text</label>
          <input 
            type="text" 
            value={content.secondaryButton || ''} 
            onChange={(e) => setContent({ ...content, secondaryButton: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative">
              <select 
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-w-[200px]"
                  value={sectionKey}
                  onChange={(e) => setSectionKey(e.target.value)}
              >
                  <option value="hero">Hero Section</option>
                  <option value="about">About Section</option>
                  <option value="experience">Experience Section</option>
                  <option value="education">Education Section</option>
                  <option value="awards">Awards Section</option>
                  <option value="publications">Publications Section</option>
                  <option value="community">Community Section</option>
                  <option value="contact">Contact Section</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button 
                onClick={() => handleModeSwitch('visual')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'visual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Eye size={14} />
                  <span className="hidden sm:inline">Visual</span>
                </div>
              </button>
              <button 
                onClick={() => handleModeSwitch('code')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 <div className="flex items-center gap-2">
                  <Code size={14} />
                  <span className="hidden sm:inline">JSON</span>
                </div>
              </button>
            </div>
        </div>

        <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>
      
      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg border flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] relative">
        {loading && (
           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
             <div className="flex flex-col items-center gap-3">
               <Loader2 size={32} className="animate-spin text-slate-400" />
               <p className="text-slate-500 font-medium">Loading configuration...</p>
             </div>
           </div>
        )}

        <div className="p-6 md:p-8">
           {mode === 'visual' ? (
             sectionKey === 'hero' ? renderHeroEditor() : (
               <div className="text-center py-20">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                   <Code size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">No Visual Editor Available</h3>
                 <p className="text-slate-500 max-w-md mx-auto mb-6">
                   This section ({sectionKey}) does not yet have a specific visual form. 
                   Please use the JSON editor to make changes.
                 </p>
                 <button 
                   onClick={() => handleModeSwitch('code')}
                   className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                 >
                   Switch to JSON Editor
                 </button>
               </div>
             )
           ) : (
             <div className="relative h-full">
               <textarea
                   className="w-full h-[600px] font-mono text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-6 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none leading-relaxed"
                   value={jsonString}
                   onChange={(e) => setJsonString(e.target.value)}
                   spellCheck={false}
               />
               <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                   JSON MODE
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
