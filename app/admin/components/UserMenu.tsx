'use client';

import { useUser } from '@stackframe/stack';
import { LogOut } from 'lucide-react';

interface UserProps {
  displayName?: string | null;
  primaryEmail?: string | null;
}

export default function UserMenu({ user }: { user: UserProps }) {
  const userObj = useUser({ or: 'return-null' });

  const handleSignOut = async () => {
    if (userObj) {
      await userObj.signOut({ redirectUrl: '/handler/sign-in' });
    }
  };

  const initial = (user.displayName || user.primaryEmail || 'A').trim()[0]?.toUpperCase() ?? 'A';

  return (
    // Sits inside the dark rail, so it uses the on-dark tokens.
    <div className="flex items-center gap-2.5 rounded-full px-2 py-1.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-[13px] font-semibold text-[var(--on-dark)]">
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-[var(--on-dark)]">
          {user.displayName || 'Administrator'}
        </p>
        <p className="studio-meta truncate text-[var(--on-dark-muted)] opacity-80">
          {user.primaryEmail}
        </p>
      </div>
      <button
        onClick={handleSignOut}
        title="Sign out"
        aria-label="Sign out"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--on-dark-muted)] transition-colors hover:bg-white/10 hover:text-[var(--on-dark)]"
      >
        <LogOut size={15} />
      </button>
    </div>
  );
}
