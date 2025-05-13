'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GalleryError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your monitoring service
    console.error('Gallery error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="rounded-full bg-destructive/10 p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight mb-2">Unable to load gallery</h2>
        <p className="text-muted-foreground mb-8">
          There was a problem loading the gallery templates. This could be temporary, please try again.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={reset}
            size="lg"
            className="w-full sm:w-auto"
          >
            Try again
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href="../">
              Go back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}