import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, Award } from "lucide-react";
import AdminAuthProvider from "./components/AdminAuthProvider";
import UserMenu from "./components/UserMenu";
import { verifyAdminToken } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verify admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) {
    redirect("/admin/login");
  }

  const user = await verifyAdminToken({ cookies: cookieStore } as any);
  
  if (!user) {
    redirect("/admin/login");
  }

  // Only allow the specified admin email
  if (user.email !== 'suzarilshah@gmail.com') {
    redirect("/admin/login");
  }

  const clientUser = {
    displayName: 'Muhammad Suzaril Shah',
    primaryEmail: user.email,
  };

  return (
    <AdminAuthProvider user={clientUser}>
      <div className="flex h-screen bg-slate-50 text-slate-900">
          {/* Background Pattern */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

          {/* Sidebar */}
          <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 flex flex-col fixed h-full z-10 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">PORTFOLIO</p>
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">Command Center</h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <Link href="/admin" className="group flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-100 rounded-lg transition-all duration-200 font-medium">
                <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
                Overview
              </Link>

              <div className="px-4 py-2 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sections</p>
                <div className="space-y-1">
                  <Link href="/admin/hero" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Hero
                  </Link>
                  <Link href="/admin/about" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    About
                  </Link>
                  <Link href="/admin/projects" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Projects
                  </Link>
                  <Link href="/admin/experience" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                    Experience
                  </Link>
                  <Link href="/admin/education" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    Education
                  </Link>
                  <Link href="/admin/awards" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>
                    Awards
                  </Link>
                  <Link href="/admin/publications" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                    Publications
                  </Link>
                  <Link href="/admin/community" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Community
                  </Link>
                  <Link href="/admin/contact" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    Contact
                  </Link>
                </div>
              </div>

              <div className="px-4 py-2 mt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Configuration</p>
                <div className="space-y-1">
                   <Link href="/admin/sections" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <LayoutDashboard size={16} />
                    Section Reorder
                  </Link>
                   <Link href="/admin/badges" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <Award size={16} />
                    Verified Badges
                  </Link>
                  <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                    <Settings size={16} />
                    Design & Global
                  </Link>
                </div>
              </div>
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                 <UserMenu user={clientUser} />
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 ml-64 overflow-y-auto h-full relative z-10">
            <div className="max-w-5xl mx-auto p-8 md:p-12">
              {children}
            </div>
          </main>
        </div>
    </AdminAuthProvider>
  );
}
