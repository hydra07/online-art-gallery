'use client';
import { useState } from 'react';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const InfoButton = () => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const t = useTranslations('exhibitions');
  return (
    <div className="absolute top-3 right-3 z-20">
      <button
        type="button"
        onMouseEnter={() => setIsInfoVisible(true)}
        onMouseLeave={() => setIsInfoVisible(false)}
        className="p-2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-opacity duration-150"
        aria-label="Show navigation controls"
      >
        <Info className="h-6 w-6" />
      </button>
        
      {/* Info Popover - Appears on hover */}
      {isInfoVisible && (
        <div
          className="absolute top-full right-0 mt-2 w-60 bg-white rounded-md shadow-lg p-4 text-left z-30 border border-gray-200"
          onMouseEnter={() => setIsInfoVisible(true)}
          onMouseLeave={() => setIsInfoVisible(false)}
        >
          <h3 className='text-base font-semibold text-gray-800 mb-2'>
            {t('navigation_controls')}
          </h3>
          <p className='text-sm text-gray-600 mb-3'>
            {/* Use your mouse to navigate the 3D space: */}
            {t('navigation_description')}
          </p>
          <ul className='space-y-1.5 text-sm text-gray-500 list-disc list-inside'>
            <li><span className="font-medium text-gray-700">
              {t('left_click_drag')}
            </span>
              ({t('rotate_view')})
            </li>
            <li><span className="font-medium text-gray-700">WASD:</span> Movement</li>
          </ul>
        </div>
      )}
    </div>
  );
};