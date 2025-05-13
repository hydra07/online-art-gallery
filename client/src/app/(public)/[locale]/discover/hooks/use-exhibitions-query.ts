import { useInfiniteQuery } from '@tanstack/react-query';
import { getPublicExhibitions } from '@/service/exhibition';
import { GetPublicExhibitionsResponse } from '@/types/exhibition';

type TabValue = 'featured' | 'trending' | 'recent';

export function useExhibitionsQuery(initialData: GetPublicExhibitionsResponse, activeTab: TabValue, searchQuery: string) {
  // Get filter and sort config based on active tab
  const getQueryConfig = (tab: TabValue) => {
    switch (tab) {
      case 'featured':
        return {
          filter: { isFeatured: true }, 
          sort: { createdAt: -1 }
        };
      case 'trending':
        return {
          filter: {}, 
          sort: { 'result.visits': -1 }
        };
      case 'recent':
        return {
          filter: {}, 
          sort: { createdAt: -1 }
        };
      default:
        return {
          filter: { discovery: true },
          sort: { createdAt: -1 }
        };
    }
  };

  return useInfiniteQuery({
    queryKey: ['exhibitions', activeTab, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { filter, sort } = getQueryConfig(activeTab);
      
      const response = await getPublicExhibitions({
        page: pageParam,
        limit: 12,
        filter,
        sort,
        search: searchQuery || undefined,
      });
      
      if (!response.data) {
        throw new Error('Failed to load exhibitions');
      }
      
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) {
        return undefined;
      }
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    initialData: { pages: [initialData], pageParams: [1] }
  });
}