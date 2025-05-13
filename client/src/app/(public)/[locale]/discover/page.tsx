import { Suspense } from 'react';
import { DiscoverClient } from './components/discover-client';
import { ExhibitionSkeleton } from './components/exhibition-skeleton';
import { getPublicExhibitions } from '@/service/exhibition';

export const revalidate = 3600; // Revalidate every hour

export default async function DiscoverPage() {
  // Pre-fetch initial data
  const initialData = await getPublicExhibitions({
    page: 1,
    limit: 12,
    filter: {}, // Use a filter parameter instead of sort
    sort: { 'result.visits': -1 },
  });

  if (!initialData.data) {
    return <div>Error loading exhibitions</div>;
  }
  return (
    <Suspense fallback={<ExhibitionSkeleton />}>
      <DiscoverClient initialData={initialData.data} />
    </Suspense>
  );
}
