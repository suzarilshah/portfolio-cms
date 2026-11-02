'use client';

import { SignIn, useUser } from '@stackframe/stack';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import '../../admin/studio.css';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    // Dark page edge with the white sheet floating on it — the same move the
    // blog's homepage makes.
    <div className="studio min-h-screen bg-[var(--ink-deep)] p-3 sm:p-5">
      <div className="studio-sheet flex min-h-[calc(100vh-24px)] flex-col items-center justify-center px-5 py-12 sm:min-h-[calc(100vh-40px)] sm:px-8">
        {children}
      </div>
    </div>
  );
}

function SignInContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/admin';
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push(redirectUrl);
  }, [user, redirectUrl, router]);

  return (
    <Shell>
      <div className="w-full max-w-[380px]">
        <header className="mb-8 text-center">
          <span className="studio-meta">Portfolio CMS</span>
          <h1 className="studio-display mt-3">Welcome back</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
            Sign in to edit suzarilshah.uk.
          </p>
        </header>

        {/* Stack Auth renders its own form here. */}
        <div className="studio-card p-5 sm:p-6">
          <SignIn fullPage={false} />
        </div>

        <footer className="mt-7 flex flex-col items-center gap-4">
          <p className="studio-meta text-center leading-relaxed">
            Restricted to the site owner
          </p>
          <Link
            href="/"
            className="studio-btn studio-btn-ghost text-[13px]"
          >
            <ArrowLeft size={14} />
            Back to the portfolio
          </Link>
        </footer>
      </div>
    </Shell>
  );
}

export default function CustomSignInPage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <span className="studio-meta">Loading…</span>
        </Shell>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
