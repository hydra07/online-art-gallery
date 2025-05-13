import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
    return (
        <div className="max-w-4xl mx-auto px-6 animate-pulse">
          <div className="mb-8 text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <div className="flex flex-col items-center justify-center mb-6 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
    )
}