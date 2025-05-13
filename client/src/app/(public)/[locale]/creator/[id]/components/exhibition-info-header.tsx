'use client';

import { Info } from 'lucide-react';
import Link from 'next/link'; // Use Next.js Link for internal navigation

// Define props type for better type safety and clarity
interface ExhibitionInfoHeaderProps {
  title: string;
  description: string;
  faqLinkText?: string;
}

export function ExhibitionInfoHeader({
  title,
  description,
  faqLinkText,
}: ExhibitionInfoHeaderProps) {
  return (
    <div className='bg-white rounded-lg border p-6 mb-8'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>{title}</h2>
      <p className='text-gray-600 leading-relaxed'>{description}</p>
      {faqLinkText && (
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <Info className="h-4 w-4" />
          {/* Use Next.js Link for client-side navigation */}
          <Link href="/faq" className="hover:underline">
            {faqLinkText}
          </Link>
        </div>
      )}
    </div>
  );
}