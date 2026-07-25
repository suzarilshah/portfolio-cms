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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-lg group"
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
          className="flex-1 p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => addPhrase(inputValue)}
          disabled={!inputValue.trim()}
          className="px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <label className="text-sm font-semibold text-slate-900">Main Headline</label>
              <p className="text-xs text-slate-500">The static text before the typing animation (e.g., "Building the Future of").</p>
              <input
                type="text"
                value={normalizedContent.headline}
                onChange={(e) => onChange({ ...normalizedContent, headline: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-display text-xl font-bold"
              />
            </div>

            {/* Typing Animation Phrases */}
            <div className="space-y-3 bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2">
                <Type size={18} className="text-blue-600" />
                <label className="text-sm font-semibold text-slate-900">Typing Animation Phrases</label>
              </div>
              <p className="text-xs text-slate-500">These phrases will cycle with a typing animation effect below the headline.</p>
              <PhrasesInput
                phrases={normalizedContent.typing_phrases}
                onChange={(phrases) => onChange({ ...normalizedContent, typing_phrases: phrases })}
              />
              <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-slate-500 mb-1">Preview:</p>
                <p className="font-display text-lg">
                  <span className="text-slate-900">{normalizedContent.headline} </span>
                  <span className="text-primary-600">{normalizedContent.typing_phrases[0] || '...'}</span>
                  <span className="text-primary-500 animate-pulse">|</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900">Subheadline (Roles)</label>
              <p className="text-xs text-slate-500">Your roles or titles, displayed above the headline.</p>
              <input
                type="text"
                value={normalizedContent.subheadline}
                onChange={(e) => onChange({ ...normalizedContent, subheadline: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-mono text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900">Bio Description</label>
              <p className="text-xs text-slate-500">A short, impactful paragraph introducing yourself.</p>
              <textarea
                value={normalizedContent.description}
                onChange={(e) => onChange({ ...normalizedContent, description: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none h-32 resize-none text-base"
              />
            </div>

            {/* Curved Text Settings */}
            <div className="space-y-3 bg-purple-50 p-5 rounded-xl border border-purple-100">
              <label className="text-sm font-semibold text-slate-900">Curved Text (Bottom of Hero)</label>
              <p className="text-xs text-slate-500">This text appears as a decorative curved element at the bottom of the hero section.</p>
              <input
                type="text"
                value={normalizedContent.curved_text}
                onChange={(e) => onChange({ ...normalizedContent, curved_text: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none font-display text-lg font-bold"
                placeholder="SHAH"
              />
              <p className="text-xs text-slate-400">Preview: {(normalizedContent.curved_text || 'SHAH').repeat(3)}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
