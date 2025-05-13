'use client';

import { Check } from 'lucide-react';

interface Feature {
  name: string;
  freeSupported: string | boolean;
  premiumSupported: string | boolean;
}

const features: Feature[] = [
  {
    name: '3D Gallery Views',
    freeSupported: '5 views/day',
    premiumSupported: 'Unlimited'
  },
  {
    name: 'Image Quality',
    freeSupported: 'HD (1080p)',
    premiumSupported: '4K Ultra HD'
  },
  
  {
    name: 'Artists You Can Follow',
    freeSupported: '10 artists',
    premiumSupported: 'Unlimited'
  },
 
  {
    name: 'Save Favorite Collections',
    freeSupported: '3 collections',
    premiumSupported: 'Unlimited'
  }
];

export const FeatureComparison = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
        Plan Feature Comparison
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Experience unlimited art with Premium
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Header */}
        <div className="col-span-1" />
        <div className="text-center font-medium text-gray-900 pb-4 border-b">
          Free Plan
        </div>
        <div className="text-center font-medium text-gray-900 pb-4 border-b">
          Premium Plan
        </div>

        {/* Features */}
        {features.map((feature, index) => (
          <div key={index} className="contents">
            <div className="py-4 text-gray-700 border-b">{feature.name}</div>
            <div className="flex justify-center items-center py-4 text-sm text-gray-600 border-b">
              {typeof feature.freeSupported === 'boolean' ? (
                feature.freeSupported ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-red-500">✕</span>
                )
              ) : (
                feature.freeSupported
              )}
            </div>
            <div className="flex justify-center items-center py-4 text-sm text-gray-600 border-b">
              {typeof feature.premiumSupported === 'boolean' ? (
                feature.premiumSupported ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-red-500">✕</span>
                )
              ) : (
                <span className="font-medium text-indigo-600">
                  {feature.premiumSupported}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};