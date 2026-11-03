'use client';

import SectionEditor from '../components/SectionEditor';
import { Button, Field, Input, Label, Meta, TagInput, Textarea } from '../components/ui';
import { Plus, Trash2 } from 'lucide-react';
import { ABOUT_INTEREST_ICONS, DEFAULT_INTEREST_ICON } from '@/lib/content/about';
import { DEFAULT_ABOUT, type AboutContent } from '@/app/components/AboutSection';

const defaultAbout: AboutContent = {
  eyebrow: DEFAULT_ABOUT.eyebrow,
  heading: DEFAULT_ABOUT.heading,
  bio: '',
  skills: DEFAULT_ABOUT.skills,
  quote: DEFAULT_ABOUT.quote,
  interests: DEFAULT_ABOUT.interests,
};

export default function AboutPage() {
  return (
    <SectionEditor<AboutContent>
      sectionKey="about"
      title="About"
      description="Who you are, in your own register."
      defaultContent={defaultAbout}
      renderForm={(content, onChange) => {
        const interests = content.interests ?? [];

        return (
          <div className="space-y-7">
            <div className="grid gap-5 sm:grid-cols-[140px_minmax(0,1fr)]">
              <Field label="Eyebrow">
                <Input
                  value={content.eyebrow || ''}
                  onChange={(e) => onChange({ ...content, eyebrow: e.target.value })}
                />
              </Field>
              <Field label="Heading">
                <Input
                  value={content.heading || ''}
                  onChange={(e) => onChange({ ...content, heading: e.target.value })}
                />
              </Field>
            </div>

            <Field
              label="Biography"
              hint="Leave a blank line between paragraphs. The first one is set larger, so make it carry the point."
            >
              <Textarea
                rows={10}
                value={content.bio || ''}
                onChange={(e) => onChange({ ...content, bio: e.target.value })}
              />
            </Field>

            <Field
              label="What you work with"
              hint="Press Enter after each. These render as the chips under your bio."
            >
              <TagInput
                values={content.skills ?? []}
                max={20}
                onChange={(skills) => onChange({ ...content, skills })}
              />
            </Field>

            <div className="space-y-4 rounded-[var(--r-field)] bg-[var(--sunken)] p-4">
              <Label>Pull quote</Label>
              <Field label="Quote">
                <Input
                  value={content.quote?.text || ''}
                  onChange={(e) =>
                    onChange({ ...content, quote: { ...content.quote, text: e.target.value } })
                  }
                />
              </Field>
              <Field label="Attribution or translation">
                <Input
                  value={content.quote?.attribution || ''}
                  onChange={(e) =>
                    onChange({
                      ...content,
                      quote: { ...content.quote, attribution: e.target.value },
                    })
                  }
                />
              </Field>
              <Meta>Leave the quote empty to hide it entirely.</Meta>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Label>Outside work</Label>
                  <Meta>{interests.length}/6</Meta>
                </div>
                <Button
                  onClick={() =>
                    onChange({
                      ...content,
                      interests: [...interests, { icon: DEFAULT_INTEREST_ICON, label: '' }],
                    })
                  }
                  disabled={interests.length >= 6}
                >
                  <Plus size={14} />
                  Add
                </Button>
              </div>

              {interests.length === 0 ? (
                <p className="rounded-[var(--r-field)] bg-[var(--sunken)] px-4 py-5 text-center text-[13px] text-[var(--muted)]">
                  Nothing listed. The section will be hidden.
                </p>
              ) : (
                <ul className="space-y-2">
                  {interests.map((interest, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {/* The icon list is the same one the renderer looks up,
                          so an unrenderable choice is not offerable. */}
                      <select
                        className="studio-input w-[150px] shrink-0"
                        value={interest.icon || DEFAULT_INTEREST_ICON}
                        onChange={(e) =>
                          onChange({
                            ...content,
                            interests: interests.map((item, i) =>
                              i === index ? { ...item, icon: e.target.value } : item
                            ),
                          })
                        }
                      >
                        {ABOUT_INTEREST_ICONS.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                      <Input
                        value={interest.label || ''}
                        placeholder="Gaming"
                        onChange={(e) =>
                          onChange({
                            ...content,
                            interests: interests.map((item, i) =>
                              i === index ? { ...item, label: e.target.value } : item
                            ),
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        aria-label={`Remove ${interest.label || 'interest'}`}
                        onClick={() =>
                          onChange({
                            ...content,
                            interests: interests.filter((_, i) => i !== index),
                          })
                        }
                      >
                        <Trash2 size={14} />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
