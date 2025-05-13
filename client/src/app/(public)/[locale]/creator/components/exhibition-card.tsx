import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import Link from 'next/link';
import { Exhibition } from '@/types/exhibition';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import DeleteExhibitionButton from './delete-exhibition-button';
// import { revalidatePath } from 'next/cache';

interface ExhibitionCardProps {
  exhibition: Exhibition;
  locale: string;
}

export default async function ExhibitionCard({ exhibition, locale }: ExhibitionCardProps) {
  const t = await getTranslations({ locale, namespace: 'exhibitions' });
  const getLocalizedContent = (exhibition: Exhibition) => {
    const localContent = exhibition.contents.find(
      content => content.languageCode === locale
    );
    if (!localContent) {
      const defaultLang = exhibition.languageOptions.find(lang => lang.isDefault);
      return exhibition.contents.find(
        content => content.languageCode === defaultLang?.code
      );
    }

    return localContent;
  };

  const content = getLocalizedContent(exhibition);
  const imageSrc = exhibition.welcomeImage || exhibition.gallery?.previewImage;
  const altText = content?.name || t('untitled_exhibition');

  return (
    <div className="relative group">
      <Link href={`/creator/${exhibition._id}/artworks`} className="block">
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md border-border/60 group-hover:border-border">
          <div className="relative">
            {imageSrc ? (
              <div className="relative aspect-video w-full">
                <Image
                  src={imageSrc}
                  alt={altText}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-white transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">{t('no_image')}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-white/90 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
                </div>
              </div>
            )}
            
            {/* Status badge moved to image for better visibility */}
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                {t(`status.${exhibition.status}`)}
              </Badge>
            </div>
          </div>
          <div className="p-4 flex-grow">
            <div className="mb-2">
              <h2 className="text-xl font-semibold line-clamp-1">
                {content?.name || t('untitled_exhibition')}
              </h2>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t('artwork_count', { count: exhibition.artworkPositions?.length ?? 0 })}</p>
              {exhibition.startDate && (
                <p>
                  {t('start_date')}:{' '}
                  {new Date(exhibition.startDate).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </Card>
      </Link>
      
      {/* Delete button only shows on hover */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DeleteExhibitionButton 
          exhibitionId={exhibition._id} 
          variant="icon"
          // onSuccess={() => {
          //   revalidatePath('/creator'); 
          // }}
        />
      </div>
    </div>
  );
}