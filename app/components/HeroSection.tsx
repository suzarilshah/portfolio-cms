'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import EmailCaptureModal from '@/components/EmailCaptureModal';

/**
 * The hero.
 *
 * The previous version led with an adjective and animated its own job titles,
 * which meant the line under the headline was never fully readable — a
 * screenshot caught "DevOps Advoca|". The credentials that actually
 * distinguish the owner (Microsoft MVP, Docker Captain, AWS Community
 * Builder) were rendered as an 11px eyebrow: the most impressive fact on the
 * site set as the least prominent element.
 *
 * So this leads with proof. The credentials are real, linkable chips at
 * readable size, the tagline is one fixed line, and every string here comes
 * from the database.
 */

export interface HeroCredential {
  label: string;
  issuer?: string;
  /** Optional verification link — a credential you can check is worth more. */
  url?: string;
  since?: string;
}

export interface HeroCta {
  label?: string;
  href?: string;
}

export interface HeroContent {
  headline?: string;
  /** One fixed line under the headline. Replaces the typewriter. */
  tagline?: string;
  description?: string;
  credentials?: HeroCredential[];
  primary_cta?: HeroCta;
  secondary_cta?: HeroCta;
  /** Retired. Kept so old rows do not fail validation on save. */
  typing_phrases?: string[];
  subheadline?: string;
  curved_text?: string;
}

interface Settings {
  resume_url?: string;
  [key: string]: any;
}

export const DEFAULT_HERO: Required<
  Pick<HeroContent, 'headline' | 'tagline' | 'description' | 'credentials' | 'primary_cta' | 'secondary_cta'>
> = {
  headline: 'I build the cloud platforms that banks run on.',
  tagline: 'Azure architecture, Kubernetes and DevOps at production scale.',
  description:
    'Senior IT Systems & Customer Engineer at Swift, Kuala Lumpur. I design and operate the infrastructure behind critical financial systems, and teach what I learn to the communities I serve.',
  credentials: [
    { label: 'Microsoft MVP', issuer: 'AI & Azure', url: 'https://mvp.microsoft.com/en-us/PublicProfile/5005264' },
    { label: 'Docker Captain', issuer: 'Docker Inc.', url: 'https://www.docker.com/captains/' },
    { label: 'AWS Community Builder', issuer: 'Amazon Web Services' },
    { label: 'Professional Technologist', issuer: 'MBOT' },
  ],
  primary_cta: { label: 'Start a conversation', href: '#contact' },
  secondary_cta: { label: 'See the work', href: '#projects' },
};

function CredentialChip({ credential, index }: { credential: HeroCredential; index: number }) {
  const reduce = useReducedMotion();

  const inner = (
    <>
      <span className="block text-[14px] font-semibold leading-tight text-slate-900 sm:text-[15px]">
        {credential.label}
      </span>
      {credential.issuer && (
        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-slate-500">
          {credential.issuer}
          {credential.since ? ` · ${credential.since}` : ''}
        </span>
      )}
    </>
  );

  // A credential with a verification link gets affordance; one without stays
  // a plain chip rather than pretending to be clickable.
  // h-full matters: "AWS Community Builder" wraps to two lines while
  // "Docker Captain" does not, and without it the row came out ragged.
  const className =
    'flex h-full flex-col justify-center rounded-xl border border-slate-200/90 bg-white/80 px-4 py-3 backdrop-blur-[2px] transition-colors';

  return (
    <motion.li
      className="h-full"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 + index * 0.06 }}
    >
      {credential.url ? (
        <a
          href={credential.url}
          target="_blank"
          rel="noreferrer"
          className={`${className} hover:border-primary-300 hover:bg-white`}
        >
          {inner}
        </a>
      ) : (
        <div className={className}>{inner}</div>
      )}
    </motion.li>
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
  const [showEmailModal, setShowEmailModal] = useState(false);

  const headline = content?.headline || DEFAULT_HERO.headline;
  const tagline = content?.tagline || DEFAULT_HERO.tagline;
  const description = content?.description || DEFAULT_HERO.description;
  const credentials =
    content?.credentials && content.credentials.length > 0
      ? content.credentials
      : DEFAULT_HERO.credentials;

  const primary = { ...DEFAULT_HERO.primary_cta, ...(content?.primary_cta || {}) };
  const secondary = { ...DEFAULT_HERO.secondary_cta, ...(content?.secondary_cta || {}) };
  const resumeUrl = settings?.resume_url;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };

  return (
    <section
      id="home"
      className="relative flex min-h-[88svh] scroll-mt-24 flex-col justify-center py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.h1
          {...rise(0)}
          className="max-w-[18ch] text-balance font-display text-[40px] font-bold leading-[1.04] tracking-[-0.035em] text-slate-900 sm:text-[56px] md:text-[68px] lg:text-[76px]"
        >
          {headline}
        </motion.h1>

        <motion.p
          {...rise(0.08)}
          className="mt-5 max-w-[46ch] text-pretty text-[18px] leading-[1.45] text-slate-600 sm:mt-6 sm:text-[22px] md:text-[24px]"
        >
          {tagline}
        </motion.p>

        {credentials.length > 0 && (
          <motion.ul
            {...rise(0.16)}
            className="mt-9 grid max-w-3xl grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-4 sm:gap-3"
          >
            {credentials.slice(0, 4).map((credential, index) => (
              <CredentialChip key={credential.label} credential={credential} index={index} />
            ))}
          </motion.ul>
        )}

        <motion.div
          {...rise(0.3)}
          className="mt-10 flex flex-col gap-8 border-t border-slate-200/80 pt-8 sm:mt-12 md:flex-row md:items-start md:justify-between md:gap-12"
        >
          <p className="max-w-[58ch] text-[15px] leading-relaxed text-slate-500 sm:text-[16px]">
            {description}
          </p>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={primary.href}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-slate-900 px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-primary-600"
            >
              {primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            {resumeUrl ? (
              <button
                onClick={() => setShowEmailModal(true)}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-300 px-6 py-3.5 text-[15px] font-medium text-slate-900 transition-colors hover:border-slate-900"
              >
                Download CV
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </button>
            ) : (
              <a
                href={secondary.href}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-300 px-6 py-3.5 text-[15px] font-medium text-slate-900 transition-colors hover:border-slate-900"
              >
                {secondary.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        resumeUrl={resumeUrl || ''}
      />
    </section>
  );
}
