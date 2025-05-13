'use client';

import { Button } from '@/components/ui/button';

export default function SpotlightError({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-xl font-semibold mb-4">
                    Unable to load artist spotlight
                </h2>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <Button onClick={reset}>Try again</Button>
            </div>
        </section>
    );
}