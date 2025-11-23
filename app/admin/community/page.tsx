'use client';

import SectionEditor from '../components/SectionEditor';
import { Plus, Trash2 } from 'lucide-react';

interface CommunityEvent {
  id?: number;
  title: string;
  date: string;
  role: string;
  topic: string;
  venue: string;
  link?: string;
  type: string;
}

interface PastEvent {
  title: string;
  date: string;
}

interface MlsaInvolvement {
  title: string;
  date?: string;
  link: string;
  type: string;
}

interface CommunityContent {
  communityEvents: CommunityEvent[];
  pastEvents: PastEvent[];
  mlsaInvolvements: MlsaInvolvement[];
}

const defaultCommunity: CommunityContent = {
  communityEvents: [
    {
      id: 9,
      title: 'E2 (Educator Exchange) Sabah',
      date: 'November 2025',
      role: 'Speaker & Organizer',
      topic: 'Agritech and AI in Education',
      venue: 'Royale Borneo Hotel Tawau',
      link: 'https://www.e2sabah.com/',
      type: 'upcoming'
    },
    {
      id: 8,
      title: 'aMP KL 2025 Thriving Through Tech: Innovation, Security & AI',
      date: 'October 2025',
      role: 'Speaker',
      topic: 'Generate Video with AI with Azure Sora 2 model',
      venue: 'Microsoft Malaysia Office',
      link: 'https://ampkl.com/2025',
      type: 'upcoming'
    },
    {
      id: 7,
      title: 'Microsoft Global AI 2025 Malaysia',
      date: 'April 2025',
      role: 'Speaker',
      topic: 'Creating your own ChatGPT using Azure AI Foundry and Open Web UI',
      venue: 'Microsoft Malaysia',
      link: 'https://globalai.community/bootcamp/malaysia-kuala-lumpur/',
      type: 'upcoming'
    },
    {
      id: 6,
      title: 'Let’s get technical - Regression Model Values Forecasting',
      date: 'June 2024',
      role: 'Speaker',
      topic: 'Regression Model Values Forecasting using Azure Machine Learning',
      venue: 'Online',
      link: 'https://developer.microsoft.com/en-us/reactor/events/22587/',
      type: 'recent'
    },
    {
      id: 5,
      title: 'Microsoft MEET & GREET - Elevate your career in tech',
      date: 'June 2024',
      role: 'Speaker',
      topic: 'Career / Experience Sharing in the IT industry',
      venue: 'Microsoft Malaysia Office',
      link: 'https://developer.microsoft.com/en-us/reactor/events/22794/',
      type: 'recent'
    },
    {
      id: 4,
      title: 'Microsoft AI Developer tools and Azure Symposium',
      date: 'May 2024',
      role: 'Organizer',
      topic: 'Keynote Speaker - event organizer',
      venue: 'Microsoft Malaysia Office',
      link: 'https://developer.microsoft.com/en-us/reactor/events/22814/',
      type: 'recent'
    },
    {
      id: 3,
      title: 'Microsoft MEET & GREET - Empowering the next generation',
      date: 'March 2024',
      role: 'Speaker',
      topic: 'Introduction to Azure Open AI Services',
      venue: 'Microsoft Malaysia Office',
      link: 'https://developer.microsoft.com/en-us/reactor/events/22181/',
      type: 'recent'
    },
    {
      id: 2,
      title: 'The Power of Artificial Intelligence in real world',
      date: 'March 2024',
      role: 'Speaker & Organizer',
      topic: 'Introduction to Microsoft Learn Student Ambassadors program',
      venue: 'UniKL MIIT',
      type: 'recent'
    },
    {
      id: 1,
      title: 'Microsoft Global AI 2024 Malaysia',
      date: 'March 2024',
      role: 'Speaker & Organizer',
      topic: 'Deep dive into Azure OpenAI services',
      venue: 'Microsoft Malaysia Office',
      link: 'https://globalai.community/bootcamp/malaysia-kuala-lumpur/',
      type: 'recent'
    }
  ],
  mlsaInvolvements: [
    { title: 'Student Ambassadors Cloud Skills Challenge: Azure AI Fundamentals', date: 'April 2024', link: 'https://learn.microsoft.com/en-gb/training/challenges?id=99c290a1-3310-4751-adb4-a08c6bbdc94e&WT.mc_id=cloudskillschallenge_99c290a1-3310-4751-adb4-a08c6bbdc94e&wt.mc_id=studentamb_58170', type: 'challenge' },
    { title: 'Azure onboarding collection contributor on Postman', date: 'November 2023', link: 'https://www.postman.com/devrel/workspace/cloud-onboarding-collections/collection/13191452-4c08a2b9-ed49-435e-824e-3981c7439a5e', type: 'content' },
    { title: 'Microsoft Reactor Azure OpenAI video creator', date: 'August 2023', link: 'https://www.youtube.com/watch?v=YKTswlRENeQ&t=5s', type: 'video' },
    { title: 'Microsoft Student Trainer (AZ-900)', date: 'August 2023', link: 'https://www.credly.com/badges/22860ff8-d68d-4471-9922-f1f2a6cd1668/public_url', type: 'badge' },
    { title: 'Imagine Cup Junior Judge', date: 'May 2023', link: 'https://www.linkedin.com/posts/suzarilshah_certificate-of-appreciation-2023-imagine-activity-7110724980669087746-JxCx?utm_source=share&utm_medium=member_desktop', type: 'judge' },
    { title: 'MLSA Cloud Skills Challenge Event Host', link: 'https://www.credly.com/badges/e2a37749-c005-4b4e-aebb-06dbf5d9c407/public_url', type: 'badge' },
    { title: 'Microsoft Learn Student Ambassadors Mentor', date: 'January 2023', link: 'https://www.credly.com/badges/01f1b153-9b7c-4ac4-93c3-8eefb74da95a/public_url', type: 'badge' },
    { title: 'Cyber-Security Architect track exam Challenge', date: 'December 2022', link: 'https://learn.microsoft.com/en-gb/training/challenges?id=b53153ff-7cc6-4a9e-ab46-3c289233bf10&wt.mc_id=studentamb_58170', type: 'challenge' },
    { title: 'Imagine Cup Mentor - e-Drishti', date: 'December 2022', link: 'https://www.credly.com/badges/36c1b4e9-81ea-4b4a-8345-437e58c2b269/public_url', type: 'badge' },
    { title: 'Microsoft Ignite After Party Host', date: 'November 2022', link: 'https://www.credly.com/badges/d7499cd8-a267-4062-9f46-f244ac06367f/public_url', type: 'badge' }
  ],
  pastEvents: [
    { title: 'Azure Fundamentals & Microsoft for Startup Founders Hub Introductions', date: 'June 2024' },
    { title: 'Benefits of Microsoft Certifications to Students and Professionals', date: 'June 2023' },
    { title: 'Build Applications in Minutes with Power Apps', date: 'December 2022' },
    { title: 'Microsoft Ignite After Party @ UniKL', date: 'November 2022' },
    { title: 'Getting Started with Development Containers in VS Code', date: 'September 2022' },
    { title: 'Azure Fundamentals (AZ-900)', date: 'March 2022' },
    { title: 'Managing Security with Microsoft 365', date: 'February 2022' },
    { title: 'Building a Simple Chatbot with Virtual Power Agent', date: 'October 2021' },
    { title: 'Event Hosting and Management for MLSA UniKL', date: 'October 2021' },
    { title: 'Building & Hosting Website on Github & Microsoft Azure', date: 'February 2021' },
    { title: 'Microsoft Learn Student Ambassadors Q&A', date: 'December 2020' },
    { title: 'Breaking the Ice with Student Ambassadors', date: 'November 2020' },
    { title: 'Introduction to Cloud - Azure Fundamentals', date: 'October 2020' }
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
          
          {/* Community Events Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Community Events</h3>
              <button 
                onClick={() => onChange({
                  ...content,
                  communityEvents: [
                    { title: 'New Event', role: 'Speaker', topic: 'Topic', date: '2025', venue: 'Venue', type: 'upcoming' },
                    ...(content.communityEvents || [])
                  ]
                })}
                className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add Event
              </button>
            </div>

            <div className="grid gap-4">
                {(content.communityEvents || []).map((event, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 relative group hover:border-blue-200 transition-colors">
                    <button 
                    onClick={() => {
                        const newEvents = [...(content.communityEvents || [])];
                        newEvents.splice(index, 1);
                        onChange({ ...content, communityEvents: newEvents });
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
                                    const newEvents = [...(content.communityEvents || [])];
                                    newEvents[index].title = e.target.value;
                                    onChange({ ...content, communityEvents: newEvents });
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
                                    const newEvents = [...(content.communityEvents || [])];
                                    newEvents[index].role = e.target.value;
                                    onChange({ ...content, communityEvents: newEvents });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Venue</label>
                                <input 
                                type="text" 
                                value={event.venue} 
                                onChange={(e) => {
                                    const newEvents = [...(content.communityEvents || [])];
                                    newEvents[index].venue = e.target.value;
                                    onChange({ ...content, communityEvents: newEvents });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Date</label>
                                    <input 
                                    type="text" 
                                    value={event.date} 
                                    onChange={(e) => {
                                        const newEvents = [...(content.communityEvents || [])];
                                        newEvents[index].date = e.target.value;
                                        onChange({ ...content, communityEvents: newEvents });
                                    }}
                                    className="w-full p-2 border border-slate-200 rounded-md text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Type</label>
                                    <select 
                                    value={event.type} 
                                    onChange={(e) => {
                                        const newEvents = [...(content.communityEvents || [])];
                                        newEvents[index].type = e.target.value;
                                        onChange({ ...content, communityEvents: newEvents });
                                    }}
                                    className="w-full p-2 border border-slate-200 rounded-md text-sm"
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="recent">Recent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Topic / Description</label>
                                <textarea 
                                value={event.topic} 
                                onChange={(e) => {
                                    const newEvents = [...(content.communityEvents || [])];
                                    newEvents[index].topic = e.target.value;
                                    onChange({ ...content, communityEvents: newEvents });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm h-20 resize-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Link (Optional)</label>
                                <input 
                                type="text" 
                                value={event.link || ''} 
                                onChange={(e) => {
                                    const newEvents = [...(content.communityEvents || [])];
                                    newEvents[index].link = e.target.value;
                                    onChange({ ...content, communityEvents: newEvents });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm text-slate-500"
                                placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* MLSA Involvements Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">MLSA Involvements</h3>
              <button 
                onClick={() => onChange({
                  ...content,
                  mlsaInvolvements: [
                    { title: 'New Involvement', link: '', type: 'badge' },
                    ...(content.mlsaInvolvements || [])
                  ]
                })}
                className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add MLSA
              </button>
            </div>

            <div className="grid gap-4">
                {(content.mlsaInvolvements || []).map((item, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 relative group hover:border-blue-200 transition-colors">
                    <button 
                    onClick={() => {
                        const newItems = [...(content.mlsaInvolvements || [])];
                        newItems.splice(index, 1);
                        onChange({ ...content, mlsaInvolvements: newItems });
                    }}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500"
                    >
                    <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Title</label>
                                <input 
                                type="text" 
                                value={item.title} 
                                onChange={(e) => {
                                    const newItems = [...(content.mlsaInvolvements || [])];
                                    newItems[index].title = e.target.value;
                                    onChange({ ...content, mlsaInvolvements: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Date (Optional)</label>
                                <input 
                                type="text" 
                                value={item.date || ''} 
                                onChange={(e) => {
                                    const newItems = [...(content.mlsaInvolvements || [])];
                                    newItems[index].date = e.target.value;
                                    onChange({ ...content, mlsaInvolvements: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Type</label>
                                <select 
                                value={item.type} 
                                onChange={(e) => {
                                    const newItems = [...(content.mlsaInvolvements || [])];
                                    newItems[index].type = e.target.value;
                                    onChange({ ...content, mlsaInvolvements: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm"
                                >
                                    <option value="badge">Badge</option>
                                    <option value="content">Content</option>
                                    <option value="video">Video</option>
                                    <option value="judge">Judge</option>
                                    <option value="challenge">Challenge</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Link</label>
                                <input 
                                type="text" 
                                value={item.link} 
                                onChange={(e) => {
                                    const newItems = [...(content.mlsaInvolvements || [])];
                                    newItems[index].link = e.target.value;
                                    onChange({ ...content, mlsaInvolvements: newItems });
                                }}
                                className="w-full p-2 border border-slate-200 rounded-md text-sm text-slate-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* Past Events Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Past Events Archive</h3>
              <button 
                onClick={() => onChange({
                  ...content,
                  pastEvents: [
                    { title: 'New Past Event', date: 'Year' },
                    ...(content.pastEvents || [])
                  ]
                })}
                className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add Past Event
              </button>
            </div>

            <div className="grid gap-4">
                {(content.pastEvents || []).map((event, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 relative group hover:border-blue-200 transition-colors flex items-center gap-4">
                    <button 
                    onClick={() => {
                        const newEvents = [...(content.pastEvents || [])];
                        newEvents.splice(index, 1);
                        onChange({ ...content, pastEvents: newEvents });
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 hover:text-red-500"
                    >
                    <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow pr-12">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Event Title</label>
                            <input 
                            type="text" 
                            value={event.title} 
                            onChange={(e) => {
                                const newEvents = [...(content.pastEvents || [])];
                                newEvents[index].title = e.target.value;
                                onChange({ ...content, pastEvents: newEvents });
                            }}
                            className="w-full p-2 border border-slate-200 rounded-md text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Date</label>
                            <input 
                            type="text" 
                            value={event.date} 
                            onChange={(e) => {
                                const newEvents = [...(content.pastEvents || [])];
                                newEvents[index].date = e.target.value;
                                onChange({ ...content, pastEvents: newEvents });
                            }}
                            className="w-full p-2 border border-slate-200 rounded-md text-sm"
                            />
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
