'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Grid, Check, Replace } from 'lucide-react';

// Type for Artwork simplified for this component's needs
interface SimpleArtwork {
  _id: string;
  title: string;
  lowResUrl: string;
}

// Type for artwork position with embedded artwork
interface ArtworkPosition {
  artwork: SimpleArtwork;
  positionIndex: number;
}

interface ArtworkPositionsGridProps {
  positions: number[];
  artworkPositions: ArtworkPosition[];
  onPositionClick: (position: number) => void;
  title: string;
  artworksLabel: string;
}

export function ArtworkPositionsGrid({
  positions,
  artworkPositions,
  onPositionClick,
  title,
  artworksLabel,
}: ArtworkPositionsGridProps) {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  
  // Calculate occupied positions from artworkPositions
  const occupiedPositions = artworkPositions.map(pos => pos.positionIndex);
  
  return (
    <div className='mt-8'>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsSectionOpen(!isSectionOpen)}
        className='w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
        aria-expanded={isSectionOpen} // Accessibility
        aria-controls="artwork-positions-content" // Accessibility
      >
        <div className='flex items-center gap-2'>
          <span className='font-semibold'>{title}</span>
          <span className='text-sm text-gray-500'>
            {occupiedPositions.length}/{positions.length} {artworksLabel}
          </span>
        </div>
        {isSectionOpen ? (
          <ChevronUp className='w-5 h-5 transition-transform duration-300' />
        ) : (
          <ChevronDown className='w-5 h-5 transition-transform duration-300' />
        )}
      </button>

      {/* Grid Content */}
      <div
        id="artwork-positions-content" // Accessibility
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isSectionOpen ? 'opacity-100 max-h-[5000px] mt-4' : 'opacity-0 max-h-0'
        }`}
      >
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {positions.map((position) => {
            const artworkPosition = artworkPositions.find(pos => pos.positionIndex === position);
            const isOccupied = !!artworkPosition;
            
            // Get artwork data if position is occupied
            const artwork = isOccupied && artworkPosition ? artworkPosition.artwork : null;
            
            // Check if this position is currently being hovered
            const isHovered = hoveredPosition === position;
            
            // Hiển thị position+1 trong UI, nhưng sử dụng position thật trong logic
            const displayPosition = position + 1;
            
            return (
              <div
                key={position}
                onClick={() => onPositionClick(position)}
                onMouseEnter={() => setHoveredPosition(position)}
                onMouseLeave={() => setHoveredPosition(null)}
                className={`aspect-square border-2 rounded-lg flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 cursor-pointer ${
                  isOccupied
                    ? 'border-solid border-green-500 hover:border-blue-500' 
                    : 'border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
                role="button" // Always a button
                tabIndex={0} // Always focusable
                aria-label={isOccupied 
                  ? `Replace artwork at position ${displayPosition}, currently ${artwork?.title}` 
                  : `Add artwork to position ${displayPosition}`}
              >
                {isOccupied && artwork ? (
                  <>
                    <div className="absolute inset-0" aria-hidden="true">
                      <Image
                        src={artwork.lowResUrl}
                        alt={artwork.title}
                        fill
                        quality={50}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.6vw"
                        className={`object-cover transition-opacity duration-300 ${isHovered ? 'opacity-60' : 'opacity-100'}`}
                      />
                      
                      {/* Status indicator in top-left corner */}
                      <div className="absolute top-1 left-1 bg-green-500 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      
                      {/* Hover overlay for replace indication */}
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-blue-600 text-white rounded-full p-2">
                            <Replace className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className='sr-only'>{isHovered 
                      ? `Replace artwork at position ${displayPosition}, currently ${artwork.title}` 
                      : `Position ${displayPosition} occupied by ${artwork.title}`}</span>
                  </>
                ) : (
                  <Grid className='w-6 h-6 text-gray-400' aria-hidden="true"/>
                )}
                <span className='absolute bottom-2 left-2 text-sm font-semibold text-gray-700 bg-white/80 px-1 rounded'>
                  {displayPosition}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}