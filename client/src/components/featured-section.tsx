'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay";
import { type CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedExhibitions } from "@/service/home";
import { formatDateByLocale } from "@/utils/converters";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PublicExhibition } from "@/types/exhibition";
import { getLocalizedContent } from "@/lib/utils";

function FeaturedSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const locale = useLocale();
  const t = useTranslations('home.exhibition');

  // Fetch featured exhibitions data
  const { data, isLoading } = useQuery({
    queryKey: ['featuredExhibitions'],
    queryFn: async () => {
      const response = await getFeaturedExhibitions(3);
      // Return the most recent 3 featured exhibitions sorted by creation date
      return response.data?.exhibitions
    }
  });

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Helper function to get exhibition display data
  const getExhibitionData = (exhibition: PublicExhibition) => {
    const content = getLocalizedContent(exhibition, locale);
    return {
      title: content?.name || t('untitled_exhibition'),
      description: content?.description || "",
      artist: exhibition.author.name,
      image: exhibition.welcomeImage || "/images/placeholder-gallery.jpg",
      date: `${formatDateByLocale(exhibition.startDate, locale)} - ${formatDateByLocale(exhibition.endDate, locale)}`
    };
  };

  if (isLoading) {
    return (
      <div className="relative bg-black h-[80vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  // Fall back to empty array if no data
  const exhibitions = data || [];
  
  // If no featured exhibitions found
  if (exhibitions.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-black">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {exhibitions.map((exhibition, index) => {
            const exhibitionData = getExhibitionData(exhibition);
            
            return (
              <CarouselItem key={exhibition._id}>
                <div className="relative h-[80vh]">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={exhibitionData.image}
                      alt={exhibitionData.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                      <div className="max-w-2xl space-y-6">
                        <div className="space-y-2">
                          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                            {exhibition.isFeatured ? t('featured') : t('exhibition')}
                          </Badge>
                          <p className="text-sm font-medium text-white/70">
                            {t('featured_artist')}: {exhibitionData.artist}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h2 className="text-4xl md:text-6xl font-bold text-white">
                            {exhibitionData.title}
                          </h2>
                          <p className="text-xl text-white/90 line-clamp-2">
                            {exhibitionData.description}
                          </p>
                          <p className="text-sm text-white/70">
                            {exhibitionData.date}
                          </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            size="lg"
                            className="bg-white text-black hover:bg-white/90"
                            asChild
                          >
                            <Link href={`/exhibitions/${exhibition.linkName}`}>
                              {t('view_exhibition')}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            {/* Progress Indicators */}
            <div className="flex gap-2">
              {exhibitions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-16 h-1 rounded-full transition-all duration-300 ${
                    index === current ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Carousel>
    </section>
  );
}

export default FeaturedSection;