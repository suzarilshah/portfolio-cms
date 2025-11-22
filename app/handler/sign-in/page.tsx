'use client';

import { SignIn } from '@stackframe/stack';

export default function CustomSignInPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4">
      {/* Architectural background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
              SUZARIL SHAH · ADMIN
            </p>
            <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-900">
              Sign in to your portfolio control center
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 max-w-sm">
            Manage hero messaging, experience, awards, and verified badges from a
            secure CMS built on Neon Database and Stack Auth.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          {/* Narrative / value prop */}
          <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
            <p>
              This admin area controls the public-facing portfolio that presents you
              as a cloud engineer and technology leader. Changes here update the
              live site immediately.
            </p>
            <p>
              Authentication and sessions are handled by Stack Auth. Only approved
              accounts can access this dashboard.
            </p>
          </div>

          {/* Auth card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm px-6 py-7">
            <div className="mb-4 text-center md:text-left">
              <p className="text-sm font-medium text-slate-900">Admin sign in</p>
              <p className="text-xs text-slate-500 mt-1">
                Use your Stack Auth credentials to continue.
              </p>
            </div>
            <SignIn />
            <p className="mt-4 text-[11px] text-slate-400 text-center md:text-left">
              Sessions are secured with HTTP-only cookies. If you suspect
              unauthorized access, rotate your keys in Stack Auth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
