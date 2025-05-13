export default function ExhibitionsLoading() {
  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8" />
      </div>
      <div className="flex gap-6 px-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="min-w-[250px] md:min-w-[300px] bg-white 
                                rounded-3xl overflow-hidden shadow animate-pulse">
            <div className="aspect-[3/2] bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}