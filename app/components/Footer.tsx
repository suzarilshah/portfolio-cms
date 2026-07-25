'use client';

import CurvedScrollText from '@/components/CurvedScrollText';

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-slate-100 overflow-hidden">
      {/* Inverted Curved Text - Above Footer */}
      <div className="pointer-events-none -mt-16">
        <CurvedScrollText text="SHAH" repeatCount={4} inverted />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 py-10 -mt-20">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="font-display text-lg font-bold text-slate-900">SUZARIL SHAH</p>
            <p className="text-sm text-slate-500">© {new Date().getFullYear()} All rights reserved. <a href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">Admin</a></p>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="https://linkedin.com/in/suzarilshah" className="hover:text-slate-900 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
