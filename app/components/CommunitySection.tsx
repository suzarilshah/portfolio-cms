'use client';

import { motion } from 'framer-motion';
import { Mic, Users, Heart, Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp, Award, Video, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

// --- Data Definitions ---

type CommunityEvent = {
  id: number;
  title: string;
  date: string;
  role: string;
  topic: string;
  venue: string;
  link?: string;
  type: 'upcoming' | 'recent';
};

const communityEvents: CommunityEvent[] = [
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
];

const mlsaInvolvements = [
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
];

const pastEvents = [
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
];

type SessionizeSession = {
  title: string;
  link: string;
};

export default function CommunitySection({ content }: { content?: any }) {
  const [sessions, setSessions] = useState<SessionizeSession[]>([]);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('https://sessionize.com/api/speaker/sessions/qe8n7ez6dg/1x1x3fb393x');
        const text = await res.text();
        // Extract session data from the document.write content
        // Pattern: <a href="LINK" class="sz-item__title" target="_blank">TITLE</a>
        const regex = /<a href="([^"]+)"[^>]*class="sz-item__title"[^>]*>([^<]+)<\/a>/g;
        const foundSessions: SessionizeSession[] = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
          foundSessions.push({
            link: match[1],
            title: match[2].replace(/&amp;/g, '&')
          });
        }
        setSessions(foundSessions);
      } catch (e) {
        console.error('Failed to fetch sessions', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const displayEvents = showAllEvents ? communityEvents : communityEvents.slice(0, 4);

  return (
    <section id="community" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-slate-50 -z-20"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 to-transparent -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Community & Speaking
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Empowering the tech ecosystem through global mentorship, impactful speaking engagements, and community leadership.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
            {/* LEFT COLUMN: Events & Archive */}
            <div className="lg:col-span-8 space-y-16">
                
                {/* Featured Events */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Calendar className="text-primary-600" />
                            Community Events
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {displayEvents.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-primary-50 text-primary-700 rounded-2xl font-bold leading-none">
                                        <span className="text-xs uppercase tracking-wider">{event.date.split(' ')[0].substring(0, 3)}</span>
                                        <span className="text-xl">{event.date.split(' ')[1]}</span>
                                    </div>
                                    
                                    <div className="flex-grow">
                                        <div className="flex flex-wrap gap-3 mb-3">
                                            {event.type === 'upcoming' && (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide rounded-full">
                                                    Upcoming
                                                </span>
                                            )}
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wide rounded-full">
                                                {event.role}
                                            </span>
                                        </div>

                                        <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {event.title}
                                        </h4>
                                        
                                        <p className="text-slate-600 mb-4 line-clamp-2">
                                            {event.topic}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center text-sm text-slate-500">
                                                <MapPin size={16} className="mr-2" />
                                                {event.venue}
                                            </div>
                                            
                                            {event.link && (
                                                <a 
                                                    href={event.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                                >
                                                    Event Details <ExternalLink size={14} className="ml-1.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    {communityEvents.length > 4 && (
                        <div className="mt-8 text-center">
                            <button 
                                onClick={() => setShowAllEvents(!showAllEvents)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                {showAllEvents ? (
                                    <>Show Less <ChevronUp size={16} /></>
                                ) : (
                                    <>View All Community Events <ChevronDown size={16} /></>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Past Events Archive */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/60">
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <Calendar className="text-slate-400" size={20} />
                        Past Organizer & Speaker Highlights
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                        {pastEvents.slice(0, showAllPast ? undefined : 6).map((event, idx) => (
                            <div key={idx} className="flex items-start gap-3 py-2 border-b border-slate-200 last:border-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0"></div>
                                <div>
                                    <p className="text-slate-800 font-medium text-sm">{event.title}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{event.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {pastEvents.length > 6 && (
                        <button 
                            onClick={() => setShowAllPast(!showAllPast)}
                            className="mt-6 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                            {showAllPast ? 'Show Less' : `View ${pastEvents.length - 6} More Past Events`}
                        </button>
                    )}
                </div>

            </div>

            {/* RIGHT COLUMN: Speaking Sessions & MLSA */}
            <div className="lg:col-span-4 space-y-12">
                
                {/* LIVE SESSIONIZE SESSIONS */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Glow Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h3 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
                            <Mic className="text-primary-400" />
                            Speaking Sessions
                        </h3>
                        <p className="text-slate-400 text-sm mb-8">
                            Current sessions offered via Sessionize.
                        </p>

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-white/10 rounded-xl"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map((session, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={session.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-xl p-5 transition-all group"
                                    >
                                        <h4 className="font-bold text-sm md:text-base mb-2 leading-snug group-hover:text-primary-300 transition-colors">
                                            {session.title}
                                        </h4>
                                        <div className="flex items-center text-xs text-slate-400 group-hover:text-white transition-colors">
                                            View Session <ExternalLink size={12} className="ml-1" />
                                        </div>
                                    </motion.a>
                                ))}
                                {sessions.length === 0 && (
                                    <p className="text-slate-400 text-sm italic">No active sessions found.</p>
                                )}
                            </div>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <a href="https://sessionize.com/suzarilshah" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-white transition-colors">
                                View full Sessionize profile
                            </a>
                        </div>
                    </div>
                </div>

                {/* MLSA Involvements */}
                <div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Award className="text-primary-600" size={20} />
                        MLSA Involvements
                    </h3>
                    <div className="space-y-3">
                        {mlsaInvolvements.map((item, idx) => {
                            let Icon = Award;
                            if (item.type === 'video') Icon = Video;
                            if (item.type === 'content') Icon = Globe;
                            if (item.type === 'judge') Icon = Users;

                            return (
                                <a 
                                    key={idx}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors group"
                                >
                                    <div className="mt-1 p-2 bg-white rounded-lg border border-slate-200 text-slate-400 group-hover:text-primary-600 group-hover:border-primary-200 transition-colors shadow-sm">
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-primary-700 transition-colors leading-tight mb-1">
                                            {item.title}
                                        </p>
                                        {item.date && (
                                            <p className="text-xs text-slate-500 font-mono">
                                                {item.date}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
}
