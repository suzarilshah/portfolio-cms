'use client';

import { motion } from 'framer-motion';
import { User, Code, Heart, Coffee, Gamepad, Music, Tv } from 'lucide-react';

const skills = [
  'Azure Cloud', 'DevOps', 'Docker', 'Kubernetes', 'CI/CD',
  'Python', 'JavaScript/TypeScript', 'React', 'Next.js',
  'IoT Solutions', 'AI Integration', 'System Architecture'
];

const interests = [
  { icon: Gamepad, label: 'Gaming' },
  { icon: Tv, label: 'Sci-Fi Series' },
  { icon: Music, label: 'Music' },
  { icon: Coffee, label: 'Coffee' }
];

export default function AboutSection({ content, settings }: { content?: any, settings?: any }) {
  const bio = content?.bio || "I'm an Engineering Technologist with a passion for cloud architecture and community building.\n\nMy journey in tech is driven by a curiosity to understand how things work and a desire to make them work better for everyone.";
  const skillsList = content?.skills || skills;
  const profilePhoto = settings?.profile_photo_url;

  return (
    <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image/Profile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 relative mb-8 shadow-2xl shadow-slate-200/50">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <User size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent pointer-events-none" />
            </div>
            
            {/* Quote Card */}
            <div className="absolute -bottom-8 -right-8 max-w-xs bg-white p-6 rounded-xl shadow-xl border border-slate-100 hidden md:block">
              <p className="font-serif italic text-slate-700 mb-2">
                "Aut inveniam viam aut faciam."
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                - I shall either find a way or make one
              </p>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-primary-500" />
              <span className="text-primary-600 font-medium uppercase tracking-wider text-sm">About Me</span>
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Bridging the gap between <span className="text-primary-600">Complex Systems</span> and <span className="text-primary-600">Human Experience</span>.
            </h2>

            <div className="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed mb-8 whitespace-pre-line">
              {bio}
            </div>

            {/* Skills */}
            <div className="mb-10">
              <h3 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Code size={20} className="text-primary-500" />
                Technical Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill: string) => (
                  <span key={skill} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Personal Interests */}
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Heart size={20} className="text-primary-500" />
                Beyond Tech
              </h3>
              <div className="flex gap-6">
                {interests.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors group">
                    <div className="p-3 rounded-full bg-slate-50 group-hover:bg-primary-50 transition-colors">
                      <item.icon size={20} />
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
