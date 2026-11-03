'use client';

/**
 * The footer.
 *
 * The previous one carried two links to `#` — "Privacy Policy" and "Terms of
 * Service" — which scrolled nowhere, and a third hardcoded to LinkedIn. Dead
 * links in a footer are the kind of thing nobody notices until a recruiter
 * clicks one, so the list now comes from `site_settings.footer` and a link
 * with no destination simply is not rendered.
 */

export interface FooterContent {
  tagline?: string;
  note?: string;
  links?: { label?: string; href?: string }[];
}

interface FooterProps {
  content?: FooterContent | null;
  settings?: { logo_text?: string; logo_highlight?: string } | null;
}

export default function Footer({ content, settings }: FooterProps) {
  const logoText = settings?.logo_text || 'SUZARIL';
  const logoHighlight = settings?.logo_highlight || 'SHAH';

  const links = (content?.links ?? []).filter(
    (link): link is { label: string; href: string } => !!link?.label && !!link?.href
  );

  return (
    <footer className="border-t border-slate-200/80 py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-[17px] font-bold tracking-tight">
              <span className="text-slate-900">{logoText}</span>{' '}
              <span className="text-primary-600">{logoHighlight}</span>
            </p>
            {content?.tagline && (
              <p className="mt-2.5 text-[14px] leading-relaxed text-slate-600">{content.tagline}</p>
            )}
          </div>

          {links.length > 0 && (
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith('#')
                        ? {}
                        : { target: '_blank', rel: 'noreferrer' })}
                      className="text-[14px] text-slate-600 transition-colors hover:text-slate-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-slate-400">
            © {new Date().getFullYear()} {logoText} {logoHighlight}
          </p>
          {content?.note && (
            <p className="font-mono text-[11px] text-slate-400">{content.note}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
