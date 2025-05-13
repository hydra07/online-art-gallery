import { getExhibitionById } from '@/service/exhibition';
import { SettingsContent } from './_components/settings-content';

export default async function SettingsPage({
	params
}: {
	params: { id: string; locale: string }
}) {
	const res = await getExhibitionById(params.id);
	const exhibition = res.data?.exhibition;

	if (!exhibition) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8 text-center">
				<p className="text-destructive">Error loading exhibition settings</p>
			</div>
		);
	}

	return (
		<SettingsContent
			exhibition={exhibition}
		/>
	);
}