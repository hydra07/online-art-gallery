import { PublicExhibition } from '@/types/exhibition';
import { ExhibitionCard } from './exhibition-card';

interface ExhibitionGridProps {
  exhibitions: PublicExhibition[];
}

export function ExhibitionGrid({ exhibitions }: ExhibitionGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {exhibitions.map((exhibition) => (
        <ExhibitionCard 
          key={exhibition._id} 
          exhibition={exhibition} 
        />
      ))}
    </div>
  );
}