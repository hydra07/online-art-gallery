import { getLocalizedContent } from "@/lib/utils";
import { PublicExhibition } from "@/types/exhibition";
import { vietnamCurrency } from "@/utils/converters";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface ExhibitionCardProps {
    exhibition: PublicExhibition;
}

export function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
    const locale = useLocale();

    // --- Localization Logic - Good Practice ---
    const getBestContent = () => {
        const localized = getLocalizedContent(exhibition, locale);
        if (localized) return localized;

        const defaultContent = exhibition.contents.find(content =>
            exhibition.languageOptions.find(lang => lang.code === content.languageCode && lang.isDefault)
        );
        if (defaultContent) return defaultContent;

        // Fallback to the first available content if no specific match
        return exhibition.contents[0] || null;
    };

    const content = getBestContent();

    // Handle case where no content is available at all
    if (!content) {
        console.warn(`No content found for exhibition ${exhibition._id}`);
        return null; // Or return a placeholder card
    }

    // --- Defensive checks for potentially missing data ---
    const authorName = exhibition.author?.name;
    const startDate = exhibition.startDate ? new Date(exhibition.startDate) : null;
    const endDate = exhibition.endDate ? new Date(exhibition.endDate) : null;
    const requiresPayment = exhibition.ticket?.requiresPayment;
    const price = exhibition.ticket?.price; // Price is already optional based on requiresPayment check

    return (
        // Link remains the container
        <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`/exhibitions/${exhibition.linkName}`}
            className="block h-full" // Ensure link fills the CarouselItem height if needed
        >
            {/* Card Structure - kept min-w implicit via basis on CarouselItem */}
            <div className="flex flex-col bg-white rounded-lg overflow-hidden h-full
                    shadow hover:shadow-lg transition-shadow duration-300"> {/* Use lg corners, shadow-lg for more pop */}
                <div className="relative aspect-[3/2] w-full"> {/* Ensure image container takes full width */}
                    <Image
                        // Use a default placeholder if welcomeImage is missing
                        src={exhibition.welcomeImage || '/images/placeholder-exhibition.jpg'}
                        alt={content.name || 'Exhibition Image'} // Provide fallback alt text
                        fill
                        className="object-cover"
                        // Consider more specific sizes based on CarouselItem basis values
                        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 30vw, 23vw"
                        priority={false} // Usually false for items in a carousel unless it's the very first section
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow gap-1.5"> {/* Added flex-grow, adjusted padding */}
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2"> {/* Adjusted text size/line-clamp */}
                        {content.name || 'Untitled Exhibition'} {/* Fallback title */}
                    </h3>
                    {authorName && ( // Conditionally render author only if available
                        <p className="text-xs text-gray-600">
                            By {authorName}
                        </p>
                    )}
                    {content.description && ( // Conditionally render description
                        <p className="text-sm text-gray-500 line-clamp-3 flex-grow"> {/* Adjusted size/clamp, added flex-grow */}
                            {content.description}
                        </p>
                    )}
                    {/* Footer section for date and price */}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100"> {/* Added separator */}
                        {(startDate || endDate) && ( // Only show dates if at least one exists
                            <p className="text-xs text-gray-500">
                                {startDate ? startDate.toLocaleDateString(locale) : '?'}
                                {endDate ? ` - ${endDate.toLocaleDateString(locale)}` : ''}
                            </p>
                        )}
                        {/* Check price is a valid number */}
                        {requiresPayment && typeof price === 'number' && price >= 0 && (
                            <p className="text-sm font-medium text-blue-600"> {/* Use theme color, adjusted size */}
                                {vietnamCurrency(price)}
                            </p>
                        )}
                        {!requiresPayment && ( // Indicate free if not paid
                            <p className="text-sm font-medium text-green-600">Free</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}