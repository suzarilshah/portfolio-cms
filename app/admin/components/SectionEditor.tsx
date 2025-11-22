'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle, CheckCircle2, History, RotateCcw, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionEditorProps<T> {
  sectionKey: string;
  title: string;
  description: string;
  defaultContent: T;
  renderForm: (content: T, onChange: (newContent: T) => void) => React.ReactNode;
}

export default function SectionEditor<T>({ 
  sectionKey, 
  title, 
  description, 
  defaultContent,
  renderForm 
}: SectionEditorProps<T>) {
  const [content, setContent] = useState<T>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // History State
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<{ id: number, created_at: string }[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/cms/sections?key=${sectionKey}`)
      .then(res => res.json())
      .then(data => {
        const fetchedContent = data.content || {};
        setContent({ ...defaultContent, ...fetchedContent });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setFeedback({ type: 'error', message: 'Failed to load content.' });
      });
  }, [sectionKey]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
        await fetch('/api/cms/sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section_key: sectionKey, content: content })
        });
        
        setFeedback({ type: 'success', message: 'Changes published successfully.' });
        setTimeout(() => setFeedback(null), 3000);
        
        // Refresh history if open
        if (showHistory) loadHistory();
    } catch (e) {
        setFeedback({ type: 'error', message: 'Failed to save. Please try again.' });
    }
    setSaving(false);
  };

  const loadHistory = async () => {
      setLoadingHistory(true);
      try {
          const res = await fetch(`/api/cms/history?key=${sectionKey}`);
          const data = await res.json();
          if (Array.isArray(data)) {
              setHistoryItems(data);
          }
      } catch (e) {
          console.error(e);
      }
      setLoadingHistory(false);
  };

  const handleRestore = async (id: number) => {
      if (!confirm('Are you sure you want to restore this version? Any unsaved changes will be lost.')) return;
      
      try {
          const res = await fetch(`/api/cms/history?id=${id}`);
          const data = await res.json();
          if (data.content) {
              // Merge with default to ensure schema
              setContent({ ...defaultContent, ...data.content });
              setShowHistory(false);
              setFeedback({ type: 'success', message: 'Version restored. Click Publish to save changes live.' });
          }
      } catch (e) {
          alert('Failed to restore version.');
      }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-2">{description}</p>
        </div>
        
        <div className="flex gap-3">
            <button
                onClick={() => {
                    setShowHistory(!showHistory);
                    if (!showHistory) loadHistory();
                }}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 border ${showHistory ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                <History size={18} />
                History
            </button>
            
            <button 
                onClick={handleSave}
                disabled={saving || loading}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
            >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Publishing...' : 'Publish Changes'}
            </button>
        </div>
      </div>

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

      <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-start relative">
        {/* Main Editor */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] relative z-10">
            {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="animate-spin text-slate-400" />
                <p className="text-slate-500 font-medium">Loading content...</p>
                </div>
            </div>
            )}

            <div className="p-8">
            {renderForm(content, setContent)}
            </div>
        </div>

        {/* History Sidebar */}
        <AnimatePresence>
            {showHistory && (
                <motion.div
                    initial={{ opacity: 0, width: 0, x: 20 }}
                    animate={{ opacity: 1, width: 320, x: 0 }}
                    exit={{ opacity: 0, width: 0, x: 20 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[600px] sticky top-6"
                >
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <History size={16} /> Version History
                        </h3>
                        <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {loadingHistory ? (
                            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                                <Loader2 size={20} className="animate-spin" />
                                <span className="text-xs">Loading history...</span>
                            </div>
                        ) : historyItems.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                No history available yet.
                            </div>
                        ) : (
                            historyItems.map((item, index) => (
                                <div key={item.id} className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                                            <Clock size={12} />
                                            {new Date(item.created_at).toLocaleDateString()} 
                                            <span className="text-slate-400">at</span>
                                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {index === 0 && (
                                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
                                                Latest
                                            </span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => handleRestore(item.id)}
                                        className="w-full mt-2 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:border-blue-200"
                                    >
                                        <RotateCcw size={12} /> Restore this version
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
