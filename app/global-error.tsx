'use client';

import { useEffect, useState } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    console.error('CRITICAL: Global error caught:', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    reset();
  };

  return (
    <html lang="en">
      <head>
        <title>Error | Suzaril Shah</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
          .bg-text {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            user-select: none;
            overflow: hidden;
          }
          .bg-text span {
            font-size: clamp(12rem, 30vw, 24rem);
            font-weight: 700;
            color: #f1f5f9;
            line-height: 1;
            letter-spacing: -0.05em;
          }
          .content {
            position: relative;
            z-index: 10;
            max-width: 28rem;
            margin: 0 auto;
            padding: 1.5rem;
            text-align: center;
          }
          .icon-wrapper {
            width: 4rem;
            height: 4rem;
            margin: 0 auto 1.5rem;
            border-radius: 1rem;
            background: #fef2f2;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .icon {
            width: 2rem;
            height: 2rem;
            color: #f87171;
          }
          h1 {
            font-size: 1.875rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 1rem;
          }
          .message {
            font-size: 1.125rem;
            color: #64748b;
            margin-bottom: 0.5rem;
            line-height: 1.6;
          }
          .error-id {
            font-size: 0.75rem;
            color: #94a3b8;
            font-family: monospace;
            margin-bottom: 2rem;
          }
          .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 2rem;
          }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: #0f172a;
            color: #ffffff;
            font-weight: 500;
            font-size: 0.9375rem;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-primary:hover { background: #1e293b; transform: translateY(-2px); }
          .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
          .btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: #ffffff;
            color: #475569;
            font-weight: 500;
            font-size: 0.9375rem;
            border: 1px solid #e2e8f0;
            border-radius: 50px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
          }
          .btn-secondary:hover { border-color: #cbd5e1; color: #0f172a; transform: translateY(-2px); }
          .details-toggle {
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 0.875rem;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            transition: color 0.2s;
          }
          .details-toggle:hover { color: #64748b; }
          .details-box {
            background: #f8fafc;
            border-radius: 0.75rem;
            padding: 1rem;
            text-align: left;
            margin-bottom: 1.5rem;
          }
          .details-label {
            font-size: 0.625rem;
            color: #94a3b8;
            font-family: monospace;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
          }
          .details-text {
            font-size: 0.8125rem;
            color: #475569;
            font-family: monospace;
            white-space: pre-wrap;
            word-break: break-word;
            margin: 0;
          }
          .help-text {
            font-size: 0.875rem;
            color: #94a3b8;
          }
          .help-text a {
            color: #475569;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .help-text a:hover { color: #0f172a; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .spinning { animation: spin 1s linear infinite; }
        `}</style>
      </head>
      <body>
        {/* Background 500 text */}
        <div className="bg-text">
          <span>500</span>
        </div>

        <div className="content">
          {/* Icon */}
          <div className="icon-wrapper">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Message */}
          <h1>Something went wrong</h1>
          <p className="message">A critical error occurred. Please try again.</p>
          {error.digest && <p className="error-id">Error ID: {error.digest}</p>}

          {/* Buttons */}
          <div className="buttons">
            <button onClick={handleRetry} disabled={retrying} className="btn-primary">
              <svg className={retrying ? 'spinning' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              {retrying ? 'Retrying...' : 'Try Again'}
            </button>
            <a href="/" className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go Home
            </a>
          </div>

          {/* Details toggle */}
          <button onClick={() => setShowDetails(!showDetails)} className="details-toggle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points={showDetails ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
            </svg>
            Technical details
          </button>

          {showDetails && (
            <div className="details-box">
              <p className="details-label">Error Message:</p>
              <pre className="details-text">{error.message || 'Unknown error'}</pre>
            </div>
          )}

          {/* Help text */}
          <p className="help-text">
            If this keeps happening, <a href="mailto:hello@suzarilshah.uk">let me know</a>
          </p>
        </div>
      </body>
    </html>
  );
}
