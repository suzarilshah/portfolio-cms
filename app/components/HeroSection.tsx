'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import TypingEffect from '@/components/TypingEffect';
import Marquee from '@/components/motion/Marquee';

export interface HeroCredential {
  label: string;
  issuer?: string;
  url?: string;
  since?: string;
}

export interface HeroContent {
  headline?: string;
  subheadline?: string;
  description?: string;
  typing_phrases?: string[];
  curved_text?: string;
  /** The credential belt. Kept from the redesign at your request. */
  credentials?: HeroCredential[];
  /** Retired fields, declared so old rows do not fail validation on save. */
  tagline?: string;
  primary_cta?: { label?: string; href?: string };
  secondary_cta?: { label?: string; href?: string };
  highlight?: string[];
}

/**
 * Defaults, exported because the Hero editor in /admin seeds its form from
 * them. The editor and this component must agree on field names or the CMS
 * writes to keys nothing renders.
 *
 * `tagline`, `primary_cta` and `secondary_cta` are kept because the editor
 * still offers them; this layout uses `subheadline` and its own buttons, so
 * `tagline` is read as a fallback for `subheadline` rather than ignored.
 */
export const DEFAULT_HERO = {
  headline: 'Building the Future of',
  subheadline: 'Microsoft MVP • Docker Captain • Platform Engineering Leader',
  tagline: 'Microsoft MVP • Docker Captain • Platform Engineering Leader',
  description:
    'Muhammad Suzaril Shah, Senior IT Systems Engineer at Swift specializing in Azure Cloud Architecture, Kubernetes orchestration, DevOps automation, and IoT cloud solutions. Microsoft MVP and Docker Captain driving digital transformation across Southeast Asia.',
  typing_phrases: [
    'Azure Cloud Architect',
    'DevOps Advocate',
    'Platform Engineering Leader',
    'Microsoft MVP',
    'Docker Captain',
  ],
  credentials: [] as HeroCredential[],
  primary_cta: { label: 'Schedule Consultation', href: '#contact' },
  secondary_cta: { label: 'View Expertise', href: '#experience' },
};

const DEFAULT_CREDENTIALS: HeroCredential[] = [
  { label: 'Microsoft MVP', issuer: 'AI & Azure', url: 'https://mvp.microsoft.com/en-us/PublicProfile/5005264' },
  { label: 'Docker Captain', issuer: 'Docker Inc.', url: 'https://www.docker.com/captains/' },
  { label: 'AWS Community Builder', issuer: 'Amazon Web Services' },
  { label: 'Professional Technologist', issuer: 'MBOT' },
];

function CredentialChip({ credential }: { credential: HeroCredential }) {
  const body = (
    <>
      <span className="block whitespace-nowrap text-[14px] font-semibold leading-tight text-slate-900">
        {credential.label}
      </span>
      {credential.issuer && (
        <span className="mt-0.5 block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] text-slate-500">
          {credential.issuer}
          {credential.since ? ` · ${credential.since}` : ''}
        </span>
      )}
    </>
  );

  const shell =
    'mx-1.5 flex items-center gap-3 rounded-full border border-slate-200/90 bg-white/70 py-2.5 pl-5 pr-5 backdrop-blur-sm transition-colors';

  if (!credential.url) return <div className={shell}>{body}</div>;

  return (
    <a
      href={credential.url}
      target="_blank"
      rel="noreferrer"
      className={`${shell} group hover:border-primary-300 hover:bg-white`}
    >
      <span>{body}</span>
      <ExternalLink
        size={12}
        className="shrink-0 text-slate-300 transition-colors group-hover:text-primary-600"
      />
    </a>
  );
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
  // `tagline` is what the current Hero editor writes; `subheadline` is what
  // this layout has always read. Accepting both means the CMS keeps driving
  // the strapline whichever field the editor happens to save.
  const subheadline = content?.subheadline || content?.tagline || DEFAULT_HERO.subheadline;
  const description = content?.description || "Muhammad Suzaril Shah - Senior IT Systems Engineer at Swift specializing in Azure Cloud Architecture, Kubernetes orchestration, DevOps automation, and IoT cloud solutions. Microsoft MVP & Docker Captain driving digital transformation across Southeast Asia.";
  const typingPhrases = content?.typing_phrases || defaultTypingPhrases;
  const credentials = content?.credentials?.length ? content.credentials : DEFAULT_CREDENTIALS;
  const resumeUrl = settings?.resume_url;
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="flex flex-col max-w-5xl mx-auto">
          
          {/* Executive Status Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          >
            <div className="h-[1px] w-8 sm:w-12 bg-primary-500" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-primary-600 uppercase">
              {subheadline}
            </span>
          </motion.div>

          {/* Main Headline with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              {headline}
            </h1>
            <div className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-primary-600 leading-[1.1] mt-2 min-h-[1.2em]">
              <TypingEffect
                phrases={typingPhrases}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
              />
            </div>
          </motion.div>

          {/* Professional Summary */}
          <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-start border-t border-slate-100 pt-6 md:pt-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-7"
            >
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-light">
                {description}
              </p>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-5 flex flex-col gap-3 sm:gap-4 w-full"
            >
              <a
                href="#contact"
                className="group inline-flex items-center justify-between px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white rounded-full hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-primary-500/25 hover:scale-105"
              >
                <span className="font-medium text-base sm:text-lg">Schedule Consultation</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              {resumeUrl ? (
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="group inline-flex items-center justify-between px-6 sm:px-8 py-3 sm:py-4 bg-white border border-slate-200 text-slate-900 rounded-full hover:border-primary-200 hover:bg-slate-50 transition-all duration-300 hover:scale-105 w-full"
                >
                  <span className="font-medium text-base sm:text-lg">Download Resume</span>
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-1 transition-transform" />
                </button>
              ) : (
                <a
                  href="#experience"
                  className="group inline-flex items-center justify-between px-6 sm:px-8 py-3 sm:py-4 bg-white border border-slate-200 text-slate-900 rounded-full hover:border-primary-200 hover:bg-slate-50 transition-all duration-300 hover:scale-105"
                >
                  <span className="font-medium text-base sm:text-lg">View Expertise</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Credential belt. Deliberately outside the centred container so it
          runs the full width of the viewport: a band you can see the end of
          is not a band. Three copies per half keeps it continuous on a wide
          screen, where four chips would otherwise leave a visible seam. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="relative z-10 mt-12 sm:mt-16"
      >
        <Marquee speed={46} repeat={3}>
          {credentials.map((credential) => (
            <CredentialChip key={credential.label} credential={credential} />
          ))}
        </Marquee>
      </motion.div>

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

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        resumeUrl={resumeUrl || ''}
      />
    </section>
  );
}
