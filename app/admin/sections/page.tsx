'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface SectionConfig {
    section_key: string;
    sort_order: number;
    is_visible: boolean;
    label?: string;
}

const SECTION_LABELS: Record<string, string> = {
    hero: 'Hero Section',
    about: 'About Me',
    skills: 'Skills & Tech',
    projects: 'Projects Showcase',
    experience: 'Experience',
    education: 'Education',
    awards: 'Awards & Certs',
    publications: 'Publications',
    community: 'Community & Speaking',
    contact: 'Contact Footer'
};

export default function SectionsReorderPage() {
    const [sections, setSections] = useState<SectionConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const res = await fetch('/api/cms/sections/reorder');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Ensure local labels are applied
                const formatted = data.map((s: any) => ({
                    ...s,
                    label: SECTION_LABELS[s.section_key] || s.section_key
                }));
                setSections(formatted);
            }
        } catch (error) {
            console.error('Failed to fetch sections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update sort_order based on new index * 10
        const updatedItems = items.map((item, index) => ({
            ...item,
            sort_order: index * 10
        }));

        setSections(updatedItems);
    };

    const toggleVisibility = (index: number) => {
        const newSections = [...sections];
        newSections[index].is_visible = !newSections[index].is_visible;
        setSections(newSections);
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/cms/sections/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections })
            });
            if (!res.ok) throw new Error('Failed to save');
            alert('Section order and visibility saved!');
        } catch (e) {
            console.error(e);
            alert('Error saving changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading configuration...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Section Management</h2>
                    <p className="text-slate-500">Drag to reorder sections or toggle visibility.</p>
                </div>
                <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections-list">
                    {(provided) => (
                        <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3 max-w-3xl"
                        >
                            {sections.map((section, index) => (
                                <Draggable key={section.section_key} draggableId={section.section_key} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`bg-white border rounded-xl p-4 flex items-center gap-4 transition-shadow ${
                                                snapshot.isDragging ? 'shadow-lg border-blue-300 ring-2 ring-blue-100' : 'border-slate-200 shadow-sm'
                                            } ${!section.is_visible ? 'opacity-60 bg-slate-50' : ''}`}
                                        >
                                            <div 
                                                {...provided.dragHandleProps}
                                                className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1"
                                            >
                                                <GripVertical size={20} />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900">{section.label}</h3>
                                                <code className="text-xs text-slate-400 font-mono">{section.section_key}</code>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                 <span className={`text-xs font-bold px-2 py-1 rounded-full ${section.is_visible ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                                    {section.is_visible ? 'Visible' : 'Hidden'}
                                                </span>
                                                <button
                                                    onClick={() => toggleVisibility(index)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        section.is_visible 
                                                        ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' 
                                                        : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                                                    }`}
                                                    title={section.is_visible ? "Hide Section" : "Show Section"}
                                                >
                                                    {section.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
