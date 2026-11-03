'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * The site navigation.
 *
 * Two things changed here. The links now come from `site_settings.nav_items`,
 * so the CMS owns them — a hardcoded list is how a link to a deleted #blog
 * section survived on the live site. And the floating pill is opaque once you
 * scroll: at 50% white with a light blur, page headings showed straight
 * through it, and a screenshot caught the word "Recognition" cut in half.
 */

export interface NavItem {
  label: string;
  href: string;
}

const DEFAULT_NAV: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Recognition', href: '#awards' },
  { label: 'Writing', href: '#publications' },
  { label: 'Contact', href: '#contact' },
];

function usableItems(raw: unknown): NavItem[] {
  if (!Array.isArray(raw)) return DEFAULT_NAV;
  const items = raw
    .filter(
      (item): item is NavItem =>
        !!item && typeof item.label === 'string' && typeof item.href === 'string'
    )
    .slice(0, 8);
  return items.length > 0 ? items : DEFAULT_NAV;
}

export default function Navigation({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const reduce = useReducedMotion();

  const items = useMemo(() => usableItems(settings?.nav_items), [settings?.nav_items]);
  const logoText = settings?.logo_text || 'SUZARIL';
  const logoHighlight = settings?.logo_highlight || 'SHAH';
  const logoUrl = settings?.logo_url;

  useEffect(() => {
    // Anchors only. An external link in the nav has no section to highlight.
    const ids = items.filter((i) => i.href.startsWith('#')).map((i) => i.href.slice(1));

    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const current = ids.find((id) => {
        const element = document.getElementById(id);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 160 && rect.bottom >= 160;
      });
      if (current) setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  // The drawer traps the page behind it; leaving the body scrollable lets the
  // page move under the overlay, which reads as the menu being broken.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isExternal = (href: string) => !href.startsWith('#');

  return (
    <>
      <motion.nav
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-x-0 top-3 z-50 px-4 sm:top-4 sm:px-6"
        aria-label="Primary"
      >
        <div
          className={`mx-auto flex max-w-5xl items-center justify-between rounded-full px-5 transition-all duration-300 sm:px-6 ${
            scrolled
              ? 'border border-slate-200 bg-white py-2.5 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-12px_rgb(15_23_42/0.18)]'
              : 'border border-transparent bg-transparent py-3.5'
          }`}
        >
          <a href="#home" className="group relative z-50 shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-7 w-auto object-contain" />
            ) : (
              <span className="flex items-center gap-1 font-display text-[19px] font-bold tracking-tight">
                <span className="text-slate-900">{logoText}</span>
                <span className="text-primary-600">{logoHighlight}</span>
              </span>
            )}
            <span className="sr-only">Back to top</span>
          </a>

          <div className="hidden items-center gap-0.5 md:flex">
            {items.map((item) => {
              const active = !isExternal(item.href) && activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href + item.label}
                  href={item.href}
                  {...(isExternal(item.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            // 44px minimum target; the old one relied on a utility class that
            // did not guarantee it.
            className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-slate-900 transition-colors hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/30 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={reduce ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="absolute inset-y-0 right-0 flex w-[82%] max-w-xs flex-col bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-slate-900 transition-colors hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-col p-3">
                {items.map((item) => {
                  const active = !isExternal(item.href) && activeSection === item.href.slice(1);
                  return (
                    <a
                      key={item.href + item.label}
                      href={item.href}
                      {...(isExternal(item.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                      onClick={() => setIsOpen(false)}
                      className={`rounded-xl px-4 py-3.5 text-[16px] font-medium transition-colors ${
                        active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
