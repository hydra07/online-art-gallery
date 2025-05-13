import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Clock, Flame } from 'lucide-react';

interface ExhibitionTabsProps {
  t: (key: string) => string;
}

export function ExhibitionTabs({ t }: ExhibitionTabsProps) {
  return (
    <TabsList className='bg-white/50 backdrop-blur-sm p-1 rounded-lg'>
      <TabsTrigger value='trending' className='flex items-center gap-2'>
        <Flame className='w-4 h-4' /> {t('tabs.trending')}
      </TabsTrigger>
      <TabsTrigger value='featured' className='flex items-center gap-2'>
        <Sparkles className='w-4 h-4' /> {t('tabs.featured')}
      </TabsTrigger>
      <TabsTrigger value='recent' className='flex items-center gap-2'>
        <Clock className='w-4 h-4' /> {t('tabs.recent')}
      </TabsTrigger>
    </TabsList>
  );
}