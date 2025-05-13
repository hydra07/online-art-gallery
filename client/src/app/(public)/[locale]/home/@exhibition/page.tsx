import { getTrendingExhibitions, getNewExhibitions } from '@/service/home';
import { ExhibitionSection } from './components/exhibition-section';

export default async function ExhibitionsPage() {
  const [trendingResponse, newExhibitionsResponse] = await Promise.all([
    getTrendingExhibitions(),
    getNewExhibitions()
  ]);
 
  const trending = trendingResponse.data?.exhibitions || [];
  const newExhibitions = newExhibitionsResponse.data?.exhibitions || [];

  return (
    <div className="w-full bg-white py-24">
      <ExhibitionSection
        title="title_trending"
        exhibitions={trending}
      />
      <ExhibitionSection 
        title="title_new"
        exhibitions={newExhibitions}
      />
    </div>
  );
}