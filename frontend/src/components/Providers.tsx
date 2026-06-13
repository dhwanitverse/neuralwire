'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import CommandPalette from '@/components/CommandPalette';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <CommandPalette />
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(3, 7, 18, 0.98) 100%)',
            color: '#f1f5f9',
            borderRadius: '14px',
            padding: '14px 18px',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
          },
          success: { iconTheme: { primary: '#a78bfa', secondary: '#030712' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#030712' } },
        }}
      />
    </AuthProvider>
  );
}
