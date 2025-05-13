import { Metadata } from 'next';
import { Suspense } from 'react';
import { GalleryTable } from './gallery-table';
import CreateGalleryButton from './create-gallery-button';
import { ErrorBoundary } from 'react-error-boundary';
import { TableSkeleton } from '@/components/ui.custom/table-skeleton';

export const metadata: Metadata = {
  title: 'Gallery Templates',
  description: 'Manage your virtual gallery templates',
};

export default function GalleryPage({
  searchParams = {}
}: {
  searchParams?: { 
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: string;
    search?: string;
  }
}) {
  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Gallery Templates</h1>
          <p className="text-muted-foreground mt-1">Create and manage your virtual exhibition spaces</p>
        </div>
        <CreateGalleryButton />
      </div>

      <ErrorBoundary fallback={<div>Error loading galleries</div>}>
        <Suspense fallback={<TableSkeleton />}>
          <GalleryTable searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}