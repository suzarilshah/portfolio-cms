'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Bug, Settings, HelpCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Log admin errors with more context
    console.error('Admin Panel Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
      section: 'admin',
    });
  }, [error]);

  const handleRetry = async () => {
    setRetrying(true);
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    reset();
    setRetrying(false);
  };

  // Common admin issues and solutions
  const troubleshootingTips = [
    { issue: 'Session expired', solution: 'Try signing out and back in' },
    { issue: 'Database connection', solution: 'Wait a moment and retry' },
    { issue: 'Permission denied', solution: 'Verify you have admin access' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/20 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Admin Panel Error</h1>
            <p className="text-white/80 text-sm">
              Something went wrong in the admin panel
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error info */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 font-medium mb-1">Error occurred:</p>
              <p className="text-sm text-red-600 font-mono break-words">
                {error.message || 'An unexpected error occurred'}
              </p>
              {error.digest && (
                <p className="text-xs text-red-400 mt-2 font-mono">
                  ID: {error.digest}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
                {retrying ? 'Retrying...' : 'Try Again'}
              </button>
              <Link
                href="/admin"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </div>

            {/* Troubleshooting */}
            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-3"
              >
                <HelpCircle className="w-4 h-4" />
                {showDetails ? 'Hide troubleshooting' : 'Troubleshooting tips'}
              </button>

              {showDetails && (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Common Solutions
                    </p>
                    <ul className="space-y-2">
                      {troubleshootingTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-slate-400">•</span>
                          <span>
                            <span className="text-slate-700 font-medium">{tip.issue}:</span>{' '}
                            <span className="text-slate-500">{tip.solution}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stack trace for debugging */}
                  <button
                    onClick={() => {
                      const el = document.getElementById('stack-trace');
                      if (el) el.classList.toggle('hidden');
                    }}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    <Bug className="w-3 h-3" />
                    Toggle stack trace
                  </button>
                  <pre
                    id="stack-trace"
                    className="hidden text-xs bg-slate-900 text-slate-300 p-3 rounded-lg overflow-auto max-h-32 font-mono"
                  >
                    {error.stack || 'No stack trace available'}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-1 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Go back
              </button>
              <Link
                href="/admin/settings"
                className="flex items-center gap-1 hover:text-slate-700 transition-colors"
              >
                <Settings className="w-3 h-3" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
