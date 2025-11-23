'use client';

import Link from "next/link";
import { LayoutDashboard, Settings, Award, Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";
import { Suspense, useState } from "react";

interface AdminSidebarProps {
  user: {
    displayName: string | null | undefined;
    primaryEmail: string | null | undefined;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 z-30 justify-between">
        <div className="flex flex-col">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">PORTFOLIO</p>
            <h1 className="font-display font-bold text-slate-900">Command Center</h1>
        </div>
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 
        flex flex-col fixed h-full z-50 shadow-sm transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:z-10 top-0 left-0
      `}>
        <div className="p-6 border-b border-slate-100">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">PORTFOLIO</p>
          <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">Command Center</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link 
            href="/admin" 
            onClick={() => setIsOpen(false)}
            className="group flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-100 rounded-lg transition-all duration-200 font-medium"
          >
            <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
            Overview
          </Link>

          <div className="px-4 py-2 mt-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sections</p>
            <div className="space-y-1">
              <Link href="/admin/hero" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Hero
              </Link>
              <Link href="/admin/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                About
              </Link>
              <Link href="/admin/projects" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Projects
              </Link>
              <Link href="/admin/experience" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                Experience
              </Link>
              <Link href="/admin/education" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Education
              </Link>
              <Link href="/admin/awards" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>
                Awards
              </Link>
              <Link href="/admin/publications" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                Publications
              </Link>
              <Link href="/admin/community" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Community
              </Link>
              <Link href="/admin/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                Contact
              </Link>
            </div>
          </div>

          <div className="px-4 py-2 mt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Configuration</p>
            <div className="space-y-1">
               <Link href="/admin/sections" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <LayoutDashboard size={16} />
                Section Reorder
              </Link>
               <Link href="/admin/badges" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <Award size={16} />
                Verified Badges
              </Link>
              <Link href="/admin/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all">
                <Settings size={16} />
                Design & Global
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
             <Suspense fallback={
               <div className="flex items-center gap-2 text-sm text-slate-500">
                 <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                 Loading user...
               </div>
             }>
               <UserMenu user={user} />
             </Suspense>
        </div>
      </aside>
    </>
  );
}
