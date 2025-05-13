import FeaturedSection from '@/components/featured-section';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense>
      <FeaturedSection />
    </Suspense>
  );
}