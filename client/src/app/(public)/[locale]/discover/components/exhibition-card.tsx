import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Eye, Heart, Sparkles } from 'lucide-react'; // Import Ticket icon
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PublicExhibition } from '@/types/exhibition';

interface ExhibitionCardProps {
  exhibition: PublicExhibition;
}

export function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  const t = useTranslations('exhibitions');

  // Get localized content (default to first content if not found)
  const content = exhibition.contents.find(c => c.languageCode === 'en') || exhibition.contents[0];

  const isFree = exhibition.ticket?.requiresPayment === false;

  return (
    <Link href={`/exhibitions/${exhibition.linkName}`}>
      <Card className="overflow-hidden h-full flex flex-col group cursor-pointer transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3]">
          <Image
            src={exhibition.welcomeImage || '/images/placeholder-gallery.jpg'}
            alt={content?.name || t('untitled_exhibition')}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1"> {/* Container for top-left badges */}
            {isFree && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                {/* Optionally add a ticket icon */}
                {/* <Ticket className="w-3 h-3 mr-1" /> */}
                {t('free')}
              </Badge>
            )}
            {/* You could add a badge for paid tickets here if desired */}
            {/* {!isFree && exhibition.ticket && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                 Ticket Required
              </Badge>
            )} */}
          </div>
          {exhibition.isFeatured && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1 text-yellow-400" />
                {t('featured')}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-semibold text-lg mb-1 truncate">{content?.name || t('untitled_exhibition')}</h3>
          <p className="text-sm text-muted-foreground mb-2">{exhibition.author.name}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {exhibition.result?.visits || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {exhibition.result?.likes?.length || 0}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}