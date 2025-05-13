export default function ArticlesLoading() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto px-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-12">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured article skeleton */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-8 w-3/4 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse" />
          </div>

          {/* Regular articles grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/2] rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}