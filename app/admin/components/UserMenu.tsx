'use client';

import { useUser } from "@stackframe/stack";
import { LogOut } from "lucide-react";

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
    <div className="flex items-center gap-2.5 rounded-[4px] px-2 py-1.5">
      <span className="wb-num flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-[var(--line)] bg-[var(--raised)] text-[11px] font-semibold text-[var(--accent)]">
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium text-[var(--text)]">
          {user.displayName || 'Administrator'}
        </p>
        <p className="wb-meta truncate">{user.primaryEmail}</p>
      </div>
      <button
        onClick={handleSignOut}
        title="Sign out"
        aria-label="Sign out"
        className="wb-btn wb-btn-ghost px-1.5 py-1.5 hover:text-[var(--danger)]"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}
