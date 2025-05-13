'use client';

import { useEffect, useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { artworkService } from '@/app/(public)/[locale]/artists/queries';
import { useRouter } from 'next/navigation';

interface ArtCategoryProps {
  onSelectCategory?: (category: string) => void;
}

const ArtCategory: React.FC<ArtCategoryProps> = ({ onSelectCategory }) => {
  const t = useTranslations();
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await artworkService.getCategories();
        if (response?.data && Array.isArray(response.data)) {
          // We don't need "All" category here - it's now handled in the filter component
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['Painting', 'Digital Art', 'Photography', 'Sculpture', 'Drawing']);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle category selection
  const handleCategoryClick = (category: string) => {
    // If the same category is clicked again, deselect it
    const newSelected = category === selectedCategory ? null : category;
    setSelectedCategory(newSelected);
    
    // Notify parent component if provided
    if (onSelectCategory) {
      onSelectCategory(newSelected || '');
    } else {
      // Default behavior - update URL with category parameter
      if (newSelected) {
        router.push(`?category=${encodeURIComponent(newSelected)}`, { scroll: false });
      } else {
        router.push(``, { scroll: false });
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container py-3 px-4 mx-auto">      <ScrollArea 
          ref={scrollRef}
          className="w-full"
        >
          <div className="flex gap-2 pb-1">
            {/* Now "All" is dynamically handled by having no selection */}
            <button
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm",
                !selectedCategory 
                  ? "bg-primary text-primary-foreground dark:text-white" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              )}
              onClick={() => handleCategoryClick(selectedCategory || '')}
            >
              {t('filter.allCategories')}
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm",
                  category === selectedCategory
                    ? "bg-primary text-primary-foreground dark:text-white" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                )}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ArtCategory;
