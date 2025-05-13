import { getFeaturedArtist } from '@/service/home';
import { ArtistSpotlight } from './components/artist-spotlight';

export default async function SpotlightPage() {
  const data = await getFeaturedArtist();
  const artist = data.data?.artist;
  
  return (
    <section className="py-24 bg-gray-50">
      <ArtistSpotlight artist={artist!} />
    </section>
  );
}