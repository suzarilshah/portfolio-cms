import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { isAdminEmail } from "@/lib/security/admin";
import pool from "@/lib/db";
import AdminNav from "./components/AdminNav";
import type { SectionRow } from "./sections";
import "./studio.css";

export const dynamic = "force-dynamic";

async function getSections(): Promise<SectionRow[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const res = await pool.query(
      "SELECT section_key, sort_order, is_visible, updated_at FROM content_sections ORDER BY sort_order ASC"
    );
    return res.rows;
  } catch (error) {
    // The nav degrades to the config links rather than taking the CMS down.
    console.error("Could not load section list for admin nav:", error);
    return [];
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/handler/sign-in?redirect_url=" + encodeURIComponent("/admin"));
  }

  // Same allowlist the API routes enforce, so the UI gate and the data gate
  // cannot drift apart.
  if (!isAdminEmail(user.primaryEmail)) {
    return (
      <div className="studio flex min-h-screen items-center justify-center p-6">
        <div className="studio-card max-w-sm p-7 text-center">
          <p className="studio-meta text-[var(--danger)]">Access denied</p>
          <h1 className="mt-3 text-[17px] font-semibold tracking-[-0.01em]">
            This CMS is restricted to the site owner.
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
            You are signed in, but this address is not on the admin allowlist.
          </p>
          <p className="studio-meta mt-5 border-t border-[var(--line-soft)] pt-4">
            {user.primaryEmail}
          </p>
        </div>
      </div>
    );
  }

  const sections = await getSections();

  const clientUser = {
    displayName: user.displayName,
    primaryEmail: user.primaryEmail,
  };

  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        <div className="studio min-h-screen">
          <AdminNav user={clientUser} sections={sections} />
          {/* Bottom padding clears the mobile nav bar; the left offset clears
              the desktop rail plus its inset. */}
          <main className="md:ml-[268px]">
            <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-10 md:pr-6 md:pt-8">
              {children}
            </div>
          </main>
        </div>
      </StackTheme>
    </StackProvider>
  );
}
