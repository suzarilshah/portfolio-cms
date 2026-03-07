'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, RefreshCw, AlertTriangle, Bug, ArrowLeft, Mail } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Log the error for debugging/monitoring
    console.error('Application error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center px-6 py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-red-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Animated error illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Pulsing warning effect */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-32 h-32 mx-auto bg-red-200 rounded-full blur-xl"
            />

            {/* Main icon */}
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.5, repeat: 3, ease: "easeInOut" }}
              className="relative w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-red-500/25"
            >
              <AlertTriangle className="w-16 h-16 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-slate-600 text-lg mb-2 max-w-md mx-auto">
            We encountered an unexpected error while loading this page.
            {retryCount > 0 && (
              <span className="block text-sm text-slate-500 mt-2">
                Retry attempts: {retryCount}
              </span>
            )}
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400 font-mono mb-6">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        {/* Primary actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-full hover:border-primary-300 hover:text-primary-600 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </motion.div>

        {/* Error details toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
          >
            <Bug className="w-4 h-4" />
            {showDetails ? 'Hide' : 'Show'} technical details
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900 rounded-xl p-4 text-left overflow-hidden"
            >
              <p className="text-xs text-slate-400 mb-2 font-mono uppercase">Error Message:</p>
              <pre className="text-sm text-red-400 font-mono whitespace-pre-wrap break-words mb-4">
                {error.message || 'Unknown error'}
              </pre>
              {error.stack && (
                <>
                  <p className="text-xs text-slate-400 mb-2 font-mono uppercase">Stack Trace:</p>
                  <pre className="text-xs text-slate-500 font-mono whitespace-pre-wrap break-words max-h-40 overflow-auto">
                    {error.stack}
                  </pre>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Help text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-white/80 backdrop-blur rounded-xl border border-slate-100"
        >
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-700">Still having issues?</span>
            <br />
            Try clearing your browser cache, or{' '}
            <Link href="/#contact" className="text-primary-600 hover:underline">
              contact me
            </Link>{' '}
            if the problem persists.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
