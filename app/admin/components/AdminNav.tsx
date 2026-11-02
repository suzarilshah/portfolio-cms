'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  EyeOff,
  LayoutGrid,
  Mail,
  Menu,
  Palette,
  X,
} from 'lucide-react';
import UserMenu from './UserMenu';
import { Dot, Label, Meta, cn } from './ui';
import { SECTION_EDITORS, type SectionRow, issueFor } from '../sections';

const CONFIG_LINKS = [
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
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const body = (
    <>
      <div className="border-b border-[var(--line)] px-4 py-4">
        <Label>Portfolio CMS</Label>
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="group mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[var(--text)]"
        >
          suzarilshah.uk
          <ArrowUpRight
            size={13}
            className="text-[var(--faint)] transition-colors group-hover:text-[var(--accent)]"
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Link
          href="/admin"
          onClick={close}
          data-active={pathname === '/admin'}
          className="wb-nav-item mb-4"
        >
          <LayoutGrid size={14} />
          Overview
        </Link>

        {/* The live page, in render order. Reading top to bottom here is
            reading the site top to bottom. */}
        <div className="mb-1.5 flex items-center justify-between px-2.5">
          <Label>The page</Label>
          <Meta className="wb-num">{sections.filter((s) => s.is_visible !== false).length}/{sections.length}</Meta>
        </div>

        <ul className="space-y-0.5">
          {sections.map((section, index) => {
            const editor = SECTION_EDITORS[section.section_key];
            const issue = issueFor(section.section_key);
            const hidden = section.is_visible === false;
            const active = editor ? pathname === editor.href : false;

            const inner = (
              <>
                <span className="wb-num w-[18px] shrink-0 text-[10px] text-[var(--faint)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={cn('flex-1 truncate', hidden && 'text-[var(--faint)]')}>
                  {editor?.label ?? section.section_key}
                </span>
                {issue === 'no-editor' ? (
                  <AlertTriangle size={12} className="shrink-0 text-[var(--warn)]" />
                ) : hidden ? (
                  <EyeOff size={12} className="shrink-0 text-[var(--faint)]" />
                ) : (
                  <Dot tone="ok" />
                )}
              </>
            );

            return (
              <li key={section.section_key}>
                {editor ? (
                  <Link href={editor.href} onClick={close} data-active={active} className="wb-nav-item">
                    {inner}
                  </Link>
                ) : (
                  <span
                    className="wb-nav-item cursor-default opacity-70"
                    title="This section has a database row but no editor"
                  >
                    {inner}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mb-1.5 mt-6 px-2.5">
          <Label>Configuration</Label>
        </div>
        <ul className="space-y-0.5">
          {CONFIG_LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} onClick={close} data-active={pathname === href} className="wb-nav-item">
                <Icon size={14} className="shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[var(--line)] p-3">
        <UserMenu user={user} />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--line)] bg-[var(--bg)] px-4 md:hidden">
        <Label>Portfolio CMS</Label>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="wb-btn wb-btn-ghost px-2"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={close} aria-hidden />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[248px] flex-col border-r border-[var(--line)] bg-[var(--surface)]',
          'transition-transform duration-200 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {body}
      </aside>
    </>
  );
}
