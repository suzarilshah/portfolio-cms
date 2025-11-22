'use client';

import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2, Users } from 'lucide-react';

interface EventItem {
  title: string;
  role: string;
  topic: string;
  date: string;
}

interface RoleItem {
  title: string;
  organization: string;
  description: string;
  icon: string;
}

interface CommunityContent {
  events: EventItem[];
  roles: RoleItem[];
}

const defaultCommunity: CommunityContent = {
  events: [
    {
      title: 'Microsoft Global AI 2025 Malaysia',
      role: 'Speaker',
      topic: 'Creating your own ChatGPT using Azure AI Foundry',
      date: 'March 2025'
    },
    {
      title: 'Deep Dive into Azure OpenAI Services',
      role: 'Speaker & Organizer',
      topic: 'Microsoft Global AI 2024 Malaysia',
      date: 'March 2024'
    },
    {
      title: 'Azure OpenAI Introduction',
      role: 'Speaker',
      topic: 'Microsoft MEET & GREET',
      date: 'March 2024'
    }
  ],
  roles: [
    {
        title: 'Community Lead',
        organization: 'Microsoft MEET Community',
        description: 'Leading initiatives to empower local developers and students with Microsoft technologies.',
        icon: 'users'
    },
    {
        title: 'MLH Mentor',
        organization: 'Major League Hacking',
        description: 'Mentoring hackathon participants at events like HackNJIT, HackTX, and HackGT.',
        icon: 'heart'
    }
  ]
};

export default function CommunityPage() {
  return (
    <SectionEditor<CommunityContent>
      sectionKey="community"
      title="Community & Speaking"
      description="Manage your speaking engagements and community roles."
      defaultContent={defaultCommunity}
      renderForm={(content, onChange) => (
        <div className="space-y-8">
          
          {/* Roles Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Community Roles</h3>
              <button 
                onClick={() => onChange({
                  ...content,
                  roles: [
                    { title: 'New Role', organization: 'Org', description: '', icon: 'users' },
                    ...(content.roles || [])
                  ]
                })}
                className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add Role
              </button>
            </div>
            <div className="grid gap-4">
                {content.roles?.map((role, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 relative group hover:border-blue-200 transition-colors">
                        <button 
                            onClick={() => {
                                const newRoles = [...content.roles];
                                newRoles.splice(index, 1);
                                onChange({ ...content, roles: newRoles });
                            }}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Role Title</label>
                                    <input 
                                        type="text" 
                                        value={role.title} 
                                        onChange={(e) => {
                                            const newRoles = [...content.roles];
                                            newRoles[index].title = e.target.value;
                                            onChange({ ...content, roles: newRoles });
                                        }}
                                        className="w-full p-2 border border-slate-200 rounded-md text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Organization</label>
                                    <input 
                                        type="text" 
                                        value={role.organization} 
                                        onChange={(e) => {
                                            const newRoles = [...content.roles];
                                            newRoles[index].organization = e.target.value;
                                            onChange({ ...content, roles: newRoles });
                                        }}
                                        className="w-full p-2 border border-slate-200 rounded-md text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Description</label>
                                <textarea 
                                    value={role.description} 
                                    onChange={(e) => {
                                        const newRoles = [...content.roles];
                                        newRoles[index].description = e.target.value;
                                        onChange({ ...content, roles: newRoles });
                                    }}
                                    className="w-full p-2 border border-slate-200 rounded-md text-sm h-20 resize-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Icon (users or heart)</label>
                                <select
                                    value={role.icon} 
                                    onChange={(e) => {
                                        const newRoles = [...content.roles];
                                        newRoles[index].icon = e.target.value;
                                        onChange({ ...content, roles: newRoles });
                                    }}
                                    className="w-full p-2 border border-slate-200 rounded-md text-sm"
                                >
                                    <option value="users">Users (Community)</option>
                                    <option value="heart">Heart (Mentorship)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Events Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Speaking Events</h3>
              <button 
                onClick={() => onChange({
                  ...content,
                  events: [
                    { title: 'New Event', role: 'Speaker', topic: 'Topic', date: '2025' },
                    ...(content.events || [])
                  ]
                })}
                className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add Event
              </button>
            </div>

            <div className="grid gap-4">
                {content.events?.map((event, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 relative group hover:border-blue-200 transition-colors">
                    <button 
                    onClick={() => {
                        const newEvents = [...content.events];
                        newEvents.splice(index, 1);
                        onChange({ ...content, events: newEvents });
                    }}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500"
                    >
                    <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Event Name</label>
                                <input 
                                type="text" 
                                value={event.title} 
                                onChange={(e) => {
                                    const newEvents = [...content.events];
                                    newEvents[index].title = e.target.value;
                                    onChange({ ...content, events: newEvents });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Role</label>
                                <input 
                                type="text" 
                                value={event.role} 
                                onChange={(e) => {
                                    const newEvents = [...content.events];
                                    newEvents[index].role = e.target.value;
                                    onChange({ ...content, events: newEvents });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Date (Month Year)</label>
                                <input 
                                type="text" 
                                value={event.date} 
                                onChange={(e) => {
                                    const newEvents = [...content.events];
                                    newEvents[index].date = e.target.value;
                                    onChange({ ...content, events: newEvents });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm font-mono"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Topic / Description</label>
                                <textarea 
                                value={event.topic} 
                                onChange={(e) => {
                                    const newEvents = [...content.events];
                                    newEvents[index].topic = e.target.value;
                                    onChange({ ...content, events: newEvents });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm h-20 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
