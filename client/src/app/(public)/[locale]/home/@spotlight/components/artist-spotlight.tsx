'use client';
import { createExcerpt } from '@/app/utils'; // Assuming this utility exists and works
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
// --- Artist Interface (Assuming definition is correct) ---
export interface Artist {
    _id: string;
    name: string;
    image: string;
    artworksCount: number;
    exhibitionsCount: number;
    bio?: string; // Make bio optional if it can be missing
    featuredWorks: {
        _id: string;
        title: string;
        createdAt?: string; // Make createdAt optional if it can be missing
        url: string;
    }[];
}

interface ArtistSpotlightProps {
    // Allow artist to be potentially null/undefined if fetched data might be empty
    artist: Artist | null | undefined;
}

// --- Define Placeholder Image Paths ---
const PLACEHOLDER_ARTIST_IMAGE = '/images/placeholder-artist.jpg'; // Create this image
const PLACEHOLDER_ARTWORK_IMAGE = '/images/placeholder-artwork.jpg'; // Create this image

// --- Main Component ---
export function ArtistSpotlight({ artist }: ArtistSpotlightProps) {
    const t = useTranslations('home.spotlight');

    // --- Graceful handling if artist data is missing ---
    if (!artist) {
        // Optionally render a specific message or skeleton loader
        return (
            <div className="max-w-7xl mx-auto px-4 text-center py-12 text-gray-500">
                {t('artist_not_found')} {/* Add this key to your translations */}
            </div>
        );
    }

    // Safely get artist details with fallbacks
    const artistName = artist.name || t('unknown_artist'); // Add 'unknown_artist' key
    const artistImage = artist.image || PLACEHOLDER_ARTIST_IMAGE;
    const artistBioExcerpt = artist.bio ? createExcerpt(artist.bio, 150) : ''; // Limit excerpt length

    // Ensure featuredWorks is an array, even if null/undefined from data
    const featuredWorks = artist.featuredWorks || [];

    return (
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center lg:text-left">
                {t('title')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                {/* === Artist Profile Section === */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    {/* Artist Image */}
                    <div className="relative aspect-square lg:aspect-[4/3] w-full max-w-md lg:max-w-none rounded-xl overflow-hidden shadow-lg mb-6">
                        <Image
                            src={artistImage}
                            alt={artistName} // Use safe artist name
                            fill
                            className="object-cover"
                            // Adjust sizes based on your layout. This assumes full width up to lg, then half width.
                            sizes="(max-width: 1023px) 90vw, 45vw"
                            priority // Prioritize loading this main image
                        />
                    </div>

                    {/* Artist Info */}
                    <div className="w-full">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-2">{artistName}</h3>

                        {/* Stats with Icons */}
                        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                            <span className="inline-flex items-center gap-1.5">
                                <span>{artist.artworksCount ?? 0} {t('artworks')}</span> {/* Use ?? 0 fallback, add 'artworks' key */}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span>{artist.exhibitionsCount ?? 0} {t('exhibitions')}</span> {/* Use ?? 0 fallback, add 'exhibitions' key */}
                            </span>
                        </div>

                        {/* Bio Excerpt */}
                        {artistBioExcerpt && ( // Only render if excerpt exists
                            <p className="text-gray-700 leading-relaxed mb-6">
                                {artistBioExcerpt}
                            </p>
                        )}

                        {/* Profile Link Button */}
                        <Button variant="outline" size="lg" asChild>
                            <Link href={`/profile/${artist._id}`}> {/* Use a clearer route like /artists/ */}
                                {t('view_profile')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* === Featured Works Section === */}
                {/* Render only if there are works to display */}
                {featuredWorks.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        {featuredWorks.slice(0, 4).map((work) => ( // Limit to e.g., 4 works for balance
                            <FeaturedWorkCard key={work._id} work={work} />
                        ))}
                    </div>
                )}
                {/* Optional: Placeholder if no featured works */}
                {featuredWorks.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-400 italic col-span-1 lg:col-span-1">
                        {t('no_featured_works')} {/* Add translation key */}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Separate Component for Featured Work Card ---
interface FeaturedWorkCardProps {
    work: Artist['featuredWorks'][0]; // Type accurately
}

function FeaturedWorkCard({ work }: FeaturedWorkCardProps) {
    const t = useTranslations('general'); // Assuming general keys like 'untitled'
    const workImageUrl = work.url || PLACEHOLDER_ARTWORK_IMAGE;
    const workTitle = work.title || t('untitled'); // Add 'untitled' key
    const workYear = work.createdAt ? new Date(work.createdAt).getFullYear() : null;

    return (
        // Make the entire card a link
        <Link
            href={`/artworks?id=${work._id}`} // Đường dẫn đến trang artwork với ID trong query parameter
            className="group block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
            <div className="relative aspect-square">
                <Image
                    src={workImageUrl}
                    alt={workTitle}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    // Sizes for a 2-column grid within half the page width
                    sizes="(max-width: 640px) 45vw, (max-width: 1023px) 45vw, 22vw"
                />
                {/* Overlay for text on hover */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white w-full">
                        <h4 className="font-medium text-sm line-clamp-2 mb-0.5">
                            {workTitle}
                        </h4>
                        {workYear && ( // Only display year if available
                            <p className="text-xs text-gray-300">{workYear}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}