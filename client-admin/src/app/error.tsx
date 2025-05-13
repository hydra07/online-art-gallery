'use client';

export default function Error({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <h2 className="text-lg font-semibold">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}