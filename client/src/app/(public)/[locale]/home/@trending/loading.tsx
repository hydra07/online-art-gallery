export default function TrendingLoading() {
  return (
    <section className="py-24 bg-white">
      <div className="w-full mx-auto px-4">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>
        
        {/* Artists grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] rounded-2xl bg-gray-200 animate-pulse" />
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}