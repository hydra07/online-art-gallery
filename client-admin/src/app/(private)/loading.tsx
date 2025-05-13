export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
        <span className="mt-2">Loading...</span>
      </div>
    </div>
  );
}