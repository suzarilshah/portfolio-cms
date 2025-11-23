'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AdminAuthContextType {
  user: { email: string; name: string } | null;
}

const AdminAuthContext = createContext<AdminAuthContextType>({ user: null });

export default function AdminAuthProvider({ 
  children, 
  user 
}: { 
  children: ReactNode; 
  user: { email: string; name: string } | null;
}) {
  return (
    <AdminAuthContext.Provider value={{ user }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
