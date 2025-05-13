'use client';

import Image from 'next/image';

interface ExhibitionFloorPlanProps {
  imageUrl: string;
  altText: string;
  title: string;
  // description: string;
}

export function ExhibitionFloorPlan({
  imageUrl,
  altText,
  title,
  // description,
}: ExhibitionFloorPlanProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>{title}</h2>
      {/* <p className='text-gray-600 leading-relaxed mb-6'>{description}</p> */}

      <div className='w-full flex justify-center'>
        <div className='w-[600px] rounded-lg overflow-hidden border border-gray-200'>
          <Image
            src={imageUrl}
            alt={altText}
            width={1000} // Provide explicit width/height for better performance
            height={1000} // Adjust based on image aspect ratio if known
            className='w-full h-auto object-contain'
            priority // Consider adding priority if it's above the fold
          />
        </div>
      </div>
    </div>
  );
}