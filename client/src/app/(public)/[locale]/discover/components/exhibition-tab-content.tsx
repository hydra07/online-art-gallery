import { ExhibitionGrid } from './exhibition-grid';
import { ExhibitionSkeleton } from './exhibition-skeleton';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { PublicExhibition } from '@/types/exhibition';

interface ExhibitionTabContentProps {
  isLoading: boolean;
  isTabChanging: boolean;
  isError: boolean;
  exhibitions: PublicExhibition[];
  searchQuery: string;
  activeTab: string;
  t: (key: string) => string;
  onRetry: () => void;
  clearSearch: () => void;
}

export function ExhibitionTabContent({
  isLoading,
  isTabChanging,
  isError,
  exhibitions,
  searchQuery,
  activeTab,
  t,
  onRetry,
  clearSearch,
}: ExhibitionTabContentProps) {
  if (isLoading && !isTabChanging) {
    return <ExhibitionSkeleton />;
  }

  if (isTabChanging) {
    return (
      <div className="relative">
        {exhibitions.length > 0 ? (
          <div className="opacity-50">
            <ExhibitionGrid exhibitions={exhibitions} />
          </div>
        ) : (
          <ExhibitionSkeleton />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600' />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{t('error_loading')}</p>
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="mt-4"
        >
          {t('try_again')}
        </Button>
      </div>
    );
  }

  if (exhibitions.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {searchQuery ? t('no_search_results') : t(`no_exhibitions_${activeTab}`)}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          {searchQuery 
            ? t('try_different_search') 
            : t('check_back_later')}
        </p>
        {searchQuery && (
          <Button 
            variant="outline"
            onClick={clearSearch}
            className="mx-auto"
          >
            {t('clear_search')}
          </Button>
        )}
      </div>
    );
  }

  return <ExhibitionGrid exhibitions={exhibitions} />;
}