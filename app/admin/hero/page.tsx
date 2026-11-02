'use client';

import { useState } from 'react';
import SectionEditor from '../components/SectionEditor';
import { X, Plus, Type } from 'lucide-react';

interface HeroContent {
  headline: string;
  subheadline: string;
  description: string;
  typing_phrases: string[];
  curved_text: string;
}

const defaultHero: HeroContent = {
  headline: "Building the Future of",
  subheadline: "Engineering Technologist • Microsoft MVP • Docker Captain",
  description: "I am Muhammad Suzaril Shah, a Senior IT Systems Engineer at Swift. I bridge the gap between complex cloud infrastructure and human impact, specializing in Azure, AI, and DevOps ecosystems.",
  typing_phrases: [
    "Azure Cloud Architect",
    "DevOps Advocate",
    "Platform Engineering Leader",
    "Microsoft MVP",
    "Docker Captain"
  ],
  curved_text: "SHAH"
};

// Tag-style input for typing phrases
function PhrasesInput({
  phrases,
  onChange
}: {
  phrases: string[];
  onChange: (phrases: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');

  const addPhrase = (phrase: string) => {
    const trimmed = phrase.trim();
    if (trimmed && !phrases.includes(trimmed)) {
      onChange([...phrases, trimmed]);
    }
    setInputValue('');
  };

  const removePhrase = (index: number) => {
    onChange(phrases.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPhrase(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && phrases.length > 0) {
      removePhrase(phrases.length - 1);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {phrases.map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-[4px] group"
          >
            {phrase}
            <button
              type="button"
              onClick={() => removePhrase(index)}
              className="hover:bg-primary-200 rounded p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a phrase and press Enter..."
          className="wb-input"
        />
        <button
          type="button"
          onClick={() => addPhrase(inputValue)}
          disabled={!inputValue.trim()}
          className="px-3 py-2 bg-[var(--accent)] text-[#06080b] rounded-[4px] hover:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

export default function HeroPage() {
  return (
    <SectionEditor<HeroContent>
      sectionKey="hero"
      title="Hero Section"
      description="Manage the main introduction banner at the top of your portfolio. Make a strong first impression."
      defaultContent={defaultHero}
      renderForm={(content, onChange) => {
        // Ensure typing_phrases exists
        const normalizedContent = {
          ...defaultHero,
          ...content,
          typing_phrases: content.typing_phrases || defaultHero.typing_phrases,
          curved_text: content.curved_text || defaultHero.curved_text,
        };

        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[var(--text)]">Main Headline</label>
              <p className="text-xs text-[var(--faint)]">The static text before the typing animation (e.g., &quot;Building the Future of&quot;).</p>
              <input
                type="text"
                value={normalizedContent.headline}
                onChange={(e) => onChange({ ...normalizedContent, headline: e.target.value })}
                className="wb-input"
              />
            </div>

            {/* Typing Animation Phrases */}
            <div className="space-y-3 bg-[var(--raised)] p-5 rounded-[4px] border border-[var(--line)]">
              <div className="flex items-center gap-2">
                <Type size={18} className="text-[var(--accent)]" />
                <label className="text-sm font-semibold text-[var(--text)]">Typing Animation Phrases</label>
              </div>
              <p className="text-xs text-[var(--faint)]">These phrases will cycle with a typing animation effect below the headline.</p>
              <PhrasesInput
                phrases={normalizedContent.typing_phrases}
                onChange={(phrases) => onChange({ ...normalizedContent, typing_phrases: phrases })}
              />
              <div className="mt-3 p-3 bg-[var(--surface)] rounded-[4px] border border-[var(--line)]">
                <p className="text-xs text-[var(--faint)] mb-1">Preview:</p>
                <p className="font-display text-lg">
                  <span className="text-[var(--text)]">{normalizedContent.headline} </span>
                  <span className="text-primary-600">{normalizedContent.typing_phrases[0] || '...'}</span>
                  <span className="text-primary-500 animate-pulse">|</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-[var(--text)]">Subheadline (Roles)</label>
              <p className="text-xs text-[var(--faint)]">Your roles or titles, displayed above the headline.</p>
              <input
                type="text"
                value={normalizedContent.subheadline}
                onChange={(e) => onChange({ ...normalizedContent, subheadline: e.target.value })}
                className="wb-input"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-[var(--text)]">Bio Description</label>
              <p className="text-xs text-[var(--faint)]">A short, impactful paragraph introducing yourself.</p>
              <textarea
                value={normalizedContent.description}
                onChange={(e) => onChange({ ...normalizedContent, description: e.target.value })}
                className="wb-input"
              />
            </div>

            {/* Curved Text Settings */}
            <div className="space-y-3 bg-[var(--raised)] p-5 rounded-[4px] border border-[var(--line)]">
              <label className="text-sm font-semibold text-[var(--text)]">Curved Text (Bottom of Hero)</label>
              <p className="text-xs text-[var(--faint)]">This text appears as a decorative curved element at the bottom of the hero section.</p>
              <input
                type="text"
                value={normalizedContent.curved_text}
                onChange={(e) => onChange({ ...normalizedContent, curved_text: e.target.value })}
                className="wb-input"
                placeholder="SHAH"
              />
              <p className="text-xs text-[var(--faint)]">Preview: {(normalizedContent.curved_text || 'SHAH').repeat(3)}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
