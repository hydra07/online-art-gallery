import { Breadcrumb } from '@/components/ui.custom/Breadcrumb';

export default function PostsPage() {
	return (
		<Breadcrumb
			items={[
				{ label: 'Dashboard', link: '/dashboard' },
				{ label: 'Articles and drafts', link: '/dashboard/posts' }
			]}
		/>
	);
}
