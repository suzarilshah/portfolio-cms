'use client';

import Link from 'next/link';
import {
  Home,
  ArrowLeft,
  FileQuestion,
  LayoutDashboard,
  Settings,
  Award,
  Briefcase,
  BookOpen,
  Users,
} from 'lucide-react';

export default function AdminNotFound() {
  // Available admin sections for quick navigation
  const adminSections = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: Briefcase },
    { href: '/admin/publications', label: 'Publications', icon: BookOpen },
    { href: '/admin/badges', label: 'Badges', icon: Award },
    { href: '/admin/community', label: 'Community', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/20 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Not Found Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-500 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
              <FileQuestion className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Page Not Found</h1>
            <p className="text-white/80 text-sm">
              This admin page doesn't exist or has been moved
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* 404 visual */}
            <div className="text-center mb-6">
              <span className="text-6xl font-display font-bold text-slate-200">
                404
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/admin"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>

            {/* Quick links to admin sections */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Available Sections
              </p>
              <div className="grid grid-cols-2 gap-2">
                {adminSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Link
                      key={section.href}
                      href={section.href}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        {section.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Need help? Check the documentation.</span>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-primary-600 transition-colors"
              >
                <Home className="w-3 h-3" />
                Public site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
