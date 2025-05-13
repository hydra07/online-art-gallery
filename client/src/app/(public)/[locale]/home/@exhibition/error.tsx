'use client';

import { Button } from '@/components/ui/button';

export default function ExhibitionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Unable to load exhibitions
        </h2>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}