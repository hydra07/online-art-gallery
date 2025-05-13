import { getExhibitionById } from "@/service/exhibition";
import { ArtworksContent } from './_components/artworks-content';

export default async function ArtworksPage({
  params
}: {
  params: { id: string; locale: string }
}) {
  // Fetch exhibition data directly on server
  const res = await getExhibitionById(params.id);
  
  const exhibition = res.data?.exhibition;
 
  // Calculate positions on server
  const totalPositions = exhibition?.gallery?.artworkPlacements?.length || 0;
  const positions = Array.from({ length: totalPositions }, (_, i) => i);

  return (
    <ArtworksContent
      exhibition={exhibition!}
      positions={positions}
    />
  );
}