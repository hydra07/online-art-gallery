'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { GetPublicExhibitionsResponse } from '@/types/exhibition';
import { SearchForm } from './search-form';
import { ExhibitionTabs } from './exhibition-tabs';
import { ExhibitionTabContent } from './exhibition-tab-content';
import { useExhibitionsQuery } from '../hooks/use-exhibitions-query';

interface DiscoverClientProps {
  initialData: GetPublicExhibitionsResponse;
}

type TabValue = 'featured' | 'trending' | 'recent';

export function DiscoverClient({ initialData }: DiscoverClientProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabValue>('trending');
  const [isTabChanging, setIsTabChanging] = useState(false);
  const t = useTranslations('exhibitions');
  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useExhibitionsQuery(initialData, activeTab, searchQuery);

  // Trigger fetch when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Combine all exhibitions from all pages
  const allExhibitions = data?.pages
    .filter(page => page !== null)
    .flatMap(page => page?.exhibitions || []) || [];

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Clear search function
  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  // Update the tab change handler
  const handleTabChange = (value: string) => {
    setIsTabChanging(true);
    setActiveTab(value as TabValue);
  };

  // Reset tabChanging state when data loads
  useEffect(() => {
    if (!isLoading && isTabChanging) {
      setIsTabChanging(false);
    }
  }, [isLoading, isTabChanging]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Hero Section */}
      <div className='relative h-[300px] bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative max-w-7xl mx-auto px-4 py-12 h-full flex flex-col justify-center'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>
            {t('discover_title')}
          </h1>
          <p className='text-lg mb-6 max-w-2xl'>
            {t('discover_description')}
          </p>

          <SearchForm
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSubmit={handleSearch}
            t={t}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <Tabs
          defaultValue={activeTab}
          onValueChange={handleTabChange}
          className='space-y-6'
        >
          <div className='flex items-center justify-between mb-4'>
            <ExhibitionTabs t={t} />
          </div>

          {/* Tab content with better loading states */}
          {['trending', 'featured', 'recent'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <ExhibitionTabContent
                isLoading={isLoading}
                isTabChanging={isTabChanging}
                isError={isError}
                exhibitions={allExhibitions}
                searchQuery={searchQuery}
                activeTab={activeTab}
                t={t}
                onRetry={() => fetchNextPage()}
                clearSearch={clearSearch}
              />
            </TabsContent>
          ))}

          {/* Infinite scroll trigger */}
          {hasNextPage && !isLoading && (
            <div ref={loadMoreRef} className='h-20 flex items-center justify-center'>
              {isFetchingNextPage && (
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600' />
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}