import { Exhibition } from '@/types/exhibition';
import { useMemo } from 'react';

export function useProcessedArtworks(exhibition: Exhibition) {
  return useMemo(() => {
    if (!exhibition.artworkPositions || !exhibition.gallery.artworkPlacements) {
      return [];
    }
    
    return exhibition.artworkPositions
      .filter(artworkPos => {
        const index = artworkPos.positionIndex;
        const placements = exhibition.gallery.artworkPlacements || [];
        return index >= 0 && index < placements.length;
      })
      .map(artworkPos => {
        const placement = exhibition.gallery.artworkPlacements[artworkPos.positionIndex];
        const artworkLikes = exhibition.result?.likes?.filter(
          like => like.artworkId === artworkPos.artwork._id
        ) || [];

        return {
          artwork: artworkPos.artwork,
          exhibitionId: exhibition._id,
          placement: {
            position: placement.position,
            rotation: placement.rotation,
          },
          likes: {
            userIds: artworkLikes.map(like => like.userId),
            count: artworkLikes.length
          }
        };
      });
  }, [exhibition._id, exhibition.artworkPositions, exhibition.gallery.artworkPlacements, exhibition.result?.likes]);
} 

export function useGalleryConfig(exhibition: Exhibition) {
  const processedArtworks = useProcessedArtworks(exhibition);
  
  return useMemo(() => {
    const languageContent = exhibition.contents?.find(c => c.languageCode === 'en') 
      || exhibition.contents?.[0] 
      || { name: 'Default Gallery Name' };
  
    return {
      id: exhibition._id,
      name: languageContent.name,
      galleryModel: {
        _id: exhibition.gallery._id,
        name: exhibition.gallery.name,
        description: exhibition.gallery.description,
        dimensions: exhibition.gallery.dimensions,
        wallThickness: exhibition.gallery.wallThickness,
        wallHeight: exhibition.gallery.wallHeight || 3,
        modelPath: exhibition.gallery.modelPath,
        modelPosition: exhibition.gallery.modelPosition,
        modelRotation: exhibition.gallery.modelRotation,
        modelScale: exhibition.gallery.modelScale,
        customColliders: exhibition.gallery.customColliders,
        artworkPlacements: exhibition.gallery.artworkPlacements?.map(placement => ({
          position: placement.position,
          rotation: placement.rotation,
        })) || [],
      },
      artworks: processedArtworks,
    };
  }, [exhibition, processedArtworks]);
}