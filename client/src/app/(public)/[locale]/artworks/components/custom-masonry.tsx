'use client';

import { Artwork } from '@/types/marketplace';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import { motion } from 'framer-motion';
import ArtCard from './art-card';
import { useTranslations } from 'next-intl';

type CustomMasonryProps = {
  items: Artwork[];
  onItemClick: (id: string) => void;
  loadMore: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  totalCount?: number;
};

export const CustomMasonry: React.FC<CustomMasonryProps> = ({
  items,
  onItemClick,
  loadMore,
  hasMore = true,
  isLoading = false,
  totalCount = 0
}) => {
  const [width, height] = useWindowSize();
  const isMobile = width < 768;
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  // Calculate optimal column count and width based on screen size
  const { columnCount, columnWidth } = useMemo(() => {
    let count = 2; // default for mobile

    if (!isMobile) {
      if (width >= 1600) count = 4;
      else if (width >= 1200) count = 3;
      else if (width >= 768) count = 2;
    }

    // Calculate column width accounting for gaps
    const gapWidth = isMobile ? 16 : 24; // 4rem or 6rem in pixels
    const totalGapWidth = (count - 1) * gapWidth;
    const containerPadding = isMobile ? 32 : 48; // 2*16px or 2*24px padding
    const availableWidth = width - containerPadding - totalGapWidth;
    const colWidth = Math.floor(availableWidth / count);

    return { columnCount: count, columnWidth: colWidth };
  }, [width, isMobile]);

  // Create optimally distributed columns
  const columns = useMemo(() => {
    if (!items.length) return [];

    const cols: Artwork[][] = Array(columnCount).fill(null).map(() => []);
    const columnHeights = Array(columnCount).fill(0);

    items.forEach(item => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // Add the item to the shortest column
      cols[shortestColumnIndex].push(item);

      // Calculate estimated height based on artwork dimensions and column width
      const aspectRatio = item.dimensions ? item.dimensions.height / item.dimensions.width : 1.5;
      // Image height + padding + metadata area
      const estimatedHeight = (columnWidth * aspectRatio) + 80;
      columnHeights[shortestColumnIndex] += estimatedHeight + (isMobile ? 16 : 24); // Add gap height
    });

    return cols;
  }, [items, columnCount, columnWidth, isMobile]);

  // Set up intersection observer for infinite loading
  useEffect(() => {
    // Only set up observer if there's more content to load
    if (!loadingRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    }, { rootMargin: '200px', threshold: 0.1 });

    observerRef.current.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoading]);

  // Animation variants
  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex w-full gap-4 md:gap-6">
        {columns.map((column, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="flex flex-col gap-4 md:gap-6"
            style={{ width: columnWidth }}
          >
            {column.map((artwork, index) => (
              <motion.div
                key={artwork._id}
                onClick={() => onItemClick(artwork._id)}
                variants={itemAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="cursor-pointer w-full"
              >
                <ArtCard
                  data={artwork}
                  index={index}
                  width={columnWidth}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Loading indicator and trigger */}
      <div ref={loadingRef} className="w-full h-20 flex items-center justify-center mt-6">
        {isLoading && (
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('artworks.end_of_list', {
              count: items.length,
              total: totalCount || items.length
            })}
          </p>
        )}

        {items.length === 0 && !isLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('artworks.no_artworks_found')}
          </p>
        )}
      </div>
    </motion.div>
  );
};
