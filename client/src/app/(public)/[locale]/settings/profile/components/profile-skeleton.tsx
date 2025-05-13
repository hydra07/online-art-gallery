import React from 'react';

export const ProfileSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Profile Section Skeleton */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            {/* Avatar Skeleton */}
            <div className="flex flex-col items-center space-y-3">
              <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-2 justify-center">
                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="pt-2">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-6 w-8 mx-auto bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-14 mx-auto mt-1 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Menu Skeleton */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-3 flex items-center border-b border-gray-100">
                <div className="h-4 w-4 bg-gray-200 rounded mr-3 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area Skeleton */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Tab Title Skeleton */}
            <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>
            
            {/* Cover Image Skeleton */}
            <div className="w-full h-64 bg-gray-200 rounded-xl mb-8 animate-pulse"></div>
            
            {/* Content Sections Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  {[0, 1].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="ml-3 flex-1">
                        <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Additional Content Block Skeletons */}
              {[0, 1].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};