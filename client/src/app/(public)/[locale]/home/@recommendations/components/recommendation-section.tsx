// --- Ensure this file is a Client Component ---
'use client'; // Required for hooks

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Artwork } from '@/types/marketplace';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Link from 'next/link';
import { vietnamCurrency } from '@/utils/converters'; // Assuming this handles formatting

// --- Import useTranslations ---
import { useTranslations, TranslationValues } from 'next-intl';

// --- Define Translator Type ---
type Translator = (key: string, values?: TranslationValues) => string;

interface RecommendationSectionProps {
    recommendedArtworks: Artwork[];
    followingArtworks: Artwork[];
    isAuthenticated: boolean;
}

export function RecommendationSection({
    recommendedArtworks,
    followingArtworks,
    isAuthenticated
}: RecommendationSectionProps) {
    // --- Use the translation hook ---
    const t = useTranslations('home.recommendations');

    return (
        <div className="w-full mx-auto px-4">
            <Tabs defaultValue="forYou" className="space-y-8">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-transparent border">
                        <TabsTrigger value="forYou" className="data-[state=active]:bg-white">
                            {t('for_you')} {/* Use translation key */}
                        </TabsTrigger>
                        {isAuthenticated && (
                            <TabsTrigger value="following" className="data-[state=active]:bg-white">
                                {t('following')} {/* Use translation key */}
                            </TabsTrigger>
                        )}
                    </TabsList>
                    {/* Optional: Make the 'View All' button a Link */}
                    <Button variant="ghost" asChild>
                        <Link
                            href="/artworks"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {t('view_all')}
                        </Link>
                    </Button>
                </div>

                <TabsContent value="forYou" className="mt-0">
                    {/* Pass translator and empty message key */}
                    <ArtworkGrid
                        artworks={recommendedArtworks}
                        t={t}
                        emptyMessageKey="no_artworks_default"
                    />
                </TabsContent>

                {isAuthenticated && (
                    <TabsContent value="following" className="mt-0">
                        {/* Pass translator and specific empty message key */}
                        <ArtworkGrid
                            artworks={followingArtworks}
                            t={t}
                            emptyMessageKey="no_artworks_following"
                        />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}

// --- Update ArtworkGridProps ---
interface ArtworkGridProps {
    artworks: Artwork[];
    emptyMessageKey: string; // Pass the key instead of the string
    t: Translator; // Pass the translator function
}

// --- Update ArtworkGrid to use passed props ---
function ArtworkGrid({ artworks, t, emptyMessageKey }: ArtworkGridProps) {
    // Handle Empty State using the translated key
    if (!artworks || artworks.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-center">
                <p className="text-gray-500">{t(emptyMessageKey)}</p> {/* Translate the key */}
            </div>
        );
    }

    // CalculateSize function remains the same
    const calculateSize = (originalWidth: number, originalHeight: number) => {
        const MAX_WIDTH = 320;
        const MIN_WIDTH = 200;
        const MAX_HEIGHT = 240;
        const MIN_HEIGHT = 160;

        const w = originalWidth > 0 ? originalWidth : MAX_WIDTH;
        const h = originalHeight > 0 ? originalHeight : MAX_HEIGHT * (MAX_WIDTH / w);

        const aspectRatio = w / h;

        let width = Math.min(w, MAX_WIDTH);
        if (width < MIN_WIDTH) width = MIN_WIDTH;

        let height = Math.round(width / aspectRatio);

        if (height > MAX_HEIGHT) {
            height = MAX_HEIGHT;
            width = Math.round(height * aspectRatio);
        } else if (height < MIN_HEIGHT) {
            height = MIN_HEIGHT;
            width = Math.round(height * aspectRatio);
        }

        width = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));
        height = Math.round(width / aspectRatio);
        height = Math.max(MIN_HEIGHT, Math.min(height, MAX_HEIGHT));

        return { width, height };
    };

    return (
        <Carousel
            opts={{
                align: "start",
                loop: false,
            }}
            className="w-full relative"
        >
            <CarouselContent className="-ml-6">
                {artworks.map((artwork, index) => {
                    const originalWidth = artwork.dimensions?.width || 280;
                    const originalHeight = artwork.dimensions?.height || 180;
                    const size = calculateSize(originalWidth, originalHeight);
                    const artworkTitle = artwork.title || t('untitled_artwork'); // Use translated fallback

                    return (
                        <CarouselItem
                            key={artwork._id}
                            className="pl-6 basis-auto"
                            style={{ flexGrow: 0, flexShrink: 0 }}
                        >
                            <Link
                                href={`/artworks?id=${artwork._id}`} // Updated link structure example
                                className="block group"
                            // Remove target="_blank" unless explicitly needed, often bad UX
                            // rel="noopener noreferrer" // Only needed with target="_blank"
                            >
                                <div
                                    className="flex flex-col"
                                    style={{ width: `${size.width}px`, height: 'fit-content' } as React.CSSProperties}
                                >
                                    <div
                                        className="relative rounded-lg overflow-hidden bg-gray-200"
                                        style={{ height: `${size.height}px` }}
                                    >
                                        {artwork.url ? (
                                            <div className="relative w-full h-full"> {/* Ensure container fills */}
                                                <Image
                                                    src={artwork.url}
                                                    alt={artworkTitle} // Use title with fallback
                                                    fill // Use fill instead of width/height for responsiveness within container
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none select-none"
                                                    sizes={`${size.width}px`} // Keep sizes for optimization hint
                                                    priority={index < 3}
                                                    onContextMenu={(e) => e.preventDefault()}
                                                    draggable={false}
                                                    quality={75}
                                                />
                                                {/* Optional: Overlay to prevent context menu/drag */}
                                                {/* <div
                                                    className="absolute inset-0"
                                                    onContextMenu={(e) => e.preventDefault()}
                                                    style={{ userSelect: 'none' }}
                                                /> */}
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                {t('no_image_placeholder')} {/* Translate */}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 min-h-[4.5rem] flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {artworkTitle} {/* Use title with fallback */}
                                            </h3>
                                            {/* Artist name is dynamic data, usually not translated via keys */}
                                            {artwork.artistId?.name && (
                                                <p className="text-sm text-gray-500 mt-0.5">{artwork.artistId.name}</p>
                                            )}
                                        </div>
                                        {/* Price Formatting: Ensure vietnamCurrency handles locale or use next-intl's formatter */}
                                        { artwork.status === 'selling' && (
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {vietnamCurrency(artwork.price)}
                                                {/* Example using next-intl formatter (if needed):
                                                const format = useFormatter();
                                                format.number(artwork.price, { style: 'currency', currency: 'VND' })
                                                */}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
    );
}