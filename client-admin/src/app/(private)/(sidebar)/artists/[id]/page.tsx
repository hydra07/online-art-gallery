import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArtistDetail } from "./artist-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { getArtistById } from "@/service/artist-service";
import { ErrorBoundary } from "@/components/error-boundary";

export default async function ArtistDetailPage({ params }: { params: { id: string } }) {
    const response = await getArtistById(params.id);
    console.log("response", response);
    if (!response) {
        return notFound();
    }

    return (
        <div className="container py-10 mx-auto">
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<ArtistDetailSkeleton />}>
                    <ArtistDetail artist={response.user} />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}

function ArtistDetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-[300px] w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[80%]" />
                    </div>
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}