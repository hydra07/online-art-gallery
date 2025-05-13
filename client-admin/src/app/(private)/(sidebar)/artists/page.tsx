// app/(private)/(sidebar)/artists/page.tsx
import { Suspense } from "react";
import { ArtistsTable, TableSkeleton } from "./artist-table";
import { ErrorBoundary } from "@/components/error-boundary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Artists',
  description: 'Manage Artists',
};

export default async function ArtistsPage(props: {
  searchParams?: {
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: string;
    search?: string;
  };
}) {
  const searchParams = props.searchParams;
  
  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Artist Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all artists</p>
        </div>
      </div>

      <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
        <Suspense fallback={<TableSkeleton />}>
          <ArtistsTable searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}