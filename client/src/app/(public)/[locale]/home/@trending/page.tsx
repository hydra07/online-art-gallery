import { getTrendingArtists } from "@/service/home";
import TrendingSection from "./components/trending-section";



export type TrendingArtist = {
    _id: string;
    name: string;
    image: string;
    followersCount: number;
}

export default async function trendingArtistsPage() {
    const artistsReponse = await getTrendingArtists();
    
    const artists = artistsReponse.data?.artists;

    if (!artists || artists.length === 0) {
        return <div>No trending artists found</div>;
    }
    return (
        <section className="py-24 bg-gray-50">
            <TrendingSection artists={artists} />
        </section>
    )
}