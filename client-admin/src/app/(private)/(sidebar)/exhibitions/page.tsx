import { Suspense } from "react";
import { ExhibitionsTable } from "./exhibition-table";
import { TableSkeleton } from '@/components/ui.custom/table-skeleton';
import { CreateExhibitionButton } from "./create-exhibition-button";
import { ErrorBoundary } from "@/components/error-boundary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Exhibitions',
  description: 'Manage Exhibitions',
};

export default async function ExhibitionsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: string;
    status?: string;
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Exhibition Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your exhibitions</p>
        </div>
        <CreateExhibitionButton />
      </div>
      <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
        <Suspense fallback={<TableSkeleton />}>
          <ExhibitionsTable searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}