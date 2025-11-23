import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { StackProvider, StackTheme } from "@stackframe/stack";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/handler/sign-in?redirect_url=" + encodeURIComponent("/admin"));
  }

  // Strict email lock for the "1 Trillion USD" security standard
  if (user.primaryEmail !== 'suzarilshah@gmail.com') {
    // return (
    //   <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
    //     <div className="max-w-md text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
    //       <h1 className="text-xl font-bold text-red-600 mb-2">Access Denied</h1>
    //       <p className="text-slate-600 mb-4">
    //         This CMS is restricted to the site owner only.
    //       </p>
    //       <p className="text-xs font-mono text-slate-400">User: {user.primaryEmail}</p>
    //     </div>
    //   </div>
    // );
  }

  const clientUser = {
    displayName: user.displayName,
    primaryEmail: user.primaryEmail,
  };

  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
          {/* Background Pattern */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

          {/* Responsive Sidebar */}
          <AdminSidebar user={clientUser} />
          
          {/* Main Content */}
          <main className="flex-1 md:ml-64 pt-16 md:pt-0 overflow-y-auto h-full relative z-10">
            <div className="max-w-5xl mx-auto p-4 md:p-12">
              {children}
            </div>
          </main>
        </div>
      </StackTheme>
    </StackProvider>
  );
}
