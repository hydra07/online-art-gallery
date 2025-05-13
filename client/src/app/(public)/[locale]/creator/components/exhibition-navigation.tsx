'use client';

import {
  BookText,
  Earth,
  Eye,
  ImageIcon,
  SlidersHorizontal,
  TrendingUp
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Exhibition } from '@/types/exhibition';

export default function ExhibitionNavigation({ exhibition }: { exhibition: Exhibition }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('exhibitions');
  
  const currentTab = pathname.split('/').pop() || 'artworks';

  const tabs = [
    { 
      value: 'artworks', 
      label: t('artworks'), 
      icon: <ImageIcon />,
      disabled: false
    },
    { 
      value: 'content', 
      label: t('content'), 
      icon: <BookText />,
      disabled: false
    },
    { 
      value: 'settings', 
      label: t('settings'), 
      icon: <SlidersHorizontal />,
      disabled: false
    },
    { 
      value: 'preview', 
      label: t('preview'), 
      icon: <Earth />,
      // disabled: !exhibition?.artworkPositions?.length
      disabled: false

    },
    { 
      value: 'publish', 
      label: t('publish'), 
      icon: <TrendingUp />,
      // disabled: !exhibition?.artworkPositions?.length
      disabled: false
    },
    { 
      value: 'result', 
      label: t('result'), 
      icon: <Eye />,
      // disabled: !exhibition?.artworkPositions?.length
      disabled: false
    }
  ];

  return (
    <div className="w-56">
      <div className="p-6">
        {/* <h1 className="text-2xl font-bold mb-6">
          {exhibition.contents[0]?.name}
        </h1> */}
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => router.push(`/creator/${exhibition._id}/${tab.value}`)}
              className={cn(
                'w-full flex items-center space-x-3 px-4 py-3 text-center font-bold rounded-lg transition-colors hover:bg-muted',
                currentTab === tab.value
                  ? 'border-l-2 border-primary text-primary'
                  : 'text-muted-foreground',
                tab.disabled && 'opacity-50 pointer-events-none cursor-not-allowed'
              )}
              disabled={tab.disabled}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}