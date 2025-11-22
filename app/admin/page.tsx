import Link from "next/link";
import { FileText, Award, Settings, ArrowRight, Globe, Clock, Shield } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back. Here is what's happening with your portfolio.</p>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Globe size={20} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Online</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Live Portfolio</h3>
          <p className="text-sm text-slate-500">suzarilshah.uk</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Secured</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Stack Auth</h3>
          <p className="text-sm text-slate-500">Admin Access Only</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Neon DB</h3>
          <p className="text-sm text-slate-500">Connected & Active</p>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/content" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5 transition-all">
          <div className="mb-4 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Edit Content</h3>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">Update hero text, experience, education, and other page sections.</p>
          <div className="flex items-center text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
            Open Editor <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link href="/admin/badges" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/5 transition-all">
          <div className="mb-4 w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Award size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Manage Badges</h3>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">Add or remove Credly badges and update recognition details.</p>
          <div className="flex items-center text-sm font-medium text-purple-600 group-hover:gap-2 transition-all">
            Manage Credentials <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link href="/admin/settings" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-500/30 hover:shadow-md hover:shadow-slate-500/5 transition-all">
          <div className="mb-4 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <Settings size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Site Settings</h3>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">Configure global SEO, branding, logos, and accent colors.</p>
          <div className="flex items-center text-sm font-medium text-slate-600 group-hover:gap-2 transition-all">
            Configure <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
