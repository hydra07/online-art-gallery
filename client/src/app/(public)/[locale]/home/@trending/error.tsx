'use client';

import { Button } from "@/components/ui/button";

export default function TrendingArtistError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="w-full mx-auto px-4 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Failed to load Trending Artist
        </h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </section>
  );
}