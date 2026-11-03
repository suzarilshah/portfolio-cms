'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Camera,
  Coffee,
  Dumbbell,
  Gamepad2,
  Music,
  Plane,
  Sparkles,
  Tv,
  User,
  type LucideIcon,
} from 'lucide-react';
import { DEFAULT_INTEREST_ICON, type AboutInterestIcon } from '@/lib/content/about';

/**
 * About.
 *
 * The previous version put a 390px unbroken paragraph next to a 584px square
 * portrait, which made the section 930px tall and the bio a wall. The copy
 * also opened with a credential run-on and slid into diary register, which
 * undercut the authority the credentials had just established.
 *
 * Structurally: the bio splits on blank lines so the first paragraph can act
 * as a lede, the portrait is no longer square, and everything — heading,
 * quote, interests — comes from the database.
 */

// The names live in lib/content/about so the validator can share them
// without importing this client component.
const INTEREST_ICONS: Record<AboutInterestIcon, LucideIcon> = {
  gaming: Gamepad2,
  tv: Tv,
  music: Music,
  coffee: Coffee,
  reading: BookOpen,
  travel: Plane,
  photography: Camera,
  fitness: Dumbbell,
  sparkle: Sparkles,
};

export interface AboutContent {
  eyebrow?: string;
  heading?: string;
  bio?: string;
  skills?: string[];
  quote?: { text?: string; attribution?: string };
  interests?: { icon?: string; label?: string }[];
}

export const DEFAULT_ABOUT = {
  eyebrow: 'About',
  heading: 'I make complex infrastructure feel ordinary.',
  skills: [
    'Azure Cloud',
    'Kubernetes',
    'Docker',
    'Terraform',
    'CI/CD',
    'Python',
    'TypeScript',
    'Next.js',
    'IoT',
    'AI Integration',
    'System Architecture',
  ],
  quote: {
    text: 'Aut inveniam viam aut faciam.',
    attribution: 'I shall either find a way or make one',
  },
  interests: [
    { icon: 'gaming', label: 'Gaming' },
    { icon: 'tv', label: 'Sci-Fi' },
    { icon: 'music', label: 'Music' },
    { icon: 'coffee', label: 'Coffee' },
  ],
};

export default function AboutSection({
  content,
  settings,
}: {
  content?: AboutContent;
  settings?: any;
}) {
  const reduce = useReducedMotion();

  const eyebrow = content?.eyebrow || DEFAULT_ABOUT.eyebrow;
  const heading = content?.heading || DEFAULT_ABOUT.heading;
  const skills = content?.skills?.length ? content.skills : DEFAULT_ABOUT.skills;
  const quote = content?.quote?.text ? content.quote : DEFAULT_ABOUT.quote;
  const interests = content?.interests?.length ? content.interests : DEFAULT_ABOUT.interests;
  const profilePhoto = settings?.profile_photo_url;

  // Blank lines are paragraph breaks. Rendering the bio as one block was what
  // made it a wall; this lets the first line carry weight on its own.
  const paragraphs = (content?.bio || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const fadeIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.5 },
      };

  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <motion.div {...fadeIn} className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
              {profilePhoto ? (
                <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-slate-300">
                  <User size={56} />
                </div>
              )}
            </div>

            {quote?.text && (
              <figure className="mt-5 border-l-2 border-primary-500 pl-4">
                <blockquote className="text-[15px] italic leading-relaxed text-slate-700">
                  “{quote.text}”
                </blockquote>
                {quote.attribution && (
                  <figcaption className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">
                    {quote.attribution}
                  </figcaption>
                )}
              </figure>
            )}
          </motion.div>

          <motion.div {...fadeIn}>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary-600">
              {eyebrow}
            </span>

            <h2 className="mt-3 max-w-[20ch] text-balance text-[30px] font-bold leading-[1.12] tracking-[-0.03em] text-slate-900 sm:text-[38px]">
              {heading}
            </h2>

            {paragraphs.length > 0 && (
              <div className="mt-6 space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? 'text-[17px] leading-relaxed text-slate-700 sm:text-[18px]'
                        : 'text-[15px] leading-relaxed text-slate-600 sm:text-[16px]'
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-9 border-t border-slate-200/80 pt-7">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                What I work with
              </h3>
              <ul className="mt-3.5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-[13px] text-slate-700"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {interests.length > 0 && (
              <div className="mt-7 border-t border-slate-200/80 pt-7">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                  Outside work
                </h3>
                <ul className="mt-3.5 flex flex-wrap gap-2.5">
                  {interests.map((interest) => {
                    const Icon =
                      INTEREST_ICONS[interest.icon as AboutInterestIcon] ??
                      INTEREST_ICONS[DEFAULT_INTEREST_ICON];
                    return (
                      <li
                        key={interest.label}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-2 text-[13px] text-slate-600"
                      >
                        <Icon size={14} className="text-slate-400" />
                        {interest.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
