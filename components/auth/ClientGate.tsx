'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { StorageManager } from '@/lib/storage';

interface ClientGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ClientGate({ 
  children, 
  fallback,
  redirectTo = '/login' 
}: ClientGateProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const hasUser = StorageManager.hasUser();
    setIsAuthorized(hasUser);

    if (!hasUser) {
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);

  // Show loading state while checking authorization
  if (isAuthorized === null) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">در حال بررسی...</span>
          </div>
        </div>
      )
    );
  }

  // If not authorized, return null (will redirect)
  if (!isAuthorized) {
    return null;
  }

  // If authorized, render children
  return <>{children}</>;
}
