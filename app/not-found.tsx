'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Mail, BookOpen, Briefcase, Search } from 'lucide-react';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Log 404 for analytics
    if (typeof window !== 'undefined') {
      console.log('404 - Page not found:', window.location.pathname);
    }
  }, []);

  // Suggested pages for users
  const suggestedLinks = [
    { href: '/', label: 'Home', icon: Home, description: 'Back to the main page' },
    { href: '/#projects', label: 'Projects', icon: Briefcase, description: 'View my work' },
    { href: '/#publications', label: 'Publications', icon: BookOpen, description: 'Read my articles' },
    { href: '/#contact', label: 'Contact', icon: Mail, description: 'Get in touch' },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Large background 404 - Very light and subtle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[20rem] md:text-[28rem] lg:text-[36rem] font-display font-bold text-slate-100 leading-none tracking-tighter"
        >
          404
        </motion.span>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Page not found
          </h1>
          <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Primary actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-full hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        {/* Suggested pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
            Popular pages
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {suggestedLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="group flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-sm text-slate-400"
        >
          Think this is a mistake?{' '}
          <Link href="/#contact" className="text-slate-600 hover:text-slate-900 underline underline-offset-2">
            Let me know
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
