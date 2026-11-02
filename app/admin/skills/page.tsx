'use client';

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import SectionEditor from '../components/SectionEditor';
import { Button, Field, Input, Label, Meta, TagInput, cn } from '../components/ui';
import {
  DEFAULT_SKILLS,
  SKILL_COLORS,
  SKILL_ICONS,
  type SkillCategory,
  type SkillsContent,
} from '@/components/SkillsMatrix';

const ICON_KEYS = Object.keys(SKILL_ICONS) as (keyof typeof SKILL_ICONS)[];

const SWATCH: Record<string, string> = {
  primary: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
};

function CategoryCard({
  category,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  category: SkillCategory;
  index: number;
  total: number;
  onChange: (next: SkillCategory) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const Icon = SKILL_ICONS[category.icon] || SKILL_ICONS.cloud;

  return (
    <li className="rounded-[4px] border border-[var(--line)] bg-[var(--surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-3 py-2.5">
        <GripVertical size={14} className="shrink-0 text-[var(--faint)]" />
        <Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" />
        <span className="studio-meta text-[10px] text-[var(--faint)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 truncate text-[13px]">{category.title || 'Untitled category'}</span>
        <Meta>{category.skills?.length ?? 0}</Meta>
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="px-1.5"
            disabled={index === 0}
            aria-label="Move up"
            onClick={() => onMove(-1)}
          >
            <ChevronUp size={13} />
          </Button>
          <Button
            variant="ghost"
            className="px-1.5"
            disabled={index === total - 1}
            aria-label="Move down"
            onClick={() => onMove(1)}
          >
            <ChevronDown size={13} />
          </Button>
          <Button
            variant="ghost"
            className="px-1.5 hover:text-[var(--danger)]"
            aria-label={`Remove ${category.title || 'category'}`}
            onClick={onRemove}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <Input
              value={category.title}
              onChange={(e) => onChange({ ...category, title: e.target.value })}
              placeholder="Cloud Platforms"
            />
          </Field>

          <Field label="Accent">
            <div className="flex gap-1.5">
              {SKILL_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  aria-pressed={category.color === color}
                  onClick={() => onChange({ ...category, color })}
                  className={cn(
                    'h-[30px] flex-1 rounded-[3px] border transition-colors',
                    category.color === color
                      ? 'border-[var(--accent-line)]'
                      : 'border-[var(--line)] hover:border-[#2c333b]'
                  )}
                >
                  <span className={cn('mx-auto block h-2.5 w-2.5 rounded-full', SWATCH[color])} />
                </button>
              ))}
            </div>
          </Field>
        </div>

        <Field label="Icon">
          <div className="flex flex-wrap gap-1.5">
            {ICON_KEYS.map((key) => {
              const Candidate = SKILL_ICONS[key];
              const active = category.icon === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={key}
                  aria-pressed={active}
                  title={key}
                  onClick={() => onChange({ ...category, icon: key })}
                  className={cn(
                    'flex h-[34px] w-[34px] items-center justify-center rounded-[3px] border transition-colors',
                    active
                      ? 'border-[var(--accent-line)] text-[var(--accent)]'
                      : 'border-[var(--line)] text-[var(--faint)] hover:border-[#2c333b] hover:text-[var(--text)]'
                  )}
                >
                  <Candidate className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Skills" hint="Up to 20 per category. Enter to add, Backspace to remove the last.">
          <TagInput
            values={category.skills || []}
            max={20}
            placeholder="Kubernetes"
            onChange={(skills) => onChange({ ...category, skills })}
          />
        </Field>
      </div>
    </li>
  );
}

export default function SkillsPage() {
  return (
    <SectionEditor<SkillsContent>
      sectionKey="skills"
      title="Skills"
      description="The capability matrix. Until now this section was hardcoded in the component and could not be edited here."
      defaultContent={DEFAULT_SKILLS}
      renderForm={(content, onChange) => {
        const categories = content.categories?.length ? content.categories : DEFAULT_SKILLS.categories;

        const update = (index: number, next: SkillCategory) =>
          onChange({ ...content, categories: categories.map((c, i) => (i === index ? next : c)) });

        const move = (index: number, direction: -1 | 1) => {
          const target = index + direction;
          if (target < 0 || target >= categories.length) return;
          const next = [...categories];
          [next[index], next[target]] = [next[target], next[index]];
          onChange({ ...content, categories: next });
        };

        return (
          <div className="space-y-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" hint="Small label above the heading.">
                <Input
                  value={content.eyebrow ?? ''}
                  onChange={(e) => onChange({ ...content, eyebrow: e.target.value })}
                  placeholder="Technical Expertise"
                />
              </Field>
              <Field label="Heading">
                <Input
                  value={content.heading ?? ''}
                  onChange={(e) => onChange({ ...content, heading: e.target.value })}
                  placeholder="Skills & Technologies"
                />
              </Field>
            </div>

            <Field label="Intro" hint="One sentence under the heading.">
              <Input
                value={content.intro ?? ''}
                onChange={(e) => onChange({ ...content, intro: e.target.value })}
              />
            </Field>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>Categories</Label>
                  <Meta className="studio-meta">{categories.length}/12</Meta>
                </div>
                <Button
                  disabled={categories.length >= 12}
                  onClick={() =>
                    onChange({
                      ...content,
                      categories: [
                        ...categories,
                        { title: '', icon: 'cloud', color: 'primary', skills: [] },
                      ],
                    })
                  }
                >
                  <Plus size={14} />
                  Add category
                </Button>
              </div>

              <ul className="space-y-2.5">
                {categories.map((category, index) => (
                  <CategoryCard
                    key={index}
                    category={category}
                    index={index}
                    total={categories.length}
                    onChange={(next) => update(index, next)}
                    onMove={(direction) => move(index, direction)}
                    onRemove={() =>
                      onChange({
                        ...content,
                        categories: categories.filter((_, i) => i !== index),
                      })
                    }
                  />
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
