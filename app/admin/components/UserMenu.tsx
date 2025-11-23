'use client';

import { useUser } from "@stackframe/stack";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProps {
  displayName?: string | null;
  primaryEmail?: string | null;
}

export default function UserMenu({ user }: { user: UserProps }) {
  const userObj = useUser({ or: 'return-null' });
  const router = useRouter();

  const handleSignOut = async () => {
    if (userObj) {
      await userObj.signOut({ redirectUrl: '/handler/sign-in' });
    }
  };

  return (
     <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
          {user.displayName?.[0] || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-900 truncate">{user.displayName || 'Administrator'}</p>
          <p className="text-[10px] text-slate-400 truncate font-mono">{user.primaryEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
     </div>
  );
}
