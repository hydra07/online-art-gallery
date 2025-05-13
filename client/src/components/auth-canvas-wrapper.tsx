'use client';

import { useSession } from 'next-auth/react';
import { ComponentType, useEffect, useState } from 'react';

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }

    return <WrappedComponent {...props} session={session} status={status} />;
  };
}