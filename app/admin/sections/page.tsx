'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowUpRight, Eye, EyeOff, GripVertical, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import {
  Label,
  Meta,
  PageHeader,
  Panel,
  Pill,
  SaveBar,
  Toggle,
  cn,
  type SaveState,
} from '../components/ui';
import { SECTION_EDITORS } from '../sections';

interface SectionConfig {
  section_key: string;
  sort_order: number;
  is_visible: boolean;
}

const stable = (value: unknown) => JSON.stringify(value);

export default function SectionsReorderPage() {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [baseline, setBaseline] = useState('[]');
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveState>({ status: 'idle' });

  const dirty = stable(sections) !== baseline;

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/sections/reorder');
      if (!res.ok) throw new Error(`Could not load sections (${res.status})`);
      const data = await res.json();
      const rows: SectionConfig[] = Array.isArray(data)
        ? data.map((s) => ({
            section_key: s.section_key,
            sort_order: s.sort_order ?? 0,
            is_visible: s.is_visible !== false,
          }))
        : [];
      setSections(rows);
      setBaseline(stable(rows));
    } catch (error) {
      setSave({ status: 'error', message: (error as Error).message });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...sections];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    // Steps of 10 leave room to insert between rows later.
    setSections(items.map((item, index) => ({ ...item, sort_order: index * 10 })));
  };

  const saveChanges = async () => {
    setSave({ status: 'saving' });
    try {
      const res = await fetch('/api/cms/sections/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Save failed (${res.status})`);
      }
      setBaseline(stable(sections));
      setSave({ status: 'idle', savedAt: new Date() });
    } catch (error) {
      setSave({ status: 'error', message: (error as Error).message });
    }
  };

  const visibleCount = sections.filter((s) => s.is_visible).length;

  return (
    <div>
      <PageHeader
        eyebrow={<Label>Structure</Label>}
        title="Order & visibility"
        description="Drag to set the order a visitor meets each section in. Hiding one removes it from the page without deleting anything."
        actions={
          <Link href="/" target="_blank" rel="noreferrer">
            <button className="wb-btn wb-btn-ghost">
              View live
              <ArrowUpRight size={14} />
            </button>
          </Link>
        }
      />

      <div className="mt-5">
        <Panel
          title="Page order"
          description={`${visibleCount} of ${sections.length} sections are showing.`}
          bodyClassName="p-3"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12">
              <Loader2 size={14} className="animate-spin text-[var(--faint)]" />
              <Meta>Loading…</Meta>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(dropProvided) => (
                  <ul
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    className="space-y-1.5"
                  >
                    {sections.map((section, index) => {
                      const editor = SECTION_EDITORS[section.section_key];
                      return (
                        <Draggable
                          key={section.section_key}
                          draggableId={section.section_key}
                          index={index}
                        >
                          {(dragProvided, snapshot) => (
                            <li
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={cn(
                                'flex items-center gap-3 rounded-[4px] border bg-[var(--surface)] px-3 py-2.5',
                                snapshot.isDragging
                                  ? 'border-[var(--accent-line)]'
                                  : 'border-[var(--line)]',
                                !section.is_visible && 'opacity-60'
                              )}
                            >
                              <span
                                {...dragProvided.dragHandleProps}
                                className="cursor-grab text-[var(--faint)] transition-colors hover:text-[var(--text)] active:cursor-grabbing"
                              >
                                <GripVertical size={15} />
                              </span>

                              <span className="wb-num w-[18px] text-[10px] text-[var(--faint)]">
                                {String(index + 1).padStart(2, '0')}
                              </span>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] text-[var(--text)]">
                                  {editor?.label ?? section.section_key}
                                </p>
                                <Meta>{editor?.blurb ?? 'No editor available'}</Meta>
                              </div>

                              {!editor && (
                                <Pill tone="warn">
                                  <AlertTriangle size={10} /> No editor
                                </Pill>
                              )}

                              {editor && (
                                <Link
                                  href={editor.href}
                                  className="wb-btn wb-btn-ghost hidden px-2 sm:inline-flex"
                                >
                                  Edit
                                </Link>
                              )}

                              <span className="flex items-center gap-2">
                                {section.is_visible ? (
                                  <Eye size={13} className="text-[var(--ok)]" />
                                ) : (
                                  <EyeOff size={13} className="text-[var(--faint)]" />
                                )}
                                <Toggle
                                  checked={section.is_visible}
                                  label={`${section.is_visible ? 'Hide' : 'Show'} ${
                                    editor?.label ?? section.section_key
                                  }`}
                                  onChange={(next) =>
                                    setSections((current) =>
                                      current.map((s, i) =>
                                        i === index ? { ...s, is_visible: next } : s
                                      )
                                    )
                                  }
                                />
                              </span>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                    {dropProvided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Panel>
      </div>

      <SaveBar
        dirty={dirty}
        state={save}
        onSave={saveChanges}
        onReset={() => {
          setSections(JSON.parse(baseline));
          setSave({ status: 'idle' });
        }}
      />
    </div>
  );
}
