'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Download, ExternalLink } from 'lucide-react';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import KineticHeading from '@/components/motion/KineticHeading';
import MagneticButton from '@/components/motion/MagneticButton';
import Marquee from '@/components/motion/Marquee';

/**
 * The hero.
 *
 * Choreography, in order: the eyebrow fades, the headline is revealed word by
 * word behind masks, the tagline follows, the credential strip starts moving,
 * and the CTAs arrive last. Each step hands off to the next rather than
 * everything animating at once, which is the difference between a composed
 * entrance and a page that simply appears.
 *
 * On scroll the whole block drifts upward slightly faster than the page and
 * fades, so the hero recedes behind the content rather than being pushed off
 * the top of it.
 */

export interface HeroCredential {
  label: string;
  issuer?: string;
  url?: string;
  since?: string;
}

export interface HeroCta {
  label?: string;
  href?: string;
}

export interface HeroContent {
  headline?: string;
  tagline?: string;
  description?: string;
  credentials?: HeroCredential[];
  primary_cta?: HeroCta;
  secondary_cta?: HeroCta;
  /** Words in the headline to tint with the accent. */
  highlight?: string[];
  /** Retired; kept so old rows do not fail validation on save. */
  typing_phrases?: string[];
  subheadline?: string;
  curved_text?: string;
}

interface Settings {
  resume_url?: string;
  [key: string]: any;
}

export const DEFAULT_HERO = {
  headline: 'I build the cloud platforms that critical systems run on.',
  tagline: 'Azure architecture, Kubernetes and DevOps at production scale.',
  description:
    'Senior IT Systems & Customer Engineer at Swift in Kuala Lumpur. I design and operate the infrastructure behind financial systems that cannot go down.',
  credentials: [
    { label: 'Microsoft MVP', issuer: 'AI & Azure', url: 'https://mvp.microsoft.com/en-us/PublicProfile/5005264' },
    { label: 'Docker Captain', issuer: 'Docker Inc.', url: 'https://www.docker.com/captains/' },
    { label: 'AWS Community Builder', issuer: 'Amazon Web Services' },
    { label: 'Professional Technologist', issuer: 'MBOT' },
  ] as HeroCredential[],
  primary_cta: { label: 'Start a conversation', href: '#contact' },
  secondary_cta: { label: 'See the work', href: '#projects' },
  highlight: ['critical'],
};

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

  if (!credential.url) {
    return <div className={shell}>{body}</div>;
  }

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

export default function HeroSection({
  content,
  settings,
}: {
  content?: HeroContent;
  settings?: Settings;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const headline = content?.headline || DEFAULT_HERO.headline;
  const tagline = content?.tagline || DEFAULT_HERO.tagline;
  const description = content?.description || DEFAULT_HERO.description;
  const highlight = content?.highlight?.length ? content.highlight : DEFAULT_HERO.highlight;
  const credentials = content?.credentials?.length
    ? content.credentials
    : DEFAULT_HERO.credentials;

  const primary = { ...DEFAULT_HERO.primary_cta, ...(content?.primary_cta || {}) };
  const secondary = { ...DEFAULT_HERO.secondary_cta, ...(content?.secondary_cta || {}) };
  const resumeUrl = settings?.resume_url;

  // Timed against the headline so nothing overlaps its reveal.
  const after = (seconds: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: seconds, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[92svh] scroll-mt-24 flex-col justify-center overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32"
    >
      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="mx-auto w-full max-w-6xl px-5 sm:px-8"
      >
        <motion.div {...after(0.05)} className="mb-7 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            {/* A live indicator, not a decoration: it says the page is
                current and the person is reachable. */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
            Kuala Lumpur · Open to work
          </span>
        </motion.div>

        <KineticHeading
          as="h1"
          text={headline}
          trigger="mount"
          delay={0.15}
          stagger={0.06}
          highlight={highlight}
          className="max-w-[17ch] text-balance font-display text-[42px] font-bold leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-[62px] md:text-[76px] lg:text-[88px]"
        />

        <motion.p
          {...after(0.15 + headline.split(' ').length * 0.06)}
          className="mt-6 max-w-[44ch] text-pretty text-[19px] leading-[1.42] text-slate-600 sm:text-[23px]"
        >
          {tagline}
        </motion.p>
      </motion.div>

      {/* Full-bleed credential strip. Breaking the container is deliberate:
          it signals the page is wider than its text column. */}
      <motion.div
        {...after(0.6)}
        className="relative mt-11 sm:mt-14"
      >
        {/* Three copies per half: four credentials is narrower than a desktop
            viewport, and a band you can see the end of is not a band. */}
        <Marquee speed={46} repeat={3}>
          {credentials.map((credential) => (
            <CredentialChip key={credential.label} credential={credential} />
          ))}
        </Marquee>
      </motion.div>

      <motion.div
        {...after(0.75)}
        className="mx-auto mt-11 w-full max-w-6xl px-5 sm:mt-14 sm:px-8"
      >
        <div className="flex flex-col gap-8 border-t border-slate-200/70 pt-8 md:flex-row md:items-start md:justify-between md:gap-12">
          <p className="max-w-[56ch] text-[15px] leading-relaxed text-slate-500 sm:text-[16px]">
            {description}
          </p>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <MagneticButton
              href={primary.href}
              className="group inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-4 text-[15px] font-medium text-white transition-colors hover:bg-primary-600"
            >
              {primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>

            {resumeUrl ? (
              <MagneticButton
                onClick={() => setShowEmailModal(true)}
                className="group inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-4 text-[15px] font-medium text-slate-900 transition-colors hover:border-slate-900"
              >
                Download CV
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </MagneticButton>
            ) : (
              <MagneticButton
                href={secondary.href}
                className="group inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-4 text-[15px] font-medium text-slate-900 transition-colors hover:border-slate-900"
              >
                {secondary.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            )}
          </div>
        </div>
      </motion.div>

      {!reduce && (
        <motion.a
          href="#about"
          {...after(1.1)}
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition-colors hover:text-slate-900 md:flex"
          aria-label="Scroll to About"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={14} />
          </motion.span>
        </motion.a>
      )}

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        resumeUrl={resumeUrl || ''}
      />
    </section>
  );
}
