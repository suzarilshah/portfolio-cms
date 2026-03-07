'use client';

import { useEffect, useState } from 'react';

/**
 * Global Error Page
 *
 * This catches errors in the root layout.
 * IMPORTANT: This component must define its own <html> and <body> tags
 * since it replaces the root layout when active.
 *
 * CSS imports don't work here - must use inline styles.
 */

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log critical error
    console.error('CRITICAL: Global error caught:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
  }, [error]);

  // Inline styles since CSS imports don't work in global-error
  const styles = {
    html: {
      height: '100%',
    },
    body: {
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #fef2f2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 24px',
      textAlign: 'center' as const,
    },
    iconWrapper: {
      width: '120px',
      height: '120px',
      margin: '0 auto 32px',
      background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 20px 40px rgba(220, 38, 38, 0.25)',
    },
    icon: {
      width: '64px',
      height: '64px',
      color: '#ffffff',
    },
    title: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#0f172a',
      margin: '0 0 16px',
      lineHeight: 1.3,
    },
    message: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0 0 8px',
      lineHeight: 1.6,
    },
    errorId: {
      fontSize: '12px',
      color: '#94a3b8',
      fontFamily: 'monospace',
      margin: '0 0 32px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
      marginBottom: '24px',
    },
    primaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: '#ffffff',
      fontWeight: 600,
      fontSize: '15px',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '14px 28px',
      background: '#ffffff',
      color: '#334155',
      fontWeight: 600,
      fontSize: '15px',
      border: '2px solid #e2e8f0',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
    },
    detailsToggle: {
      background: 'none',
      border: 'none',
      color: '#64748b',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '16px',
    },
    detailsBox: {
      background: '#0f172a',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'left' as const,
      marginBottom: '24px',
    },
    detailsLabel: {
      fontSize: '10px',
      color: '#64748b',
      fontFamily: 'monospace',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      marginBottom: '8px',
    },
    detailsText: {
      fontSize: '13px',
      color: '#f87171',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-word' as const,
      margin: 0,
    },
    helpBox: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #f1f5f9',
    },
    helpText: {
      fontSize: '13px',
      color: '#475569',
      margin: 0,
      lineHeight: 1.5,
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
    },
  };

  return (
    <html lang="en" style={styles.html}>
      <head>
        <title>Critical Error | Suzaril Shah</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body style={styles.body}>
        <div style={styles.container}>
          {/* Error icon */}
          <div style={styles.iconWrapper}>
            <svg
              style={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* Message */}
          <h1 style={styles.title}>Critical Error</h1>
          <p style={styles.message}>
            A critical error occurred while loading the application.
            This has been logged for investigation.
          </p>
          {error.digest && (
            <p style={styles.errorId}>Error ID: {error.digest}</p>
          )}

          {/* Actions */}
          <div style={styles.buttonGroup}>
            <button
              onClick={() => reset()}
              style={styles.primaryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.25)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Try Again
            </button>
            <a
              href="/"
              style={styles.secondaryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go Home
            </a>
          </div>

          {/* Technical details toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={styles.detailsToggle}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {showDetails ? 'Hide' : 'Show'} technical details
          </button>

          {showDetails && (
            <div style={styles.detailsBox}>
              <p style={styles.detailsLabel}>Error Message:</p>
              <pre style={styles.detailsText}>
                {error.message || 'Unknown critical error'}
              </pre>
            </div>
          )}

          {/* Help box */}
          <div style={styles.helpBox}>
            <p style={styles.helpText}>
              <strong>Need help?</strong> Try refreshing the page or clearing your browser cache.
              If the problem persists, please{' '}
              <a href="mailto:hello@suzarilshah.uk" style={styles.link}>
                contact me
              </a>
              .
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
