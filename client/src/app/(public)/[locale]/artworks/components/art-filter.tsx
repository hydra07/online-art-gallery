'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  ArrowDownAZ,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Filter,
  Grid,
  Image,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  Tag,
  Tags,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { vietnamCurrency } from '@/utils/converters';
import { artworkService } from '@/app/(public)/[locale]/artists/queries';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Types based on artwork data structure
type SectionName = 'artists' | 'categories' | 'status' | 'price';

interface FilterSectionProps {
  title: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface HeaderFilterProps {
  onLayoutChange: (isGrid: boolean) => void;
  headerHeight?: number;
  onFilterChange?: (filters: FilterState) => void;
}

interface CheckboxItemProps {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: () => void;
}

// Artist structure as per your data
interface Artist {
  _id: string;
  name: string;
  image: string;
}

// Updated FilterState to match API parameters
export interface FilterState {
  categories: string[];
  priceRange: number[];
  artists: string[];
  status: {
    available: boolean;
    selling: boolean;
  };
  search: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Mock data - aligned with your data structure
const artists: Artist[] = [
  { _id: 'artist1', name: 'Leonardo da Vinci', image: '/artists/davinci.jpg' },
  { _id: 'artist2', name: 'Vincent van Gogh', image: '/artists/vangogh.jpg' },
  { _id: 'artist3', name: 'Pablo Picasso', image: '/artists/picasso.jpg' },
];

const categories = ['Painting', 'Sculpture', 'Digital Art', 'Photography', 'Drawing'];

const initialFilterState: FilterState = {
  categories: [],
  priceRange: [0, 10000000],
  artists: [],
  status: {
    available: false,
    selling: false
  },
  search: ''
};

// Simplified checkbox item
const CheckboxItem = ({ id, label, description, checked = false, onChange }: CheckboxItemProps) => (
  <div className="flex items-center space-x-2 py-1">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-primary dark:border-gray-600"
    />
    <div className="grid gap-0.5 leading-none">
      <Label htmlFor={id} className="text-sm cursor-pointer text-gray-900 dark:text-gray-100">{label}</Label>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  </div>
);

// Simplified filter section
const FilterSection = memo(({ title, isExpanded, onToggle, children }: FilterSectionProps) => (
  <div className='border-b border-gray-200 dark:border-gray-700 pb-3'>
    <div
      className='flex justify-between items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors'
      onClick={onToggle}
    >
      <h3 className='font-medium text-gray-900 dark:text-gray-100'>{title}</h3>
      {isExpanded ?
        <ChevronUp className='h-4 w-4 text-gray-500 dark:text-gray-400' /> :
        <ChevronDown className='h-4 w-4 text-gray-500 dark:text-gray-400' />
      }
    </div>

    {isExpanded && <div className='mt-2'>{children}</div>}
  </div>
));
FilterSection.displayName = 'FilterSection';

// Main Component - optimized for the provided data structure
const HeaderFilter = ({ onLayoutChange, headerHeight = 80, onFilterChange }: HeaderFilterProps) => {
  const t = useTranslations('filter');
  const pathname = usePathname();
  const filterRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const initialTopRef = useRef<number | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();

  // Filter state - Now we separate current filters from applied filters
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilterState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showCategorySelect, setShowCategorySelect] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<SectionName, boolean>>({
    artists: false,
    categories: true,
    status: false,
    price: true
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>(categories);
  const [isFilterChanged, setIsFilterChanged] = useState<boolean>(false);

  // Visible categories limit
  const [visibleCategoryCount, setVisibleCategoryCount] = useState<number>(10);
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await artworkService.getCategories();
        if (response?.data && Array.isArray(response.data)) {
          setAvailableCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
      }
    };

    fetchCategories();
  }, []);

  // Mobile optimization - check viewport width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track if filters have changed from what's applied
  useEffect(() => {
    const hasChanged =
      JSON.stringify(filters.categories) !== JSON.stringify(appliedFilters.categories) ||
      JSON.stringify(filters.priceRange) !== JSON.stringify(appliedFilters.priceRange) ||
      JSON.stringify(filters.artists) !== JSON.stringify(appliedFilters.artists) ||
      JSON.stringify(filters.status) !== JSON.stringify(appliedFilters.status) ||
      filters.search !== appliedFilters.search ||
      filters.sortBy !== appliedFilters.sortBy ||
      filters.sortOrder !== appliedFilters.sortOrder;

    setIsFilterChanged(hasChanged);
  }, [filters, appliedFilters]);

  // Get visible categories based on limit
  const getVisibleCategories = useCallback(() => {
    if (showAllCategories) return availableCategories;
    return availableCategories.slice(0, visibleCategoryCount);
  }, [availableCategories, visibleCategoryCount, showAllCategories]);

  // Add sort options in the filter
  const handleSortChange = (sortOption: string) => {
    setFilters(prev => {
      // Toggle between asc/desc if same sortBy is selected
      if (prev.sortBy === sortOption) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        };
      }

      // Otherwise set new sort option with default asc order
      return {
        ...prev,
        sortBy: sortOption,
        sortOrder: 'asc'
      };
    });
  };

  // Improved search bar with debounce
  const handleSearchSubmit = useCallback(() => {
    if (filters.search !== appliedFilters.search) {
      setAppliedFilters(prev => ({ ...prev, search: filters.search }));
      onFilterChange?.({ ...appliedFilters, search: filters.search });
    }
  }, [filters.search, appliedFilters, onFilterChange]);

  // Debounced search function
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));

    // We don't apply search right away, let user press Apply
    if (search === '') {
      // But we do clear search immediately when empty
      if (appliedFilters.search) {
        setAppliedFilters(prev => ({ ...prev, search: '' }));
        onFilterChange?.({ ...appliedFilters, search: '' });
      }
    }
  };

  // Apply current filters
  const applyFilters = () => {
    setAppliedFilters(filters);
    onFilterChange?.(filters);

    // Close sheet on mobile when filters are applied
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    onFilterChange?.(initialFilterState);
  };

  // Check if any filters are currently applied
  const hasActiveFilters = useCallback(() => {
    return (
      appliedFilters.categories.length > 0 ||
      appliedFilters.priceRange[0] > 0 ||
      appliedFilters.priceRange[1] < 10000000 ||
      appliedFilters.artists.length > 0 ||
      Object.values(appliedFilters.status).some(Boolean) ||
      Boolean(appliedFilters.search) ||
      Boolean(appliedFilters.sortBy)
    );
  }, [appliedFilters]);

  // Update filter functions - unchanged from original
  const updateCategories = (category: string) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(category);
      const newCategories = isSelected
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];

      return { ...prev, categories: newCategories };
    });
  };

  const updatePriceRange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const updateArtists = (artistId: string) => {
    setFilters(prev => {
      const isSelected = prev.artists.includes(artistId);
      const newArtists = isSelected
        ? prev.artists.filter(id => id !== artistId)
        : [...prev.artists, artistId];

      return { ...prev, artists: newArtists };
    });
  };

  const updateStatus = (statusKey: 'available' | 'selling') => {
    setFilters(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [statusKey]: !prev.status[statusKey]
      }
    }));
  };

  // Enhanced filter panel with better color contrasts and visual hierarchy
  const FilterPanelContent = () => (
    <>
      <ScrollArea ref={sheetRef} className="h-[calc(100vh-10rem-60px)] md:h-[calc(100vh-10rem-60px)]">
        <div className="px-4 space-y-5 pb-6 pt-2">
          {/* Sort Options Section */}
          <div className='border-b border-gray-200 dark:border-gray-700 pb-4'>
            <h3 className='font-medium text-gray-900 dark:text-gray-50 mb-3 flex items-center'>
              <ArrowUpDown className="w-4 h-4 mr-1.5 text-primary/80" />
              {t('sort')}
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              <Button
                size="sm"
                variant={filters.sortBy === 'price' ? 'default' : 'outline'}
                className={cn(
                  "text-xs justify-start",
                  filters.sortBy === 'price' && 'bg-primary text-white hover:bg-primary/90'
                )}
                onClick={() => handleSortChange('price')}
              >
                <CircleDollarSign className="w-3 h-3 mr-1.5" />
                {t('sortByPrice')} {filters.sortBy === 'price' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                size="sm"
                variant={filters.sortBy === 'createdAt' ? 'default' : 'outline'}
                className={cn(
                  "text-xs justify-start",
                  filters.sortBy === 'createdAt' && 'bg-primary text-white hover:bg-primary/90'
                )}
                onClick={() => handleSortChange('createdAt')}
              >
                <ArrowDownAZ className="w-3 h-3 mr-1.5" />
                {t('sortByDate')} {filters.sortBy === 'createdAt' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            </div>
          </div>

          {/* Categories as tags */}
          <FilterSection
            title={
              <div className="flex items-center">
                <Tags className="w-4 h-4 mr-1.5 text-primary/80" />
                {t('categories')}
              </div>
            }
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
          >
            <div className='flex flex-wrap gap-1.5 mt-2 max-h-48 overflow-y-auto pr-1'>
              {getVisibleCategories().map(category => (
                <CategoryTag
                  key={category}
                  category={category}
                  isSelected={filters.categories.includes(category)}
                  onClick={() => updateCategories(category)}
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-3">
              {availableCategories.length > visibleCategoryCount && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-0 h-6 text-primary hover:text-primary/80 hover:bg-primary/10"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                >
                  {showAllCategories ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      {t('showLess')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      {t('showMore')} ({availableCategories.length - visibleCategoryCount})
                    </>
                  )}
                </Button>
              )}

              {filters.categories.length > 0 && (<Button
                variant="ghost"
                size="sm"
                className="text-xs p-0 h-6 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-900/20"
                onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
              >
                <X className="w-3 h-3 mr-1" />
                {t('clearSelection')}
              </Button>
              )}
            </div>
          </FilterSection>

          <FilterSection
            title={
              <div className="flex items-center">
                <CircleDollarSign className="w-4 h-4 mr-1.5 text-primary/80" />
                {t('price')}
              </div>
            }
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className='space-y-4'>
              <Slider
                value={filters.priceRange}
                onValueChange={updatePriceRange}
                max={10000000}
                step={100000}
                className='my-4'
              />
              <div className='flex justify-between text-sm text-gray-700 dark:text-gray-300 font-medium'>
                <span>{vietnamCurrency(filters.priceRange[0])}</span>
                <span>{vietnamCurrency(filters.priceRange[1])}</span>
              </div>

              <div className="flex gap-2 mt-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Min</Label>
                  <Input
                    type="text"
                    value={vietnamCurrency(filters.priceRange[0])}
                    className="h-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    readOnly
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Max</Label>
                  <Input
                    type="text"
                    value={vietnamCurrency(filters.priceRange[1])}
                    className="h-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    readOnly
                  />
                </div>
              </div>

              {/* Reset price range button */}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) && (
                <div className="flex justify-end mt-1">                  <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs py-1 h-6 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:text-rose-200 dark:hover:bg-rose-900/20"
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 10000000] }))}
                >
                  <X className="w-3 h-3 mr-1" />
                  {t('resetPriceRange')}
                </Button>
                </div>
              )}
            </div>
          </FilterSection>

          <FilterSection
            title={
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1.5 text-primary/80" />
                {t('artists')}
              </div>
            }
            isExpanded={expandedSections.artists}
            onToggle={() => toggleSection('artists')}
          >
            <div className='space-y-2'>
              {artists.map(artist => (
                <CheckboxItem
                  key={artist._id}
                  id={artist._id}
                  label={artist.name}
                  checked={filters.artists.includes(artist._id)}
                  onChange={() => updateArtists(artist._id)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title={
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1.5 text-primary/80" />
                {t('status')}
              </div>
            }
            isExpanded={expandedSections.status}
            onToggle={() => toggleSection('status')}
          >
            <div className='space-y-2'>
              <CheckboxItem
                id="available"
                label={t('artwork.status.available')}
                checked={filters.status.available}
                onChange={() => updateStatus('available')}
              />
              <CheckboxItem
                id="selling"
                label={t('artwork.status.selling')}
                checked={filters.status.selling}
                onChange={() => updateStatus('selling')}
              />
            </div>
          </FilterSection>
        </div>
      </ScrollArea>

      {/* Action buttons (Apply/Clear Filters) with better styling */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:text-rose-200 dark:hover:bg-rose-900/20 border-rose-200 dark:border-rose-800"
          disabled={!hasActiveFilters()}
        >
          <X className="w-4 h-4 mr-1" />
          {t('clearFilters')}
        </Button>
        <Button
          size="sm"
          onClick={applyFilters}
          className={cn(
            "text-sm bg-primary hover:bg-primary/90 text-white",
            !isFilterChanged && "opacity-50"
          )}
          disabled={!isFilterChanged}
          variant={isFilterChanged ? "default" : "outline"}
        >
          <Check className="w-4 h-4 mr-1" />
          {t('applyFilters')}
        </Button>
      </div>
    </>
  );

  // Display active category filters as tags - improved styling
  const ActiveCategoryTags = () => {
    const activeCategories = appliedFilters.categories.map(category => (
      <CategoryTag
        key={category}
        category={category}
        isSelected={true}
        onClick={() => updateCategories(category)}
      />
    ));

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {activeCategories}
      </div>
    );
  };

  // Helper functions
  const toggleSection = (section: SectionName) =>
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  // Enhanced button style with better color contrast
  const getButtonStyle = (isScrolled: boolean) => cn(
    'rounded-full transition-colors font-medium',
    isScrolled
      ? 'text-gray-800 dark:text-gray-50 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
      : 'text-gray-700 dark:text-gray-200 bg-white/20 dark:bg-gray-800/40 hover:bg-white/30 dark:hover:bg-gray-700/50 border-transparent dark:border-gray-700/40'
  );
  // Enhanced rendering for category tags with consistent size and spacing and improved contrast
  const CategoryTag = ({ category, isSelected, onClick }: {
    category: string;
    isSelected: boolean;
    onClick: () => void
  }) => (
    <button
      className={cn(
        'text-xs min-h-[28px] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm',
        isSelected
          ? 'bg-primary text-white dark:text-white hover:bg-primary/90 font-medium ring-2 ring-primary/20 dark:ring-primary/30'
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      )}
      onClick={onClick}
    >
      {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
      <span className="line-clamp-1">{category}</span>
    </button>
  );

  // Better default category display with more consistent spacing and responsive design
  const DefaultCategoryDisplay = () => {
    // Adjust display count based on screen width
    const displayCount = windowWidth < 1024 ? 8 : windowWidth < 1280 ? 10 : 12;
    const displayCategories = availableCategories.slice(0, displayCount);
    const hasMore = availableCategories.length > displayCount;

    return (
      <div className="mt-1 py-1.5">
        <div className="flex flex-wrap gap-1.5 items-center">
          {/* All Categories Option */}
          <CategoryTag
            category="All"
            isSelected={appliedFilters.categories.length === 0}
            onClick={() => {
              // When selecting "All", clear all category filters
              if (appliedFilters.categories.length > 0) {
                const newFilters = { ...appliedFilters, categories: [] };
                setFilters(prev => ({ ...prev, categories: [] }));
                setAppliedFilters(newFilters);
                onFilterChange?.(newFilters);

                // Also update URL to remove category parameter
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('category');
                window.history.replaceState({}, '', newUrl.toString());
              }
            }}
          />

          {/* Individual Category Options */}
          {displayCategories.map(category => (
            <CategoryTag
              key={category}
              category={category}
              isSelected={appliedFilters.categories.includes(category)}
              onClick={() => {
                // Toggle the category selection
                const isSelected = appliedFilters.categories.includes(category);
                const newCategories = isSelected
                  ? appliedFilters.categories.filter(c => c !== category)
                  : [...appliedFilters.categories, category];

                const newFilters = { ...appliedFilters, categories: newCategories };
                setFilters(prev => ({ ...prev, categories: newCategories }));
                setAppliedFilters(newFilters);
                onFilterChange?.(newFilters);
              }}
            />
          ))}

          {/* Show More Option */}
          {hasMore && (
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-xs min-h-[28px] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 
                  bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 
                  text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  <ChevronDown className="w-3 h-3 flex-shrink-0" />
                  <span className="line-clamp-1">{t('showMore')} ({availableCategories.length - displayCount})</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[70vh] rounded-t-xl p-4">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-lg font-bold flex items-center">
                    <Tags className="w-5 h-5 mr-2 text-primary/90" />
                    {t('allCategories')}
                  </SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-[calc(70vh-100px)]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {/* All Categories Option in Modal */}
                    <CategoryTag
                      category="All"
                      isSelected={appliedFilters.categories.length === 0}
                      onClick={() => {
                        if (appliedFilters.categories.length > 0) {
                          const newFilters = { ...appliedFilters, categories: [] };
                          setFilters(prev => ({ ...prev, categories: [] }));
                          setAppliedFilters(newFilters);
                          onFilterChange?.(newFilters);
                        }
                      }}
                    />

                    {availableCategories.map(category => (
                      <CategoryTag
                        key={category}
                        category={category}
                        isSelected={appliedFilters.categories.includes(category)}
                        onClick={() => {
                          const isSelected = appliedFilters.categories.includes(category);
                          const newCategories = isSelected
                            ? appliedFilters.categories.filter(c => c !== category)
                            : [...appliedFilters.categories, category];

                          const newFilters = { ...appliedFilters, categories: newCategories };
                          setFilters(prev => ({ ...prev, categories: newCategories }));
                          setAppliedFilters(newFilters);
                          onFilterChange?.(newFilters);
                        }}
                      />
                    ))}
                  </div>
                </ScrollArea>

                {/* Bottom Action Bar */}
                <div className="mt-4 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newFilters = { ...appliedFilters, categories: [] };
                      setFilters(prev => ({ ...prev, categories: [] }));
                      setAppliedFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                    className="text-xs"
                    disabled={appliedFilters.categories.length === 0}
                  >
                    {t('clearSelection')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Just close the sheet, changes are applied immediately
                    }}
                    className="text-xs"
                  >
                    {t('done')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    );
  };

  // More prominent clear all filters button with proper disabled state
  const ClearAllFiltersButton = () => {
    const isActive = hasActiveFilters();

    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "text-xs h-6 py-0 px-2 transition-all",
          isActive
            ? "text-rose-500 hover:text-rose-600 border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:border-rose-900 dark:hover:bg-rose-900/20"
            : "text-gray-400 border-gray-200 bg-gray-50/50 dark:text-gray-600 dark:border-gray-800 dark:bg-gray-800/30 cursor-not-allowed"
        )}
        onClick={clearFilters}
        disabled={!isActive}
      >
        <X className="h-3 w-3 mr-1" />
        {t('clearAll')}
      </Button>
    );
  };

  // Window width hook for responsive design
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return (
    <div
      ref={filterRef}
      className={cn(
        'z-40 transition-colors',
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm dark:shadow-gray-950/30'
          : 'bg-transparent'
      )}
    >
      <div className={cn('container mx-auto py-2', isMobile ? 'px-2' : 'px-4')}>
        <div className='flex items-center gap-2'>
          {/* Search Bar with debounce - main search bar */}
          <div className='flex-1 min-w-0'>
            <form
              className='w-full'
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
            >              <div
              className={cn(
                'relative rounded-full overflow-hidden transition-colors',
                isScrolled
                  ? 'bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700'
                  : 'bg-white/30 dark:bg-gray-800/50 ring-1 ring-gray-300/60 dark:ring-gray-700/60'
              )}
            >
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700 dark:text-gray-300' />
                <Input
                  placeholder={t('quickSearch')}
                  value={filters.search}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFilters(prev => ({ ...prev, search: newValue }));

                    // Clear any existing timeout
                    if (searchTimeoutRef.current) {
                      clearTimeout(searchTimeoutRef.current);
                    }

                    // Set a new timeout for debouncing (700ms)
                    searchTimeoutRef.current = setTimeout(() => {
                      setAppliedFilters(prev => ({ ...prev, search: newValue }));
                      onFilterChange?.({ ...appliedFilters, search: newValue });
                    }, 700);
                  }}
                  className={cn(
                    'border-none bg-transparent pl-10 pr-10 h-9 w-full focus:ring-0 text-sm',
                    isScrolled
                      ? 'text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
                      : 'text-gray-900 dark:text-gray-50 placeholder:text-gray-600 dark:placeholder:text-gray-300'
                  )}
                />
                {filters.search && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, search: '' }));
                      setAppliedFilters(prev => ({ ...prev, search: '' }));
                      onFilterChange?.({ ...appliedFilters, search: '' });
                      if (searchTimeoutRef.current) {
                        clearTimeout(searchTimeoutRef.current);
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Filter button with enhanced styling and badge count */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className={cn(
                  getButtonStyle(isScrolled),
                  'flex items-center gap-1 min-w-9 justify-center shadow-sm',
                  hasActiveFilters() && 'bg-primary/20 border-primary/30 text-primary-foreground dark:bg-primary/30 dark:text-white dark:border-primary/50'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <SlidersHorizontal className='h-4 w-4' />
                <span className='hidden sm:inline text-sm font-semibold'>{t('filters')}</span>
                {hasActiveFilters() && (
                  <Badge variant='secondary' className='ml-1 text-xs px-1.5 bg-primary text-white'>
                    {[
                      appliedFilters.categories.length > 0,
                      appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 10000000,
                      appliedFilters.artists.length > 0,
                      Object.values(appliedFilters.status).some(Boolean),
                      Boolean(appliedFilters.sortBy)
                    ].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent
              side={isMobile ? 'bottom' : 'right'}
              className={cn(
                'bg-white dark:bg-gray-900 p-0 backdrop-blur-md border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-950/50',
                isMobile ? 'h-[85vh] rounded-t-xl' : 'w-full max-w-[380px]'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <SheetHeader className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                <SheetTitle className='text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center'>
                  <Filter className="h-5 w-5 mr-2 text-primary/80" />
                  {t('filters')}
                </SheetTitle>
              </SheetHeader>
              <FilterPanelContent />
            </SheetContent>
          </Sheet>          {/* Desktop category filter button - hidden at all breakpoints now */}
          {false && (
            <div className="hidden sm:flex">
              <DefaultCategoryDisplay />
            </div>
          )}

          {/* Price filter quick button */}
          <div className="hidden sm:flex">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className={cn(
                    getButtonStyle(isScrolled),
                    'text-sm font-semibold whitespace-nowrap shadow-sm',
                    (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 10000000) &&
                    'bg-primary/15 border-primary/25 text-primary dark:bg-primary/25 dark:text-primary-foreground dark:border-primary/40'
                  )}
                >
                  <CircleDollarSign className="w-4 h-4 mr-1" />
                  {t('priceRange')}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className='w-80 p-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-950/50'
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <Label className='text-base font-semibold text-gray-900 dark:text-gray-50 flex items-center'>
                    <CircleDollarSign className="w-4 h-4 mr-1.5" />
                    {t('priceRange')}
                  </Label>

                  <Slider
                    value={filters.priceRange}
                    onValueChange={updatePriceRange}
                    max={10000000}
                    step={100000}
                    className='my-4'
                  />

                  <div className='flex justify-between text-sm text-gray-700 dark:text-gray-300'>
                    <span>{vietnamCurrency(filters.priceRange[0])}</span>
                    <span>{vietnamCurrency(filters.priceRange[1])}</span>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Min</Label>
                      <Input
                        type="text"
                        value={vietnamCurrency(filters.priceRange[0])}
                        className="h-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        readOnly
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Max</Label>
                      <Input
                        type="text"
                        value={vietnamCurrency(filters.priceRange[1])}
                        className="h-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Add Apply/Reset buttons */}
                  <div className="mt-4 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFilters = { ...filters, priceRange: [0, 10000000] };
                        setFilters(newFilters);
                        setAppliedFilters(prev => ({ ...prev, priceRange: [0, 10000000] }));
                        onFilterChange?.({ ...appliedFilters, priceRange: [0, 10000000] });
                      }}
                      className="text-xs"
                      disabled={filters.priceRange[0] === 0 && filters.priceRange[1] === 10000000}
                    >
                      {t('reset')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setAppliedFilters(prev => ({ ...prev, priceRange: filters.priceRange }));
                        onFilterChange?.({ ...appliedFilters, priceRange: filters.priceRange });
                      }}
                      className="text-xs"
                      disabled={
                        filters.priceRange[0] === appliedFilters.priceRange[0] &&
                        filters.priceRange[1] === appliedFilters.priceRange[1]
                      }
                    >
                      {t('apply')}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort button for desktop */}
          <div className="hidden sm:flex">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className={cn(
                    getButtonStyle(isScrolled),
                    'text-sm font-semibold whitespace-nowrap shadow-sm',
                    appliedFilters.sortBy && 'bg-primary/15 border-primary/25 text-primary dark:bg-primary/25 dark:text-primary-foreground dark:border-primary/40'
                  )}
                >
                  <ArrowUpDown className="w-4 h-4 mr-1" />
                  {t('sort')}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className='w-60 p-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-950/50'
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-2">
                  <h4 className='text-sm font-semibold text-gray-900 dark:text-gray-50 flex items-center mb-2'>
                    <ArrowUpDown className="w-4 h-4 mr-1.5" />
                    {t('sortBy')}
                  </h4>

                  <div className="space-y-1">
                    <Button
                      size="sm"
                      variant={filters.sortBy === 'price' && filters.sortOrder === 'asc' ? 'default' : 'outline'}
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const newFilters: FilterState = {
                          ...filters,
                          sortBy: 'price',
                          sortOrder: 'asc'
                        };
                        setFilters(newFilters);
                        setAppliedFilters(newFilters);
                        onFilterChange?.(newFilters);
                      }}
                    >
                      <CircleDollarSign className="w-3.5 h-3.5 mr-1.5" />
                      {t('priceLowToHigh')}
                    </Button>

                    <Button
                      size="sm"
                      variant={filters.sortBy === 'price' && filters.sortOrder === 'desc' ? 'default' : 'outline'}
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const newFilters: FilterState = {
                          ...filters,
                          sortBy: 'price',
                          sortOrder: 'desc'
                        };
                        setFilters(newFilters);
                        setAppliedFilters(newFilters);
                        onFilterChange?.(newFilters);
                      }}
                    >
                      <CircleDollarSign className="w-3.5 h-3.5 mr-1.5" />
                      {t('priceHighToLow')}
                    </Button>

                    <Button
                      size="sm"
                      variant={filters.sortBy === 'createdAt' && filters.sortOrder === 'desc' ? 'default' : 'outline'}
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const newFilters: FilterState = {
                          ...filters,
                          sortBy: 'createdAt',
                          sortOrder: 'desc'
                        };
                        setFilters(newFilters);
                        setAppliedFilters(newFilters);
                        onFilterChange?.(newFilters);
                      }}
                    >
                      <ArrowDownAZ className="w-3.5 h-3.5 mr-1.5" />
                      {t('newest')}
                    </Button>

                    <Button
                      size="sm"
                      variant={filters.sortBy === 'createdAt' && filters.sortOrder === 'asc' ? 'default' : 'outline'}
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const newFilters: FilterState = {
                          ...filters,
                          sortBy: 'createdAt',
                          sortOrder: 'asc'
                        };
                        setFilters(newFilters);
                        setAppliedFilters(newFilters);
                        onFilterChange?.(newFilters);
                      }}
                    >
                      <ArrowDownAZ className="w-3.5 h-3.5 mr-1.5" />
                      {t('oldest')}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* Display default categories in main view for quick selection */}
        {availableCategories.length > 0 && !isMobile && (
          <DefaultCategoryDisplay />
        )}

        {/* Other active filter indicators - with improved styling */}
        {(
          (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 10000000) ||
          appliedFilters.artists.length > 0 ||
          Object.values(appliedFilters.status).some(Boolean) ||
          appliedFilters.sortBy
        ) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {(appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 10000000) && (
                <Badge
                  variant="outline"
                  className="text-xs py-0 bg-gray-50 dark:bg-gray-800 flex items-center shadow-sm
                  border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                >
                  <CircleDollarSign className="w-3 h-3 mr-1 text-primary" />
                  {vietnamCurrency(appliedFilters.priceRange[0])} - {vietnamCurrency(appliedFilters.priceRange[1])}
                  <button
                    className="ml-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => {
                      const newFilters = { ...appliedFilters, priceRange: [0, 10000000] };
                      setFilters(prev => ({ ...prev, priceRange: [0, 10000000] }));
                      setAppliedFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {appliedFilters.sortBy && (
                <Badge
                  variant="outline"
                  className="text-xs py-0 bg-gray-50 dark:bg-gray-800 flex items-center shadow-sm
                  border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <ArrowUpDown className="w-3 h-3 mr-1 text-primary/70" />
                  {appliedFilters.sortBy === 'price'
                    ? (appliedFilters.sortOrder === 'asc' ? t('priceLowToHigh') : t('priceHighToLow'))
                    : (appliedFilters.sortOrder === 'asc' ? t('oldest') : t('newest'))
                  }                <button
                    className="ml-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: undefined, sortOrder: undefined }));
                      setAppliedFilters(prev => ({ ...prev, sortBy: undefined, sortOrder: undefined }));
                      onFilterChange?.({ ...appliedFilters, sortBy: undefined, sortOrder: undefined });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {/* Status badges if any active */}
              {appliedFilters.status.available && (
                <Badge
                  variant="outline"
                  className="text-xs py-0 bg-gray-50 dark:bg-gray-800 flex items-center shadow-sm
                  border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <Tag className="w-3 h-3 mr-1 text-primary/70" />
                  {t('artwork.status.available')}                <button
                    className="ml-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, status: { ...prev.status, available: false } }));
                      setAppliedFilters(prev => ({ ...prev, status: { ...prev.status, available: false } }));
                      onFilterChange?.({ ...appliedFilters, status: { ...appliedFilters.status, available: false } });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {appliedFilters.status.selling && (
                <Badge
                  variant="outline"
                  className="text-xs py-0 bg-gray-50 dark:bg-gray-800 flex items-center shadow-sm
                  border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <Tag className="w-3 h-3 mr-1 text-primary/70" />
                  {t('artwork.status.selling')}                <button
                    className="ml-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, status: { ...prev.status, selling: false } }));
                      setAppliedFilters(prev => ({ ...prev, status: { ...prev.status, selling: false } }));
                      onFilterChange?.({ ...appliedFilters, status: { ...appliedFilters.status, selling: false } });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {/* Clear all filters button */}
              <ClearAllFiltersButton />
            </div>
          )}
      </div>

      {/* Bottom border when scrolled */}
      {isScrolled && (
        <div className='h-px w-full bg-gradient-to-r from-transparent via-gray-200/70 dark:via-gray-700/80 to-transparent' />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .dark .ui-slider-track { background-color: rgba(55, 65, 81, 0.5); }
        .dark .ui-slider-range { background-color: rgba(209, 213, 219, 0.8); }
        .dark .ui-slider-thumb { 
          border-color: rgba(209, 213, 219, 0.8);
          background-color: rgba(31, 41, 55, 1);
        }
      `}</style>
    </div>
  );
};

export default HeaderFilter;