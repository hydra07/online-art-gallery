
import { getExhibitionById } from '@/service/exhibition';
import PreviewContent from './_components/preview-content';
// import { notFound } from 'next/navigation';

export default async function PreviewPage({ params }: { params: { id: string } }) {
	const { id } = params;
		const res = await getExhibitionById(id);
		const exhibition = res.data?.exhibition;
	
	
	return (
		<PreviewContent exhibition={exhibition!} />
	);
}
