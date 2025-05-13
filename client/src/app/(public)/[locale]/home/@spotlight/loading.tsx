export default function SpotlightLoading() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}