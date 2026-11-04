'use client';

import SectionEditor from '../components/SectionEditor';
import { Button, Field, Input, Label, Meta, Textarea } from '../components/ui';
import { Award, GripVertical, Plus, Trash2 } from 'lucide-react';
import { DEFAULT_HERO, type HeroContent, type HeroCredential } from '@/app/components/HeroSection';

/**
 * The hero editor.
 *
 * It edits what the hero now renders: a headline, one fixed tagline, up to
 * four credentials, a paragraph and two CTAs. The old fields it replaced —
 * typing phrases and curved text — are gone from this screen; curved text in
 * particular had outlived the component that drew it, so the CMS was offering
 * control over something the page could not render.
 */

const defaultHero: HeroContent = {
  headline: DEFAULT_HERO.headline,
  tagline: DEFAULT_HERO.tagline,
  description: DEFAULT_HERO.description,
  credentials: DEFAULT_HERO.credentials,
  primary_cta: DEFAULT_HERO.primary_cta,
  secondary_cta: DEFAULT_HERO.secondary_cta,
};

const MAX_CREDENTIALS = 4;

function CredentialRow({
  credential,
  index,
  onChange,
  onRemove,
  onMove,
  isFirst,
  isLast,
}: {
  credential: HeroCredential;
  index: number;
  onChange: (next: HeroCredential) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <li className="rounded-[var(--r-field)] border border-[var(--line)] bg-[var(--sunken)] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-[var(--faint)]" />
          <Meta>Slot {index + 1}</Meta>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => onMove(-1)}
            disabled={isFirst}
            aria-label={`Move ${credential.label || 'credential'} earlier`}
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            onClick={() => onMove(1)}
            disabled={isLast}
            aria-label={`Move ${credential.label || 'credential'} later`}
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            onClick={onRemove}
            aria-label={`Remove ${credential.label || 'credential'}`}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Field label="Credential">
          <Input
            value={credential.label || ''}
            placeholder="Microsoft MVP"
            onChange={(e) => onChange({ ...credential, label: e.target.value })}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Issuer">
            <Input
              value={credential.issuer || ''}
              placeholder="AI & Azure"
              onChange={(e) => onChange({ ...credential, issuer: e.target.value })}
            />
          </Field>
          <Field label="Since">
            <Input
              value={credential.since || ''}
              placeholder="2023"
              onChange={(e) => onChange({ ...credential, since: e.target.value })}
            />
          </Field>
        </div>
        <Field
          label="Verification link"
          hint="Optional. A credential a recruiter can check is worth more than one they cannot."
        >
          <Input
            value={credential.url || ''}
            placeholder="https://mvp.microsoft.com/…"
            onChange={(e) => onChange({ ...credential, url: e.target.value })}
          />
        </Field>
      </div>
    </li>
  );
}

export default function HeroEditor() {
  return (
    <SectionEditor<HeroContent>
      sectionKey="hero"
      title="Hero"
      description="The first screen. Lead with proof, not adjectives."
      defaultContent={defaultHero}
      renderForm={(content, onChange) => {
        const credentials = content.credentials ?? [];

        const setCredentials = (next: HeroCredential[]) =>
          onChange({ ...content, credentials: next });

        return (
          <div className="space-y-7">
            <Field
              label="Headline"
              hint="One concrete sentence about what you do. Specifics beat superlatives."
            >
              <Textarea
                rows={2}
                value={content.headline || ''}
                onChange={(e) => onChange({ ...content, headline: e.target.value })}
              />
            </Field>

            <Field
              label="Strapline"
              hint="The small line above the headline, set in mono caps."
            >
              <Input
                value={content.subheadline ?? content.tagline ?? ''}
                onChange={(e) => onChange({ ...content, subheadline: e.target.value })}
              />
            </Field>

            <Field
              label="Rotating phrases"
              hint="One per line. These cycle under the headline in the typing animation."
            >
              <Textarea
                rows={5}
                value={(content.typing_phrases || []).join('\n')}
                onChange={(e) =>
                  onChange({
                    ...content,
                    // Split on save rather than on every keystroke would drop
                    // the blank line you are mid-way through typing.
                    typing_phrases: e.target.value.split('\n'),
                  })
                }
              />
            </Field>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Award size={15} className="text-[var(--accent)]" />
                  <Label>Credentials</Label>
                  <Meta>
                    {credentials.length}/{MAX_CREDENTIALS}
                  </Meta>
                </div>
                <Button
                  onClick={() => setCredentials([...credentials, { label: '' }])}
                  disabled={credentials.length >= MAX_CREDENTIALS}
                >
                  <Plus size={14} />
                  Add
                </Button>
              </div>
              <p className="mb-3 text-[13px] leading-relaxed text-[var(--faint)]">
                These are the strongest facts on your site. The hero lays out four across, so a
                fifth would be saved but never rendered.
              </p>

              {credentials.length === 0 ? (
                <p className="rounded-[var(--r-field)] bg-[var(--sunken)] px-4 py-6 text-center text-[13px] text-[var(--muted)]">
                  No credentials yet. The hero will fall back to the defaults.
                </p>
              ) : (
                <ul className="space-y-3">
                  {credentials.map((credential, index) => (
                    <CredentialRow
                      key={index}
                      credential={credential}
                      index={index}
                      isFirst={index === 0}
                      isLast={index === credentials.length - 1}
                      onChange={(next) =>
                        setCredentials(credentials.map((c, i) => (i === index ? next : c)))
                      }
                      onRemove={() => setCredentials(credentials.filter((_, i) => i !== index))}
                      onMove={(direction) => {
                        const target = index + direction;
                        if (target < 0 || target >= credentials.length) return;
                        const next = [...credentials];
                        [next[index], next[target]] = [next[target], next[index]];
                        setCredentials(next);
                      }}
                    />
                  ))}
                </ul>
              )}
            </div>

            <Field label="Supporting paragraph" hint="Context under the fold line. Two sentences is plenty.">
              <Textarea
                rows={4}
                value={content.description || ''}
                onChange={(e) => onChange({ ...content, description: e.target.value })}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              {(
                [
                  ['primary_cta', 'Primary button'],
                  ['secondary_cta', 'Secondary button'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-3 rounded-[var(--r-field)] bg-[var(--sunken)] p-4">
                  <Label>{label}</Label>
                  <Field label="Text">
                    <Input
                      value={content[key]?.label || ''}
                      onChange={(e) =>
                        onChange({ ...content, [key]: { ...content[key], label: e.target.value } })
                      }
                    />
                  </Field>
                  <Field label="Link" hint="#section or https://…">
                    <Input
                      value={content[key]?.href || ''}
                      onChange={(e) =>
                        onChange({ ...content, [key]: { ...content[key], href: e.target.value } })
                      }
                    />
                  </Field>
                </div>
              ))}
            </div>

            <p className="studio-meta border-t border-[var(--line-soft)] pt-4 leading-relaxed">
              The secondary button is replaced by a CV download whenever a resume file is set under
              Design &amp; SEO.
            </p>
          </div>
        );
      }}
    />
  );
}
