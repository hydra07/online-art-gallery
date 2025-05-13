
import { getExhibitionById } from '@/service/exhibition';
import PublishContent from './_components/publish-content';

export default async function PublishPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await getExhibitionById(id);
  const exhibition = res.data?.exhibition;
  return (
    <PublishContent exhibition={exhibition!} />
  );
}