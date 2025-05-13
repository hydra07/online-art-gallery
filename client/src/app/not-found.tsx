import Link from 'next/link';

export default function NotFound() {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
			Return Home
          </Link>
          
          
        </div>
      </div>
    </div>
  );
}