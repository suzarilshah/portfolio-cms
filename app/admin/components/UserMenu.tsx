'use client';

import { useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserMenu({ user }: { user: { email: string; name: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear the cookie and redirect
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      router.push('/admin/login');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-md transition-all w-full text-left"
      >
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
          <User size={14} className="text-blue-600" />
        </div>
        <span className="truncate flex-1">{user.name || user.email}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
