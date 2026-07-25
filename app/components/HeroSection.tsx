'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import TypingEffect from '@/components/TypingEffect';
import CurvedScrollText from '@/components/CurvedScrollText';

interface HeroContent {
  headline?: string;
  subheadline?: string;
  description?: string;
  typing_phrases?: string[];
  curved_text?: string;
}

interface Settings {
  resume_url?: string;
  [key: string]: any;
}

const defaultTypingPhrases = [
  "Azure Cloud Architect",
  "DevOps Advocate",
  "Platform Engineering Leader",
  "Microsoft MVP",
  "Docker Captain"
];

export default function HeroSection({ content, settings }: { content?: HeroContent; settings?: Settings }) {
  const headline = content?.headline || "Building the Future of";
  const subheadline = content?.subheadline || "Microsoft MVP • Docker Captain • Platform Engineering Leader";
  const description = content?.description || "Muhammad Suzaril Shah - Senior IT Systems Engineer at Swift specializing in Azure Cloud Architecture, Kubernetes orchestration, DevOps automation, and IoT cloud solutions. Microsoft MVP & Docker Captain driving digital transformation across Southeast Asia.";
  const typingPhrases = content?.typing_phrases || defaultTypingPhrases;
  const curvedText = content?.curved_text || "SHAH";
  const resumeUrl = settings?.resume_url;
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Parallax Grid Background - airail.uk style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern with mouse parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            x: mousePosition.x * 0.3,
            y: mousePosition.y * 0.3,
          }}
        >
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgb(var(--p-300))" strokeWidth="0.5" opacity="0.5" />
                <rect x="0" y="0" width="15" height="15" fill="rgb(var(--p-200))" opacity="0.08" />
                <rect x="30" y="30" width="15" height="15" fill="rgb(var(--p-200))" opacity="0.06" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </motion.div>

        {/* Floating Orbs with parallax */}
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
            backgroundColor: 'rgb(var(--p-200) / 0.25)',
          }}
        />
        <motion.div
          className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{
            x: mousePosition.x * -0.3,
            y: mousePosition.y * -0.3,
            backgroundColor: 'rgb(var(--p-100) / 0.3)',
          }}
        />
        <motion.div
          className="absolute -bottom-20 right-1/4 w-[350px] h-[350px] rounded-full blur-3xl"
          style={{
            x: mousePosition.x * 0.2,
            y: mousePosition.y * 0.2,
            backgroundColor: 'rgba(168, 85, 247, 0.08)',
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-20">
        <div className="flex flex-col max-w-5xl mx-auto">
          
          {/* Executive Status Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-primary-500" />
            <span className="font-mono text-sm font-bold tracking-widest text-primary-600 uppercase">
              {subheadline}
            </span>
          </motion.div>

          {/* Main Headline with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              {headline}
            </h1>
            <div className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-600 leading-[1.1] mt-2 min-h-[1.2em]">
              <TypingEffect
                phrases={typingPhrases}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
              />
            </div>
          </motion.div>

          {/* Professional Summary */}
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start border-t border-slate-100 pt-8 md:pt-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-7"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
                {description}
              </p>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-5 flex flex-col gap-4 w-full"
            >
              <a 
                href="#contact" 
                className="group inline-flex items-center justify-between px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-primary-500/25 hover:scale-105"
              >
                <span className="font-medium text-lg">Schedule Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              {resumeUrl ? (
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="group inline-flex items-center justify-between px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-full hover:border-primary-200 hover:bg-slate-50 transition-all duration-300 hover:scale-105 w-full"
                >
                  <span className="font-medium text-lg">Download Resume</span>
                  <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </button>
              ) : (
                <a 
                  href="#experience" 
                  className="group inline-flex items-center justify-between px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-full hover:border-primary-200 hover:bg-slate-50 transition-all duration-300 hover:scale-105"
                >
                  <span className="font-medium text-lg">View Expertise</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-32 right-12 hidden md:flex items-center gap-4 z-10"
      >
        <span className="font-mono text-xs tracking-widest text-slate-400 uppercase rotate-90 origin-right translate-x-2">Scroll</span>
        <div className="h-16 w-[1px] bg-slate-200 overflow-hidden">
          <motion.div
            className="h-full w-full bg-slate-900"
            animate={{ y: [-64, 64] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Curved Text at Bottom of Hero */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <CurvedScrollText text={curvedText} repeatCount={4} />
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        resumeUrl={resumeUrl || ''}
      />
    </section>
  );
}
