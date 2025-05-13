'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useServerAction } from 'zsa-react';

import { updateExhibitionAction } from '../../../actions';

// Import components
import { ExhibitionInfoHeader } from '../../components/exhibition-info-header';
// import { ExhibitionFloorPlan } from './exhibition-floor-plan';
import { ArtworkPositionsGrid } from './artwork-positions-grid';
import { ArtworkSelectionModal } from './artwork-selection-modal';
import { ArtworkPosition, Exhibition } from '@/types/exhibition';
import { FloorPlanRenderer } from './floor-plan-renderer';

// Types
interface Artwork {
    _id: string;
    title: string;
    description: string;
    url: string;
    dimensions?: {
        width: number;
        height: number;
    };
}

export function ArtworksContent({
    exhibition,
    positions }: {
        exhibition: Exhibition;
        positions: number[];
    }) {
    const { toast } = useToast();
    const t = useTranslations("exhibitions");
    const tCommon = useTranslations("common");

    const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
    const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
    const [existingArtworkPosition, setExistingArtworkPosition] = useState<ArtworkPosition | null>(null);
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

    // Server action hook
    const { execute: executePlacement, isPending: isPlacingArtwork } = useServerAction(updateExhibitionAction, {
        onSuccess: () => {
            toast({
                title: tCommon("success"),
                description: existingArtworkPosition
                    ? (selectedArtwork === null
                        ? t("artwork_removed_success")
                        : t("artwork_replaced_success"))
                    : t("artwork_placed_success"),
                variant: "success"
            });
            setIsArtworkModalOpen(false);
            setSelectedPosition(null);
            setExistingArtworkPosition(null);
        },
        onError: (error) => {
            toast({
                title: tCommon("error"),
                description: error.err.message || t("artwork_operation_failed"),
                variant: "destructive"
            });
            console.error('Error with artwork operation:', error);
        },
    });

    // Handler to open the modal
    const handlePositionClick = useCallback((position: number) => {
        // Check if position already has artwork
        const existingPosition = exhibition?.artworkPositions?.find(
            p => p.positionIndex === position
        ) || null;

        setExistingArtworkPosition(existingPosition);
        setSelectedPosition(position);
        setIsArtworkModalOpen(true);
    }, [exhibition?.artworkPositions]);

    // Handler to execute the server action
    const handleConfirmArtworkSelection = useCallback((artwork: Artwork | null, position: number) => {
        if (!exhibition) return;
        setSelectedArtwork(artwork);

        // Filter out any existing entry for the same position
        const updatedPositions = (exhibition.artworkPositions || [])
            .filter(p => p.positionIndex !== position)
            .map(p => ({
                artwork: p.artwork._id,
                positionIndex: p.positionIndex
            }));

        // Only add the new position if we're not removing
        if (artwork) {
            updatedPositions.push({
                artwork: artwork._id,
                positionIndex: position
            });
        }

        executePlacement({
            id: exhibition._id,
            data: {
                welcomeImage: exhibition.welcomeImage,
                artworkPositions: updatedPositions,
            }
        });
    }, [exhibition, executePlacement]);

    // Prepare translations for the modal
    const modalTranslations = {
        select_artwork_for_position: t("select_artwork_for_position"),
        replace_artwork_at_position: t("replace_artwork_at_position"),
        remove_artwork_confirmation: t("remove_artwork_confirmation"),
        remove_artwork_description: t("remove_artwork_description"),
        no_artworks_found: t("no_artworks_found"),
        create_artwork: t("create_artwork"),
        cancel: t("cancel"),
        place_artwork: t("place_artwork"),
        replace_artwork: t("replace_artwork"),
        remove_artwork: t("remove_artwork"),
        placing: t("placing"),

    };

    return (
        <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
            {/* Header Component */}
            <ExhibitionInfoHeader
                title={t("artworks")}
                description={t("artworks_description")}
                faqLinkText={t("read_faq")}
            />

            {/* Container */}
            <div className='bg-white rounded-lg shadow-md'>
                {/* Floor Plan Component */}
                {/* <ExhibitionFloorPlan
                    imageUrl={exhibition.gallery?.planImage || 'https://res.cloudinary.com/djvlldzih/image/upload/v1739374668/gallery/modern_c1_plan.png'}
                    altText={t("floor_plan_alt")}
                    title={t("floor_plan")}
                    // description={t("floor_plan_description")}
                /> */}
                <div className="w-full overflow-auto flex justify-center items-center p-4">
                  <FloorPlanRenderer
                    dimensions={exhibition.gallery.dimensions}
                    wallThickness={exhibition.gallery.wallThickness}
                    customColliders={exhibition.gallery.customColliders}
                    artworkPlacements={exhibition.gallery.artworkPlacements}
                    scale={8}
                    className="mx-auto"
                  />
                </div>

                {/* Artwork Positions Grid Component */}
                <div className='p-6'>
                    <ArtworkPositionsGrid
                        positions={positions}
                        artworkPositions={exhibition.artworkPositions || []}
                        onPositionClick={handlePositionClick}
                        title={t("artwork_positions")}
                        artworksLabel={t("artworks")}
                    />
                </div>
            </div>

            {/* Artwork Selection Modal Component */}
            <ArtworkSelectionModal
                isOpen={isArtworkModalOpen}
                onOpenChange={setIsArtworkModalOpen}
                position={selectedPosition}
                onConfirm={handleConfirmArtworkSelection}
                isPlacingArtwork={isPlacingArtwork}
                existingArtworkPosition={existingArtworkPosition}
                t={modalTranslations}
            />
        </div>
    );
}