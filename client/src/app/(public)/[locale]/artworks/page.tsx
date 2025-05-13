import {fetchArtPiecesByRange} from '@/app/(public)/[locale]/artworks/api';
import dynamic from 'next/dynamic';
import {LoadingComponent} from '@/components/ui.custom/loading';

const Artworks = dynamic(
    () => import('@/app/(public)/[locale]/artworks/artworks'),
    {
        ssr: false,
        loading(loadingProps) {
            return (
                <LoadingComponent
                    error={loadingProps.error}
                    timedOut={loadingProps.timedOut}
                    pastDelay={loadingProps.pastDelay}
                    retry={loadingProps.retry}
                />
            );
        }
    }
);

const ArtworksPage = async () => {
    const response = await fetchArtPiecesByRange(0, 10);
    const initialData = response.data.artworks;
    const totalCount = response.data.total;
    
    return (
        <Artworks 
            artworks={initialData} 
            initialTotal={totalCount}
        />
    );
};
export default ArtworksPage;
