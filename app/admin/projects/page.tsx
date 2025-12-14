'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Edit2, ExternalLink, Code, Cloud, Zap, Server, Globe, History, RotateCcw, Camera, Upload, Image, Settings } from 'lucide-react';

interface Project {
    id?: number;
    title: string;
    tagline: string;
    challenge: string;
    solution: string;
    impact: { metric: string; value: string }[];
    technologies: string[];
    category: string;
    icon_name: string;
    year: string;
    link: string;
    project_url?: string;
    thumbnail_url?: string;
    snapshot_url?: string;
    has_snapshot?: boolean;
    updated_at?: string;
}

const DEFAULT_PROJECT: Project = {
    title: '',
    tagline: '',
    challenge: '',
    solution: '',
    impact: [{ metric: '', value: '' }],
    technologies: [],
    category: '',
    icon_name: 'Code',
    year: '',
    link: ''
};

const ICONS = ['Code', 'Cloud', 'Zap', 'Server', 'Globe'];

import SectionEditor from '../components/SectionEditor';

// ... existing interfaces ...

export default function ProjectsAdminPage() {
    const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');
    
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Project>(DEFAULT_PROJECT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // History State
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyRecords, setHistoryRecords] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedProjectForHistory, setSelectedProjectForHistory] = useState<number | null>(null);

    // Snapshot and Upload State
    const [snapshotLoading, setSnapshotLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/cms/projects');
            const data = await res.json();
            setProjects(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (projectId: number) => {
        setHistoryLoading(true);
        try {
            const res = await fetch(`/api/cms/projects/history?projectId=${projectId}`);
            const data = await res.json();
            setHistoryRecords(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleHistoryClick = (projectId: number) => {
        setSelectedProjectForHistory(projectId);
        setHistoryOpen(true);
        fetchHistory(projectId);
    };

    const handleRestore = async (historyId: number) => {
        if (!confirm('Restore this version? Current changes will be overwritten.')) return;
        try {
            const res = await fetch('/api/cms/projects/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history_id: historyId })
            });
            if (res.ok) {
                const restored = await res.json();
                alert('Version restored successfully!');
                setHistoryOpen(false);
                fetchProjects();
                // If we were editing this project, update the form
                if (editingId === restored.id) {
                    setFormData(restored);
                }
            }
        } catch (e) {
            alert('Failed to restore version');
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id!);
        setFormData(project);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData(DEFAULT_PROJECT);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        await fetch(`/api/cms/projects?id=${id}`, { method: 'DELETE' });
        fetchProjects();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = editingId ? 'PUT' : 'POST';
            const payload = editingId ? { ...formData, id: editingId } : formData;
            
            await fetch('/api/cms/projects', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            handleCancel();
            fetchProjects();
        } catch (e) {
            alert('Failed to save project');
        } finally {
            setSaving(false);
        }
    };

    const updateImpact = (index: number, field: 'metric' | 'value', val: string) => {
        const newImpact = [...formData.impact];
        newImpact[index][field] = val;
        setFormData({ ...formData, impact: newImpact });
    };

    const addImpact = () => {
        setFormData({ ...formData, impact: [...formData.impact, { metric: '', value: '' }] });
    };

    const removeImpact = (index: number) => {
        const newImpact = formData.impact.filter((_, i) => i !== index);
        setFormData({ ...formData, impact: newImpact });
    };

    if (loading && activeTab === 'projects') return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            {/* Tab Switcher */}
            <div className="flex gap-1 bg-gradient-to-r from-slate-100 to-slate-200 p-1.5 rounded-2xl w-fit mb-12 shadow-inner">
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'projects' ? 'bg-white text-slate-900 shadow-lg transform scale-105' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
                >
                    <span className="flex items-center gap-2">
                        <Code size={16} />
                        Manage Projects
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-lg transform scale-105' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
                >
                    <span className="flex items-center gap-2">
                        <Settings size={16} />
                        Section Settings
                    </span>
                </button>
            </div>

            {activeTab === 'settings' ? (
                <SectionEditor<{ title: string; description: string }>
                    sectionKey="projects"
                    title="Projects Section Config"
                    description="Manage the section header, title, and introductory text."
                    defaultContent={{
                        title: "Projects & Case Studies",
                        description: "Real-world cloud architecture, DevOps transformations, and IoT solutions driving measurable business impact"
                    }}
                    renderForm={(content, onChange) => (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900">Section Title</label>
                                <input 
                                    type="text" 
                                    value={content.title} 
                                    onChange={(e) => onChange({ ...content, title: e.target.value })}
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900">Description</label>
                                <textarea 
                                    value={content.description} 
                                    onChange={(e) => onChange({ ...content, description: e.target.value })}
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white h-32"
                                />
                            </div>
                        </div>
                    )}
                />
            ) : (
                <div className="space-y-12 relative">
                    {/* History Modal */}
                    {historyOpen && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
                            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">Version History</h3>
                                    <button onClick={() => setHistoryOpen(false)} className="text-slate-500 hover:text-slate-700">Close</button>
                                </div>
                                
                                {historyLoading ? (
                                    <div className="text-center py-8 text-slate-500">Loading history...</div>
                                ) : (
                                    <div className="space-y-4">
                                        {historyRecords.map((record) => (
                                            <div key={record.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="text-sm text-slate-500">
                                                        {new Date(record.created_at).toLocaleString()}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleRestore(record.id)}
                                                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
                                                    >
                                                        <RotateCcw size={12} /> Restore
                                                    </button>
                                                </div>
                                                <div className="text-sm font-medium text-slate-900 truncate">
                                                    {record.snapshot.title}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    {record.snapshot.technologies?.length || 0} technologies • {record.snapshot.impact?.length || 0} metrics
                                                </div>
                                            </div>
                                        ))}
                                        {historyRecords.length === 0 && (
                                            <div className="text-center text-slate-400 py-8">No history found.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Projects Showcase</h2>
                            <p className="text-slate-500">Manage featured case studies and projects.</p>
                        </div>
                        {!editingId && (
                            <button 
                                onClick={() => { setEditingId(null); setFormData(DEFAULT_PROJECT); }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus size={18} /> Add Project
                            </button>
                        )}
                    </div>

                    {/* Editor Form */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 p-8 md:p-12 shadow-xl shadow-primary-500/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-xl">
                                <Edit2 size={20} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                {editingId ? 'Edit Project' : 'Create New Project'}
                            </h3>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Project Title</label>
                                    <input type="text" className="w-full border p-2 rounded-lg" required 
                                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tagline</label>
                                    <input type="text" className="w-full border p-2 rounded-lg" 
                                        value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <input type="text" className="w-full border p-2 rounded-lg" placeholder="e.g. Cloud Architecture"
                                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Year</label>
                                    <input type="text" className="w-full border p-2 rounded-lg" placeholder="e.g. 2024-2025"
                                        value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Challenge</label>
                                    <textarea className="w-full border p-2 rounded-lg h-32" required
                                        value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Solution</label>
                                    <textarea className="w-full border p-2 rounded-lg h-32" required
                                        value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} />
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Technologies (comma separated)</label>
                                <input type="text" className="w-full border p-2 rounded-lg" 
                                    value={formData.technologies.join(', ')} 
                                    onChange={e => setFormData({...formData, technologies: e.target.value.split(',').map(s => s.trim())})} 
                                    placeholder="React, Node.js, Azure, ..."
                                />
                            </div>

                            {/* Impact Metrics */}
                            <div className="space-y-4">
                                <label className="text-sm font-medium">Impact Metrics</label>
                                {formData.impact.map((imp, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <input type="text" placeholder="Metric (e.g. Uptime)" className="flex-1 border p-2 rounded-lg"
                                            value={imp.metric} onChange={e => updateImpact(idx, 'metric', e.target.value)} />
                                        <input type="text" placeholder="Value (e.g. 99.9%)" className="flex-1 border p-2 rounded-lg"
                                            value={imp.value} onChange={e => updateImpact(idx, 'value', e.target.value)} />
                                        <button type="button" onClick={() => removeImpact(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addImpact} className="text-sm text-blue-600 hover:underline">+ Add Metric</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Project Link</label>
                                    <div className="flex items-center gap-2">
                                        <ExternalLink size={16} className="text-slate-400" />
                                        <input type="text" className="w-full border p-2 rounded-lg" placeholder="https://..."
                                            value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Icon</label>
                                    <div className="flex gap-2">
                                        {ICONS.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData({...formData, icon_name: icon})}
                                                className={`p-2 border rounded-lg ${formData.icon_name === icon ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-slate-50'}`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Project URL and Thumbnail */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Project URL</label>
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-slate-400" />
                                        <input type="text" className="w-full border p-2 rounded-lg" placeholder="https://your-project-url.com"
                                            value={formData.project_url || ''} onChange={e => setFormData({...formData, project_url: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Thumbnail URL</label>
                                    <div className="flex items-center gap-2">
                                        <Image size={16} className="text-slate-400" />
                                        <input type="text" className="w-full border p-2 rounded-lg" placeholder="Auto-filled on upload"
                                            value={formData.thumbnail_url || ''} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} readOnly />
                                    </div>
                                </div>
                            </div>

                            {/* Snapshot and Upload Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                {formData.project_url && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!editingId) {
                                                alert('Save project first before capturing snapshot');
                                                return;
                                            }
                                            setSnapshotLoading(true);
                                            try {
                                                const res = await fetch('/api/cms/projects/snapshot', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ project_id: editingId, url: formData.project_url })
                                                });
                                                const data = await res.json();
                                                if (data.snapshot_url) {
                                                    setFormData({ ...formData, snapshot_url: data.snapshot_url, has_snapshot: true });
                                                    alert('Snapshot captured successfully!');
                                                }
                                            } catch (e) {
                                                alert('Failed to capture snapshot');
                                            } finally {
                                                setSnapshotLoading(false);
                                            }
                                        }}
                                        disabled={snapshotLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {snapshotLoading && <Loader2 size={16} className="animate-spin" />}
                                        <Camera size={16} />
                                        <span className="font-bold">Capture Snapshot</span>
                                    </button>
                                )}

                                <label className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                    {uploadLoading && <Loader2 size={16} className="animate-spin" />}
                                    <Upload size={16} />
                                    <span className="font-bold">Upload Thumbnail</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file || !editingId) {
                                                if (!editingId) alert('Save project first before uploading thumbnail');
                                                return;
                                            }
                                            setUploadLoading(true);
                                            try {
                                                const uploadFormData = new FormData();
                                                uploadFormData.append('file', file);
                                                uploadFormData.append('project_id', editingId.toString());
                                                const res = await fetch('/api/cms/projects/upload', {
                                                    method: 'POST',
                                                    body: uploadFormData
                                                });
                                                const data = await res.json();
                                                if (data.thumbnail_url) {
                                                    setFormData({ ...formData, thumbnail_url: data.thumbnail_url });
                                                    alert('Thumbnail uploaded successfully!');
                                                }
                                            } catch (e) {
                                                alert('Failed to upload thumbnail');
                                            } finally {
                                                setUploadLoading(false);
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                {editingId && (
                                    <button type="button" onClick={handleCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                    {saving && <Loader2 size={16} className="animate-spin" />}
                                    {editingId ? 'Update Project' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Projects List */}
                    <div className="grid gap-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-gradient-to-br from-white via-slate-50/30 to-white p-6 rounded-2xl border border-slate-200/50 flex items-center justify-between group hover:shadow-xl hover:border-primary-200/50 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-xl">
                                        <Code className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg">{project.title}</h4>
                                        <p className="text-sm text-slate-500 font-medium">{project.category} • {project.year}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleHistoryClick(project.id!)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="History">
                                        <History size={18} />
                                    </button>
                                    <button onClick={() => handleEdit(project)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(project.id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                                No projects found. Create one above!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
