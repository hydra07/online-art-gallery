import { ErrorBoundary } from "@/components/error-boundary";
import { ArtistRequestsTable, TableSkeleton } from "./artist-requests-table";
import { Suspense } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ArtistRequestsPage({ searchParams }: { searchParams: any }) {
    return (
        <div className="container py-10 mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Artist Request Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your artist requests</p>
                </div>
            </div>
            <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
                <Suspense fallback={<TableSkeleton />}>
                    <ArtistRequestsTable searchParams={searchParams} />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}