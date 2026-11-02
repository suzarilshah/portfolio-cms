'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, GripVertical, Award, CheckCircle2, ExternalLink, Loader2, LayoutList, Grid3X3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(badges);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setBadges(items);
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
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4px] p-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
            <Award size={200} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-transparent0/20 rounded-[4px] text-[var(--warn)]">
                    <Award size={24} />
                </div>
                <h2 className="text-2xl font-bold">Verified Credentials</h2>
            </div>
            
            <p className="text-[var(--faint)] mb-8 text-lg">
                Showcase your professional certifications. Enter a Credly Badge ID to instantly verify and add it to your portfolio.
            </p>

            <div className="bg-[var(--surface)] p-2 rounded-[4px] border border-white/20 flex flex-col md:flex-row gap-2">
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
                    className="bg-[var(--surface)] text-[var(--text)] px-6 py-3 rounded-[4px] font-bold hover:bg-[var(--raised)] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    Add Credential
                </button>
            </div>
            
            {/* Live Preview Hint */}
            {newBadgeId && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)] bg-[var(--raised)] w-fit px-3 py-1 rounded-full border border-[var(--accent-line)]/30">
                    <ExternalLink size={14} />
                    <span>Preview available below after adding</span>
                </div>
            )}
        </div>
      </div>

      {/* Toolbar: view toggle and saving indicator */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-[4px] border border-[var(--line)] overflow-hidden">
          <button
            type="button"
            className={`px-3 py-2 text-sm flex items-center gap-2 ${listView ? 'bg-[var(--accent)] text-[#06080b]' : 'bg-[var(--surface)] text-[var(--dim)]'}`}
            onClick={() => setListView(true)}
            aria-label="List View"
          >
            <LayoutList size={16} /> List
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-sm flex items-center gap-2 ${!listView ? 'bg-[var(--accent)] text-[#06080b]' : 'bg-[var(--surface)] text-[var(--dim)]'}`}
            onClick={() => setListView(false)}
            aria-label="Grid View"
          >
            <Grid3X3 size={16} /> Grid
          </button>
        </div>
        <div className="text-sm text-[var(--faint)] flex items-center gap-2">
          {savingOrder ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving order...
            </>
          ) : (
            <span className="text-[var(--faint)] flex items-center gap-2">
              <GripVertical size={14} /> Click and drag badges to reorder • Auto-saved
            </span>
          )}
        </div>
      </div>

      {/* Badges Grid */}
      {loading ? (
          <div className="text-center py-12 text-[var(--faint)]">Loading credentials...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="badges" direction={listView ? "vertical" : "horizontal"}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={listView ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}
              >
                {badges.map((badge, index) => (
                  <Draggable key={badge.id.toString()} draggableId={badge.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group bg-[var(--surface)] rounded-[4px] border-2  overflow-hidden transition-all duration-300 ${
                          snapshot.isDragging 
                            ? 'border-primary-400  scale-105 rotate-2 z-50' 
                            : 'border-[var(--line)]  hover:border-[#2c333b]'
                        } ${listView ? 'flex flex-row' : ''}`}
                      >
                        <div className={`p-4 ${listView ? 'w-56 border-r' : ''} border-b border-[var(--line)] bg-[var(--raised)] flex ${listView ? 'flex-col items-start gap-3' : 'justify-between items-center'} shrink-0`}>
                          <div 
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-2 text-[var(--faint)] hover:text-primary-600 transition-colors cursor-grab active:cursor-grabbing ${!listView ? 'w-full justify-center' : ''}`}
                          >
                            <GripVertical size={20} className={snapshot.isDragging ? 'text-primary-600' : ''} />
                            {listView && <span className="text-xs font-mono uppercase tracking-wider font-semibold">Drag to Reorder</span>}
                          </div>
                          <div className={`flex ${listView ? 'flex-col' : 'flex-row items-center justify-between w-full mt-2'}`}>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-[var(--text)] line-clamp-2">{badge.title || 'Untitled Badge'}</span>
                              {badge.issuer && <span className="text-xs text-[var(--faint)] mt-1">{badge.issuer}</span>}
                            </div>
                            <button 
                              onClick={() => deleteBadge(badge.id)}
                              className="ml-auto text-[var(--faint)] hover:text-[var(--danger)] transition-colors p-2 rounded-[4px] hover:bg-transparent"
                              aria-label={`Delete ${badge.title || badge.badge_id}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className={`p-6 flex ${listView ? 'flex-row items-center gap-6' : 'flex-col'} justify-center bg-[var(--surface)] relative min-h-[200px] grow`}>
                          {/* Verification Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <div className="bg-[var(--raised)] text-[var(--ok)] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-[var(--line)]">
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
                                <h4 className="font-bold text-[var(--text)] text-sm mb-1 line-clamp-2 px-2">
                                  {badge.title}
                                </h4>
                              )}
                              {badge.issuer && (
                                <p className="text-xs text-[var(--faint)]">
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
                          <div className="p-3 bg-[var(--raised)] border-t border-[var(--line)] text-center">
                            <span className="text-xs font-medium text-[var(--dim)]">{badge.title || badge.badge_id}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      {badges.length === 0 && !loading && (
        <div className="text-center py-24 bg-[var(--raised)] rounded-[4px] border-2 border-dashed border-[var(--line)]">
            <div className="inline-flex p-4 bg-[var(--raised)] rounded-full mb-4">
                <Award size={32} className="text-[var(--faint)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text)]">No credentials yet</h3>
            <p className="text-[var(--faint)]">Add your first badge above to start building your portfolio.</p>
        </div>
      )}
    </div>
  );
}
