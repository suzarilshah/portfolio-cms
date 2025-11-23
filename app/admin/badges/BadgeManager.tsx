'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, GripVertical, Award, CheckCircle2, ExternalLink, Loader2, LayoutList, Grid3X3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';

interface Badge {
  id: number;
  badge_id: string;
  sort_order: number;
  title?: string;
  image_url?: string;
  issuer?: string;
}

export default function BadgeManager() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadgeId, setNewBadgeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [listView, setListView] = useState(true);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch('/api/cms/badges')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            setBadges(data);
            // Auto-refresh metadata (title/image) for badges missing image_url
            const missing = (data as Badge[]).filter(b => !b.image_url);
            missing.forEach(async (b) => {
              try {
                const res = await fetch('/api/cms/badges', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: b.id })
                });
                if (res.ok) {
                  const updated = await res.json();
                  setBadges(prev => prev.map(x => x.id === updated.id ? updated : x));
                }
              } catch {}
            });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Refresh Credly embeds whenever badges change
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.credly && window.credly.embed) {
        // @ts-ignore
        window.credly.embed.refresh();
      } else {
        // If script isn't loaded yet, it might load later via lazyOnload.
        // But if we navigated here, it might need a nudge if it was already loaded elsewhere?
        // Usually next/script handles this but for dynamic content, .refresh() is key.
      }
    }
  }, [badges]);

  const addBadge = async () => {
    if (!newBadgeId) return;
    setSaving(true);
    
    const res = await fetch('/api/cms/badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badge_id: newBadgeId, sort_order: badges.length + 1 })
    });
    
    if (res.ok) {
      const badge = await res.json();
      setBadges([...badges, badge]);
      setNewBadgeId('');
    }
    setSaving(false);
  };

  const deleteBadge = async (id: number) => {
    if (!confirm('Are you sure you want to remove this badge?')) return;
    
    const res = await fetch(`/api/cms/badges?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBadges(badges.filter(b => b.id !== id));
    }
  };

  const handleReorder = (newOrder: Badge[]) => {
    setBadges(newOrder);
  };
  
  // Debounced save for reordering
  useEffect(() => {
      const timer = setTimeout(() => {
          if (badges.length > 0) {
             const persist = async () => {
               try {
                 setSavingOrder(true);
                 const updates = badges.map((b, index) => ({ id: b.id, sort_order: index + 1 }));
                 await fetch('/api/cms/badges', {
                   method: 'PUT',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ badges: updates })
                 });
               } finally {
                 setSavingOrder(false);
               }
             };
             persist();
          }
      }, 600);
      return () => clearTimeout(timer);
  }, [badges]);

  return (
    <div className="space-y-8">
      <Script src="//cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
      
      {/* Hero / Add Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
            <Award size={200} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                    <Award size={24} />
                </div>
                <h2 className="text-2xl font-bold">Verified Credentials</h2>
            </div>
            
            <p className="text-slate-300 mb-8 text-lg">
                Showcase your professional certifications. Enter a Credly Badge ID to instantly verify and add it to your portfolio.
            </p>

            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 flex gap-2">
                <input 
                    type="text" 
                    placeholder="Enter Credly Badge ID (e.g. 12345-abcde...)" 
                    className="flex-1 bg-transparent border-none text-white placeholder-slate-400 px-4 py-3 outline-none text-lg font-mono"
                    value={newBadgeId}
                    onChange={(e) => setNewBadgeId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addBadge()}
                />
                <button 
                    onClick={addBadge}
                    disabled={!newBadgeId || saving}
                    className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    Add Credential
                </button>
            </div>
            
            {/* Live Preview Hint */}
            {newBadgeId && (
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-300 bg-blue-900/30 w-fit px-3 py-1 rounded-full border border-blue-500/30">
                    <ExternalLink size={14} />
                    <span>Preview available below after adding</span>
                </div>
            )}
        </div>
      </div>

      {/* Toolbar: view toggle and saving indicator */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            type="button"
            className={`px-3 py-2 text-sm flex items-center gap-2 ${listView ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
            onClick={() => setListView(true)}
            aria-label="List View"
          >
            <LayoutList size={16} /> List
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-sm flex items-center gap-2 ${!listView ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
            onClick={() => setListView(false)}
            aria-label="Grid View"
          >
            <Grid3X3 size={16} /> Grid
          </button>
        </div>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          {savingOrder ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving order...
            </>
          ) : (
            <span className="text-slate-400">Drag badges to reorder</span>
          )}
        </div>
      </div>

      {/* Badges Grid */}
      {loading ? (
          <div className="text-center py-12 text-slate-400">Loading credentials...</div>
      ) : (
        <motion.div layout className={listView ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
          <AnimatePresence>
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              layout
              // Dragging only works well in list view for now due to Reorder.Group complexities
              drag={listView ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={() => {}}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 ${listView ? 'flex flex-row cursor-grab active:cursor-grabbing' : ''}`}
            >
              <div className={`p-4 ${listView ? 'w-56 border-r' : ''} border-b border-slate-100 bg-slate-50/50 flex ${listView ? 'flex-col items-start gap-3' : 'justify-between items-center'} shrink-0`}>
                {listView && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <GripVertical size={18} />
                    <span className="text-xs font-mono uppercase tracking-wider">Drag</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 line-clamp-2">{badge.title || 'Untitled Badge'}</span>
                  {badge.issuer && <span className="text-xs text-slate-500">{badge.issuer}</span>}
                </div>
                <button 
                  onClick={() => deleteBadge(badge.id)}
                  className="ml-auto text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                  aria-label={`Delete ${badge.title || badge.badge_id}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>

                    <div className={`p-6 flex ${listView ? 'flex-row items-center gap-6' : 'flex-col'} justify-center bg-white relative min-h-[200px] grow`}>
                {/* Verification Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-100">
                    <CheckCircle2 size={12} /> Verified
                  </div>
                </div>

                {/* Credly Embed or Static Image */}
                        {badge.image_url && !imageError[badge.id] ? (
                  <div className="flex flex-col items-center text-center">
                    <img 
                      src={badge.image_url} 
                      alt={badge.title || 'Badge'} 
                      className="w-32 h-32 object-contain mb-4"
                      onError={() => setImageError(prev => ({ ...prev, [badge.id]: true }))}
                    />
                    {badge.title && (
                      <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 px-2">
                        {badge.title}
                      </h4>
                    )}
                    {badge.issuer && (
                      <p className="text-xs text-slate-500">
                        {badge.issuer}
                      </p>
                    )}
                  </div>
                ) : (
                  <div 
                    data-iframe-width="150" 
                    data-iframe-height="270" 
                    data-share-badge-id={badge.badge_id} 
                    data-share-badge-host="https://www.credly.com"
                    className="transform transition-transform group-hover:scale-105 duration-500"
                    key={`embed-${badge.id}-${badge.badge_id}-${badge.image_url || 'noimg'}`}
                  ></div>
                )}
              </div>
              
              {!listView && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <span className="text-xs font-medium text-slate-600">{badge.title || badge.badge_id}</span>
                </div>
              )}
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {badges.length === 0 && !loading && (
        <div className="text-center py-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                <Award size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No credentials yet</h3>
            <p className="text-slate-500">Add your first badge above to start building your portfolio.</p>
        </div>
      )}
    </div>
  );
}
