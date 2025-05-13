import { assertAdmin } from '@/lib/session';

export default async function AdminLayout({
	children
}: {
	children: React.ReactNode;
}) {
	await assertAdmin();

	return <div>{children}</div>;
}
