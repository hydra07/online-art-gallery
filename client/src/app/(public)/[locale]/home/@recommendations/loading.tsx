export default function RecommendationsLoading() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="w-full mx-auto px-4">
        {/* Tabs skeleton */}
        <div className="h-10 w-72 bg-gray-200 rounded-md animate-pulse mb-8" />
        
        {/* Content skeleton */}
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] space-y-3">
              <div className="aspect-[3/2] rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}