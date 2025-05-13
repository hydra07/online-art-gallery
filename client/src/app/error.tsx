'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Update based on your UI lib

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error('An error occurred:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        An unexpected error has occurred. Please try refreshing the page or go back to the homepage.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try Again</Button>
        <Button variant="outline" onClick={() => router.push('/')}>Go Home</Button>
      </div>
    </div>
  );
}
