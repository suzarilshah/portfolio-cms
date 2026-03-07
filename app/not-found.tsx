'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, FileQuestion, Mail, BookOpen, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Log 404 for analytics (could be sent to your own endpoint)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center px-6 py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Animated 404 illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Floating question marks */}
            {mounted && (
              <>
                <motion.div
                  animate={{ y: [-5, 5, -5], rotate: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-8 text-4xl text-primary-300"
                >
                  ?
                </motion.div>
                <motion.div
                  animate={{ y: [5, -5, 5], rotate: [10, -10, 10] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-2 -right-6 text-3xl text-primary-400"
                >
                  ?
                </motion.div>
              </>
            )}

            {/* Main 404 number */}
            <div className="flex items-center justify-center gap-2">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-8xl md:text-9xl font-display font-bold bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 bg-clip-text text-transparent"
              >
                4
              </motion.span>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center shadow-lg shadow-primary-500/25"
              >
                <FileQuestion className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-8xl md:text-9xl font-display font-bold bg-gradient-to-br from-blue-500 via-primary-500 to-primary-600 bg-clip-text text-transparent"
              >
                4
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4">
            Oops! Page not found
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let me help you find your way back.
          </p>
        </motion.div>

        {/* Primary actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-full hover:border-primary-300 hover:text-primary-600 hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </motion.div>

        {/* Suggested pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Or try these pages
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {suggestedLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
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
          If you believe this is an error, please{' '}
          <Link href="/#contact" className="text-primary-600 hover:underline">
            contact me
          </Link>
          .
        </motion.p>
      </div>
    </div>
  );
}
