import { Skeleton } from "@/components/ui/skeleton";
export default function ExhibitionSkeleton() {
    return (
        <div>
            <div className="flex items-center justify-between border-b px-6 py-4 bg-white sticky top-0 z-10">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="p-6">
                <Skeleton className="h-96 w-full" />
            </div>
            <div className="flex items-center justify-between border-b px-6 py-4 bg-white sticky top-0 z-10">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="p-6">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
}