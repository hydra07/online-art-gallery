'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';

export function ClientErrorBoundary({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}