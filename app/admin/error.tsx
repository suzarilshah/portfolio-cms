'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, LayoutDashboard, ArrowLeft, ChevronDown } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    console.error('Admin Panel Error:', {
      message: error.message,
      digest: error.digest,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
      section: 'admin',
    });
  }, [error]);

  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    reset();
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Large background text - Very light and subtle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[16rem] md:text-[22rem] lg:text-[28rem] font-display font-bold text-[var(--faint)] leading-none tracking-tighter"
        >
          500
        </motion.span>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-16 h-16 mx-auto rounded-[4px] bg-transparent flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[var(--danger)]" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text)] mb-4">
            Admin Error
          </h1>
          <p className="text-[var(--faint)] text-lg mb-2 max-w-md mx-auto leading-relaxed">
            Something went wrong in the admin panel.
          </p>
          {error.digest && (
            <p className="text-xs text-[var(--faint)] font-mono mb-8">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        {/* Primary actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[#06080b] font-medium rounded-full hover:bg-[var(--accent)] disabled:opacity-50 hover:-translate-y-0.5 transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
            {retrying ? 'Retrying...' : 'Try Again'}
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface)] border border-[var(--line)] text-[var(--dim)] font-medium rounded-full hover:border-[var(--line)] hover:text-[var(--text)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </motion.div>

        {/* Error details toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 text-sm text-[var(--faint)] hover:text-[var(--dim)] transition-colors mb-4"
          >
            Technical details
            <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-[var(--raised)] rounded-[4px] p-4 text-left overflow-hidden"
            >
              <p className="text-xs text-[var(--faint)] mb-2 font-mono uppercase">Error Message:</p>
              <pre className="text-sm text-[var(--dim)] font-mono whitespace-pre-wrap break-words">
                {error.message || 'Unknown error'}
              </pre>
            </motion.div>
          )}
        </motion.div>

        {/* Footer actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-[var(--faint)]"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 hover:text-[var(--dim)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
          <Link
            href="/"
            className="hover:text-[var(--dim)] transition-colors"
          >
            Public site
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
