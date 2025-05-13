// --- Add 'use client' directive ---
'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicExhibition } from '@/types/exhibition'; // Assuming this type exists

// --- Import ShadCN Carousel Components ---
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { ExhibitionCard } from './exhibition-card';

interface ExhibitionSectionProps {
    title: string;
    exhibitions: PublicExhibition[];
}

export function ExhibitionSection({ title, exhibitions }: ExhibitionSectionProps) {
    const t = useTranslations('home.exhibition');

    // Keep the early return for empty data - good practice
    if (!exhibitions?.length) {
        return null;
    }

    return (
        <section className="mb-24">
            {/* Keep overall section structure and title */}
            <div className="mx-auto px-4 md:px-8"> {/* Use common max-width/padding */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {t(title)}
                    </h2>
                    <Button variant="ghost" asChild>
                        <Link href="/discover" className="text-blue-600 hover:text-blue-700 font-medium">
                            {t('view_all')}
                        </Link>
                    </Button>
                </div>
                {/* --- Use ShadCN Carousel --- */}
                <Carousel
                    opts={{
                        align: "start", // Align items to the start
                        loop: false,      // Disable looping (adjust if needed)
                    }}
                    className="w-full relative" // Carousel container
                >
                    <CarouselContent className="-ml-6"> {/* Adjust negative margin to match item padding */}
                        {exhibitions.map((exhibition) => (
                            <CarouselItem
                                key={exhibition._id}
                                className="pl-6 basis-auto md:basis-1/3 lg:basis-1/4" // Add padding for gap, control items per view optionally
                            >
                                {/* Render the existing card component */}
                                <ExhibitionCard exhibition={exhibition} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Add built-in navigation buttons */}
                    {/* Position them slightly outside the content area */}
                    <CarouselPrevious className="absolute left-[-15px] md:left-[-20px] top-1/2 -translate-y-1/2 z-10 disabled:opacity-30" />
                    <CarouselNext className="absolute right-[-15px] md:right-[-20px] top-1/2 -translate-y-1/2 z-10 disabled:opacity-30" />
                </Carousel>
            </div>
        </section>
    );
}

// --- ExhibitionCard Component (Remains largely the same) ---
