import { getExhibitionById } from '@/service/exhibition';
import { ContentSettings } from './_components/content-settings';

export default async function ContentPage({
  params
}: {
  params: { id: string; locale: string }
}) {
  const res = await getExhibitionById(params.id);
  const exhibition = res.data?.exhibition;

  return <ContentSettings exhibition={exhibition!} />;
}