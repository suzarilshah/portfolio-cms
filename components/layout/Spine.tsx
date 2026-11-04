'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/**
 * The spine.
 *
 * The old page was nine centred blocks stacked vertically, which is the shape
 * every portfolio template has. This replaces the top navigation on wide
 * screens with a fixed left rail, and that one move changes what the page is:
 * the content no longer floats in the middle of the viewport, it hangs off a
 * permanent edge. The page reads as a document with a margin rather than a
 * sequence of slides.
 *
 * The rail carries three things a recruiter actually needs on screen at all
 * times — who you are, where they are in the document, and how to contact you.
 * A floating pill nav carries one of those.
 *
 * Section order and labels both come from the database: `order` is the same
 * `renderOrder` the page renders, so adding or hiding a section in the CMS
 * changes the index with no code change, and a label override can be supplied
 * through `site_settings.nav_items`.
 */

const FALLBACK_LABELS: Record<string, string> = {
  hero: 'Intro',
  about: 'About',
  skills: 'Skills',
  projects: 'Selected work',
  experience: 'Experience',
  education: 'Education',
  awards: 'Recognition',
  publications: 'Writing',
  community: 'Community',
  contact: 'Contact',
};

interface NavItem {
  label: string;
  href: string;
}

export interface SpineProps {
  /** The page's render order, straight from `content_sections`. */
  order: string[];
  settings?: Record<string, any>;
}

/** Label overrides keyed by section, read out of the CMS nav items. */
function labelsFrom(navItems: unknown): Record<string, string> {
  if (!Array.isArray(navItems)) return {};
  const out: Record<string, string> = {};
  for (const item of navItems as NavItem[]) {
    if (!item || typeof item.href !== 'string' || typeof item.label !== 'string') continue;
    if (item.href.startsWith('#')) out[item.href.slice(1)] = item.label;
  }
  return out;
}

export default function Spine({ order, settings }: SpineProps) {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  // A spring on the progress rule: the raw value tracks scroll exactly, which
  // reads as jittery on a trackpad. A light spring makes it feel weighted.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  const labels = labelsFrom(settings?.nav_items);
  const identity = settings?.identity || {};
  const name = identity.name || `${settings?.logo_text ?? 'Suzaril'} ${settings?.logo_highlight ?? 'Shah'}`;
  const role = identity.role || 'Senior IT Systems & Customer Engineer';
  const location = identity.location || 'Kuala Lumpur, Malaysia';
  const availability = identity.availability || 'Open to work';

  // `hero` is the top of the page, not an entry in an index of it.
  const entries = order.filter((key) => key !== 'hero');

  useEffect(() => {
    const ids = order.filter((key) => key !== 'hero');
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    // rootMargin pulls the detection band to the upper third of the viewport,
    // so a section becomes "active" when its head reaches reading position
    // rather than when its last pixel leaves the bottom of the screen.
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [order]);

  return (
    <aside
      aria-label="Document index"
      className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-[300px] flex-col justify-between px-10 py-12 xl:flex 2xl:w-[340px] 2xl:px-12"
    >
      {/* Identity. The masthead of the document. */}
      <div className="pointer-events-auto">
        <a href="#home" className="group block">
          <h2 className="font-display text-[26px] font-bold leading-[1.05] tracking-[-0.03em] text-slate-900">
            {name}
          </h2>
          <p className="mt-2 max-w-[22ch] text-[13px] leading-snug text-slate-500">{role}</p>
        </a>

        <div className="mt-5 flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
            {availability}
          </span>
        </div>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
          {location}
        </p>
      </div>

      {/* The index. A numbered table of contents that tracks reading
          position — the thing a long single-page CV has always needed. */}
      <nav ref={navRef} className="pointer-events-auto relative my-10 flex-1 overflow-hidden">
        <div className="flex h-full items-center">
          <div className="relative w-full">
            {/* The rule, and the read-so-far portion of it. */}
            <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-slate-900/10" />
            <motion.span
              aria-hidden
              style={reduce ? { scaleY: 0 } : { scaleY: progress }}
              className="absolute inset-y-0 left-0 w-px origin-top bg-slate-900/55"
            />

            <ul className="flex flex-col gap-0.5 pl-5">
              {entries.map((key, index) => {
                const isActive = active === key;
                return (
                  <li key={key}>
                    <a
                      href={`#${key}`}
                      aria-current={isActive ? 'true' : undefined}
                      className="group flex items-baseline gap-3 py-[7px]"
                    >
                      <span
                        className={`font-mono text-[10px] tabular-nums transition-colors duration-300 ${
                          isActive ? 'text-primary-600' : 'text-slate-300 group-hover:text-slate-400'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="relative overflow-hidden">
                        <span
                          className={`block text-[13px] transition-all duration-300 ${
                            isActive
                              ? 'translate-x-0 font-medium text-slate-900'
                              : 'text-slate-400 group-hover:translate-x-0.5 group-hover:text-slate-700'
                          }`}
                        >
                          {labels[key] || FALLBACK_LABELS[key] || key}
                        </span>
                        {/* The active entry is underscored rather than
                            highlighted: a filled pill in a quiet rail shouts. */}
                        <span
                          aria-hidden
                          className={`absolute bottom-0 left-0 h-px w-full origin-left bg-slate-900 transition-transform duration-500 ${
                            isActive ? 'scale-x-100' : 'scale-x-0'
                          }`}
                        />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      <div className="pointer-events-auto">
        <a
          href="#contact"
          className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-900"
        >
          <span className="relative">
            Get in touch
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-slate-900 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0" />
          </span>
          <ArrowUpRight
            size={13}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </aside>
  );
}
