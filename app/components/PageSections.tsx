'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import SkillsMatrix from '@/components/SkillsMatrix';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import AwardsSection from './AwardsSection';
import PublicationsSection from './PublicationsSection';
import CommunitySection from './CommunitySection';
import ContactSection from './ContactSection';
import {
  PREVIEW_CHANNEL,
  PREVIEW_PARAM,
  applyDrafts,
  parseEditorMessage,
  type PreviewMessage,
} from '@/lib/preview/protocol';

/**
 * The public page's section renderer.
 *
 * `app/page.tsx` stays a server component and owns the database read; this
 * owns the key → component map, because in preview mode the content has to be
 * replaceable from the client. Every section component is already
 * `'use client'`, so re-rendering one with draft content costs nothing.
 *
 * Outside preview mode this is an ordinary pass-through: no listener, no
 * overlay, no extra state. The preview machinery must not be something a
 * visitor can reach or notice.
 */

interface Settings {
  [key: string]: unknown;
}

interface PageSectionsProps {
  sectionData: Record<string, unknown>;
  renderOrder: string[];
  badges: unknown[];
  settings: Settings;
  /** Rendered on the server because projects come from their own query. */
  projectsSlot: React.ReactNode;
}

export default function PageSections({
  sectionData,
  renderOrder,
  badges,
  settings,
  projectsSlot,
}: PageSectionsProps) {
  // `window` is unavailable on the server, so preview mode resolves after
  // mount. The first paint is always the published page.
  const [previewing, setPreviewing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, unknown>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Only a top-level navigation can set this, and only our own editor
    // frames it. Being inside *some* iframe is not sufficient on its own, but
    // combined with the same-origin check below it is what gates the bridge.
    if (params.get(PREVIEW_PARAM) === '1' && window.parent !== window) {
      setPreviewing(true);
    }
  }, []);

  const post = useCallback((message: PreviewMessage) => {
    // Same-origin only. The editor and the public page are the same deploy,
    // so there is never a reason to broadcast across origins.
    window.parent.postMessage(message, window.location.origin);
  }, []);

  useEffect(() => {
    if (!previewing) return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const message = parseEditorMessage(event.data);
      if (!message) return;

      if (message.type === 'draft') {
        setDrafts((current) => ({ ...current, [message.key]: message.content }));
      } else if (message.type === 'reset') {
        setDrafts({});
      } else if (message.type === 'focus') {
        setFocused(message.key);
        containerRef.current
          ?.querySelector(`[data-section-key="${CSS.escape(message.key)}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('message', onMessage);
    post({ channel: PREVIEW_CHANNEL, type: 'ready', sections: renderOrder });

    return () => window.removeEventListener('message', onMessage);
  }, [previewing, renderOrder, post]);

  // Each section owns the shape of its own content and validates it at the
  // API boundary; the renderer only routes it. Typing this map as the union
  // of ten unrelated shapes would buy nothing here.
  const content: Record<string, any> = useMemo(
    () => (previewing ? applyDrafts(sectionData, drafts) : sectionData),
    [previewing, sectionData, drafts]
  );

  // Section numbers shown in the margin and in the spine's index. They are
  // positions in the *rendered* order, so hiding a section in the CMS
  // renumbers the page rather than leaving a gap. The hero is the top of the
  // document, not an entry in an index of it.
  const numbered = renderOrder.filter((key) => key !== 'hero');
  const numberOf = (key: string) => numbered.indexOf(key) + 1;

  const components: Record<string, React.ReactNode> = {
    hero: <HeroSection content={content.hero} settings={settings} />,
    about: <AboutSection content={content.about} settings={settings} />,
    skills: <SkillsMatrix content={content.skills} />,
    projects: projectsSlot,
    experience: (
      <ExperienceSection
        content={content.experience}
        settings={settings}
        index={numberOf('experience')}
      />
    ),
    education: <EducationSection content={content.education} />,
    awards: <AwardsSection badges={badges} content={content.awards} />,
    publications: <PublicationsSection content={content.publications} />,
    community: <CommunitySection content={content.community} />,
    contact: <ContactSection content={content.contact} />,
  };

  return (
    <div ref={containerRef} className="relative z-10">
      {renderOrder.map((key) => {
        const node = components[key];
        if (!node) return null;

        if (!previewing) return <div key={key}>{node}</div>;

        return (
          <div
            key={key}
            data-section-key={key}
            // Capture phase, so a click lands on the section rather than on a
            // link or form control inside it. In preview mode the page is a
            // map of the site, not a working copy of it.
            onClickCapture={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setFocused(key);
              post({ channel: PREVIEW_CHANNEL, type: 'select', key });
            }}
            className="group relative cursor-pointer"
          >
            {node}
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-0 z-50 ring-inset transition-all duration-150 ${
                focused === key
                  ? 'ring-2 ring-primary-500'
                  : 'ring-0 ring-primary-400/40 group-hover:ring-2'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
