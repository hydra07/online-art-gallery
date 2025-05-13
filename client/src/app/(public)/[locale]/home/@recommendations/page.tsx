import { getNewRecommendedArtworks, getFollowingArtworks } from '@/service/home';
import { RecommendationSection } from './components/recommendation-section';
import { getCurrentUser } from '@/lib/session';

export default async function RecommendationsPage() {
    const user = await getCurrentUser();

    const [recommended, following] = await Promise.all([
        getNewRecommendedArtworks(),
        user ? getFollowingArtworks(user.accessToken) : Promise.resolve({ data: { artworks: [] } })
    ]);

    const recommendedArtworks = recommended.artworks || [];
    const followingArtworks = following.data?.artworks || [];

    return (
        <section className="py-14 bg-gray-50">
            <RecommendationSection
                recommendedArtworks={recommendedArtworks}
                followingArtworks={followingArtworks}
                isAuthenticated={!!user}
            />
        </section>
    );
}