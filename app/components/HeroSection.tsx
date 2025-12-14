'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import EmailCaptureModal from '@/components/EmailCaptureModal';

interface HeroContent {
  headline?: string;
  subheadline?: string;
  description?: string;
}

interface Settings {
  resume_url?: string;
  [key: string]: any;
}

export default function HeroSection({ content, settings }: { content?: HeroContent; settings?: Settings }) {
  const headline = content?.headline || "Azure Cloud Architect & DevOps Advocate";
  const subheadline = content?.subheadline || "Microsoft MVP • Docker Captain • Platform Engineering Leader";
  const description = content?.description || "Muhammad Suzaril Shah - Senior IT Systems Engineer at Swift specializing in Azure Cloud Architecture, Kubernetes orchestration, DevOps automation, and IoT cloud solutions. Microsoft MVP & Docker Captain driving digital transformation across Southeast Asia.";
  const resumeUrl = settings?.resume_url;
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-50/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 -z-10" />
      
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

          {/* Main Headline - Impact Driven */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-slate-900 mb-8 leading-[0.95]"
          >
            {headline}
          </motion.h1>

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
        className="absolute bottom-12 right-12 hidden md:flex items-center gap-4"
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

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        resumeUrl={resumeUrl || ''}
      />
    </section>
  );
}
