'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  EyeOff,
  LayoutGrid,
  type LucideIcon,
  Mail,
  Palette,
  PanelsTopLeft,
  X,
} from 'lucide-react';
import UserMenu from './UserMenu';
import { Dot, Meta, cn } from './ui';
import { SECTION_EDITORS, type SectionRow } from '../sections';

const CONFIG_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/admin/sections', label: 'Order & visibility', icon: LayoutGrid },
  { href: '/admin/badges', label: 'Verified badges', icon: Award },
  { href: '/admin/resume', label: 'Resume downloads', icon: Mail },
  { href: '/admin/settings', label: 'Design & SEO', icon: Palette },
];

export default function AdminNav({
  user,
  sections,
}: {
  user: { displayName: string | null | undefined; primaryEmail: string | null | undefined };
  sections: SectionRow[];
}) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Route change closes the sheet; without this it survives navigation.
  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  const liveCount = sections.filter((s) => s.is_visible !== false).length;

  const sectionLinks = (
    <ul className="space-y-0.5">
      {sections.map((section, index) => {
        const editor = SECTION_EDITORS[section.section_key];
        const hidden = section.is_visible === false;
        const inner = (
          <>
            <span className="studio-meta w-[18px] shrink-0 opacity-60">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={cn('flex-1 truncate', hidden && 'opacity-55')}>
              {editor?.label ?? section.section_key}
            </span>
            {!editor ? (
              <AlertTriangle size={13} className="shrink-0 text-[var(--warn)]" />
            ) : hidden ? (
              <EyeOff size={13} className="shrink-0 opacity-55" />
            ) : (
              <Dot tone="ok" />
            )}
          </>
        );

        return (
          <li key={section.section_key}>
            {editor ? (
              <Link
                href={editor.href}
                data-active={pathname === editor.href}
                className="studio-nav-item"
              >
                {inner}
              </Link>
            ) : (
              <span
                className="studio-nav-item cursor-default opacity-60"
                title="This section has a database row but no editor"
              >
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );

  const configLinks = (
    <ul className="space-y-0.5">
      {CONFIG_LINKS.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link href={href} data-active={pathname === href} className="studio-nav-item">
            <Icon size={15} className="shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  const railBody = (
    <>
      <div className="px-3 pb-4 pt-1">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between gap-2 rounded-full px-3 py-2 transition-colors hover:bg-white/[0.07]"
        >
          <span className="min-w-0">
            <span className="studio-meta block opacity-70">Portfolio CMS</span>
            <span className="block truncate text-[14px] font-medium text-[var(--on-dark)]">
              suzarilshah.uk
            </span>
          </span>
          <ArrowUpRight
            size={14}
            className="shrink-0 text-[var(--on-dark-muted)] transition-colors group-hover:text-[var(--on-dark)]"
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <Link href="/admin" data-active={pathname === '/admin'} className="studio-nav-item mb-4">
          <PanelsTopLeft size={15} />
          Overview
        </Link>

        <div className="mb-2 flex items-center justify-between px-3">
          <Meta className="opacity-70">The page</Meta>
          <Meta className="opacity-70">
            {liveCount}/{sections.length}
          </Meta>
        </div>
        {sectionLinks}

        <div className="mb-2 mt-6 px-3">
          <Meta className="opacity-70">Configuration</Meta>
        </div>
        {configLinks}
      </nav>

      <div className="border-t border-white/10 p-3">
        <UserMenu user={user} />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: a floating dark pill, inset from the canvas edge. */}
      <aside className="fixed inset-y-4 left-4 hidden w-[244px] md:flex">
        <div className="studio-rail flex h-full w-full flex-col py-3">{railBody}</div>
      </aside>

      {/* Mobile: thumb-reachable bar pinned to the bottom. */}
      <nav
        aria-label="Primary"
        className="studio-rail fixed inset-x-3 bottom-3 z-40 flex items-center justify-around px-2 py-2 md:hidden"
      >
        <Link
          href="/admin"
          data-active={pathname === '/admin'}
          className="studio-nav-item flex-col gap-1 px-4 py-1.5 text-[11px]"
        >
          <PanelsTopLeft size={17} />
          Overview
        </Link>
        <Link
          href="/admin/sections"
          data-active={pathname === '/admin/sections'}
          className="studio-nav-item flex-col gap-1 px-4 py-1.5 text-[11px]"
        >
          <LayoutGrid size={17} />
          Pages
        </Link>
        <Link
          href="/admin/settings"
          data-active={pathname === '/admin/settings'}
          className="studio-nav-item flex-col gap-1 px-4 py-1.5 text-[11px]"
        >
          <Palette size={17} />
          Design
        </Link>
        <button
          onClick={() => setSheetOpen(true)}
          aria-expanded={sheetOpen}
          className="studio-nav-item flex-col gap-1 px-4 py-1.5 text-[11px]"
        >
          <span className="flex h-[17px] items-center gap-[3px]">
            <span className="h-[3px] w-[3px] rounded-full bg-current" />
            <span className="h-[3px] w-[3px] rounded-full bg-current" />
            <span className="h-[3px] w-[3px] rounded-full bg-current" />
          </span>
          More
        </button>
      </nav>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSheetOpen(false)}
            aria-hidden
          />
          <div className="studio-rail absolute inset-x-3 bottom-3 top-16 flex flex-col py-3">
            <div className="flex items-center justify-between px-5 pb-2">
              <Meta className="opacity-70">All screens</Meta>
              <button
                onClick={() => setSheetOpen(false)}
                aria-label="Close menu"
                className="studio-nav-item w-auto rounded-full p-2"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3">
              <div className="mb-2 px-3">
                <Meta className="opacity-70">The page</Meta>
              </div>
              {sectionLinks}
              <div className="mb-2 mt-5 px-3">
                <Meta className="opacity-70">Configuration</Meta>
              </div>
              {configLinks}
            </div>
            <div className="border-t border-white/10 p-3">
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
