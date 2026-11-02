'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUpRight,
  Clock,
  History,
  Loader2,
  Monitor,
  PencilLine,
  RotateCcw,
  X,
} from 'lucide-react';
import LivePreview from './LivePreview';
import { SECTION_EDITORS } from '../sections';
import {
  Button,
  Dot,
  EmptyState,
  Label,
  Meta,
  Panel,
  PageHeader,
  Pill,
  SaveBar,
  Toggle,
  type SaveState,
} from './ui';

interface SectionRow {
  is_visible?: boolean | null;
  sort_order?: number | null;
}

interface SectionEditorProps<T> {
  sectionKey: string;
  title: string;
  description: string;
  defaultContent: T;
  renderForm: (content: T, onChange: (newContent: T) => void) => React.ReactNode;
}

const stable = (value: unknown) => JSON.stringify(value);

export default function SectionEditor<T>({
  sectionKey,
  title,
  description,
  defaultContent,
  renderForm,
}: SectionEditorProps<T>) {
  const [content, setContent] = useState<T>(defaultContent);
  // The last state known to be on the server. Dirty is a comparison against
  // this, not a flag someone has to remember to set.
  const [baseline, setBaseline] = useState<string>(stable(defaultContent));
  const [row, setRow] = useState<SectionRow>({});

  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveState>({ status: 'idle' });
  const [togglingVisibility, setTogglingVisibility] = useState(false);

  // Below the split-view breakpoint the two halves become tabs; there is not
  // enough width to show a usable form and a usable page at once.
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<{ id: number; created_at: string }[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // defaultContent is a fresh object literal on every render in most callers,
  // so it cannot be an effect dependency without looping.
  const defaults = useRef(defaultContent);
  const router = useRouter();

  const dirty = stable(content) !== baseline;

  // Clicking another section in the preview is a navigation, so it has to
  // respect the same unsaved-work guard the browser applies to a reload.
  const handlePreviewSelect = useCallback(
    (key: string) => {
      const target = SECTION_EDITORS[key];
      if (!target) return;
      if (dirty && !confirm('Leave this section? Unsaved changes will be lost.')) return;
      router.push(target.href);
    },
    [dirty, router]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/cms/sections?key=${encodeURIComponent(sectionKey)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load section (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const merged = { ...defaults.current, ...(data?.content || {}) } as T;
        setContent(merged);
        setBaseline(stable(merged));
        setRow({ is_visible: data?.is_visible, sort_order: data?.sort_order });
        setLoading(false);
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setSave({ status: 'error', message: error.message });
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  // Browser-level guard. The SaveBar states it, this enforces it.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/cms/history?key=${encodeURIComponent(sectionKey)}`);
      const data = await res.json();
      setHistoryItems(Array.isArray(data) ? data : []);
    } catch {
      setHistoryItems([]);
    }
    setLoadingHistory(false);
  }, [sectionKey]);

  const handleSave = async () => {
    setSave({ status: 'saving' });
    try {
      const res = await fetch('/api/cms/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section_key: sectionKey, content }),
      });

      // The previous version reported success unconditionally, so a rejected
      // write looked identical to a saved one.
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail = Array.isArray(body?.details) ? `: ${body.details.join(', ')}` : '';
        throw new Error(`${body?.error || `Save failed (${res.status})`}${detail}`);
      }

      setBaseline(stable(content));
      setSave({ status: 'idle', savedAt: new Date() });
      if (showHistory) loadHistory();
    } catch (error) {
      setSave({ status: 'error', message: (error as Error).message });
    }
  };

  const handleToggleVisibility = async (next: boolean) => {
    setTogglingVisibility(true);
    const previous = row.is_visible;
    setRow((current) => ({ ...current, is_visible: next }));

    try {
      const res = await fetch('/api/cms/sections/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: [
            {
              section_key: sectionKey,
              sort_order: row.sort_order ?? 0,
              is_visible: next,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error('Could not change visibility');
    } catch (error) {
      setRow((current) => ({ ...current, is_visible: previous }));
      setSave({ status: 'error', message: (error as Error).message });
    }
    setTogglingVisibility(false);
  };

  const handleRestore = async (id: number) => {
    if (!confirm('Load this version into the editor? Unsaved changes will be lost.')) return;
    try {
      const res = await fetch(`/api/cms/history?id=${id}`);
      const data = await res.json();
      if (data?.content) {
        setContent({ ...defaults.current, ...data.content } as T);
        setShowHistory(false);
        setSave({ status: 'idle' });
      }
    } catch {
      setSave({ status: 'error', message: 'Could not restore that version.' });
    }
  };

  // Until the row arrives, `is_visible` is undefined — which must not read as
  // "visible", or the editor briefly asserts the opposite of the truth.
  const known = row.is_visible !== undefined;
  const visible = row.is_visible !== false;

  // The panel column: header, visibility, form and save bar. In split view it
  // scrolls independently of the preview beside it.
  const panel = (
    <div className="pb-2">
      <PageHeader
        compact
        eyebrow={
          <div className="flex items-center gap-2">
            <Label>Section</Label>
            <Meta className="text-[var(--accent)]">{sectionKey}</Meta>
          </div>
        }
        title={title}
        description={description}
        actions={
          <>
            <Button
              variant={showHistory ? 'default' : 'ghost'}
              onClick={() => {
                const next = !showHistory;
                setShowHistory(next);
                if (next) loadHistory();
              }}
            >
              <History size={14} />
              History
            </Button>
            <Link href={`/#${sectionKey}`} target="_blank" rel="noreferrer">
              <Button variant="ghost">
                View live
                <ArrowUpRight size={14} />
              </Button>
            </Link>
          </>
        }
      />

      {/* Visibility sits with the content it governs, rather than on a separate
          reorder screen. */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
        <div className="flex items-center gap-3">
          <Toggle
            checked={known && visible}
            onChange={handleToggleVisibility}
            disabled={!known || togglingVisibility}
            label={`${visible ? 'Hide' : 'Show'} the ${title} section`}
          />
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[var(--text)]">
              {!known
                ? 'Checking visibility…'
                : visible
                  ? 'Visible on the live site'
                  : 'Hidden from the live site'}
            </span>
            {togglingVisibility && (
              <Loader2 size={12} className="animate-spin text-[var(--faint)]" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label>Position</Label>
          <Meta className="studio-meta">{row.sort_order ?? '—'}</Meta>
        </div>
      </div>

      <div className="mt-5">
        <Panel>
          {loading ? (
            <div className="flex items-center justify-center gap-2.5 py-16">
              <Loader2 size={16} className="animate-spin text-[var(--faint)]" />
              <Meta>Loading content…</Meta>
            </div>
          ) : (
            renderForm(content, setContent)
          )}
        </Panel>
      </div>

      <SaveBar
        dirty={dirty}
        state={save}
        onSave={handleSave}
        onReset={() => {
          setContent(JSON.parse(baseline) as T);
          setSave({ status: 'idle' });
        }}
      />

      {showHistory && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowHistory(false)}
            aria-hidden
          />
          <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[340px] flex-col border-l border-[var(--line)] bg-[var(--surface)]">
            <header className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3.5">
              <div className="flex items-center gap-2">
                <History size={14} className="text-[var(--faint)]" />
                <h2 className="text-[13px] font-semibold">Version history</h2>
              </div>
              <Button variant="ghost" onClick={() => setShowHistory(false)} aria-label="Close history">
                <X size={14} />
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto p-3">
              {loadingHistory ? (
                <div className="flex items-center justify-center gap-2 py-12">
                  <Loader2 size={14} className="animate-spin text-[var(--faint)]" />
                  <Meta>Loading…</Meta>
                </div>
              ) : historyItems.length === 0 ? (
                <EmptyState
                  icon={<Clock size={18} />}
                  title="No saved versions yet"
                  description="Every publish writes a revision you can roll back to."
                />
              ) : (
                <ul className="space-y-1.5">
                  {historyItems.map((item, index) => {
                    const at = new Date(item.created_at);
                    return (
                      <li
                        key={item.id}
                        className="group rounded-[4px] border border-[var(--line)] px-3 py-2.5 transition-colors hover:border-[var(--accent-line)]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Meta>
                            {at.toLocaleDateString([], { day: '2-digit', month: 'short' })}{' '}
                            {at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Meta>
                          {index === 0 && <Pill tone="ok">Current</Pill>}
                        </div>
                        <button
                          onClick={() => handleRestore(item.id)}
                          className="studio-label mt-2 flex w-full items-center justify-center gap-1.5 rounded-[3px] border border-[var(--line)] py-1.5 transition-colors hover:border-[var(--accent-line)] hover:text-[var(--accent)]"
                        >
                          <RotateCcw size={11} />
                          Load into editor
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <footer className="border-t border-[var(--line)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Dot />
                <Meta>Loading a version does not publish it.</Meta>
              </div>
            </footer>
          </aside>
        </>
      )}
    </div>
  );

  const preview = (
    <LivePreview sectionKey={sectionKey} content={content} onSelect={handlePreviewSelect} />
  );

  return (
    // `studio-split` widens the admin container; see studio.css.
    <div className="studio-split">
      {/* Tabs, below the split-view breakpoint only. */}
      <div className="mb-4 flex gap-1 rounded-[var(--r-pill)] bg-[var(--sunken)] p-1 xl:hidden">
        {(
          [
            ['edit', 'Edit', PencilLine],
            ['preview', 'Preview', Monitor],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`studio-label flex flex-1 items-center justify-center gap-1.5 rounded-[var(--r-pill)] py-2 transition-colors ${
              tab === id ? 'bg-[var(--card)] text-[var(--text)] shadow-[var(--lift)]' : 'text-[var(--muted)]'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_460px] xl:items-start xl:gap-5">
        {/* Preview first in the DOM on wide screens so it reads left-to-right,
            but the form must come first for keyboard and screen-reader order
            on narrow ones — hence the explicit order classes. */}
        <div
          className={`order-2 xl:order-1 ${tab === 'preview' ? 'block' : 'hidden'} xl:block`}
        >
          <div className="studio-card h-[70vh] overflow-hidden p-0 xl:sticky xl:top-6 xl:h-[calc(100vh-6rem)]">
            {preview}
          </div>
        </div>

        <div className={`order-1 xl:order-2 ${tab === 'edit' ? 'block' : 'hidden'} xl:block`}>
          {panel}
        </div>
      </div>
    </div>
  );
}
