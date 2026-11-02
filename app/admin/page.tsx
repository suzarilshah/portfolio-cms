import Link from "next/link";
import { AlertTriangle, ArrowUpRight, EyeOff, FileWarning } from "lucide-react";
import pool from "@/lib/db";
import { Dot, Label, Meta, Panel, PageHeader, Pill } from "./components/ui";
import { SECTION_EDITORS, type SectionRow, relativeTime } from "./sections";

export const dynamic = "force-dynamic";

interface Overview {
  sections: SectionRow[];
  projects: number;
  badges: number;
  downloads: number;
  resumeUrl: string | null;
  ok: boolean;
}

async function getOverview(): Promise<Overview> {
  const empty: Overview = {
    sections: [],
    projects: 0,
    badges: 0,
    downloads: 0,
    resumeUrl: null,
    ok: false,
  };
  if (!process.env.DATABASE_URL) return empty;

  try {
    const [sections, projects, badges, downloads, settings] = await Promise.all([
      pool.query(
        "SELECT section_key, sort_order, is_visible, updated_at FROM content_sections ORDER BY sort_order ASC"
      ),
      pool.query("SELECT COUNT(*)::int AS n FROM projects"),
      pool.query("SELECT COUNT(*)::int AS n FROM badges"),
      pool.query("SELECT COUNT(*)::int AS n FROM resume_downloads"),
      pool.query("SELECT resume_url FROM site_settings LIMIT 1"),
    ]);

    return {
      sections: sections.rows,
      projects: projects.rows[0]?.n ?? 0,
      badges: badges.rows[0]?.n ?? 0,
      downloads: downloads.rows[0]?.n ?? 0,
      resumeUrl: settings.rows[0]?.resume_url ?? null,
      ok: true,
    };
  } catch (error) {
    console.error("Overview query failed:", error);
    return empty;
  }
}

function Stat({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const inner = (
    <div className="studio-card h-full px-5 py-4 transition-shadow hover:shadow-[var(--lift-lg)]">
      <Label>{label}</Label>
      {/* Tabular numerals without .studio-meta, whose 11px would win here. */}
      <p className="mt-2.5 font-mono text-[26px] leading-[1.1] tracking-[-0.02em] tabular-nums">
        {value}
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminDashboard() {
  const { sections, projects, badges, downloads, resumeUrl, ok } = await getOverview();

  const visible = sections.filter((s) => s.is_visible !== false);
  const hidden = sections.filter((s) => s.is_visible === false);
  const orphans = sections.filter((s) => !SECTION_EDITORS[s.section_key]);
  const lastEdited = [...sections]
    .filter((s) => s.updated_at)
    .sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
    .slice(0, 3);

  const issues = [
    ...orphans.map((s) => ({
      key: `orphan-${s.section_key}`,
      icon: AlertTriangle,
      tone: "warn" as const,
      text: `"${s.section_key}" has a database row but no editor in the CMS.`,
      href: "/admin/sections",
      cta: "Review",
    })),
    ...(!resumeUrl
      ? [
          {
            key: "resume",
            icon: FileWarning,
            tone: "warn" as const,
            text: "No resume file is configured, so the download buttons stay hidden.",
            href: "/admin/settings",
            cta: "Upload",
          },
        ]
      : []),
    ...(!ok
      ? [
          {
            key: "db",
            icon: AlertTriangle,
            tone: "danger" as const,
            text: "Could not read the database. The public site is serving fallback content.",
            href: "/admin/settings",
            cta: "Settings",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Label>Overview</Label>}
        title="Your portfolio, right now"
        description="Everything the public page is currently rendering, and anything that needs a decision."
        actions={
          <Link href="/" target="_blank" rel="noreferrer">
            <button className="studio-btn studio-btn-default">
              View live site
              <ArrowUpRight size={14} />
            </button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Sections live" value={`${visible.length}/${sections.length}`} href="/admin/sections" />
        <Stat label="Projects" value={projects} href="/admin/projects" />
        <Stat label="Badges" value={badges} href="/admin/badges" />
        <Stat label="Resume leads" value={downloads} href="/admin/resume" />
      </div>

      {issues.length > 0 && (
        <Panel
          title="Needs attention"
          description="Surfaced from the live database, not a checklist."
        >
          <ul className="space-y-2">
            {issues.map(({ key, icon: Icon, tone, text, href, cta }) => (
              <li
                key={key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[var(--line)] px-3.5 py-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Icon
                    size={14}
                    className={tone === "danger" ? "text-[var(--danger)]" : "text-[var(--warn)]"}
                  />
                  <span className="text-[13px] text-[var(--dim)]">{text}</span>
                </div>
                <Link href={href} className="studio-btn studio-btn-default shrink-0">
                  {cta}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel
        title="The page"
        description="Top to bottom, exactly as a visitor meets it."
        actions={
          <Link href="/admin/sections" className="studio-btn studio-btn-ghost">
            Reorder
          </Link>
        }
        bodyClassName="p-0"
      >
        <ul className="divide-y divide-[var(--line-soft)]">
          {sections.length === 0 && (
            <li className="px-5 py-8 text-center">
              <Meta>No sections found.</Meta>
            </li>
          )}
          {sections.map((section, index) => {
            const editor = SECTION_EDITORS[section.section_key];
            const isHidden = section.is_visible === false;

            const row = (
              <div className="flex items-center gap-3 px-5 py-3">
                <span className="studio-meta w-[18px] text-[10px] text-[var(--faint)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[13px] ${
                      isHidden ? "text-[var(--faint)]" : "text-[var(--text)]"
                    }`}
                  >
                    {editor?.label ?? section.section_key}
                  </p>
                  <Meta>{editor?.blurb ?? "No editor available"}</Meta>
                </div>
                <Meta className="hidden sm:block">{relativeTime(section.updated_at)}</Meta>
                {!editor ? (
                  <Pill tone="warn">
                    <AlertTriangle size={10} /> No editor
                  </Pill>
                ) : isHidden ? (
                  <Pill>
                    <EyeOff size={10} /> Hidden
                  </Pill>
                ) : (
                  <Pill tone="ok">
                    <Dot tone="ok" /> Live
                  </Pill>
                )}
              </div>
            );

            return (
              <li key={section.section_key}>
                {editor ? (
                  <Link href={editor.href} className="block transition-colors hover:bg-[var(--raised)]">
                    {row}
                  </Link>
                ) : (
                  <div className="opacity-70">{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>

      {lastEdited.length > 0 && (
        <Panel title="Recently edited">
          <ul className="space-y-1.5">
            {lastEdited.map((section) => {
              const editor = SECTION_EDITORS[section.section_key];
              return (
                <li key={section.section_key} className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-[var(--dim)]">
                    {editor?.label ?? section.section_key}
                  </span>
                  <Meta>{relativeTime(section.updated_at)}</Meta>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      {hidden.length > 0 && (
        <p className="studio-meta">
          {hidden.length} section{hidden.length === 1 ? "" : "s"} hidden:{" "}
          {hidden.map((s) => SECTION_EDITORS[s.section_key]?.label ?? s.section_key).join(", ")}.
        </p>
      )}
    </div>
  );
}
