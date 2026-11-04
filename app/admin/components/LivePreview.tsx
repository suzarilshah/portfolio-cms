'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowUpRight, RotateCw } from 'lucide-react';
import {
  PREVIEW_CHANNEL,
  PREVIEW_DEVICES,
  type EditorMessage,
  type PreviewDeviceId,
  parsePreviewMessage,
  previewUrl,
} from '@/lib/preview/protocol';
import { Button, Meta } from './ui';

/**
 * The real public page, in an iframe, fed the draft you are editing.
 *
 * It is the production page rather than a reimplementation of it, so it
 * cannot drift from what visitors see. The cost is that it is a separate
 * document: everything crosses a postMessage boundary, and the bridge may
 * never load at all. The `ready` handshake and the timeout below exist so
 * that case announces itself instead of looking like a frozen preview.
 */

interface LivePreviewProps {
  sectionKey: string;
  /** The draft to project into the page. Re-sent whenever it changes. */
  content: unknown;
  /** Fires when the editor clicks a different section inside the preview. */
  onSelect?: (key: string) => void;
}

export default function LivePreview({ sectionKey, content, onSelect }: LivePreviewProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<PreviewDeviceId>('desktop');
  const [ready, setReady] = useState(false);
  const [stalled, setStalled] = useState(false);
  // Changing this remounts the iframe, which is the only reliable way to
  // force a reload across the boundary without reaching into its document.
  const [nonce, setNonce] = useState(0);
  // The timeout below fires long after its effect was created, so it cannot
  // read `ready` from that closure — it would always see the initial false
  // and declare a working preview broken.
  const readyRef = useRef(false);

  const send = useCallback((message: EditorMessage) => {
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const message = parsePreviewMessage(event.data);
      if (!message) return;

      if (message.type === 'ready') {
        readyRef.current = true;
        setReady(true);
        setStalled(false);
      } else if (message.type === 'select' && message.key !== sectionKey) {
        onSelect?.(message.key);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [sectionKey, onSelect]);

  // If the handshake never arrives the preview is dead weight, and silence
  // would read as "still loading" forever.
  useEffect(() => {
    readyRef.current = false;
    setReady(false);
    setStalled(false);
    const timer = setTimeout(() => {
      if (!readyRef.current) setStalled(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [nonce]);

  // Push the draft on every keystroke. The payload is small and the receiver
  // is a React setState, so debouncing would only add latency to the thing
  // the split view exists to provide.
  useEffect(() => {
    if (!ready) return;
    send({ channel: PREVIEW_CHANNEL, type: 'draft', key: sectionKey, content });
  }, [ready, sectionKey, content, send]);

  useEffect(() => {
    if (!ready) return;
    send({ channel: PREVIEW_CHANNEL, type: 'focus', key: sectionKey });
  }, [ready, sectionKey, send]);

  const width = PREVIEW_DEVICES.find((d) => d.id === device)?.width ?? null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-3 py-2">
        <div className="flex items-center gap-1" role="group" aria-label="Preview width">
          {PREVIEW_DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              aria-pressed={device === d.id}
              className={`studio-label rounded-[var(--r-pill)] px-2.5 py-1.5 transition-colors ${
                device === d.id
                  ? 'bg-[var(--ink-deep)] text-[var(--on-dark)]'
                  : 'text-[var(--muted)] hover:bg-[var(--sunken)]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!ready && !stalled && <Meta>Connecting…</Meta>}
          {ready && <Meta>{width ? `${width}px` : 'Full width'}</Meta>}
          <Button
            variant="ghost"
            onClick={() => setNonce((n) => n + 1)}
            aria-label="Reload preview"
            title="Reload preview"
          >
            <RotateCw size={14} />
          </Button>
          <a href="/" target="_blank" rel="noreferrer">
            <Button variant="ghost" aria-label="Open the live site" title="Open the live site">
              <ArrowUpRight size={14} />
            </Button>
          </a>
        </div>
      </header>

      {stalled && (
        <div className="flex items-start gap-2.5 border-b border-[var(--line)] bg-[#a26a12]/8 px-3 py-2.5">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--warn)]" />
          <p className="text-[13px] leading-relaxed text-[var(--muted)]">
            The preview did not connect. Editing and publishing still work. Only the live
            rendering is unavailable.
          </p>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-hidden bg-[var(--sunken)] p-3">
        <div
          className="mx-auto h-full overflow-hidden rounded-[var(--r-field)] bg-white shadow-[var(--lift)] transition-[max-width] duration-200"
          style={{ maxWidth: width ? `${width}px` : '100%' }}
        >
          <iframe
            key={nonce}
            ref={frameRef}
            src={previewUrl(sectionKey)}
            title="Live preview of the public site"
            className="h-full w-full border-0"
            // The preview runs our own first-party page, so it needs scripts
            // and same-origin to render and to talk back. Forms and top-level
            // navigation stay blocked: a stray click must not take the CMS
            // somewhere else.
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
