'use client';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingArtist } from '../page';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function TrendingSection({ artists }: { artists: TrendingArtist[] }) {
  const t = useTranslations('home.trending');
  return (
    <section className="py-24 bg-white">
      <div className="w-full mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('title')}
          </h2>
          <Button variant="ghost" asChild>
            <Link
              href="/artists"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('view_all')}
            </Link>
          </Button>
        </div>

        <div className="relative group">
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-6 items-end min-w-max pb-4">
              {artists.map((artist: TrendingArtist) => (
                <Link 
                  key={artist._id} 
                  href={`/profile/${artist._id}`}
                  className="group/item flex flex-col w-[280px]"
                >
                  <div className="flex-grow">
                    <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                        sizes="280px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-xl font-semibold group-hover/item:text-blue-400 transition-colors">
                          {artist.name}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {t('followers', { count: artist.followersCount })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}