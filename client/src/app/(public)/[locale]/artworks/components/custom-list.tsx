'use client';

import { Artwork } from '@/types/marketplace';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ArtFeed from './art-feed';
import { useWindowSize } from '@react-hook/window-size';
import { useRouter } from 'next/navigation';

type CustomListProps = {
  items: Artwork[];
  onChangeArtwork: (id: string | null) => void;
  loadMore: () => void;
};

export const CustomList: React.FC<CustomListProps> = ({ items, onChangeArtwork, loadMore }) => {
  const router = useRouter();
  const [width, height] = useWindowSize();
  
  // Refs for DOM elements and scroll handling
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  
  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemHeight, setItemHeight] = useState(0);
  const [debugColors] = useState(['bg-red-200/5', 'bg-blue-200/5', 'bg-green-200/5', 'bg-yellow-200/5', 'bg-purple-200/5']);
  
  // Precise constants - HEADER_HEIGHT is critical
  const HEADER_HEIGHT = 160;
  const SNAP_THRESHOLD = 0.3; // When to snap (proportion of item height)
  
  // Calculate item height on window resize or mount
  useEffect(() => {
    const calculateHeight = () => {
      // CRITICAL: Exact height calculation
      const windowHeight = window.innerHeight;
      const calculatedHeight = windowHeight - HEADER_HEIGHT;
      setItemHeight(calculatedHeight);
      
      console.log(`Window height: ${windowHeight}px, Header: ${HEADER_HEIGHT}px, Item height: ${calculatedHeight}px`);
      
      // Apply height to container immediately
      if (containerRef.current) {
        containerRef.current.style.height = `${windowHeight - HEADER_HEIGHT}px`;
      }
    };
    
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);
  
  // Update URL and active item when scrolling
  const updateActiveItem = useCallback((index: number) => {
    if (index >= 0 && index < items.length && index !== activeIndex) {
      setActiveIndex(index);
      
      // Update URL without reload
      if (items[index]) {
        window.history.replaceState(
          {}, 
          '', 
          `?id=${items[index]._id}`
        );
        onChangeArtwork(items[index]._id);
      }
    }
  }, [items, activeIndex, onChangeArtwork]);
  
  // Snap scrolling function - completely rewritten for better reliability
  const snapToItem = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    if (!containerRef.current || itemHeight <= 0 || index < 0 || index >= items.length) return;
    
    isScrollingRef.current = true;
    
    const targetPos = Math.floor(index * itemHeight);
    
    // Use direct DOM scrolling for maximum reliability
    try {
      containerRef.current.scrollTo({
        top: targetPos,
        behavior
      });
      
      // Update active item
      updateActiveItem(index);
    } catch (e) {
      console.error("Scroll error:", e);
    }
    
    // Reset scrolling flag after animation completes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, behavior === 'smooth' ? 400 : 0);
  }, [itemHeight, items.length, updateActiveItem]);
  
  // Handle scroll events - completely rewritten
  useEffect(() => {
    if (!containerRef.current || itemHeight <= 0) return;
    
    const handleScroll = () => {
      if (!containerRef.current || isScrollingRef.current) return;
      
      const scrollPos = containerRef.current.scrollTop;
      const estimatedIndex = Math.round(scrollPos / itemHeight);
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce the scroll events
      scrollTimeoutRef.current = setTimeout(() => {
        // Calculate exact position for snapping
        const currentPos = containerRef.current?.scrollTop || 0;
        const rawIndex = currentPos / itemHeight;
        const fraction = rawIndex - Math.floor(rawIndex);
        
        let targetIndex = Math.floor(rawIndex);
        if (fraction > SNAP_THRESHOLD) targetIndex++;
        
        // Only snap if needed
        const targetPos = targetIndex * itemHeight;
        const diffPx = Math.abs(currentPos - targetPos);
        
        // If we're close enough to the target, just update active item
        if (diffPx < 10) {
          updateActiveItem(estimatedIndex);
          return;
        }
        
        // Otherwise snap to target
        if (targetIndex >= 0 && targetIndex < items.length) {
          snapToItem(targetIndex);
        }
      }, 50);
    };
    
    const scrollContainer = containerRef.current;
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [itemHeight, items.length, snapToItem, updateActiveItem]);
  
  // Implement infinite scrolling
  useEffect(() => {
    if (!loadingRef.current || items.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore && !isScrollingRef.current) {
        setLoadingMore(true);
        loadMore();
        setTimeout(() => setLoadingMore(false), 1000);
      }
    }, { rootMargin: '200px 0px', threshold: 0.1 });
    
    observer.observe(loadingRef.current);
    return () => observer.disconnect();
  }, [loadMore, loadingMore, items]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingRef.current) return;
      
      switch (e.key) {
        case 'ArrowDown':
        case 'Space':
          e.preventDefault();
          if (activeIndex < items.length - 1) snapToItem(activeIndex + 1);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          if (activeIndex > 0) snapToItem(activeIndex - 1);
          break;
          
        case 'PageDown':
          e.preventDefault();
          snapToItem(Math.min(activeIndex + 3, items.length - 1));
          break;
          
        case 'PageUp':
          e.preventDefault();
          snapToItem(Math.max(activeIndex - 3, 0));
          break;
          
        case 'Home':
          e.preventDefault();
          snapToItem(0);
          break;
          
        case 'End':
          e.preventDefault();
          snapToItem(items.length - 1);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items.length, snapToItem]);
  
  // Initial setup - scroll to top on first render
  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    containerRef.current.scrollTop = 0;
    updateActiveItem(0);
  }, [updateActiveItem, items]);

  return (
    <div
      className="list-container overflow-y-auto will-change-scroll"
      ref={containerRef}
      style={{
        height: `${height - HEADER_HEIGHT}px`,
        maxHeight: `${height - HEADER_HEIGHT}px`,
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* Debug information overlay */}
      <div className="fixed top-4 right-4 z-50 bg-black/70 text-white p-2 text-xs rounded">
        <div>Height: {itemHeight}px</div>
        <div>Viewport: {height}px</div>
        <div>Active: {activeIndex}</div>
      </div>
      
      {/* Artwork items */}
      {items.map((artwork, index) => (
        <div
          key={artwork._id}
          className={`artwork-item ${debugColors[index % debugColors.length]}`}
          data-index={index}
          style={{
            height: `${itemHeight}px`,
            maxHeight: `${itemHeight}px`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <ArtFeed
            data={artwork}
            index={index}
            isActive={activeIndex === index}
          />
          
          {/* Navigation indicators */}
          {index > 0 && (
            <button
              className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-black/30 rounded-full p-2 text-white hover:bg-black/50 transition"
              onClick={() => snapToItem(index - 1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          
          {index < items.length - 1 && (
            <button
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-black/30 rounded-full p-2 text-white hover:bg-black/50 transition"
              onClick={() => snapToItem(index + 1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      ))}
      
      {/* Position indicator dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        {items.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 my-2 rounded-full cursor-pointer transition-all ${
              i === activeIndex ? 'bg-white scale-150' : 'bg-white/30 hover:bg-white/60'
            }`}
            onClick={() => snapToItem(i)}
          />
        ))}
      </div>
      
      {/* Loading indicator */}
      <div
        ref={loadingRef}
        className="h-4 w-full absolute bottom-0 left-0 flex justify-center items-center"
      >
        {loadingMore && (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .list-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-snap-type: y proximity;
        }
        
        .list-container::-webkit-scrollbar {
          display: none;
        }
        
        .artwork-item {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
      `}</style>
    </div>
  );
};
