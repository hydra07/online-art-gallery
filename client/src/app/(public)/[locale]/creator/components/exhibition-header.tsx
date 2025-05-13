import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';
import { Exhibition } from '@/types/exhibition';
import { Calendar } from 'lucide-react';

const statusConfig = {
  PUBLISHED: {
    bgClass: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400',
    key: 'published'
  },
  PENDING: {
    bgClass: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400',
    key: 'pending'
  },
  REJECTED: {
    bgClass: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400',
    key: 'rejected'
  },
  DRAFT: {
    bgClass: 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400',
    key: 'draft'
  }
};

export default function ExhibitionHeader({ exhibition }: { exhibition: Exhibition }) {
  const t = useTranslations('exhibitions');
  const status = statusConfig[exhibition.status as keyof typeof statusConfig] || statusConfig.DRAFT;
  
  return (
    <div className="px-6 py-4 bg-white sticky top-0 z-10">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {exhibition.startDate && formatDate(new Date(exhibition.startDate))}
              {exhibition.endDate && ` - ${formatDate(new Date(exhibition.endDate))}`}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${status.bgClass}`}>
              {t(status.key)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}