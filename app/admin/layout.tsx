import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { isAdminEmail } from "@/lib/security/admin";
import pool from "@/lib/db";
import AdminNav from "./components/AdminNav";
import type { SectionRow } from "./sections";
import "./workbench.css";

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
      <div className="wb flex min-h-screen items-center justify-center p-6">
        <div className="wb-panel max-w-sm p-6 text-center">
          <p className="wb-label text-[var(--danger)]">Access denied</p>
          <h1 className="mt-3 text-[15px] font-semibold">This CMS is restricted to the site owner.</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--dim)]">
            You are signed in, but this address is not on the admin allowlist.
          </p>
          <p className="wb-meta mt-4 border-t border-[var(--line)] pt-3">{user.primaryEmail}</p>
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
        <div className="wb min-h-screen">
          <AdminNav user={clientUser} sections={sections} />
          <main className="pt-14 md:ml-[248px] md:pt-0">
            <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">{children}</div>
          </main>
        </div>
      </StackTheme>
    </StackProvider>
  );
}
